@echo off
chcp 65001 > nul
echo ========================================
echo 后端连接配置向导
echo ========================================
echo.

echo [步骤 1/4] 检查 .env.local 文件...
if exist .env.local (
    echo ⚠️  .env.local 文件已存在
    echo.
    type .env.local
    echo.
    set /p overwrite="是否覆盖？(y/n): "
    if /i not "%overwrite%"=="y" (
        echo 💡 保留现有配置，跳过创建
        goto :check_backend
    )
)

echo ✅ 创建 .env.local 文件...
(
echo # Frontend Environment Configuration
echo # This file is for local development only
echo.
echo # API Configuration
echo VITE_USE_MOCK=false
echo VITE_API_URL=http://localhost:3001/api
) > .env.local
echo ✅ .env.local 创建成功
echo.

:check_backend
echo [步骤 2/4] 检查后端依赖...
if not exist server\node_modules (
    echo ⚠️  后端依赖未安装
    echo 📦 正在安装后端依赖...
    cd server
    call npm install
    cd ..
    echo ✅ 后端依赖安装完成
) else (
    echo ✅ 后端依赖已安装
)
echo.

echo [步骤 3/4] 检查数据库...
echo 💡 尝试连接数据库...
npm run db:push > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 数据库连接成功
) else (
    echo ⚠️  数据库可能需要初始化
    echo 💡 请确保 .env 文件中 DATABASE_URL 配置正确
)
echo.

echo [步骤 4/4] 配置总结
echo ========================================
echo ✅ 环境变量已配置：.env.local
echo.
type .env.local
echo ========================================
echo.

echo 🎉 配置完成！
echo.
echo 📋 下一步操作：
echo.
echo 1. 启动后端服务器（新终端）：
echo    npm run server
echo.
echo 2. 启动前端服务器（当前终端）：
echo    npm run dev
echo.
echo 3. 打开浏览器访问：
echo    http://localhost:5173
echo.
echo 💡 提示：黄色横幅应该消失，表示已连接真实后端
echo.
pause
