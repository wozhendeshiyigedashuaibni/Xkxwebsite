/**
 * Admin Layout Component
 * 后台管理布局：侧边栏 + 顶部栏 + 内容区域
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { logout, user } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      disabled: true, // 暂未实现
    },
    {
      path: '/admin/products',
      label: 'Products',
      icon: Package,
    },
    {
      path: '/admin/content',
      label: 'Content',
      icon: FileText,
    },
    {
      path: '/admin/leads',
      label: 'Inquiries',
      icon: MessageSquare,
      disabled: true, // 暂未实现
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`
          hidden md:flex flex-col bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo & Toggle */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">X</span>
              </div>
              <span className="font-semibold text-gray-900">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  }
                }}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-colors group relative
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${
                    isActive && !item.disabled
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {item.disabled && !sidebarCollapsed && (
                  <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">
                    Soon
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          <div
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`
              mt-3 w-full flex items-center gap-2 px-3 py-2 text-red-600 
              hover:bg-red-50 rounded-lg transition-colors
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo & Close */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  } else {
                    setMobileSidebarOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-colors
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${
                    isActive && !item.disabled
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.disabled && (
                  <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Breadcrumb or Title */}
          <div className="flex-1 flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              View Site →
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
