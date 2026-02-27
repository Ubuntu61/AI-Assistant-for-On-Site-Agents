"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SelectionPopup, AIAgentToggle } from "@/components/ai-agent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { energyMonitoringData } from "@/lib/product-data";
import {
  Zap,
  TrendingDown,
  BarChart3,
  Activity,
  Gauge,
  Clock,
  FileText,
  CheckCircle,
} from "lucide-react";

const energyFeatures = [
  {
    title: "实时能耗监测",
    description: "实时掌握每小时的单机台能耗变动",
    icon: Activity,
  },
  {
    title: "落纱耗电分析",
    description: "根据一落纱的用电，计算出吨纱耗电",
    icon: Gauge,
  },
  {
    title: "趋势统计分析",
    description: "按照班次、机台、品种进行趋势线统计",
    icon: TrendingDown,
  },
  {
    title: "多维度对比",
    description: "大中小纱耗电分析，快速分析设备故障",
    icon: BarChart3,
  },
];

const energyBenefits = [
  "从原先的粗线条转为精细化管理",
  "实时监测有功功率、功率因数",
  "根据十落纱的用电计算平均吨纱耗电",
  "降低吨纱能耗成本",
  "及时发现能耗异常问题",
  "为节能改造提供数据支撑",
];

export default function EnergyFeaturePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SelectionPopup />

      <main className="py-12">
        {/* Page Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">04 能耗监测</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">{energyMonitoringData.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {energyMonitoringData.description}
            </p>
          </div>
        </section>

        {/* Hero Stats */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {energyFeatures.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent mx-auto">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Collection Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>采集指标</CardTitle>
                    <CardDescription>能耗监测系统采集的关键数据</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {energyMonitoringData.collectItems.map((item, idx) => (
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

            {/* Benefits */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>核心价值</CardTitle>
                    <CardDescription>能耗监测带来的管理提升</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {energyBenefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 py-2"
                    >
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                      <span className="text-muted-foreground leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Analysis Section */}
        <section className="container mx-auto px-4 mb-16">
          <Card className="max-w-5xl mx-auto">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                能耗分析详解
              </CardTitle>
              <CardDescription>从多维度分析设备能耗，实现精细化管理</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-foreground">按时间分析</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>实时能耗监测</li>
                    <li>班次能耗统计</li>
                    <li>日/月/年能耗趋势</li>
                    <li>峰谷用电分析</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Gauge className="h-5 w-5 text-accent" />
                    <h4 className="font-semibold text-foreground">按设备分析</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>单机台能耗监测</li>
                    <li>设备间能耗对比</li>
                    <li>异常能耗报警</li>
                    <li>设备效率分析</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-chart-1" />
                    <h4 className="font-semibold text-foreground">按产品分析</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>品种能耗对比</li>
                    <li>吨纱耗电计算</li>
                    <li>大中小纱分析</li>
                    <li>工艺参数关联</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-6 rounded-xl bg-accent/10 border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">重点工序分析</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  对于重点工序细纱工序的耗电进行详细的分析，包括不同机台落纱的耗电分析对比，一落纱的锭速、大中小纱对耗电的影响。通过精细化的能耗数据采集和分析，帮助企业找到节能优化的空间，降低生产成本。
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Display Effect Section */}
        <section className="container mx-auto px-4 mb-16">
          <Card className="max-w-5xl mx-auto bg-card">
            <CardHeader>
              <CardTitle>展示效果</CardTitle>
              <CardDescription>能耗监测系统的可视化展示</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-muted/50 border border-border">
                  <h4 className="font-semibold text-foreground mb-4">实时监控看板</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">当前总功率</span>
                      <span className="font-mono text-foreground">实时显示</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">今日累计能耗</span>
                      <span className="font-mono text-foreground">自动统计</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">吨纱耗电</span>
                      <span className="font-mono text-foreground">智能计算</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">能耗趋势</span>
                      <span className="font-mono text-foreground">图表展示</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-muted/50 border border-border">
                  <h4 className="font-semibold text-foreground mb-4">分析报表输出</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">班次能耗报表</span>
                      <Badge variant="outline">自动生成</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">设备能耗对比</span>
                      <Badge variant="outline">可视化</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">异常报警记录</span>
                      <Badge variant="outline">实时推送</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">节能建议报告</span>
                      <Badge variant="outline">智能分析</Badge>
                    </div>
                  </div>
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
