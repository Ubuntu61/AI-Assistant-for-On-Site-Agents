import { NextRequest, NextResponse } from "next/server";

const COPILOT_SUPABASE_URL = process.env.COPILOT_SUPABASE_URL || "";
const COPILOT_SUPABASE_KEY = process.env.COPILOT_SUPABASE_KEY || "";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing url", { status: 400 });
    }

    try {
        // Fetch from Supabase using service key to bypass any potential local networking issues 
        // that the browser might face, while the server can reach 127.0.0.1
        const response = await fetch(url, {
            headers: {
                apikey: COPILOT_SUPABASE_KEY,
                Authorization: `Bearer ${COPILOT_SUPABASE_KEY}`,
            },
        });

        if (!response.ok) {
            return new NextResponse("Failed to fetch image", { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get("content-type") || "image/png";

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("[proxy-image] Error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
