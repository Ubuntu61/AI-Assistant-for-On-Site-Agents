"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AIAgentToggle } from "@/components/ai-agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { competitors, ourAdvantages } from "@/lib/product-data";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Target,
  MessageSquare,
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface ComparisonResult {
  report: string;
  tactics: string[];
}

export default function ComparisonPage() {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [customerNeeds, setCustomerNeeds] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [copiedTactic, setCopiedTactic] = useState<number | null>(null);

  const handleCompetitorToggle = (competitorId: string) => {
    setSelectedCompetitors((prev) =>
      prev.includes(competitorId)
        ? prev.filter((id) => id !== competitorId)
        : [...prev, competitorId]
    );
  };

  const generateComparison = async () => {
    if (selectedCompetitors.length === 0) {
      return;
    }

    setIsGenerating(true);

    // Simulate API call for generating comparison
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedCompetitorData = competitors.filter((c) =>
      selectedCompetitors.includes(c.id)
    );

    // Generate comparison report
    const report = generateComparisonReport(selectedCompetitorData, customerNeeds);
    const tactics = generateTactics(selectedCompetitorData);

    setComparisonResult({ report, tactics });
    setIsGenerating(false);
  };

  const generateComparisonReport = (
    competitorData: typeof competitors,
    needs: string
  ): string => {
    let report = `## 竞品对比分析报告\n\n`;
    report += `### 客户需求分析\n${needs || "（未填写具体需求）"}\n\n`;

    report += `### 竞品概况\n\n`;

    for (const comp of competitorData) {
      report += `#### ${comp.name}（${comp.type}）\n`;
      report += `- **核心功能**: ${comp.coreFeatures.join("、")}\n`;
      report += `- **纺织适配性**: ${comp.textileAdaptation}\n`;
      report += `- **优势**: ${comp.advantages.join("、")}\n`;
      report += `- **劣势**: ${comp.disadvantages.join("、")}\n`;
      report += `- **报价范围**: ${comp.priceRange}\n`;
      report += `- **客户口碑**: ${comp.reputation}\n\n`;
    }

    report += `### 格罗瑞核心优势\n\n`;
    for (const adv of ourAdvantages) {
      report += `- ${adv}\n`;
    }

    report += `\n### 结论与建议\n\n`;
    report += `基于以上分析，格罗瑞智能纺纱生产系统在以下方面具有明显优势：\n\n`;
    report += `1. **行业深耕优势**: 10年纺织行业经验，深刻理解纺织生产流程和管理痛点\n`;
    report += `2. **技术积累优势**: 55个工业机理模型、24个数据分析算法，技术底蕴深厚\n`;
    report += `3. **实施案例优势**: 上千家纺织企业成功案例，实施经验丰富\n`;
    report += `4. **定制化能力**: 适配纺织非标设备，灵活满足客户个性化需求\n`;

    return report;
  };

  const generateTactics = (competitorData: typeof competitors): string[] => {
    const tactics: string[] = [];

    for (const comp of competitorData) {
      if (comp.advantages.includes("品牌知名度高")) {
        tactics.push(
          `针对【${comp.name}品牌知名度高】：强调我们在纺织行业的专业深度，"大品牌通用型MES需要大量定制才能适配纺织场景，而我们是专门为纺织行业设计的系统，开箱即用，减少定制成本和实施周期。"`
        );
      }
      if (comp.advantages.includes("价格较低")) {
        tactics.push(
          `针对【${comp.name}价格较低】：强调总体拥有成本，"虽然初始报价可能略高，但我们的系统更贴合纺织行业需求，减少二次开发成本，长期使用的总成本更低，投资回报率更高。"`
        );
      }
      if (comp.advantages.includes("ERP集成能力强")) {
        tactics.push(
          `针对【${comp.name}ERP集成能力强】：突出MES专业性，"ERP管理的是企业层面的资源，MES管理的是车间层面的执行，专业的MES系统能够更好地管理生产现场，我们也支持与各类ERP系统的对接。"`
        );
      }
      if (comp.disadvantages.includes("纺织行业经验较浅")) {
        tactics.push(
          `针对【${comp.name}纺织经验不足】：强调行业Know-How，"纺织行业有很多特殊的管理需求，如千锭时断头率、落纱统计、工艺翻改等，没有深入行业理解很难做好，我们深耕纺织10年，这些都是我们的核心优势。"`
        );
      }
    }

    // Add general tactics
    tactics.push(
      `通用话术：强调服务响应，"我们在全国主要纺织产业集群都有服务团队，能够快速响应客户需求，提供本地化支持。"`
    );
    tactics.push(
      `通用话术：强调案例背书，"我们已经服务了上千家纺织企业，包括多家行业龙头，可以安排客户参观交流。"`
    );

    return tactics;
  };

  const copyTactic = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTactic(index);
    setTimeout(() => setCopiedTactic(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12">
        {/* Page Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">方案对比</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">竞品对比分析</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              选择目标竞品，输入客户核心需求，智能生成针对性对比报告和竞品应对话术
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-6xl">
          <Tabs defaultValue="competitors" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="competitors">竞品库</TabsTrigger>
              <TabsTrigger value="compare">生成对比</TabsTrigger>
              <TabsTrigger value="tactics">应对话术</TabsTrigger>
            </TabsList>

            {/* Competitors Tab */}
            <TabsContent value="competitors">
              <div className="grid gap-6">
                {competitors.map((competitor) => (
                  <Card key={competitor.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{competitor.name}</CardTitle>
                            <CardDescription>
                              <Badge variant="outline">{competitor.type}</Badge>
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">{competitor.priceRange}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 text-sm">核心功能</h4>
                          <ul className="space-y-1">
                            {competitor.coreFeatures.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 text-sm">优势</h4>
                          <ul className="space-y-1">
                            {competitor.advantages.map((adv, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-3.5 w-3.5 text-accent" />
                                {adv}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 text-sm">劣势</h4>
                          <ul className="space-y-1">
                            {competitor.disadvantages.map((dis, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <XCircle className="h-3.5 w-3.5 text-destructive" />
                                {dis}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-foreground">纺织适配性：</span>
                            <span className="text-muted-foreground">{competitor.textileAdaptation}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">客户口碑：</span>
                            <span className="text-muted-foreground">{competitor.reputation}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      选择竞品
                    </CardTitle>
                    <CardDescription>选择要对比的竞争对手</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {competitors.map((competitor) => (
                      <div key={competitor.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={competitor.id}
                          checked={selectedCompetitors.includes(competitor.id)}
                          onCheckedChange={() => handleCompetitorToggle(competitor.id)}
                        />
                        <Label htmlFor={competitor.id} className="font-normal cursor-pointer">
                          {competitor.name}
                          <span className="text-muted-foreground ml-2 text-sm">({competitor.type})</span>
                        </Label>
                      </div>
                    ))}

                    <div className="pt-4 space-y-2">
                      <Label htmlFor="customerNeeds">客户核心需求</Label>
                      <Textarea
                        id="customerNeeds"
                        placeholder="如：客户关注染整工艺追溯、移动端管理、与现有ERP对接..."
                        value={customerNeeds}
                        onChange={(e) => setCustomerNeeds(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button
                      onClick={generateComparison}
                      disabled={selectedCompetitors.length === 0 || isGenerating}
                      className="w-full gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          生成对比报告
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      对比报告
                    </CardTitle>
                    <CardDescription>基于选择的竞品和客户需求生成的对比分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {comparisonResult ? (
                      <div className="h-[500px] overflow-y-auto rounded-lg border border-border p-4">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
                            {comparisonResult.report}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>选择竞品并点击"生成对比报告"</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tactics Tab */}
            <TabsContent value="tactics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    竞品应对话术
                  </CardTitle>
                  <CardDescription>
                    针对竞品核心卖点生成的对应谈单话术，帮助销售人员化解客户的竞品顾虑
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {comparisonResult?.tactics ? (
                    <div className="space-y-4">
                      {comparisonResult.tactics.map((tactic, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <p className="text-sm text-foreground leading-relaxed">{tactic}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={() => copyTactic(idx, tactic)}
                            >
                              {copiedTactic === idx ? (
                                <Check className="h-4 w-4 text-accent" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>请先在"生成对比"标签页中生成对比报告</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Our Advantages */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>格罗瑞核心优势</CardTitle>
                  <CardDescription>销售谈单时可重点突出的我方优势</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ourAdvantages.map((advantage, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                      >
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <AIAgentToggle />
    </div>
  );
}
