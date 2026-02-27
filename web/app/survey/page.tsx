"use client";

import React from "react"

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Building2,
  Settings,
  Network,
  AlertTriangle,
  Wrench,
  Wallet,
  CheckCircle,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

interface FormData {
  // Basic info
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  
  // Equipment info
  equipmentModels: string;
  equipmentAge: string;
  hasDataInterface: boolean;
  automationLevel: string;
  
  // Network status
  isNetworked: boolean;
  networkType: string;
  existingCollectionSystem: string;
  collectionCoverage: string;
  
  // Pain points
  manualStatistics: string;
  productionBottleneck: string;
  managementIssues: string;
  
  // Customization needs
  erpIntegration: boolean;
  mobileAppNeeded: boolean;
  customReports: boolean;
  processEncryption: boolean;
  aiEquipmentIntegration: boolean;
  otherRequirements: string;
  
  // Budget
  budgetRange: string;
  purchaseTimeline: string;
  decisionProcess: string;
}

const initialFormData: FormData = {
  companyName: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  equipmentModels: "",
  equipmentAge: "",
  hasDataInterface: false,
  automationLevel: "",
  isNetworked: false,
  networkType: "",
  existingCollectionSystem: "",
  collectionCoverage: "",
  manualStatistics: "",
  productionBottleneck: "",
  managementIssues: "",
  erpIntegration: false,
  mobileAppNeeded: false,
  customReports: false,
  processEncryption: false,
  aiEquipmentIntegration: false,
  otherRequirements: "",
  budgetRange: "",
  purchaseTimeline: "",
  decisionProcess: "",
};

