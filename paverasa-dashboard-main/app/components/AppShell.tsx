"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getRoleDescription, NAV_ITEMS, hasPermission } from "../lib/roles";
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Wallet, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  User,
  Calendar
} from "lucide-react";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

interface AppShellProps {
  children: ReactNode;
  showDateFilter?: boolean;
  dateFilter?: string;
  onDateFilterChange?: (value: string) => void;
}

const navIcons: Record<string, React.ReactNode> = {
  "/dashboard": <LayoutDashboard className="w-5 h-5" />,
  "/revenue": <DollarSign className="w-5 h-5" />,
  "/expenses": <TrendingUp className="w-5 h-5" />,
  "/profit-loss": <Wallet className="w-5 h-5" />,
  "/cash-flow": <Wallet className="w-5 h-5" />,
  "/analytics": <BarChart3 className="w-5 h-5" />,
  "/reports": <FileText className="w-5 h-5" />,
  "/kpi": <BarChart3 className="w-5 h-5" />,
  "/settings": <Settings className="w-5 h-5" />,
};

export default function AppShell({ children, showDateFilter = false, dateFilter, onDateFilterChange }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const result = await response.json();

        if (response.ok) {
          setUser(result.user);
        }
      } catch {
        setUser(null);
      }
    }

    void loadUser();
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    hasPermission(user?.role || "", item.permission),
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-slate-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-40
        w-72 bg-slate-900 
        text-white flex flex-col
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        border-r border-slate-800
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
              <h1 className="text-sm font-semibold text-white tracking-tight">Paverasa</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }
                `}
              >
                <div className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                  {navIcons[item.href] || <LayoutDashboard className="w-5 h-5" />}
                </div>
                <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
                  {item.label}
                </span>
                {isActive && sidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        {user ? (
          <div className={`
            p-4 border-t border-slate-800
            ${sidebarOpen ? 'block' : 'hidden lg:block'}
          `}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'} flex-1 min-w-0`}>
                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                <div className="text-xs text-slate-400 truncate">{user.email}</div>
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              type="button"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>Logout</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="h-full px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-slate-900">
                  {visibleNavItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {showDateFilter && onDateFilterChange && (
                <div className="hidden md:flex items-center gap-2 pr-4 border-r border-slate-200">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <select
                    className="text-sm text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer"
                    value={dateFilter}
                    onChange={(e) => onDateFilterChange(e.target.value)}
                  >
                    <option>Today</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                </div>
              )}
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.role}</div>
                  </div>
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
