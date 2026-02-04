@echo off
chcp 65001 >nul
echo.
echo 🔍 验证错误修复
echo =================
echo.

echo 1️⃣ 检查 App.tsx 导入...
findstr /C:"import { LanguageProvider, useLanguage }" src\app\App.tsx >nul
if %errorlevel% equ 0 (
    echo    ✅ LanguageProvider 导入存在
) else (
    echo    ❌ LanguageProvider 导入缺失
    exit /b 1
)

findstr /C:"import { BrowserRouter as Router" src\app\App.tsx >nul
if %errorlevel% equ 0 (
    echo    ✅ React Router 导入存在
) else (
    echo    ❌ React Router 导入缺失
    exit /b 1
)

findstr /C:"import AdminDashboardPage" src\app\App.tsx >nul
if %errorlevel% equ 0 (
    echo    ✅ AdminDashboardPage 导入存在
) else (
    echo    ❌ AdminDashboardPage 导入缺失
    exit /b 1
)

echo.
echo 2️⃣ 检查必要文件...

if exist "src\app\App.tsx" (
    echo    ✅ src\app\App.tsx
) else (
    echo    ❌ src\app\App.tsx 不存在
    exit /b 1
)

if exist "src\contexts\LanguageContext.tsx" (
    echo    ✅ src\contexts\LanguageContext.tsx
) else (
    echo    ❌ src\contexts\LanguageContext.tsx 不存在
    exit /b 1
)

if exist "src\contexts\AdminAuthContext.tsx" (
    echo    ✅ src\contexts\AdminAuthContext.tsx
) else (
    echo    ❌ src\contexts\AdminAuthContext.tsx 不存在
    exit /b 1
)

if exist "src\app\pages\AdminDashboardPage.tsx" (
    echo    ✅ src\app\pages\AdminDashboardPage.tsx
) else (
    echo    ❌ src\app\pages\AdminDashboardPage.tsx 不存在
    exit /b 1
)

if exist "src\app\pages\AdminLoginPage.tsx" (
    echo    ✅ src\app\pages\AdminLoginPage.tsx
) else (
    echo    ❌ src\app\pages\AdminLoginPage.tsx 不存在
    exit /b 1
)

if exist "public\admin-test.html" (
    echo    ✅ public\admin-test.html
) else (
    echo    ❌ public\admin-test.html 不存在
    exit /b 1
)

echo.
echo 3️⃣ 检查路由配置...
findstr /C:"path=\"/admin/dashboard\"" src\app\App.tsx >nul
if %errorlevel% equ 0 (
    echo    ✅ /admin/dashboard 路由已配置
) else (
    echo    ❌ /admin/dashboard 路由缺失
    exit /b 1
)

findstr /C:"path=\"/admin-login\"" src\app\App.tsx >nul
if %errorlevel% equ 0 (
    echo    ✅ /admin-login 路由已配置
) else (
    echo    ❌ /admin-login 路由缺失
    exit /b 1
)

echo.
echo ✅ 所有检查通过！
echo.
echo 📋 下一步操作：
echo    1. 刷新浏览器（Ctrl+F5）
echo    2. 访问: http://localhost:5173/admin/dashboard
echo    3. 或访问: http://localhost:5173/admin-test.html
echo.
echo 🔗 快速访问：
echo    • 首页:       http://localhost:5173/
echo    • 测试页面:   http://localhost:5173/admin-test.html
echo    • 简化后台:   http://localhost:5173/admin/dashboard
echo    • 登录页面:   http://localhost:5173/admin-login
echo.
pause
