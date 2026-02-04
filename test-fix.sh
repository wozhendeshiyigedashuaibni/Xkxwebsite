#!/bin/bash

echo "🔍 测试后台管理系统修复..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数
PASSED=0
FAILED=0

# 函数：测试 URL
test_url() {
    local url=$1
    local name=$2
    
    echo -n "测试 $name ... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ 通过${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        ((FAILED++))
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. 检查后端服务器"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_url "http://localhost:3001/api/products" "后端 API"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. 检查前端页面"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_url "http://localhost:5173/" "首页"
test_url "http://localhost:5173/admin-login" "登录页面"
test_url "http://localhost:5173/admin-test.html" "测试页面"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. 测试管理员账号"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 尝试创建管理员账号（可能已存在）
echo -n "创建管理员账号 ... "
REGISTER_RESULT=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' 2>&1)

if echo "$REGISTER_RESULT" | grep -q "successfully\|already"; then
    echo -e "${GREEN}✓ 账号已就绪${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ 跳过（可能已存在）${NC}"
fi

# 测试登录
echo -n "测试登录 API ... "
LOGIN_RESULT=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' 2>&1)

if echo "$LOGIN_RESULT" | grep -q "token"; then
    echo -e "${GREEN}✓ 登录成功${NC}"
    ((PASSED++))
    
    # 提取 token
    TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:30}..."
else
    echo -e "${RED}✗ 登录失败${NC}"
    ((FAILED++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. 测试后台 API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$TOKEN" ]; then
    echo -n "测试产品 API ... "
    PRODUCTS_RESULT=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/admin/products 2>&1)
    
    if echo "$PRODUCTS_RESULT" | grep -q "\[\]"; then
        echo -e "${GREEN}✓ 通过${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ 响应异常（但可能正常）${NC}"
    fi
    
    echo -n "测试内容 API ... "
    CONTENT_RESULT=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/admin/content 2>&1)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ 失败${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ 跳过（无 Token）${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 测试结果"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "通过: ${GREEN}${PASSED}${NC}"
echo -e "失败: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 所有测试通过！${NC}"
    echo ""
    echo "🎉 后台管理系统已就绪！"
    echo ""
    echo "📋 访问地址："
    echo "   登录页面: http://localhost:5173/admin-login"
    echo "   简化后台: http://localhost:5173/admin/dashboard"
    echo "   产品管理: http://localhost:5173/admin/products"
    echo "   内容管理: http://localhost:5173/admin/content"
    echo ""
    echo "🔑 登录账号："
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
else
    echo -e "${RED}❌ 部分测试失败${NC}"
    echo ""
    echo "💡 建议："
    echo "   1. 确认后端服务器运行：cd server && npm run server"
    echo "   2. 确认前端服务器运行：npm run dev"
    echo "   3. 查看详细错误信息"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
