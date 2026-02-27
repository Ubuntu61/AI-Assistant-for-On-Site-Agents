"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Send,
    Bot,
    User,
    Sparkles,
    Loader2,
    MessageCircle,
    Copy,
    Check,
    ArrowLeft,
    Lightbulb,
    AtSign,
    Building2,
    HardHat,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface CopilotResponse {
    message: string;
    images: string[];
}

interface CrmContextItem {
    id: string | number;
    type: "company" | "contact" | "deal";
    name: string;
    details: string;
}

export default function CopilotPage() {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string, images?: string[] }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // CRM Context State
    const [contexts, setContexts] = useState<CrmContextItem[]>([]);
    const [isContextOpen, setIsContextOpen] = useState(false);
    const [contextQuery, setContextQuery] = useState("");
    const [contextResults, setContextResults] = useState<CrmContextItem[]>([]);
    const [isSearchingContext, setIsSearchingContext] = useState(false);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (contextQuery.length > 0) {
            const fetchContexts = async () => {
                setIsSearchingContext(true);
                try {
                    const res = await fetch(`/api/crm/search?q=${encodeURIComponent(contextQuery)}`);
                    const data = await res.json();
                    setContextResults(data.results || []);
                } catch (e) {
                    console.error("Failed to search crm:", e);
                } finally {
                    setIsSearchingContext(false);
                }
            };
            const debounceTimer = setTimeout(fetchContexts, 300);
            return () => clearTimeout(debounceTimer);
        } else {
            setContextResults([]);
        }
    }, [contextQuery]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim() || isLoading) return;

        const currentQuery = query.trim();
        setQuery("");
        setMessages(prev => [...prev, { role: "user", content: currentQuery }]);
        setIsLoading(true);

        try {
            // 获取最近5轮对话历史 (10条消息)
            const recentHistory = messages.slice(-10);

            const payload = {
                query: currentQuery,
                crmContexts: contexts.length > 0 ? contexts : undefined,
                conversationHistory: recentHistory
            };

            const res = await fetch("/api/copilot/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("API request failed");

            const data: CopilotResponse = await res.json();
            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.message,
                images: data.images
            }]);
        } catch (error) {
            console.error("Copilot error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "抱歉，由于连接问题，我暂时无法给出话术建议。请重试或检查后台配置。"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        const valueToCopy = text.split("推荐追问：")[0].replace("给客户说的话：", "").trim();
        navigator.clipboard.writeText(valueToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-screen bg-muted/30">
            {/* Mobile Header */}
            <header className="bg-background border-b px-4 h-14 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <h1 className="font-bold text-base">销售 Copilot</h1>
                    </div>
                </div>
                <Link href="/admin/knowledge">
                    <Button variant="outline" size="sm" className="text-xs h-8">
                        管理知识库
                    </Button>
                </Link>
            </header>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6 pb-20">
                        <div className="bg-primary/10 p-6 rounded-full">
                            <Bot className="h-12 w-12 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">面对面销售辅助</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                                输入客户的问题或他在对比的品牌，我会立刻为你生成专业的话术卡片。
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 w-full max-w-xs pt-4">
                            {["数采频率是多少？", "比起PLC方案有什么优势？", "FA506型细纱机能连吗？"].map((q) => (
                                <Button
                                    key={q}
                                    variant="outline"
                                    className="justify-start h-auto py-3 px-4 text-xs bg-background"
                                    onClick={() => { setQuery(q); }}
                                >
                                    <Lightbulb className="h-3 w-3 mr-2 text-amber-500 shrink-0" />
                                    {q}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[90%] space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                                {msg.role === "assistant" && (
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <Bot className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-semibold text-muted-foreground">AI 锦囊</span>
                                    </div>
                                )}
                                <Card className={`${msg.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                                    : "bg-background border-2 border-primary/20 rounded-2xl rounded-tl-none shadow-md overflow-hidden"
                                    }`}>
                                    <CardContent className="p-4">
                                        {msg.role === "assistant" ? (
                                            <div className="space-y-4">
                                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                    {msg.content.split("\n\n").map((section, sidx) => {
                                                        const isValue = section.includes("给客户说的话");
                                                        const isFollowUp = section.includes("推荐追问");

                                                        return (
                                                            <div key={sidx} className={`${isValue ? "bg-primary/5 p-3 rounded-lg border-l-4 border-primary font-medium" :
                                                                isFollowUp ? "bg-amber-500/5 p-3 rounded-lg border-l-4 border-amber-500 mt-2 italic" : ""
                                                                } mb-2 last:mb-0`}>
                                                                {section}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {msg.images && msg.images.length > 0 && (
                                                    <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide">
                                                        {msg.images.map((url, uidx) => (
                                                            <img
                                                                key={uidx}
                                                                src={`/api/proxy-image?url=${encodeURIComponent(url)}`}
                                                                alt="Related"
                                                                className="h-32 w-auto rounded border shadow-sm flex-shrink-0"
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-2 border-t">
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 gap-1.5 text-xs text-primary"
                                                        onClick={() => copyToClipboard(msg.content)}
                                                    >
                                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                        {copied ? "已复制" : "复制话术"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm">{msg.content}</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-background border rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">正在翻阅知识库...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-background border-t">
                {/* Context Badges Area */}
                {contexts.length > 0 && (
                    <div className="max-w-4xl mx-auto flex flex-wrap gap-2 mb-2 px-2">
                        {contexts.map((ctx) => (
                            <Badge
                                key={`${ctx.type}-${ctx.id}`}
                                variant="secondary"
                                className="pl-1 pr-2 py-1 text-xs max-w-[200px] truncate cursor-pointer hover:bg-destructive/10"
                                onClick={() => setContexts(prev => prev.filter(p => p.id !== ctx.id || p.type !== ctx.type))}
                            >
                                <div className="bg-background rounded-full p-0.5 mr-1.5 shrink-0">
                                    {ctx.type === 'company' && <Building2 className="h-3 w-3 text-blue-500" />}
                                    {ctx.type === 'contact' && <HardHat className="h-3 w-3 text-orange-500" />}
                                    {ctx.type === 'deal' && <Briefcase className="h-3 w-3 text-green-500" />}
                                </div>
                                <span className="truncate">{ctx.name}</span>
                            </Badge>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
                    <Popover open={isContextOpen} onOpenChange={setIsContextOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className={`h-12 w-12 rounded-full shrink-0 ${contexts.length > 0 ? "border-primary bg-primary/5 text-primary" : ""}`}
                            >
                                <AtSign className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 mb-2" align="start">
                            <div className="p-3 border-b">
                                <Input
                                    placeholder="搜索 CRM 客户/联系人/商机..."
                                    className="h-8 text-xs"
                                    value={contextQuery}
                                    onChange={(e) => setContextQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto p-1">
                                {isSearchingContext ? (
                                    <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin" /> 搜索中...
                                    </div>
                                ) : contextResults.length > 0 ? (
                                    contextResults.map((result) => (
                                        <div
                                            key={`${result.type}-${result.id}`}
                                            className="flex items-start gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                                            onClick={() => {
                                                if (!contexts.find(c => c.id === result.id && c.type === result.type)) {
                                                    setContexts(prev => [...prev, result]);
                                                }
                                                setIsContextOpen(false);
                                                setContextQuery("");
                                            }}
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                {result.type === 'company' && <Building2 className="h-4 w-4 text-blue-500" />}
                                                {result.type === 'contact' && <HardHat className="h-4 w-4 text-orange-500" />}
                                                {result.type === 'deal' && <Briefcase className="h-4 w-4 text-green-500" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-sm font-medium truncate">{result.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{result.details}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : contextQuery.length > 0 ? (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                        未找到匹配记录
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground">
                                        输入关键词以关联 CRM 上下文
                                    </div>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Input
                        placeholder="输入客户的问题或不确定的参数..."
                        value={query || ""}
                        onChange={(e) => setQuery(e.target.value)}
                        className="h-12 rounded-full px-5 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="h-12 w-12 rounded-full shrink-0 shadow-lg"
                        disabled={!query.trim() || isLoading}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
