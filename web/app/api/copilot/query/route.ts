import { NextRequest, NextResponse } from "next/server";

const COPILOT_SUPABASE_URL = process.env.COPILOT_SUPABASE_URL || "";
const COPILOT_SUPABASE_KEY = process.env.COPILOT_SUPABASE_KEY || "";
const QWEN_API_KEY = process.env.QWEN_API_KEY || "";
const QWEN_BASE_URL = process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/api/v1";
const QWEN_CHAT_MODEL = process.env.QWEN_CHAT_MODEL || "qwen3.5-plus";
const QWEN_REASONING_MODEL = process.env.QWEN_REASONING_MODEL || "qwen-turbo";

// Types for reasoning
type Intent = "FUNCTION" | "COMPATIBILITY" | "IMPACT" | "PRINCIPLE" | "GENERAL";
interface ReasoningResult {
    intent: Intent;
    module: string;
    keywords: string[];
    retrieval_query: string;
}

// Types for memory
interface ConversationMessage {
    role: "user" | "assistant";
    content: string;
}

interface MemoryContext {
    hasMemory: boolean;
    content: string;
    source: string;
}

async function getEmbedding(text: string) {
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
            parameters: { text_type: "query" },
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
        console.error("[getEmbedding] API error response:", JSON.stringify(data));
        return null;
    }

    const embedding = isCompatible
        ? data?.data?.[0]?.embedding
        : data?.output?.embeddings?.[0]?.embedding;

    return embedding as number[];
}

