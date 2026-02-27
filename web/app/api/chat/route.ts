import { NextRequest, NextResponse } from "next/server";

const DIFY_API_URL = process.env.DIFY_API_URL || "http://114.29.238.175";

// Custom chat: keep existing env
const DIFY_API_KEY_CUSTOM = process.env.DIFY_API_KEY || "";

// New envs for different entry points (do not hardcode keys)
const DIFY_API_KEY_BASIC = process.env.DIFY_API_KEY_BASIC || "";
const DIFY_API_KEY_FLOATING = process.env.DIFY_API_KEY_FLOATING || "";

interface Message {
    role: "user" | "assistant";
    content: string;
}

type ChatMode = "basic" | "custom" | "floating";

function resolveApiKey(mode: ChatMode): {
    apiKey: string;
    missingEnvName: string;
} {
    switch (mode) {
        case "basic":
            return {
                apiKey: DIFY_API_KEY_BASIC,
                missingEnvName: "DIFY_API_KEY_BASIC",
            };
        case "floating":
            return {
                apiKey: DIFY_API_KEY_FLOATING,
                missingEnvName: "DIFY_API_KEY_FLOATING",
            };
        case "custom":
        default:
            return {
                apiKey: DIFY_API_KEY_CUSTOM,
                missingEnvName: "DIFY_API_KEY",
            };
    }
}

export async function POST(request: NextRequest) {
    try {
        const { messages, mode } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid request: messages required" },
                { status: 400 },
            );
        }

        const chatMode: ChatMode =
            mode === "basic" || mode === "custom" || mode === "floating"
                ? mode
                : "custom";

        const { apiKey, missingEnvName } = resolveApiKey(chatMode);

        const lastUserMessage = messages
            .filter((m: Message) => m.role === "user")
            .pop();

        if (!lastUserMessage) {
            return NextResponse.json(
                { error: "No user message found" },
                { status: 400 },
            );
        }

        if (!apiKey) {
            return NextResponse.json({
                message:
                    `您询问的是：${lastUserMessage.content}\n\n` +
                    `由于Dify API密钥尚未配置（缺少 ${missingEnvName}），暂时无法提供AI解答。请联系管理员配置对应环境变量。\n`,
            });
        }

        const response = await fetch(`${DIFY_API_URL}/v1/chat-messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                inputs: {},
                query: lastUserMessage.content,
                response_mode: "blocking",
                conversation_id: "",
                user: "web-user",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[v0] Dify API error:", errorText);
            return NextResponse.json({
                message: "AI服务暂时不可用，请稍后再试。",
            });
        }

        const data = await response.json();

        return NextResponse.json({
            message: data.answer || "抱歉，无法获取回答。",
        });
    } catch (error) {
        console.error("[v0] Chat API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
