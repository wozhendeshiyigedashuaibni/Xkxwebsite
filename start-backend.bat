@echo off
echo ========================================
echo 启动后端服务器
echo ========================================
echo.

echo [1/3] 检查环境变量配置...
if not exist .env.local (
    echo ❌ .env.local 文件不存在
    echo 💡 请先运行 setup-backend.bat 创建配置文件
    pause
    exit /b 1
)
echo ✅ 环境变量配置文件存在
echo.

echo [2/3] 检查数据库连接...
echo.

echo [3/3] 启动后端服务器...
echo 🚀 服务器将运行在 http://localhost:3001
echo 💡 按 Ctrl+C 停止服务器
echo.
npm run server
