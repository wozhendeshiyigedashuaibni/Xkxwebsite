/**
 * Admin Dashboard - Simple Test Page
 */

import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 后台管理系统
        </h1>
        <p className="text-gray-600 mb-6">
          后台管理系统已成功加载！
        </p>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h2 className="font-semibold text-green-900 mb-2">✅ 系统状态：正常</h2>
            <p className="text-sm text-green-700">前端和路由工作正常</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h2 className="font-semibold text-blue-900 mb-2">📋 可用功能</h2>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 产品管理</li>
              <li>• 内容管理</li>
              <li>• 用户认证</li>
            </ul>
          </div>
          
          <div className="flex gap-4">
            <a 
              href="/admin/products"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              产品管理
            </a>
            <a 
              href="/admin/content"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              内容管理
            </a>
            <a 
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