export default function SurveyPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.companyName || !formData.contactName || !formData.contactPhone) {
      toast.error("请填写必填项：公司名称、联系人和联系电话");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "提交成功！");
        setIsSubmitted(true);
      } else {
        toast.error(result.error || "提交失败，请重试");
      }
    } catch (error) {
      console.error("[v0] Survey submission error:", error);
      toast.error("网络错误，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 text-accent mx-auto mb-6">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">提交成功！</h1>
              <p className="text-lg text-muted-foreground mb-8">
                感谢您填写需求调研表，我们会尽快与您联系，为您提供定制化解决方案。
              </p>
              <Button onClick={() => setIsSubmitted(false)}>重新填写</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />

      <main className="py-12">
        {/* Page Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">需求调研</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">智能纺纱系统需求调研</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              请填写以下信息，我们将根据您的实际需求，提供定制化的智能纺纱生产管理解决方案
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>请填写企业及联系人信息</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      公司名称 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="请输入公司名称"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">
                      联系人 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="请输入联系人姓名"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">
                      联系电话 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactPhone"
                      placeholder="请输入联系电话"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">电子邮箱</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="请输入电子邮箱"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>设备信息</CardTitle>
                    <CardDescription>现有设备型号、品牌、数量及自动化程度</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="equipmentModels">设备型号/品牌/数量</Label>
                  <Textarea
                    id="equipmentModels"
                    placeholder="如：细纱机型号、喷气织机台数、染缸规格等"
                    value={formData.equipmentModels}
                    onChange={(e) => handleInputChange("equipmentModels", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentAge">设备出厂年限</Label>
                    <Select
                      value={formData.equipmentAge}
                      onValueChange={(value) => handleInputChange("equipmentAge", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择设备年限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-3">0-3年</SelectItem>
                        <SelectItem value="3-5">3-5年</SelectItem>
                        <SelectItem value="5-10">5-10年</SelectItem>
                        <SelectItem value="10+">10年以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="automationLevel">现有自动化程度</Label>
                    <Select
                      value={formData.automationLevel}
                      onValueChange={(value) => handleInputChange("automationLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择自动化程度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">较低（主要依赖人工）</SelectItem>
                        <SelectItem value="medium">中等（部分自动化）</SelectItem>
                        <SelectItem value="high">较高（大部分自动化）</SelectItem>
                        <SelectItem value="full">完全自动化</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDataInterface"
                    checked={formData.hasDataInterface}
                    onCheckedChange={(checked) => handleInputChange("hasDataInterface", !!checked)}
                  />
                  <Label htmlFor="hasDataInterface" className="font-normal">
                    设备是否自带数据采集接口
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Network Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1 text-card">
                    <Network className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>联网现状</CardTitle>
                    <CardDescription>现有网络和数据采集系统情况</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNetworked"
                    checked={formData.isNetworked}
                    onCheckedChange={(checked) => handleInputChange("isNetworked", !!checked)}
                  />
                  <Label htmlFor="isNetworked" className="font-normal">
                    设备是否已联网
                  </Label>
                </div>
                {formData.isNetworked && (
                  <div className="space-y-2 pl-6">
                    <Label>联网方式</Label>
                    <RadioGroup
                      value={formData.networkType}
                      onValueChange={(value) => handleInputChange("networkType", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lan" id="lan" />
                        <Label htmlFor="lan" className="font-normal">局域网</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="industrial" id="industrial" />
                        <Label htmlFor="industrial" className="font-normal">工业互联网</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other-network" />
                        <Label htmlFor="other-network" className="font-normal">其他</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="existingCollectionSystem">现有数据采集系统</Label>
                    <Input
                      id="existingCollectionSystem"
                      placeholder="如：PLC、组态软件等"
                      value={formData.existingCollectionSystem}
                      onChange={(e) => handleInputChange("existingCollectionSystem", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collectionCoverage">数据采集覆盖范围</Label>
                    <Select
                      value={formData.collectionCoverage}
                      onValueChange={(value) => handleInputChange("collectionCoverage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择覆盖范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无数据采集</SelectItem>
                        <SelectItem value="partial">部分工序覆盖</SelectItem>
                        <SelectItem value="most">大部分工序覆盖</SelectItem>
                        <SelectItem value="full">全工序覆盖</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pain Points */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>现有管理痛点</CardTitle>
                    <CardDescription>请描述当前生产管理中遇到的主要问题</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manualStatistics">手动统计的数据</Label>
                  <Textarea
                    id="manualStatistics"
                    placeholder="请描述目前需要手动统计的数据有哪些"
                    value={formData.manualStatistics}
                    onChange={(e) => handleInputChange("manualStatistics", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productionBottleneck">生产瓶颈</Label>
                  <Textarea
                    id="productionBottleneck"
                    placeholder="请描述当前生产中的主要瓶颈问题"
                    value={formData.productionBottleneck}
                    onChange={(e) => handleInputChange("productionBottleneck", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managementIssues">订单/工艺/库存管理核心问题</Label>
                  <Textarea
                    id="managementIssues"
                    placeholder="请描述订单管理、工艺管理、库存管理等方面的核心问题"
                    value={formData.managementIssues}
                    onChange={(e) => handleInputChange("managementIssues", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customization Needs */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>定制化需求</CardTitle>
                    <CardDescription>请选择您需要的定制化功能</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erpIntegration"
                      checked={formData.erpIntegration}
                      onCheckedChange={(checked) => handleInputChange("erpIntegration", !!checked)}
                    />
                    <Label htmlFor="erpIntegration" className="font-normal">
                      需要对接现有ERP/WMS/QC系统
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobileAppNeeded"
                      checked={formData.mobileAppNeeded}
                      onCheckedChange={(checked) => handleInputChange("mobileAppNeeded", !!checked)}
                    />
                    <Label htmlFor="mobileAppNeeded" className="font-normal">
                      需要移动端（车间主任/操作工端）
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="customReports"
                      checked={formData.customReports}
                      onCheckedChange={(checked) => handleInputChange("customReports", !!checked)}
                    />
                    <Label htmlFor="customReports" className="font-normal">
                      需要定制报表/看板
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="processEncryption"
                      checked={formData.processEncryption}
                      onCheckedChange={(checked) => handleInputChange("processEncryption", !!checked)}
                    />
                    <Label htmlFor="processEncryption" className="font-normal">
                      要求工艺配方加密
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aiEquipmentIntegration"
                      checked={formData.aiEquipmentIntegration}
                      onCheckedChange={(checked) => handleInputChange("aiEquipmentIntegration", !!checked)}
                    />
                    <Label htmlFor="aiEquipmentIntegration" className="font-normal">
                      需要对接AI质检/AGV等智能设备
                    </Label>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="otherRequirements">其他定制化需求</Label>
                  <Textarea
                    id="otherRequirements"
                    placeholder="请描述其他定制化需求"
                    value={formData.otherRequirements}
                    onChange={(e) => handleInputChange("otherRequirements", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Budget */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>项目预算</CardTitle>
                    <CardDescription>预算范围及采购计划</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">大致预算范围</Label>
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(value) => handleInputChange("budgetRange", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择预算范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-30">10-30万</SelectItem>
                        <SelectItem value="30-50">30-50万</SelectItem>
                        <SelectItem value="50-100">50-100万</SelectItem>
                        <SelectItem value="100-200">100-200万</SelectItem>
                        <SelectItem value="200+">200万以上</SelectItem>
                        <SelectItem value="undecided">待定</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseTimeline">采购时间节点</Label>
                    <Select
                      value={formData.purchaseTimeline}
                      onValueChange={(value) => handleInputChange("purchaseTimeline", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择采购时间" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">1个月内</SelectItem>
                        <SelectItem value="3months">3个月内</SelectItem>
                        <SelectItem value="6months">6个月内</SelectItem>
                        <SelectItem value="1year">1年内</SelectItem>
                        <SelectItem value="exploring">仅调研了解</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decisionProcess">决策流程</Label>
                  <Textarea
                    id="decisionProcess"
                    placeholder="请描述贵公司的采购决策流程"
                    value={formData.decisionProcess}
                    onChange={(e) => handleInputChange("decisionProcess", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2 px-8">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    提交调研表
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
