"use client";

import React from "react"

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SelectionPopup, AIAgentToggle } from "@/components/ai-agent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productionFeatures } from "@/lib/product-data";
import {
  Users,
  Settings,
  Wrench,
  Play,
  FileText,
  Clock,
  AlertTriangle,
  BarChart3,
  ClipboardList,
  Layers,
} from "lucide-react";

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "staff-replacement": Users,
  "equipment-status": Settings,
  "process-change": Wrench,
  "production-operation": Play,
};

export default function ProductionFeaturePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SelectionPopup />

      <main className="py-12">
        {/* Page Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">03 生产系统功能</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">生产系统功能详解</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              简易、灵活、方便、快捷的现场应用管理系统，涵盖排班管理、人员替岗、停台分析、落纱统计、订单追溯、工艺翻改、开台了机、计件管理等功能
            </p>
          </div>
        </section>

        {/* Field Applications Grid */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">现场应用功能</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {productionFeatures.fieldApplications.map((app, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                    {idx === 0 && <Clock className="h-6 w-6" />}
                    {idx === 1 && <Users className="h-6 w-6" />}
                    {idx === 2 && <AlertTriangle className="h-6 w-6" />}
                    {idx === 3 && <BarChart3 className="h-6 w-6" />}
                    {idx === 4 && <FileText className="h-6 w-6" />}
                    {idx === 5 && <Wrench className="h-6 w-6" />}
                    {idx === 6 && <Play className="h-6 w-6" />}
                    {idx === 7 && <ClipboardList className="h-6 w-6" />}
                  </div>
                  <h3 className="font-semibold text-foreground">{app.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Functions Table */}
        <section className="container mx-auto px-4 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                主要功能介绍
              </CardTitle>
              <CardDescription>生产系统各功能模块的详细说明</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">主要功能</TableHead>
                    <TableHead>功能描述</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionFeatures.mainFunctions.map((func, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        <Badge variant={func.name.includes("选配") ? "outline" : "default"}>
                          {func.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground leading-relaxed">
                        {func.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Detailed Modules */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">功能模块详解</h2>

          <Tabs defaultValue="staff-replacement" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="staff-replacement">人员替岗</TabsTrigger>
              <TabsTrigger value="equipment-status">设备状态</TabsTrigger>
              <TabsTrigger value="process-change">工艺翻改</TabsTrigger>
              <TabsTrigger value="production-operation">生产运转</TabsTrigger>
            </TabsList>

            {productionFeatures.detailedModules.map((module) => {
              const IconComponent = moduleIcons[module.id] || Settings;
              return (
                <TabsContent key={module.id} value={module.id}>
                  <Card>
                    <CardHeader className="bg-primary/5 border-b border-border">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{module.title}</CardTitle>
                          <CardDescription className="mt-1">功能描述</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            功能描述
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {module.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            采集要素
                          </h4>
                          <div className="space-y-2">
                            {module.collectItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                              >
                                <span className="font-medium text-foreground">{item.label}</span>
                                <span className="text-sm text-muted-foreground">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 p-6 rounded-xl bg-muted/30 border border-border">
                        <h4 className="font-semibold text-foreground mb-2">展示效果说明</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          系统通过可视化界面展示{module.title}的实时数据，支持多维度筛选和分析。管理人员可以通过Web端或移动APP随时查看相关信息，及时做出决策。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
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
