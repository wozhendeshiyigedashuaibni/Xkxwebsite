#!/bin/bash

echo "🔍 验证错误修复"
echo "================="
echo ""

# 检查 App.tsx 是否包含必要的导入
echo "1️⃣ 检查 App.tsx 导入..."
if grep -q "import { LanguageProvider, useLanguage }" src/app/App.tsx; then
    echo "   ✅ LanguageProvider 导入存在"
else
    echo "   ❌ LanguageProvider 导入缺失"
    exit 1
fi

if grep -q "import { BrowserRouter as Router" src/app/App.tsx; then
    echo "   ✅ React Router 导入存在"
else
    echo "   ❌ React Router 导入缺失"
    exit 1
fi

if grep -q "import AdminDashboardPage" src/app/App.tsx; then
    echo "   ✅ AdminDashboardPage 导入存在"
else
    echo "   ❌ AdminDashboardPage 导入缺失"
    exit 1
fi

echo ""
echo "2️⃣ 检查必要文件..."

# 检查关键文件是否存在
FILES=(
    "src/app/App.tsx"
    "src/contexts/LanguageContext.tsx"
    "src/contexts/AdminAuthContext.tsx"
    "src/app/pages/AdminDashboardPage.tsx"
    "src/app/pages/AdminLoginPage.tsx"
    "public/admin-test.html"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file 不存在"
        exit 1
    fi
done

echo ""
echo "3️⃣ 检查路由配置..."
if grep -q 'path="/admin/dashboard"' src/app/App.tsx; then
    echo "   ✅ /admin/dashboard 路由已配置"
else
    echo "   ❌ /admin/dashboard 路由缺失"
    exit 1
fi

if grep -q 'path="/admin-login"' src/app/App.tsx; then
    echo "   ✅ /admin-login 路由已配置"
else
    echo "   ❌ /admin-login 路由缺失"
    exit 1
fi

echo ""
echo "✅ 所有检查通过！"
echo ""
echo "📋 下一步操作："
echo "   1. 刷新浏览器（Ctrl+F5）"
echo "   2. 访问: http://localhost:5173/admin/dashboard"
echo "   3. 或访问: http://localhost:5173/admin-test.html"
echo ""
echo "🔗 快速访问："
echo "   • 首页:       http://localhost:5173/"
echo "   • 测试页面:   http://localhost:5173/admin-test.html"
echo "   • 简化后台:   http://localhost:5173/admin/dashboard"
echo "   • 登录页面:   http://localhost:5173/admin-login"
echo ""
