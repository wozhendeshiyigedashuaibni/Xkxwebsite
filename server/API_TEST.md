# 后台管理 API 测试文档

## 🔐 认证

所有 `/api/admin/*` 接口都需要在 Header 中携带 JWT Token：

```
Authorization: Bearer <your_jwt_token>
```

## 📚 API 文档索引

本文档包含产品管理 API。其他管理功能请参考：

- **[内容管理 API](./CONTENT_API_TEST.md)** - 网站文案内容管理
- **询盘线索管理 API** - 查看和管理客户询盘（待文档）

---

## 📦 产品管理 API

### 1. 获取所有产品

**GET** `/api/admin/products`

**查询参数**：
- `category` (可选): 按分类筛选
- `search` (可选): 搜索关键词（匹配标题和描述）

**示例**：

```bash
# 获取所有产品
curl -X GET http://localhost:3001/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# 按分类筛选
curl -X GET "http://localhost:3001/api/admin/products?category=Dresses" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 搜索
curl -X GET "http://localhost:3001/api/admin/products?search=summer" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**响应**：
```json
[
  {
    "id": 1,
    "slug": "summer-dress-001",
    "title": "Summer Floral Dress",
    "category": "Dresses",
    "subcategory": "Casual Dresses",
    "mainImage": "https://example.com/image.jpg",
    "images": ["url1", "url2"],
    "description": "Beautiful summer dress...",
    "moq": "100 pieces",
    "sampleLeadTime": "7-10 days",
    "bulkLeadTime": "30-45 days",
    "material": "100% Cotton",
    "process": "Digital Print",
    "capacity": "50,000 pcs/month",
    "packaging": "Individual polybag",
    "customOptions": ["Color customization", "Size range"],
    "tags": ["summer", "casual", "floral"],
    "price": "$15.00",
    "featured": true,
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. 获取单个产品

**GET** `/api/admin/products/:id`

**示例**：

```bash
curl -X GET http://localhost:3001/api/admin/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**响应**：同上单个产品对象

---

### 3. 创建产品

**POST** `/api/admin/products`

**必填字段**：
- `slug` - 产品唯一标识（URL friendly）
- `title` - 产品标题
- `category` - 分类（Dresses/Tops/Bottoms/Outerwear/Activewear/Accessories）
- `mainImage` - 主图 URL
- `description` - 产品描述
- `moq` - 最小起订量
- `sampleLeadTime` - 样品交期
- `bulkLeadTime` - 大货交期
- `material` - 面料材质
- `process` - 工艺
- `capacity` - 产能
- `packaging` - 包装方式

**可选字段**：
- `subcategory` - 子分类
- `images` - 图片数组
- `customOptions` - 定制选项数组
- `tags` - 标签数组
- `price` - 价格
- `featured` - 是否推荐（默认 false）
- `active` - 是否激活（默认 true）

**示例**：

```bash
curl -X POST http://localhost:3001/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-dress-001",
    "title": "Test Summer Dress",
    "category": "Dresses",
    "subcategory": "Casual Dresses",
    "mainImage": "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446"
    ],
    "description": "A beautiful summer dress perfect for casual occasions",
    "moq": "100 pieces",
    "sampleLeadTime": "7-10 days",
    "bulkLeadTime": "30-45 days",
    "material": "100% Cotton",
    "process": "Digital Print",
    "capacity": "50,000 pcs/month",
    "packaging": "Individual polybag",
    "customOptions": ["Color customization", "Size range: XS-3XL"],
    "tags": ["summer", "casual", "cotton"],
    "price": "$15.00",
    "featured": true,
    "active": true
  }'
```

**成功响应（201 Created）**：
```json
{
  "id": 2,
  "slug": "test-dress-001",
  "title": "Test Summer Dress",
  ...
}
```

**错误响应（400 Bad Request）**：
```json
{
  "error": "Missing required fields",
  "fields": ["slug", "title", "category"]
}
```

或：
```json
{
  "error": "Product with this slug already exists"
}
```

---

### 4. 更新产品

**PUT** `/api/admin/products/:id`

**说明**：可以只更新部分字段，未传的字段保持不变

**示例**：

```bash
curl -X PUT http://localhost:3001/api/admin/products/2 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Summer Dress",
    "price": "$18.00",
    "featured": false
  }'
```

**成功响应（200 OK）**：
```json
{
  "id": 2,
  "slug": "test-dress-001",
  "title": "Updated Summer Dress",
  "price": "$18.00",
  "featured": false,
  ...
}
```

**错误响应（404 Not Found）**：
```json
{
  "error": "Product not found"
}
```

---

### 5. 删除产品

**DELETE** `/api/admin/products/:id`

**示例**：

```bash
curl -X DELETE http://localhost:3001/api/admin/products/2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应（200 OK）**：
```json
{
  "message": "Product deleted successfully",
  "id": 2
}
```

**错误响应（404 Not Found）**：
```json
{
  "error": "Product not found"
}
```

---

## 📋 产品分类

支持的 6 个服装分类：

1. **Dresses** - 连衣裙
2. **Tops** - 上衣
3. **Bottoms** - 下装
4. **Outerwear** - 外套
5. **Activewear** - 运动服
6. **Accessories** - 配饰

---

## ⚠️ 注意事项

### 数组字段处理

以下字段在数据库中存储为 JSON 字符串，API 会自动转换：

- `images` - 图片 URL 数组
- `customOptions` - 定制选项数组
- `tags` - 标签数组

**前端发送**：`["item1", "item2"]`  
**数据库存储**：`"[\"item1\",\"item2\"]"`  
**API 返回**：`["item1", "item2"]`

### 布尔字段处理

`featured` 和 `active` 字段支持以下格式：

- Boolean: `true` / `false`
- String: `"true"` / `"false"`

API 会自动转换为布尔值。

### Slug 唯一性

`slug` 字段必须全局唯一，建议格式：
- `category-name-number`
- 例如：`dresses-summer-001`、`tops-casual-002`

### 错误码

- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权（缺少 Token）
- `403` - Token 无效
- `404` - 资源不存在
- `500` - 服务器错误

---

## 🧪 完整测试流程

### 步骤 1：创建管理员账号

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 步骤 2：登录获取 Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

保存返回的 `token`。

### 步骤 3：创建产品

使用上面"创建产品"的示例命令，替换 `YOUR_TOKEN`。

### 步骤 4：获取产品列表

```bash
curl -X GET http://localhost:3001/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 步骤 5：更新产品

```bash
curl -X PUT http://localhost:3001/api/admin/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### 步骤 6：删除产品

```bash
curl -X DELETE http://localhost:3001/api/admin/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 常见问题

### Q: 如何测试 API？

A: 推荐使用以下工具：
- **cURL** - 命令行工具
- **Postman** - 图形化 API 测试工具
- **Thunder Client** - VS Code 插件

### Q: Token 过期怎么办？

A: Token 有效期为 7 天，过期后需要重新登录获取新 Token。

### Q: 如何上传图片？

A: 当前版本图片字段使用 URL 字符串，可以使用：
- Unsplash 图片链接
- 其他图床服务
- 后续版本会支持图片上传功能

---

**测试环境**：`http://localhost:3001`  
**生产环境**：待部署后更新  
**更新日期**：2026-02-04