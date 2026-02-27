"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Send,
    Bot,
    User,
    Sparkles,
    Settings,
    MessageSquare,
    Loader2,
    ArrowLeft,
    Lightbulb,
    Factory,
    Zap,
    BarChart3,
    Shield,
} from "lucide-react";
import Link from "next/link";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const suggestedQuestions = {
    basic: [
        "格罗瑞系统有哪些主要功能模块？",
        "系统如何帮助降低生产成本？",
        "能耗监测功能具体包含哪些内容？",
        "系统支持哪些设备的数据采集？",
        "如何实现生产过程的实时监控？",
        "系统的部署方式有哪些？",
    ],
    custom: [
        "针对我们工厂的规模，推荐什么配置方案？",
        "如何根据现有设备进行系统集成？",
        "定制开发周期和成本如何评估？",
        "系统如何与现有ERP系统对接？",
        "数据安全和备份机制是怎样的？",
        "售后服务和技术支持如何保障？",
    ],
};

const topicCategories = [
    {
        icon: Factory,
        title: "生产管理",
        description: "生产计划、工艺管理、产量统计",
    },
    {
        icon: Zap,
        title: "能耗监控",
        description: "用电分析、节能优化、成本控制",
    },
    {
        icon: BarChart3,
        title: "数据分析",
        description: "报表统计、趋势分析、决策支持",
    },
    {
        icon: Shield,
        title: "质量管理",
        description: "质检追溯、异常预警、品质改进",
    },
];

export default function ChatPage() {
    const [activeTab, setActiveTab] = useState<"basic" | "custom">("basic");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: activeTab === "custom" ? "custom" : "basic",
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    context:
                        activeTab === "custom"
                            ? "用户正在进行定制化咨询，请提供更详细、更个性化的解答，并主动询问用户的具体需求和场景。"
                            : "用户正在进行基础咨询，请简洁明了地回答问题。",
                }),
            });

            if (!response.ok) throw new Error("请求失败");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMessage.id
                                ? { ...msg, content: msg.content + chunk }
                                : msg,
                        ),
                    );
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "抱歉，发生了一些错误。请稍后再试。",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                                <Bot className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="font-semibold">智能客服助手</h1>
                                <p className="text-xs text-muted-foreground">
                                    格罗瑞智能纺纱系统
                                </p>
                            </div>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="bg-accent/10 text-accent border-accent/30"
                    >
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI 驱动
                    </Badge>
                </div>
            </header>

            <div className="container py-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* Main Chat Area */}
                    <Card className="flex h-[calc(100vh-180px)] flex-col">
                        <CardHeader className="border-b px-4 py-3">
                            <Tabs
                                value={activeTab}
                                onValueChange={(v) =>
                                    setActiveTab(v as "basic" | "custom")
                                }
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="basic"
                                        className="gap-2"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        基础对话
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="custom"
                                        className="gap-2"
                                    >
                                        <Settings className="h-4 w-4" />
                                        定制对话
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardHeader>

                        <CardContent className="flex flex-1 flex-col p-0 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4">
                                {messages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center py-12">
                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            <Bot className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            {activeTab === "basic"
                                                ? "欢迎使用基础对话"
                                                : "欢迎使用定制对话"}
                                        </h3>
                                        <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
                                            {activeTab === "basic"
                                                ? "您可以询问关于格罗瑞智能纺纱系统的任何问题，我会为您提供详细解答。"
                                                : "定制对话模式下，我会根据您的具体需求提供个性化的解决方案和建议。"}
                                        </p>

                                        {/* Topic Categories */}
                                        <div className="mb-6 grid w-full max-w-lg grid-cols-2 gap-3">
                                            {topicCategories.map((topic) => (
                                                <button
                                                    key={topic.title}
                                                    onClick={() =>
                                                        handleSend(
                                                            `请详细介绍${topic.title}相关功能`,
                                                        )
                                                    }
                                                    className="flex items-start gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-muted/50"
                                                >
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                                        <topic.icon className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {topic.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {topic.description}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex gap-3 ${
                                                    message.role === "user"
                                                        ? "flex-row-reverse"
                                                        : "flex-row"
                                                }`}
                                            >
                                                <div
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                        message.role === "user"
                                                            ? "bg-primary"
                                                            : "bg-muted"
                                                    }`}
                                                >
                                                    {message.role === "user" ? (
                                                        <User className="h-4 w-4 text-primary-foreground" />
                                                    ) : (
                                                        <Bot className="h-4 w-4 text-foreground" />
                                                    )}
                                                </div>
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                                        message.role === "user"
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted"
                                                    }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">
                                                        {message.content}
                                                    </p>
                                                    <p
                                                        className={`mt-1 text-xs ${
                                                            message.role ===
                                                            "user"
                                                                ? "text-primary-foreground/70"
                                                                : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {message.timestamp.toLocaleTimeString(
                                                            "zh-CN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading &&
                                            messages[messages.length - 1]
                                                ?.role === "user" && (
                                                <div className="flex gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                                        <Bot className="h-4 w-4 text-foreground" />
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span className="text-sm text-muted-foreground">
                                                            正在思考...
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="border-t p-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        placeholder={
                                            activeTab === "basic"
                                                ? "输入您的问题..."
                                                : "描述您的定制需求..."
                                        }
                                        disabled={isLoading}
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={() => handleSend(input)}
                                        disabled={!input.trim() || isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Suggested Questions */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                    推荐问题
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {suggestedQuestions[activeTab].map(
                                    (question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSend(question)}
                                            disabled={isLoading}
                                            className="w-full rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:bg-muted/50 disabled:opacity-50"
                                        >
                                            {question}
                                        </button>
                                    ),
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    快捷操作
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                <Link href="/survey">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start bg-transparent"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        填写需求调研表
                                    </Button>
                                </Link>
                                <Link href="/comparison">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start bg-transparent"
                                    >
                                        <BarChart3 className="mr-2 h-4 w-4" />
                                        查看方案对比
                                    </Button>
                                </Link>
                                <Link href="/report">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start bg-transparent"
                                    >
                                        <Factory className="mr-2 h-4 w-4" />
                                        生成解决方案
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
