"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  MessageSquare,
  FileText,
  BarChart3,
  ClipboardList,
  Home,
  Factory,
  Sparkles,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "产品首页", icon: Home },
  { href: "/features/production", label: "生产系统", icon: FileText },
  { href: "/features/energy", label: "能耗监测", icon: BarChart3 },
  { href: "/features/data", label: "数据监测", icon: BarChart3 },
  { href: "/survey", label: "需求调研", icon: ClipboardList },
  { href: "/comparison", label: "方案对比", icon: FileText },
  { href: "/chat", label: "智能对话", icon: MessageSquare },
  { href: "/copilot", label: "销售领航", icon: Sparkles },
  { href: "/admin/knowledge", label: "管理后台", icon: Settings },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Factory className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground">格罗瑞智能</h1>
            <p className="text-xs text-muted-foreground">纺纱生产管理系统</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <item.icon className="mr-1.5 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">打开菜单</span>
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
