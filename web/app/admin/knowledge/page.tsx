"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    FileText,
    MessageCircle,
    Loader2,
    Search,
    RefreshCw,
    X,
    Upload,
    BookOpen,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface KnowledgeEntry {
    id: string;
    content: string;
    type: "qa" | "description";
    category: string;
    source_name?: string;
    image_url?: string;
    created_at: string;
}

export default function KnowledgeAdminPage() {
    const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Single Form state
    const [content, setContent] = useState("");
    const [type, setType] = useState<"qa" | "description">("description");
    const [category, setCategory] = useState("general");
    const [sourceName, setSourceName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Batch Form state
    const [batchMarkdown, setBatchMarkdown] = useState("");
    const [batchImages, setBatchImages] = useState<File[]>([]);
    const batchFileInputRef = useRef<HTMLInputElement>(null);

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/knowledge");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setEntries(data);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("加载知识库失败");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setImageUrl(data.url);
                toast.success("图片上传成功");
            } else {
                throw new Error(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("图片上传失败");
        } finally {
            setIsUploading(false);
        }
    };

    const handleBatchImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setBatchImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/knowledge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    type,
                    category,
                    source_name: sourceName,
                    image_url: imageUrl,
                }),
            });

            if (!res.ok) throw new Error("Submit failed");

            toast.success("添加成功");
            setContent("");
            setImageUrl("");
            setSourceName("");
            fetchEntries();
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("添加失败");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!batchMarkdown.trim()) return;

        setIsSubmitting(true);
        try {
            let processedMarkdown = batchMarkdown;

            // 1. Upload images first if any
            if (batchImages.length > 0) {
                toast.info(`开始上传 ${batchImages.length} 个素材...`);
                const nameToUrlMap: Record<string, string> = {};

                for (const file of batchImages) {
                    const formData = new FormData();
                    formData.append("file", file);
                    const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });
                    const uploadData = await uploadRes.json();
                    if (uploadData.url) {
                        nameToUrlMap[file.name] = uploadData.url;
                    }
                }

                // 2. Replace placeholders in Markdown
                // Matches # image: filename.png or # image_url: filename.png
                Object.entries(nameToUrlMap).forEach(([name, url]) => {
                    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`# (image|image_url):\\s*${escapedName}`, 'g');
                    processedMarkdown = processedMarkdown.replace(regex, `# image: ${url}`);
                });
            }

            // 3. Send to API
            const res = await fetch("/api/knowledge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markdown: processedMarkdown }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Batch submit failed");

            toast.success(`批量处理完成：成功 ${data.count}/${data.total} 条`);
            setBatchMarkdown("");
            setBatchImages([]);
            if (batchFileInputRef.current) batchFileInputRef.current.value = "";
            fetchEntries();
        } catch (error: any) {
            console.error("Batch submit error:", error);
            toast.error(`批量处理失败: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("确定要删除这条内容吗？")) return;

        try {
            const res = await fetch(`/api/knowledge?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("删除成功");
                setEntries(entries.filter(e => e.id !== id));
            } else {
                throw new Error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("删除失败");
        }
    };

    const filteredEntries = entries.filter(e =>
        e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen bg-background">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">知识库管理</h1>
                    <p className="text-muted-foreground mt-1">管理 Sales Copilot 的 AI 知识储备</p>
                </div>
                <Button onClick={fetchEntries} variant="outline" size="icon">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-[480px_1fr]">
                {/* Form Section */}
                <div className="space-y-6 sticky top-24 h-fit">
                    <Tabs defaultValue="single" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="single">单条录入</TabsTrigger>
                            <TabsTrigger value="batch">智能批量导入</TabsTrigger>
                        </TabsList>

                        <TabsContent value="single">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        单条手动录入
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">内容类型</label>
                                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="description">产品描述 (DESC)</SelectItem>
                                                    <SelectItem value="qa">标准问答 (QA)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">所属分类</label>
                                            <Select value={category} onValueChange={setCategory}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">通用</SelectItem>
                                                    <SelectItem value="function">功能说明</SelectItem>
                                                    <SelectItem value="compatibility">适配/接口</SelectItem>
                                                    <SelectItem value="impact">效果提升</SelectItem>
                                                    <SelectItem value="principle">技术原理</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">知识内容</label>
                                            <Textarea
                                                placeholder={type === "qa" ? "Q: 问题\nA: 答案" : "输入产品功能、价值或业务逻辑描述..."}
                                                rows={5}
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">附件图片 (可选)</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="URL 地址"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    className="flex-1"
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={handleFileUpload}
                                                        disabled={isUploading}
                                                    />
                                                    <Button type="button" variant="outline" size="icon" disabled={isUploading}>
                                                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                            {imageUrl && (
                                                <div className="relative mt-2 rounded border overflow-hidden bg-muted aspect-video">
                                                    <img
                                                        src={`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`}
                                                        alt="Preview"
                                                        className="object-contain w-full h-full"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="absolute top-1 right-1 h-6 w-6 bg-background/50 backdrop-blur"
                                                        onClick={() => setImageUrl("")}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                            保存到知识库
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="batch">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Upload className="h-4 w-4 text-primary" />
                                            素材智能关联导入
                                        </CardTitle>
                                        <Badge variant="secondary">一键关联图片</Badge>
                                    </div>
                                    <CardDescription>
                                        在下方 Markdown 中写入文件名，并同步上传对应文件即可自动匹配。
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleBatchSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold flex items-center gap-1.5 px-1">
                                                <FileText className="h-3.5 w-3.5" />
                                                Markdown 文档内容
                                            </label>
                                            <Textarea
                                                placeholder={`# type: qa\n# category: function\nQ: FA506能连吗?\nA: 支持直连.\n\n---\n\n# type: description\n# image: f506_layout.png\n这是FA506的接线示意图...`}
                                                rows={10}
                                                className="font-mono text-sm leading-relaxed"
                                                value={batchMarkdown}
                                                onChange={(e) => setBatchMarkdown(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-3 p-4 border-2 border-dashed rounded-xl bg-muted/20">
                                            <label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                                                <ImageIcon className="h-3.5 w-3.5" />
                                                选择对应图片附件 ({batchImages.length})
                                            </label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                id="batch-file-input"
                                                ref={batchFileInputRef}
                                                onChange={handleBatchImagesChange}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full border-primary/30 hover:bg-primary/5"
                                                onClick={() => batchFileInputRef.current?.click()}
                                            >
                                                选取本地多张图片
                                            </Button>

                                            {batchImages.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {batchImages.map((f, i) => (
                                                        <div key={i} className="text-[10px] bg-background border px-2 py-1 rounded flex items-center gap-1">
                                                            <ImageIcon className="h-3 w-3 text-muted-foreground" />
                                                            {f.name}
                                                            <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setBatchImages(prev => prev.filter((_, idx) => idx !== i))} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 text-[11px] space-y-1">
                                            <p className="font-bold text-amber-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> 使用技巧：
                                            </p>
                                            <p>• 文档中写 <code className="bg-background px-1"># image: 文件名.png</code> 即可关联。</p>
                                            <p>• 文档内容使用 <code className="bg-background px-1">---</code> 进行分段录入。</p>
                                        </div>

                                        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    正在处理并入库...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 font-bold">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    开始智能导入
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* List Entries Section */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="搜索知识内容、分类或来源..."
                            className="pl-11 h-12 bg-background border-none shadow-sm rounded-xl focus-visible:ring-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/40" />
                            <p className="font-medium">正在深度检索数据库...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    全部知识储备 ({filteredEntries.length})
                                </span>
                            </div>

                            {filteredEntries.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed rounded-2xl flex flex-col items-center gap-3 bg-muted/10">
                                    <BookOpen className="h-12 w-12 text-muted-foreground/20" />
                                    <p className="text-muted-foreground font-medium">
                                        {searchQuery ? "未找到搜索结果" : "知识库尚无记录，请从左侧录入"}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {filteredEntries.map((entry) => (
                                        <Card key={entry.id} className="overflow-hidden group hover:border-primary/50 transition-all shadow-sm">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="flex-1 p-5">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Badge className={
                                                            entry.type === "qa"
                                                                ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none"
                                                                : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none"
                                                        }>
                                                            {entry.type === "qa" ? <MessageCircle className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                                                            {entry.type === "qa" ? "问答" : "描述"}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-[10px] h-5 rounded-md font-mono">
                                                            {entry.category.toUpperCase()}
                                                        </Badge>
                                                        {entry.source_name && (
                                                            <span className="text-[10px] text-muted-foreground font-medium border-l pl-2 ml-1">
                                                                {entry.source_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/80 line-clamp-6">{entry.content}</p>
                                                </div>
                                                {entry.image_url && (
                                                    <div className="w-full md:w-36 bg-muted/40 border-l flex items-center justify-center p-3">
                                                        <div className="relative w-full h-full min-h-[80px]">
                                                            <img
                                                                src={`/api/proxy-image?url=${encodeURIComponent(entry.image_url)}`}
                                                                alt="Media"
                                                                className="absolute inset-0 w-full h-full object-contain rounded-md bg-background shadow-xs"
                                                                onError={(e) => {
                                                                    // Show fallback icon if image fails
                                                                    (e.target as any).src = "https://placehold.co/200x200?text=No+Image";
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="p-3 border-t md:border-t-0 md:border-l flex md:flex-col justify-end gap-2 bg-muted/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                                        onClick={() => handleDelete(entry.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
