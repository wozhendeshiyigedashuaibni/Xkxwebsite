#!/bin/bash

# 后台管理系统快速测试脚本
# 使用方法: chmod +x test-now.sh && ./test-now.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔍 后台管理系统快速测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试 1: 后端健康检查
echo "📡 测试 1/5: 后端服务器..."
if curl -s http://localhost:3001/api/products > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端正常运行${NC}"
else
    echo -e "${RED}❌ 后端未运行 - 请执行: cd server && npm run server${NC}"
    exit 1
fi

echo ""

# 测试 2: 创建管理员账号
echo "👤 测试 2/5: 创建管理员账号..."
REGISTER_RESULT=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' 2>&1)

if echo "$REGISTER_RESULT" | grep -q "successfully\|already"; then
    echo -e "${GREEN}✅ 管理员账号就绪${NC}"
else
    echo -e "${YELLOW}⚠️  账号创建响应: $REGISTER_RESULT${NC}"
fi

echo ""

# 测试 3: 登录测试
echo "🔐 测试 3/5: 登录功能..."
LOGIN_RESULT=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$LOGIN_RESULT" | grep -q "token"; then
    echo -e "${GREEN}✅ 登录功能正常${NC}"
    TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:30}..."
else
    echo -e "${RED}❌ 登录失败${NC}"
    echo "   响应: $LOGIN_RESULT"
fi

echo ""

# 测试 4: 产品 API
echo "📦 测试 4/5: 产品API..."
if [ -n "$TOKEN" ]; then
    PRODUCTS_RESULT=$(curl -s -H "Authorization: Bearer $TOKEN" \
      http://localhost:3001/api/admin/products 2>&1)
    
    if echo "$PRODUCTS_RESULT" | grep -q "\[\]"; then
        echo -e "${GREEN}✅ 产品API正常（空列表）${NC}"
    elif echo "$PRODUCTS_RESULT" | grep -q "\["; then
        PRODUCT_COUNT=$(echo "$PRODUCTS_RESULT" | grep -o "{" | wc -l)
        echo -e "${GREEN}✅ 产品API正常（${PRODUCT_COUNT} 个产品）${NC}"
    else
        echo -e "${YELLOW}⚠️  产品API响应异常${NC}"
    fi
else
    echo -e "${RED}❌ 跳过（无Token）${NC}"
fi

echo ""

# 测试 5: 内容 API
echo "📝 测试 5/5: 内容API..."
if [ -n "$TOKEN" ]; then
    CONTENT_RESULT=$(curl -s -H "Authorization: Bearer $TOKEN" \
      http://localhost:3001/api/admin/content 2>&1)
    
    if echo "$CONTENT_RESULT" | grep -q "\["; then
        CONTENT_COUNT=$(echo "$CONTENT_RESULT" | grep -o "{" | wc -l)
        echo -e "${GREEN}✅ 内容API正常（${CONTENT_COUNT} 个内容）${NC}"
    else
        echo -e "${YELLOW}⚠️  内容API响应异常（可能需要运行 seed-content.js）${NC}"
    fi
else
    echo -e "${RED}❌ 跳过（无Token）${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🎉 后端测试完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 现在请访问以下页面测试前端："
echo ""
echo "   前台首页:   ${YELLOW}http://localhost:5173/${NC}"
echo "   后台登录:   ${YELLOW}http://localhost:5173/admin-login${NC}"
echo "   简化后台:   ${YELLOW}http://localhost:5173/admin/dashboard${NC}"
echo "   产品管理:   ${YELLOW}http://localhost:5173/admin/products${NC}"
echo "   测试工具:   ${YELLOW}http://localhost:5173/admin-test.html${NC}"
echo ""
echo "🔑 登录信息："
echo "   Username: ${GREEN}admin${NC}"
echo "   Password: ${GREEN}admin123${NC}"
echo ""
echo "💡 提示："
echo "   - 如果页面空白，按 F12 查看控制台错误"
echo "   - 如果看到错误，硬刷新: Ctrl+F5"
echo "   - 查看详细文档: /ERROR_FIXED.md"
echo ""
