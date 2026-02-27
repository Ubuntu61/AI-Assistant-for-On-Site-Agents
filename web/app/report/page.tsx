"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { productOverview, fourSystems, nineApplications, ourAdvantages } from "@/lib/product-data";
import {
  Download,
  FileText,
  CheckCircle,
  Building2,
  Settings,
  Zap,
  BarChart3,
  Calendar,
  User,
  Phone,
  Mail,
  Printer,
} from "lucide-react";

export default function ReportPage() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsGenerating(true);

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For now, use browser print as PDF
    window.print();

    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12">
        {/* Page Header */}
        <section className="container mx-auto px-4 mb-8 print:hidden">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">方案报告</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">定制化解决方案报告</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              基于您的需求生成的格罗瑞智能纺纱生产系统定制化解决方案
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleDownload} disabled={isGenerating} className="gap-2">
                <Download className="h-4 w-4" />
                {isGenerating ? "生成中..." : "下载PDF"}
              </Button>
              <Button variant="outline" onClick={handlePrint} className="gap-2 bg-transparent">
                <Printer className="h-4 w-4" />
                打印报告
              </Button>
            </div>
          </div>
        </section>

        {/* Report Content */}
        <div ref={reportRef} className="container mx-auto px-4 max-w-4xl print:max-w-full print:px-8">
          <Card className="print:shadow-none print:border-none">
            <CardContent className="p-8 print:p-0">
              {/* Report Header */}
              <div className="text-center mb-8 pb-8 border-b border-border">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-xl font-bold">G</span>
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-foreground">格罗瑞智能科技</h2>
                    <p className="text-sm text-muted-foreground">纺织智能生产管理云平台</p>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  智能纺纱生产系统解决方案
                </h1>
                <p className="text-muted-foreground">
                  生成日期：{new Date().toLocaleDateString("zh-CN")}
                </p>
              </div>

              {/* Executive Summary */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  方案概述
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {productOverview.description}
                </p>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {productOverview.stats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="my-8" />

              {/* Four Systems */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  四大系统平台
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {fourSystems.map((system) => (
                    <div key={system.id} className="p-4 rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-2">{system.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{system.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {system.features.slice(0, 4).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {system.features.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{system.features.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="my-8" />

              {/* Nine Applications */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  九大应用模块
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {nineApplications.map((app) => (
                    <div key={app.id} className="p-3 rounded-lg border border-border">
                      <h4 className="font-medium text-foreground text-sm mb-1">{app.title}</h4>
                      <p className="text-xs text-muted-foreground">{app.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="my-8" />

              {/* Core Advantages */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  核心优势
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {ourAdvantages.map((advantage, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-primary/5">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{advantage}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="my-8" />

              {/* Recommended Solutions */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  推荐方案配置
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">基础版</h4>
                      <Badge variant="secondary">适合中小企业</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        纺织物联网系统（数据采集）
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        生产监控系统（看板展示）
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        基础MES功能（计划、工艺、报表）
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">标准版</h4>
                      <Badge>推荐</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        包含基础版全部功能
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        完整MES系统（九大应用模块）
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        能耗监测系统
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        移动APP应用
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">高级版</h4>
                      <Badge variant="outline">适合大型企业</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        包含标准版全部功能
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        智能排产系统（G.A算法）
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        管理驾驶舱（决策支持）
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        ERP/WMS系统对接
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        定制化开发服务
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Implementation Timeline */}
              <section className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  实施周期
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold text-primary">第1-2周</div>
                    <div className="text-sm text-muted-foreground mt-1">需求调研与方案设计</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold text-primary">第3-4周</div>
                    <div className="text-sm text-muted-foreground mt-1">设备联网与数据采集</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold text-primary">第5-8周</div>
                    <div className="text-sm text-muted-foreground mt-1">系统部署与功能配置</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-lg font-bold text-primary">第9-12周</div>
                    <div className="text-sm text-muted-foreground mt-1">培训上线与持续优化</div>
                  </div>
                </div>
              </section>

              <Separator className="my-8" />

              {/* Contact Info */}
              <section className="text-center">
                <h3 className="text-lg font-bold text-foreground mb-4">联系我们</h3>
                <p className="text-muted-foreground mb-4">
                  如需进一步了解或获取详细报价，请联系我们的销售团队
                </p>
                <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>销售顾问</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>400-XXX-XXXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>sales@glory-mes.com</span>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header, footer, .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
