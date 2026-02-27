"use client";

import React from "react"

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  productOverview,
  fourSystems,
  nineApplications,
  systemHighlights,
  platformAdvantages,
  smartScheduling,
} from "@/lib/product-data";
import {
  Network,
  Settings,
  Monitor,
  Smartphone,
  Calendar,
  Sliders,
  Truck,
  Factory,
  BarChart,
  Zap,
  Wrench,
  CheckCircle,
  LayoutDashboard,
  ArrowRight,
  MessageSquare,
  FileText,
  ClipboardList,
  ChevronRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Network,
  Settings,
  Monitor,
  Smartphone,
  Calendar,
  Sliders,
  Truck,
  Factory,
  BarChart,
  Zap,
  Wrench,
  CheckCircle,
  LayoutDashboard,
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 py-20 lg:py-28">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6">
                纺织智能生产管理云平台
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
                {productOverview.title}
              </h1>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {productOverview.description}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/survey">
                  <Button size="lg" className="gap-2">
                    <ClipboardList className="h-5 w-5" />
                    开始需求调研
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                    <MessageSquare className="h-5 w-5" />
                    在线咨询
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
              {productOverview.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-card p-6 text-center shadow-sm border border-border">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Systems Section */}
        <section className="bg-card py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <Badge variant="outline" className="mb-4">
                02 产品概要
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">四大系统平台</h2>
              <p className="text-muted-foreground leading-relaxed">
                完整的纺织智能生产管理解决方案，涵盖物联网、MES、监控和移动应用
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {fourSystems.map((system) => {
                const IconComponent = iconMap[system.icon] || Settings;
                return (
                  <Card key={system.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{system.title}</CardTitle>
                      <CardDescription>{system.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {system.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="h-3 w-3 text-primary" />
                            {feature}
                          </li>
                        ))}
                        {system.features.length > 4 && (
                          <li className="text-sm text-primary">+{system.features.length - 4} 更多功能</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Nine Applications Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <Badge variant="outline" className="mb-4">
                九大应用
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">面向车间各环节的生产管理</h2>
              <p className="text-muted-foreground leading-relaxed">
                格罗瑞MES制造执行系统是针对纺织生产行业的实际需求，基于最新的软件技术、自动化开发的一套效果卓著的车间生产信息化管理软件
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {nineApplications.map((app) => {
                const IconComponent = iconMap[app.icon] || Settings;
                return (
                  <Card key={app.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{app.title}</CardTitle>
                          <CardDescription className="text-sm">{app.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {app.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Smart Scheduling Section */}
        <section className="bg-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <Badge className="mb-4">智能排产</Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">{smartScheduling.title}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {smartScheduling.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 rounded-xl bg-card p-5 shadow-sm border border-border"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-medium text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* System Highlights */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <Badge variant="outline" className="mb-4">
                系统亮点
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">核心价值与优势</h2>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {systemHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{highlight.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Advantages */}
        <section className="bg-card py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <Badge variant="outline" className="mb-4">
                平台技术沉淀
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">打造智能化数字工厂</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {platformAdvantages.map((advantage) => (
                <Card key={advantage.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{advantage.title}</CardTitle>
                      <Badge variant="secondary">{advantage.subtitle}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">亮点</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{advantage.highlight}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">价值</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{advantage.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Cards - Navigation to Detail Pages */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <Badge variant="outline" className="mb-4">
                详细功能
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">了解更多功能模块</h2>
              <p className="text-muted-foreground leading-relaxed">
                点击卡片查看各功能模块的详细介绍，支持AI智能问答解释
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Link href="/features/production" className="group">
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Factory className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl">生产系统功能</CardTitle>
                    <CardDescription>
                      包含人员替岗、设备状态、工艺翻改、生产运转等核心功能模块
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      查看详情
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/features/energy" className="group">
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Zap className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl">能耗监测功能</CardTitle>
                    <CardDescription>
                      精细化能耗管理，实时监测单机台能耗变动，实现节能增效
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-accent font-medium">
                      查看详情
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/features/data" className="group">
                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-chart-1 text-card">
                      <BarChart className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl">生产数据监测</CardTitle>
                    <CardDescription>
                      多维度数据分析，统计日产量、月产量等指标进行聚合分析
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-chart-1 font-medium">
                      查看详情
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                开始您的智能纺纱之旅
              </h2>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                填写需求调研表，获取定制化解决方案
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/survey">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <FileText className="h-5 w-5" />
                    填写调研表
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                    <MessageSquare className="h-5 w-5" />
                    在线咨询
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
