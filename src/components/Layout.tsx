import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FlaskConical,
  Layers,
  Sun,
  ClipboardCheck,
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { path: '/', label: '生产概览', icon: LayoutDashboard },
  { path: '/materials', label: '原料管理', icon: Package },
  { path: '/pulping', label: '制浆工序', icon: FlaskConical },
  { path: '/lifting', label: '捞纸生产', icon: Layers },
  { path: '/drying', label: '晒纸焙干', icon: Sun },
  { path: '/inspection', label: '检验分级', icon: ClipboardCheck },
  { path: '/orders', label: '订单生产', icon: ShoppingCart },
  { path: '/traceability', label: '销售溯源', icon: Search },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-xuan-paper ink-wash-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:relative z-50 h-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-16' : 'w-60'}
          bg-xuan-paperLight/95 backdrop-blur-sm border-r border-xuan-paperDark/40
          flex flex-col shadow-lg lg:shadow-none`}
      >
        <div className={`flex items-center h-16 px-4 border-b border-xuan-paperDark/30 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 animate-slide-in">
              <div className="w-8 h-8 bg-xuan-ochre rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">宣</span>
              </div>
              <div>
                <h1 className="text-sm font-serif font-semibold text-xuan-ink leading-tight">宣纸生产管理</h1>
                <p className="text-[10px] text-xuan-inkLight">传统工艺 · 数字管理</p>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              if (sidebarOpen) setSidebarOpen(false);
            }}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-xuan-paperDark/30 text-xuan-inkLight transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-xuan-paperDark/30 text-xuan-inkLight"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center mx-2 my-0.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${collapsed ? 'justify-center' : 'gap-3'}
                ${isActive
                  ? 'bg-xuan-ochre/10 text-xuan-ochre shadow-sm'
                  : 'text-xuan-inkLight hover:bg-xuan-paperDark/30 hover:text-xuan-ink'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-xuan-paperDark/30">
            <div className="xuan-card p-3 text-center">
              <p className="text-xs text-xuan-inkLight font-serif">千年宣纸 · 匠心传承</p>
              <p className="text-[10px] text-xuan-inkLight/60 mt-1">泾县非遗工艺管理系统</p>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center h-14 px-4 lg:px-6 border-b border-xuan-paperDark/30 bg-xuan-paperLight/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-xuan-paperDark/30 text-xuan-inkLight mr-3"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-serif font-semibold text-xuan-ink">传统宣纸生产管理系统</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-xs text-xuan-inkLight">
              <div className="w-2 h-2 rounded-full bg-xuan-moss animate-pulse" />
              系统运行正常
            </div>
            <div className="w-8 h-8 rounded-full bg-xuan-ochre/10 flex items-center justify-center">
              <span className="text-xs font-serif text-xuan-ochre font-semibold">管</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 paper-texture">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
