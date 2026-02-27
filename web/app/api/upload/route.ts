import { NextRequest, NextResponse } from "next/server";

const COPILOT_SUPABASE_URL = process.env.COPILOT_SUPABASE_URL || "";
const COPILOT_SUPABASE_KEY = process.env.COPILOT_SUPABASE_KEY || "";

export async function POST(request: NextRequest) {
    if (!COPILOT_SUPABASE_URL || !COPILOT_SUPABASE_KEY) {
        return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = fileName;

        const uploadUrl = `${COPILOT_SUPABASE_URL}/storage/v1/object/knowledge-images/${filePath}`;

        const res = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${COPILOT_SUPABASE_KEY}`,
                apikey: COPILOT_SUPABASE_KEY,
                "Content-Type": file.type,
            },
            body: buffer,
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("[upload] Supabase storage error:", err);
            return NextResponse.json({ error: "Upload failed" }, { status: 500 });
        }

        const publicUrl = `${COPILOT_SUPABASE_URL}/storage/v1/object/public/knowledge-images/${filePath}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error("[upload] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
