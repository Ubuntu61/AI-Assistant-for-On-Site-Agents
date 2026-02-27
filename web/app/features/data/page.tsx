"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SelectionPopup, AIAgentToggle } from "@/components/ai-agent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { productionDataMonitoring } from "@/lib/product-data";
import {
  BarChart3,
  Users,
  Settings,
  Package,
  FileText,
  TrendingUp,
  PieChart,
  Activity,
  Layers,
  CheckCircle,
} from "lucide-react";

const analysisDimensions = [
  {
    title: "机台维度",
    description: "班次、吨纱指标分析",
    icon: Settings,
    metrics: ["机台效率", "产量统计", "停机分析", "能耗对比"],
  },
  {
    title: "班组维度",
    description: "品种、人员指标分析",
    icon: Users,
    metrics: ["班组产量", "品种分布", "人员绩效", "质量指标"],
  },
  {
    title: "人员维度",
    description: "效率、产量指标分析",
    icon: Users,
    metrics: ["个人产量", "效率排名", "考勤记录", "技能评估"],
  },
  {
    title: "订单维度",
    description: "订单预测了机分析",
    icon: FileText,
    metrics: ["订单进度", "交期预测", "完成率", "延误分析"],
  },
];

const reportTypes = [
  { name: "生产日报表", description: "每日生产数据汇总" },
  { name: "员工考勤记录表", description: "人员出勤与工时统计" },
  { name: "订单进度分析表", description: "订单执行进度追踪" },
  { name: "品种产量效率分析表", description: "不同品种的产量与效率对比" },
  { name: "能耗统计报表", description: "能源消耗详细统计" },
];

export default function DataFeaturePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SelectionPopup />

      <main className="py-12">
        {/* Page Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">05 生产数据监测</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">{productionDataMonitoring.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {productionDataMonitoring.description}
            </p>
          </div>
        </section>

        {/* Analysis Items Grid */}
        <section className="container mx-auto px-4 mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>分析指标</CardTitle>
                  <CardDescription>多维度数据分析指标体系</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {productionDataMonitoring.analysisItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Analysis Dimensions */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">多维度分析</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {analysisDimensions.map((dimension, idx) => {
              const IconComponent = dimension.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent mb-4">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{dimension.title}</CardTitle>
                    <CardDescription>{dimension.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {dimension.metrics.map((metric, midx) => (
                        <li key={midx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Production Statistics */}
        <section className="container mx-auto px-4 mb-16">
          <Card className="max-w-5xl mx-auto">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                产量统计方法
              </CardTitle>
              <CardDescription>多种方式计算产量数据</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-foreground">千锭时断头率计算</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    根据千锭时断头率计算产量，适用于细纱工序的产量统计。系统自动采集断头数据，结合运行时间计算千锭时断头率，进而推算实际产量。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">细纱工序</Badge>
                    <Badge variant="outline">自动采集</Badge>
                    <Badge variant="outline">实时计算</Badge>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart className="h-5 w-5 text-accent" />
                    <h4 className="font-semibold text-foreground">落棉率计算</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    根据落棉率计算实际产量，适用于清花、梳棉等工序。通过监测落棉量与投料量的比例，准确计算各工序的实际产出。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">清花工序</Badge>
                    <Badge variant="outline">梳棉工序</Badge>
                    <Badge variant="outline">比例计算</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Report Types */}
        <section className="container mx-auto px-4 mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1 text-card">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>智能报表</CardTitle>
                  <CardDescription>根据客户需要多维度定制化开发各类管理报表</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportTypes.map((report, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-4 px-5 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">可定制</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Display Effect */}
        <section className="container mx-auto px-4 mb-16">
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle>展示效果</CardTitle>
              <CardDescription>数据监测系统的可视化展示方式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-muted/30 border border-border text-center">
                  <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">柱状图对比</h4>
                  <p className="text-sm text-muted-foreground">直观展示各维度数据对比</p>
                </div>
                <div className="p-5 rounded-xl bg-muted/30 border border-border text-center">
                  <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">趋势分析图</h4>
                  <p className="text-sm text-muted-foreground">展示数据变化趋势</p>
                </div>
                <div className="p-5 rounded-xl bg-muted/30 border border-border text-center">
                  <PieChart className="h-8 w-8 text-chart-1 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">占比分析图</h4>
                  <p className="text-sm text-muted-foreground">展示各类数据占比</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tips Section */}
        <section className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-accent/5 border-accent/20">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AI 智能助手</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    选中页面上的任意文字，点击出现的"AI解释"按钮，即可获得该内容的详细解释。您也可以点击右下角的对话按钮，直接与AI助手进行对话咨询。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
      <AIAgentToggle />
    </div>
  );
}
