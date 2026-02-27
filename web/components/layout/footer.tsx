import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">G</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">格罗瑞智能</h3>
                <p className="text-xs text-muted-foreground">纺纱生产管理系统</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              专注纺织行业数字化转型，提供完整的MES制造执行系统解决方案
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">产品功能</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features/production" className="hover:text-foreground transition-colors">生产系统功能</Link></li>
              <li><Link href="/features/energy" className="hover:text-foreground transition-colors">能耗监测功能</Link></li>
              <li><Link href="/features/data" className="hover:text-foreground transition-colors">生产数据监测</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">服务支持</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/survey" className="hover:text-foreground transition-colors">需求调研</Link></li>
              <li><Link href="/comparison" className="hover:text-foreground transition-colors">方案对比</Link></li>
              <li><Link href="/report" className="hover:text-foreground transition-colors">方案报告</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">联系我们</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/chat" className="hover:text-foreground transition-colors">在线咨询</Link></li>
              <li>技术支持热线</li>
              <li>商务合作咨询</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>版权所有 格罗瑞智能科技 保留所有权利</p>
        </div>
      </div>
    </footer>
  );
}