async function hybridSearch(query: string, embedding: number[], matchCount: number = 5) {
    const response = await fetch(`${COPILOT_SUPABASE_URL}/rest/v1/rpc/hybrid_search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: COPILOT_SUPABASE_KEY,
            Authorization: `Bearer ${COPILOT_SUPABASE_KEY}`,
        },
        body: JSON.stringify({
            query_text: query,
            query_embedding: embedding,
            match_count: 5,
        }),

    });
    if (!response.ok) {
        const err = await response.text();
        console.error("[search] Supabase RPC error:", err);
        return [];
    }
    return await response.json();
}

interface ReasoningResponse {
    result: ReasoningResult;
    usage: any;
}

// Memory processing functions
function shouldLoadMemory(query: string, intent: Intent, historyLength: number): boolean {
    // 基础条件：至少有2轮历史
    if (historyLength < 4) return false;
    
    // 时间指代检测
    if (/(刚才|之前|前面|上次|刚刚)/.test(query)) return true;
    
    // 代词检测
    if (/(它|这个|那个|上述|该)/.test(query)) return true;
    
    // 复杂意图检测
    if (intent === "PRINCIPLE" || intent === "IMPACT") return true;
    
    // 简短延续检测
    if (query.length < 15 && historyLength > 4) return true;
    
    return false;
}

async function compressHistory(history: ConversationMessage[]): Promise<string> {
    const totalLength = history.reduce((sum, msg) => sum + msg.content.length, 0);
    
    // 如果内容不多，不压缩
    if (totalLength < 400) {
        return history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    }
    
    // 使用便宜的模型进行摘要
    const historyText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    const summaryPrompt = `
请将以下对话历史压缩为关键信息摘要（100字以内）：

${historyText}

重点保留：
- 客户关注的产品功能
- 重要的技术信息  
- 已确认的方案

摘要：`;
    
    try {
        const isCompatible = QWEN_BASE_URL.includes("compatible-mode");
        const url = isCompatible ? `${QWEN_BASE_URL}/chat/completions` : `${QWEN_BASE_URL}/services/aigc/text-generation/generation`;
        
        const body = isCompatible
            ? {
                model: QWEN_REASONING_MODEL, // 使用便宜的模型
                messages: [{ role: "user", content: summaryPrompt }],
                max_tokens: 150,
            }
            : {
                model: QWEN_REASONING_MODEL,
                input: { messages: [{ role: "user", content: summaryPrompt }] },
                parameters: { max_tokens: 150 },
            };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${QWEN_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        
        if (response.ok) {
            const data = await response.json();
            const summary = isCompatible
                ? data?.choices?.[0]?.message?.content
                : data?.output?.choices?.[0]?.message?.content;
            
            return `对话摘要: ${summary || "对话历史摘要"}`;
        }
    } catch (error) {
        console.warn("压缩失败，使用截断", error);
    }
    
    // 回退到简单截断
    return history
        .slice(-2)
        .map(msg => `${msg.role}: ${msg.content.substring(0, 150)}...`)
        .join('\n');
}

async function processMemory(
    query: string,
    intent: Intent,
    conversationHistory: ConversationMessage[]
): Promise<MemoryContext> {
    // Step 1: 条件触发
    if (!shouldLoadMemory(query, intent, conversationHistory.length)) {
        return { hasMemory: false, content: "", source: "no-trigger" };
    }
    
    // Step 2: 直接使用最近5轮对话
    const recentHistory = conversationHistory.slice(-10); // 最多5轮
    
    // Step 3: 压缩处理
    const compressed = await compressHistory(recentHistory);
    
    return {
        hasMemory: true,
        content: compressed,
        source: "compressed"
    };
}

/**
 * Step 1: Reasoning - Identify intent and key terms
 */
async function performReasoning(query: string, crmContextStr: string = ""): Promise<ReasoningResponse> {
    const prompt = `
你是一个专业的销售助理大脑。请分析销售人员输入的客户问题，决定回答策略。

策略分类说明:
- FUNCTION: 询问功能作用、使用流程或业务价值。
- COMPATIBILITY: 询问是否适配某型号、是否有接口、是否需定制。
- IMPACT: 询问效果提升、可量化指标、ROI、行业案例。
- PRINCIPLE: 询问技术原理、底层逻辑、为什么能实现。
- GENERAL: 其他通用咨询。

涉及模块提取(Module): 识别涉及的产品模块，如"数采"、"排产"、"能耗"、"看板"等。
核心关键词提取(Keywords): 提取2-3个核心关键词用于搜索。

检索重写(retrieval_query): 为了提高检索精度，请将原始问题重写为适合知识库搜索的短句。
- 要求：去除语气词，补全省略的主语/公司名（参考当前上下文）。
- 示例：当前上下文是"阿里巴巴"，用户问"怎么推？"，重写为"针对阿里巴巴（大型互联网企业）的MES推行方案与卖点"。

当前交流的CRM背景:
${crmContextStr || "无特定客户背景"}

输出格式(严格 JSON):
{
  "intent": "FUNCTION" | "COMPATIBILITY" | "IMPACT" | "PRINCIPLE" | "GENERAL",
  "module": "模块名",
  "keywords": ["关键词1", "关键词2"],
  "retrieval_query": "生成的检索专用查询语句"
}
`;

    const isCompatible = QWEN_BASE_URL.includes("compatible-mode");
    const url = isCompatible ? `${QWEN_BASE_URL}/chat/completions` : `${QWEN_BASE_URL}/services/aigc/text-generation/generation`;

    const body = isCompatible
        ? {
            model: QWEN_REASONING_MODEL,
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: query },
            ],
            response_format: { type: "json_object" }
        }
        : {
            model: QWEN_REASONING_MODEL,
            input: {
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: query },
                ],
            },
            parameters: { result_format: "message" },
        };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${QWEN_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        const content = isCompatible
            ? data?.choices?.[0]?.message?.content
            : data?.output?.choices?.[0]?.message?.content;

        const usage = isCompatible ? data?.usage : data?.usage;

        return {
            result: JSON.parse(content.replace(/```json|```/g, "").trim()),
            usage
        };
    } catch (e) {
        console.error("[reasoning] Failed to parse reasoning:", e);
        return {
            result: { intent: "GENERAL", module: "unknown", keywords: [query], retrieval_query: query },
            usage: null
        };
    }
}

/**
 * Step 3: Specific Generation Strategies
 */
function getSystemPromptByIntent(intent: Intent, context: string, crmContextStr: string = ""): string {
    const isNoData = context.includes("【无相关参考资料】");

    const baseInstruction = `
你是销售助手，协助纺织行业MES软件销售。
${crmContextStr ? `\u3010当前交流对象/商机背景\u3011\n${crmContextStr}\n请务必结合上述背景进行针对性回答，展现你对客户的了解。\n` : ""}
根据提供的[知识库内容], 按规定结构生成专业回答。

【重要：知识真实性约束】
1. 如果[知识库内容]为空或内容与用户问题完全不相关，请**拒绝胡编乱造**。
2. 对于无法从知识库直接推导的问题，请统一回复：\u201c抱歉，基于目前掌握的专业知识库，我暂时无法回答关于 [问题核心] 的确切信息。为了保证业务严谨性，建议您咨询技术部门或查阅官方产品手册。\u201d
${isNoData ? "\n3. 注意：当前检索分值极低，知识库可能无覆盖，请执行专业拒答策略。\n" : ""}

[知识库内容]:
${context || "【无相关参考资料】"}

通用要求: 1. 销售口吻，禁用说明书语言。2. 严禁瞎编数据。
`;

    const strategies: Record<Intent, string> = {
        FUNCTION: `
策略：卖点转化 (FUNCTION)
输出结构:
- **功能作用**: [一句话描述它是什么]
- **使用场景**: [简述客户在什么环节用它，怎么用]
- **业务价值**: [重点：对客户有什么好处（省钱/省力/提速）]
- **界面示意**: [根据知识库描述界面长什么样，若有图片会由系统自动匹配]
`,
        COMPATIBILITY: `
策略：风险控制 (COMPATIBILITY)
输出结构:
- **支持情况**: [明确回答：支持 / 不支持 / 需确认]
- **适配条件**: [列出必要条件，如型号、接口协议等]
- **定制化说明**: [是否需要额外开发费用或周期]
- **风险提示(关键)**: [一句话提醒销售不要乱承诺，如需技术选型确认等]
`,
        IMPACT: `
策略：数据驱动 (IMPACT)
输出结构:
- **预期提升**: [给出可量化的区间，严禁绝对值，如"预计提升5%-8%"]
- **实现前提**: [达到此效果需要客户配合的条件]
- **行业案例**: [简述知识库中的同类客户成功经验]
- **风险说明**: [提示效果受现场环境因素影响]
`,
        PRINCIPLE: `
策略：专业可信 (PRINCIPLE)
输出结构:
- **原理简述**: [用通俗语言解释底层逻辑，不涉及代码]
- **核心优势**: [为什么我们能做到，竞品做不到的点]
- **落地价值**: [强调技术先进性对业务稳定性的帮助]
`,
        GENERAL: `
策略：通用咨询
请按"作战卡片"格式输出：
给客户说的话：[30字内精品建议]
推荐追问：[引导痛点]
`
    };

    return baseInstruction + strategies[intent];
}

export async function POST(request: NextRequest) {
    if (!QWEN_API_KEY || !COPILOT_SUPABASE_URL) {
        return NextResponse.json({ error: "Missing configuration" }, { status: 500 });
    }

    try {
        const bodyParam = await request.json();
        const { query, crmContexts, conversationHistory } = bodyParam; // 新增 conversationHistory

        if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

        let crmContextStr = "";
        if (crmContexts && Array.isArray(crmContexts) && crmContexts.length > 0) {
            crmContextStr = crmContexts.map(c => `- [${c.type.toUpperCase()}] ${c.name}: ${c.details}`).join("\n");
        }

        // Step 1: Reasoning
        console.log("[copilot] Step 1: Reasoning...");
        const reasoningData = await performReasoning(query, crmContextStr);
        const { result: reasoning, usage: reasoningUsage } = reasoningData;
        console.log("[copilot] Identified Intent:", reasoning.intent, "Module:", reasoning.module);
        console.log("[copilot] Retrieval Query:", reasoning.retrieval_query);

        // Step 1.5: Memory Processing
        let memoryContext: MemoryContext = { hasMemory: false, content: "", source: "" };
        if (conversationHistory && conversationHistory.length > 0) {
            memoryContext = await processMemory(
                query,
                reasoning.intent,
                conversationHistory
            );
            console.log("[copilot] Memory:", memoryContext.source);
        }

        // Step 2: RAG
        console.log("[copilot] Step 2: RAG...");
        const embedding = await getEmbedding(reasoning.retrieval_query);
        if (!embedding) return NextResponse.json({ error: "Embedding failed" }, { status: 500 });

        // Use rewritten query for search
        const searchResults = await hybridSearch(reasoning.retrieval_query, embedding);

        // Calculate confidence based on top result score
        // RRF scores are typically small. 0.01-0.015+ usually indicates a decent match
        const topScore = searchResults && searchResults.length > 0 ? (searchResults[0].score || 0) : 0;
        const confidence: 'high' | 'low' = topScore > 0.012 ? 'high' : 'low';

        console.log(`[copilot] RAG Top Score: ${topScore}, Confidence: ${confidence}`);

        let context = searchResults
            .map((res: any) => `[${res.category || res.type}] ${res.content}`)
            .join("\n\n");

        if (confidence === 'low' && searchResults.length < 2) {
            context = "【无相关参考资料】";
        }

        // Step 3: Generation
        console.log("[copilot] Step 3: Generation for", reasoning.intent);
        const systemPrompt = getSystemPromptByIntent(reasoning.intent, context, crmContextStr);

        // 构建包含记忆的消息
        const messages = [
            { role: "system", content: systemPrompt },
            ...(memoryContext.hasMemory ? [{ role: "system", content: memoryContext.content }] : []),
            { role: "user", content: query },
        ];

        const isCompatible = QWEN_BASE_URL.includes("compatible-mode");
        const url = isCompatible ? `${QWEN_BASE_URL}/chat/completions` : `${QWEN_BASE_URL}/services/aigc/text-generation/generation`;

        const body = isCompatible
            ? {
                model: QWEN_CHAT_MODEL,
                messages: messages, // 使用包含记忆的消息
            }
            : {
                model: QWEN_CHAT_MODEL,
                input: {
                    messages: messages, // 使用包含记忆的消息
                },
                parameters: { result_format: "message" },
            };

        const chatResponse = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${QWEN_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!chatResponse.ok) {
            const err = await chatResponse.text();
            console.error("[chat] Qwen API error:", err);
            return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
        }

        const chatData = await chatResponse.json();
        const fullMessage = isCompatible
            ? chatData?.choices?.[0]?.message?.content
            : chatData?.output?.choices?.[0]?.message?.content;

        const chatUsage = isCompatible ? chatData?.usage : chatData?.usage;

        const images = searchResults
            .filter((res: any) => res.image_url)
            .map((res: any) => res.image_url);

        const totalUsage = {
            reasoning: reasoningUsage,
            generation: chatUsage,
            memory: memoryContext.hasMemory ? { 
                tokens: Math.ceil(memoryContext.content.length / 2),
                source: memoryContext.source 
            } : null,
            total_tokens: (reasoningUsage?.total_tokens || 0) + (chatUsage?.total_tokens || 0)
        };

        console.log("[copilot] Consumption Summary:", JSON.stringify(totalUsage));

        return NextResponse.json({
            message: fullMessage || "",
            images: [...new Set(images)],
            intent: reasoning.intent,
            confidence: confidence,
            usage: totalUsage,
            memory: memoryContext.hasMemory ? {
                source: memoryContext.source,
                tokens: Math.ceil(memoryContext.content.length / 2)
            } : null
        });
    } catch (error) {
        console.error("[copilot] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
