import { NextRequest, NextResponse } from "next/server";

const COPILOT_SUPABASE_URL = process.env.COPILOT_SUPABASE_URL || "";
const COPILOT_SUPABASE_KEY = process.env.COPILOT_SUPABASE_KEY || "";
const QWEN_API_KEY = process.env.QWEN_API_KEY || "";
const QWEN_BASE_URL = process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/api/v1";

async function getEmbedding(text: string, type: "query" | "document" = "document") {
    const isCompatible = QWEN_BASE_URL.includes("compatible-mode");
    const url = isCompatible ? `${QWEN_BASE_URL}/embeddings` : `${QWEN_BASE_URL}/services/embeddings/text-embedding/text-embedding`;

    const body = isCompatible
        ? {
            model: process.env.QWEN_EMBED_MODEL || "text-embedding-v4",
            input: text,
        }
        : {
            model: process.env.QWEN_EMBED_MODEL || "text-embedding-v4",
            input: { texts: [text] },
            parameters: { text_type: type },
        };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${QWEN_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("[getEmbedding] Knowledge API error:", JSON.stringify(data));
        return null;
    }

    const embedding = isCompatible
        ? data?.data?.[0]?.embedding
        : data?.output?.embeddings?.[0]?.embedding;

    return embedding as number[];
}

async function supabaseRequest(path: string, options: RequestInit) {
    const url = `${COPILOT_SUPABASE_URL}/rest/v1${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            apikey: COPILOT_SUPABASE_KEY,
            Authorization: `Bearer ${COPILOT_SUPABASE_KEY}`,
            ...(options.headers || {}),
        },
    });
    return res;
}

// GET /api/knowledge - list all knowledge entries
export async function GET() {
    if (!COPILOT_SUPABASE_URL || !COPILOT_SUPABASE_KEY) {
        return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const res = await supabaseRequest(
        "/knowledge_base?select=id,content,type,category,source_name,image_url,created_at&order=created_at.desc&limit=200",
        { method: "GET" }
    );

    if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
}

// POST /api/knowledge - add one or many entries
export async function POST(request: NextRequest) {
    if (!COPILOT_SUPABASE_URL || !COPILOT_SUPABASE_KEY) {
        return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Handle Markdown Batch
        if (body.markdown) {
            const blocks = body.markdown.split(/---\n?/).filter((b: string) => b.trim());
            const results = [];
            const errors = [];

            for (const block of blocks) {
                const lines = block.trim().split("\n");
                let type = "description";
                let category = "general";
                let image_url = null;
                const contentLines = [];

                for (const line of lines) {
                    if (line.startsWith("# type:")) {
                        type = line.replace("# type:", "").trim();
                    } else if (line.startsWith("# category:")) {
                        category = line.replace("# category:", "").trim();
                    } else if (line.startsWith("# image:")) {
                        image_url = line.replace("# image:", "").trim();
                    } else if (line.startsWith("# image_url:")) {
                        image_url = line.replace("# image_url:", "").trim();
                    } else {
                        contentLines.push(line);
                    }
                }

                const content = contentLines.join("\n").trim();
                if (!content) continue;

                const embedding = await getEmbedding(content, "document");
                if (!embedding) {
                    errors.push({ content: content.substring(0, 50), error: "Embedding failed" });
                    continue;
                }

                const res = await supabaseRequest("/knowledge_base", {
                    method: "POST",
                    headers: { Prefer: "return=representation" },
                    body: JSON.stringify({
                        content,
                        type,
                        category,
                        image_url,
                        embedding,
                    }),
                });

                if (res.ok) {
                    results.push(content.substring(0, 30));
                } else {
                    errors.push({ content: content.substring(0, 50), error: "DB Insert failed" });
                }
            }

            return NextResponse.json({
                success: true,
                count: results.length,
                total: blocks.length,
                errors: errors.length > 0 ? errors : undefined
            });
        }

        // Single entry
        const { content, type = "description", category = "general", source_name, image_url } = body;

        if (!content) {
            return NextResponse.json({ error: "content is required" }, { status: 400 });
        }

        const embedding = await getEmbedding(content, "document");
        if (!embedding) {
            return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
        }

        const res = await supabaseRequest("/knowledge_base", {
            method: "POST",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify({
                content,
                type,
                category,
                source_name: source_name || null,
                image_url: image_url || null,
                embedding,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            return NextResponse.json({ error: "Failed to save knowledge" }, { status: 500 });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, entry: data[0] });
    } catch (error) {
        console.error("[knowledge] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/knowledge - delete entry by id
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const res = await supabaseRequest(`/knowledge_base?id=eq.${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
