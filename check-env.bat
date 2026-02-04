@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    Xikaixi Platform - Environment Check
echo ========================================
echo.

REM Check .env.local file
echo [1/5] Checking .env.local file...
if exist .env.local (
    echo   [OK] .env.local exists
    findstr /C:"VITE_USE_MOCK" .env.local > nul
    if !errorlevel! equ 0 (
        for /f "tokens=2 delims==" %%a in ('findstr /C:"VITE_USE_MOCK" .env.local') do set MOCK_VALUE=%%a
        echo   [OK] VITE_USE_MOCK = !MOCK_VALUE!
        if "!MOCK_VALUE!"=="true" (
            set MODE=MOCK DATA
        ) else (
            set MODE=REAL BACKEND
        )
    ) else (
        echo   [WARN] VITE_USE_MOCK not set (will default to true)
        set MODE=MOCK DATA (default)
    )
) else (
    echo   [WARN] .env.local not found (will use defaults)
    set MODE=MOCK DATA (default)
)
echo.

REM Check if backend is running
echo [2/5] Checking backend server...
curl -s http://localhost:3001/api/health > nul 2>&1
if !errorlevel! equ 0 (
    echo   [OK] Backend server is running on port 3001
    set BACKEND_RUNNING=true
) else (
    echo   [X] Backend server is not running
    set BACKEND_RUNNING=false
)
echo.

REM Check server dependencies
echo [3/5] Checking backend dependencies...
if exist server\node_modules (
    echo   [OK] Backend dependencies installed
) else (
    echo   [X] Backend dependencies not installed
    echo       Run: cd server ^&^& npm install
)
echo.

REM Check database
echo [4/5] Checking database...
if exist prisma\dev.db (
    echo   [OK] Database file exists
) else (
    echo   [WARN] Database not initialized
    echo       Run: npx prisma migrate dev
)
echo.

REM Check frontend dependencies
echo [5/5] Checking frontend dependencies...
if exist node_modules (
    echo   [OK] Frontend dependencies installed
) else (
    echo   [X] Frontend dependencies not installed
    echo       Run: npm install
)
echo.

echo ========================================
echo               Summary
echo ========================================
echo.

echo Current Mode: !MODE!
echo.

if "!MODE!"=="MOCK DATA" (
    echo [OK] Ready to run!
    echo   Just start the dev server: npm run dev
    echo   The app will use mock data (no backend needed)
) else if "!MODE!"=="MOCK DATA (default)" (
    echo [OK] Ready to run!
    echo   Just start the dev server: npm run dev
    echo   The app will use mock data (no backend needed)
) else (
    echo Real Backend Mode
    if "!BACKEND_RUNNING!"=="true" (
        echo   [OK] Backend is running - you're all set!
        echo   Start frontend: npm run dev
    ) else (
        echo   [X] Backend is NOT running
        echo   Start backend first: npm run server
        echo   Then start frontend: npm run dev
    )
)

echo.
echo ========================================
echo.

echo Quick Commands:
echo   Switch to mock mode:    echo VITE_USE_MOCK=true ^> .env.local
echo   Switch to real backend: echo VITE_USE_MOCK=false ^> .env.local
echo   Install backend deps:   cd server ^&^& npm install ^&^& cd ..
echo   Setup database:         npx prisma migrate dev
echo   Start backend:          npm run server
echo   Start frontend:         npm run dev
echo.
echo Documentation:
echo   Quick Start:  QUICK_START.md
echo   Full README:  README.md
echo.

pause
