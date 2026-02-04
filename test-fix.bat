@echo off
chcp 65001 >nul
echo.
echo 🔍 测试后台管理系统修复...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 1. 检查后端服务器
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

curl -s -o NUL -w "后端 API: %%{http_code}" http://localhost:3001/api/products
echo.
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 2. 检查前端页面  
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

curl -s -o NUL -w "首页: %%{http_code}" http://localhost:5173/
echo.
curl -s -o NUL -w "登录页面: %%{http_code}" http://localhost:5173/admin-login
echo.
curl -s -o NUL -w "测试页面: %%{http_code}" http://localhost:5173/admin-test.html
echo.
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 3. 测试管理员账号
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo 创建管理员账号...
curl -s -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
echo.
echo.

echo 测试登录...
curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}" > temp_login.json
type temp_login.json
echo.
del temp_login.json >nul 2>&1
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ 测试完成！
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 访问地址：
echo    登录页面: http://localhost:5173/admin-login
echo    简化后台: http://localhost:5173/admin/dashboard
echo    产品管理: http://localhost:5173/admin/products
echo    内容管理: http://localhost:5173/admin/content
echo.
echo 🔑 登录账号：
echo    Username: admin
echo    Password: admin123
echo.
echo 💡 如果看到 200 或 304 状态码，说明服务正常
echo.
pause
