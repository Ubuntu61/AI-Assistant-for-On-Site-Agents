import { NextRequest, NextResponse } from "next/server";

const QWEN_API_KEY = process.env.QWEN_API_KEY || "";
const QWEN_BASE_URL = process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/api/v1";
const QWEN_EMBED_MODEL = process.env.QWEN_EMBED_MODEL || "text-embedding-v4";

export async function POST(request: NextRequest) {
    try {
        const { text, type = "query" } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "text is required" }, { status: 400 });
        }

        if (!QWEN_API_KEY) {
            return NextResponse.json({ error: "QWEN_API_KEY not configured" }, { status: 500 });
        }

        const isCompatible = QWEN_BASE_URL.includes("compatible-mode");
        const url = isCompatible ? `${QWEN_BASE_URL}/embeddings` : `${QWEN_BASE_URL}/services/embeddings/text-embedding/text-embedding`;

        const body = isCompatible
            ? {
                model: QWEN_EMBED_MODEL,
                input: text,
            }
            : {
                model: QWEN_EMBED_MODEL,
                input: { texts: [text] },
                parameters: {
                    text_type: type === "query" ? "query" : "document",
                },
            };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${QWEN_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
        );

        if (!response.ok) {
            const err = await response.text();
            console.error("[embed] Qwen API error:", err);
            return NextResponse.json({ error: "Embedding API failed" }, { status: 500 });
        }

        const data = await response.json();

        const embedding = isCompatible
            ? data?.data?.[0]?.embedding
            : data?.output?.embeddings?.[0]?.embedding;

        if (!embedding) {
            return NextResponse.json({ error: "No embedding returned" }, { status: 500 });
        }

        return NextResponse.json({ embedding });
    } catch (error) {
        console.error("[embed] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
