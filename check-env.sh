#!/bin/bash

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Xikaixi Platform - Environment Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Check .env.local file
echo -e "${YELLOW}[1/5]${NC} Checking .env.local file..."
if [ -f ".env.local" ]; then
    echo -e "  ${GREEN}✓${NC} .env.local exists"
    if grep -q "VITE_USE_MOCK" .env.local; then
        MOCK_VALUE=$(grep "VITE_USE_MOCK" .env.local | cut -d '=' -f2)
        echo -e "  ${GREEN}✓${NC} VITE_USE_MOCK = ${MOCK_VALUE}"
        if [ "$MOCK_VALUE" = "true" ]; then
            MODE="MOCK DATA"
        else
            MODE="REAL BACKEND"
        fi
    else
        echo -e "  ${YELLOW}⚠${NC} VITE_USE_MOCK not set (will default to true)"
        MODE="MOCK DATA (default)"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} .env.local not found (will use defaults)"
    MODE="MOCK DATA (default)"
fi
echo ""

# Check if backend is running
echo -e "${YELLOW}[2/5]${NC} Checking backend server..."
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Backend server is running on port 3001"
    BACKEND_RUNNING=true
else
    echo -e "  ${RED}✗${NC} Backend server is not running"
    BACKEND_RUNNING=false
fi
echo ""

# Check server dependencies
echo -e "${YELLOW}[3/5]${NC} Checking backend dependencies..."
if [ -d "server/node_modules" ]; then
    echo -e "  ${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "  ${RED}✗${NC} Backend dependencies not installed"
    echo -e "      Run: ${BLUE}cd server && npm install${NC}"
fi
echo ""

# Check database
echo -e "${YELLOW}[4/5]${NC} Checking database..."
if [ -f "prisma/dev.db" ]; then
    echo -e "  ${GREEN}✓${NC} Database file exists"
else
    echo -e "  ${YELLOW}⚠${NC} Database not initialized"
    echo -e "      Run: ${BLUE}npx prisma migrate dev${NC}"
fi
echo ""

# Check frontend dependencies
echo -e "${YELLOW}[5/5]${NC} Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo -e "  ${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "  ${RED}✗${NC} Frontend dependencies not installed"
    echo -e "      Run: ${BLUE}npm install${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}              Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "Current Mode: ${GREEN}${MODE}${NC}"

if [ "$MODE" = "MOCK DATA" ] || [ "$MODE" = "MOCK DATA (default)" ]; then
    echo -e "\n${GREEN}✓ Ready to run!${NC}"
    echo -e "  Just start the dev server: ${BLUE}npm run dev${NC}"
    echo -e "  The app will use mock data (no backend needed)"
    
    if [ "$BACKEND_RUNNING" = true ]; then
        echo -e "\n${YELLOW}Note:${NC} Backend is running but won't be used in mock mode"
    fi
else
    echo -e "\n${YELLOW}Real Backend Mode${NC}"
    if [ "$BACKEND_RUNNING" = true ]; then
        echo -e "  ${GREEN}✓${NC} Backend is running - you're all set!"
        echo -e "  Start frontend: ${BLUE}npm run dev${NC}"
    else
        echo -e "  ${RED}✗${NC} Backend is NOT running"
        echo -e "  Start backend first: ${BLUE}npm run server${NC}"
        echo -e "  Then start frontend: ${BLUE}npm run dev${NC}"
    fi
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Additional help
echo -e "${YELLOW}Quick Commands:${NC}"
echo -e "  Switch to mock mode:    ${BLUE}echo 'VITE_USE_MOCK=true' > .env.local${NC}"
echo -e "  Switch to real backend: ${BLUE}echo 'VITE_USE_MOCK=false' > .env.local${NC}"
echo -e "  Install backend deps:   ${BLUE}cd server && npm install && cd ..${NC}"
echo -e "  Setup database:         ${BLUE}npx prisma migrate dev${NC}"
echo -e "  Start backend:          ${BLUE}npm run server${NC}"
echo -e "  Start frontend:         ${BLUE}npm run dev${NC}"
echo -e "\n${YELLOW}Documentation:${NC}"
echo -e "  Quick Start:  ${BLUE}./QUICK_START.md${NC}"
echo -e "  Full README:  ${BLUE}./README.md${NC}"
echo ""
