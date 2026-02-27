"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    MessageSquare,
    X,
    Send,
    Loader2,
    Sparkles,
    Minimize2,
} from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface AIAgentProps {
    onClose?: () => void;
    initialMessage?: string;
}

export function AIAgent({ onClose, initialMessage }: AIAgentProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState(initialMessage || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialMessage) {
            setInput(initialMessage);
        }
    }, [initialMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMessage },
        ]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "floating",
                    messages: [
                        ...messages,
                        { role: "user", content: userMessage },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.message },
            ]);
        } catch (error) {
            console.error("[v0] Chat API error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "抱歉，连接出现问题。请稍后再试或检查API配置。",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsMinimized(false)}
                    className="h-14 w-14 rounded-full shadow-lg"
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>
            </div>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 z-50 w-96 shadow-2xl border-2 border-primary/20">
            <CardHeader className="bg-primary/5 border-b border-border py-3 px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-base">AI 智能助手</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsMinimized(true)}
                        >
                            <Minimize2 className="h-4 w-4" />
                        </Button>
                        {onClose && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={onClose}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4" ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Sparkles className="h-8 w-8 mb-2 text-primary" />
                            <p className="text-sm">您好！我是格罗瑞AI助手</p>
                            <p className="text-xs mt-1">
                                选中页面文字或直接输入问题开始对话
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-foreground"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-lg px-3 py-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
                <div className="border-t border-border p-3">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="输入问题或选中文字..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}

// Selection popup component for AI explanation
export function SelectionPopup() {
    const [selectedText, setSelectedText] = useState("");
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [showPopup, setShowPopup] = useState(false);
    const [showAgent, setShowAgent] = useState(false);

    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            // Delay to allow selection to complete
            setTimeout(() => {
                const selection = window.getSelection();
                const text = selection?.toString().trim();

                if (text && text.length > 2) {
                    const range = selection?.getRangeAt(0);
                    const rect = range?.getBoundingClientRect();

                    if (rect) {
                        setSelectedText(text);
                        // Position popup above the selection with proper bounds checking
                        const x = Math.min(
                            Math.max(rect.left + rect.width / 2, 60),
                            window.innerWidth - 60,
                        );
                        const y = Math.max(rect.top + window.scrollY - 10, 50);
                        setPopupPosition({ x, y });
                        setShowPopup(true);
                    }
                }
            }, 10);
        };

        const handleMouseDown = (e: MouseEvent) => {
            // Only hide popup if clicking outside the popup button
            const target = e.target as HTMLElement;
            if (!target.closest("[data-ai-popup]")) {
                setShowPopup(false);
            }
        };

        const handleScroll = () => {
            setShowPopup(false);
        };

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleAIExplain = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAgent(true);
        setShowPopup(false);
    };

    return (
        <>
            {showPopup && (
                <div
                    data-ai-popup
                    className="fixed z-[100] animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        left: popupPosition.x,
                        top: popupPosition.y,
                        transform: "translate(-50%, -100%)",
                    }}
                >
                    <Button
                        size="sm"
                        onClick={handleAIExplain}
                        className="shadow-xl gap-1.5 bg-primary hover:bg-primary/90"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        AI解释
                    </Button>
                </div>
            )}
            {showAgent && (
                <AIAgent
                    initialMessage={`请解释：${selectedText}`}
                    onClose={() => setShowAgent(false)}
                />
            )}
        </>
    );
}

// Floating toggle button for AI agent
export function AIAgentToggle() {
    const [showAgent, setShowAgent] = useState(false);

    return (
        <>
            {!showAgent && (
                <Button
                    onClick={() => setShowAgent(true)}
                    className="fixed bottom-6 right-6 z-[99] h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                    <MessageSquare className="h-6 w-6" />
                    <span className="sr-only">打开AI助手</span>
                </Button>
            )}
            {showAgent && <AIAgent onClose={() => setShowAgent(false)} />}
        </>
    );
}
