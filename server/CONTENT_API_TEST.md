# 内容管理 API 测试文档

## 概述

内容管理 API 用于修改网站各个页面的文案内容，包括：
- 首页文案（Hero、服务、统计数据等）
- 关于我们页面
- 工厂介绍页面
- OEM/ODM 服务页面
- 案例展示页面
- 联系我们页面
- 页脚信息

**注意**：此 API 不涉及多语言逻辑，仅管理单一语言版本的内容。

---

## 🔐 认证

所有内容管理接口都需要 JWT Token：

```bash
Authorization: Bearer <your_jwt_token>
```

---

## 📋 内容管理 API

### 1. 获取所有内容

**GET** `/api/admin/content`

获取网站所有内容条目列表。

**示例**：

```bash
curl -X GET http://localhost:3001/api/admin/content \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**响应（200 OK）**：

```json
[
  {
    "id": 1,
    "key": "home.hero.title",
    "value": {
      "text": "Professional B2B Women's Fashion OEM/ODM Manufacturer",
      "description": "首页 Hero 区标题"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "key": "home.hero.subtitle",
    "value": {
      "text": "Your trusted partner...",
      "description": "首页 Hero 区副标题"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 2. 获取单个内容

**GET** `/api/admin/content/:key`

根据 key 获取特定内容。

**示例**：

```bash
curl -X GET http://localhost:3001/api/admin/content/home.hero.title \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应（200 OK）**：

```json
{
  "id": 1,
  "key": "home.hero.title",
  "value": {
    "text": "Professional B2B Women's Fashion OEM/ODM Manufacturer",
    "description": "首页 Hero 区标题"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**错误响应（404 Not Found）**：

```json
{
  "error": "Content not found"
}
```

---

### 3. 创建或更新内容

**PUT** `/api/admin/content/:key`

使用 `upsert` 语义：
- 如果 key 存在，则更新
- 如果 key 不存在，则创建

**请求体**：

```json
{
  "value": {
    "text": "Updated title text",
    "description": "Optional description"
  }
}
```

**示例 1：更新文本内容**

```bash
curl -X PUT http://localhost:3001/api/admin/content/home.hero.title \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": {
      "text": "New Hero Title",
      "description": "Updated hero title"
    }
  }'
```

**示例 2：更新数组内容**

```bash
curl -X PUT http://localhost:3001/api/admin/content/home.stats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": {
      "items": [
        { "label": "Years Experience", "value": "20+" },
        { "label": "Production Capacity", "value": "1M pcs/month" }
      ],
      "description": "Updated stats"
    }
  }'
```

**示例 3：创建新内容**

```bash
curl -X PUT http://localhost:3001/api/admin/content/custom.new.section \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": {
      "title": "New Section",
      "content": "This is custom content"
    }
  }'
```

**成功响应（200 OK）**：

```json
{
  "id": 1,
  "key": "home.hero.title",
  "value": {
    "text": "New Hero Title",
    "description": "Updated hero title"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-02-04T15:30:00.000Z"
}
```

**错误响应（400 Bad Request）**：

```json
{
  "error": "Value is required"
}
```

或：

```json
{
  "error": "Invalid key format. Use only letters, numbers, dash, underscore, and dot."
}
```

---

### 4. 删除内容

**DELETE** `/api/admin/content/:key`

删除指定 key 的内容。

**示例**：

```bash
curl -X DELETE http://localhost:3001/api/admin/content/custom.old.section \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应（200 OK）**：

```json
{
  "message": "Content deleted successfully",
  "key": "custom.old.section"
}
```

**错误响应（404 Not Found）**：

```json
{
  "error": "Content not found"
}
```

---

## 🔑 Content Key 命名规范

### 格式要求

- 只能包含：字母、数字、连字符（-）、下划线（_）、点（.）
- 推荐使用点分隔的层级结构
- 小写字母为主

### 推荐的命名模式

```
<页面>.<区域>.<字段>
```

**示例**：

| Key | 说明 |
|-----|------|
| `home.hero.title` | 首页 Hero 区标题 |
| `home.hero.subtitle` | 首页 Hero 区副标题 |
| `about.company.description` | 关于我们 - 公司描述 |
| `factory.capabilities` | 工厂页 - 生产能力 |
| `contact.info` | 联系页 - 联系信息 |
| `footer.copyright` | 页脚 - 版权信息 |

### 页面前缀对照表

| 前缀 | 页面 |
|------|------|
| `home` | 首页 |
| `about` | 关于我们 |
| `factory` | 工厂介绍 |
| `oem-odm` | OEM/ODM 服务 |
| `cases` | 案例展示 |
| `contact` | 联系我们 |
| `footer` | 页脚 |
| `header` | 页头 |

---

## 📊 Content Value 数据结构

### 1. 简单文本

```json
{
  "value": {
    "text": "Your text content here",
    "description": "Optional description for admin reference"
  }
}
```

### 2. 数组列表

```json
{
  "value": {
    "items": [
      { "label": "Item 1", "value": "Value 1" },
      { "label": "Item 2", "value": "Value 2" }
    ],
    "description": "List of items"
  }
}
```

### 3. 复杂对象

```json
{
  "value": {
    "title": "Section Title",
    "subtitle": "Section Subtitle",
    "items": [
      {
        "title": "Item Title",
        "description": "Item Description",
        "icon": "icon-name"
      }
    ],
    "description": "Complex section"
  }
}
```

### 4. 流程步骤

```json
{
  "value": {
    "steps": [
      {
        "step": 1,
        "title": "Step One",
        "description": "Description of step one"
      },
      {
        "step": 2,
        "title": "Step Two",
        "description": "Description of step two"
      }
    ],
    "description": "Process steps"
  }
}
```

---

## 🌱 初始化内容数据

### 运行初始化脚本

在第一次使用前，运行种子脚本来初始化默认内容：

```bash
node server/seed-content.js
```

这将创建以下内容分类：
- ✅ 首页内容（Hero、服务、统计）
- ✅ 关于我们页面
- ✅ 工厂介绍页面
- ✅ OEM/ODM 服务页面
- ✅ 案例展示页面
- ✅ 联系我们页面
- ✅ 页脚信息

### 查看初始化的内容

```bash
curl -X GET http://localhost:3001/api/admin/content \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 完整测试流程

### 步骤 1：登录获取 Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

保存返回的 `token`。

---

### 步骤 2：初始化内容（首次运行）

```bash
node server/seed-content.js
```

---

### 步骤 3：获取所有内容

```bash
curl -X GET http://localhost:3001/api/admin/content \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 步骤 4：修改首页标题

```bash
curl -X PUT http://localhost:3001/api/admin/content/home.hero.title \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": {
      "text": "Welcome to Professional Fashion Manufacturing",
      "description": "Updated hero title"
    }
  }'
```

---

### 步骤 5：添加自定义内容

```bash
curl -X PUT http://localhost:3001/api/admin/content/home.custom.banner \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": {
      "text": "Special promotion: 10% off first order!",
      "backgroundColor": "#ff0000",
      "textColor": "#ffffff",
      "enabled": true
    }
  }'
```

---

### 步骤 6：获取特定内容

```bash
curl -X GET http://localhost:3001/api/admin/content/home.hero.title \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 步骤 7：删除内容（可选）

```bash
curl -X DELETE http://localhost:3001/api/admin/content/home.custom.banner \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💡 使用建议

### 1. 内容组织

- 按页面分组管理内容
- 使用清晰的 key 命名
- 在 `description` 字段添加说明

### 2. 版本控制

- 修改前先备份当前内容
- 保存历史版本（可通过 `updatedAt` 字段追踪）

### 3. 数据结构设计

- 保持 value 结构的一致性
- 使用嵌套对象来组织复杂内容
- 添加 `description` 字段方便团队协作

### 4. 前端集成

前端可以创建一个 Context 或 Hook 来管理内容：

```typescript
// 示例：React Hook
function useContent(key: string) {
  const [content, setContent] = useState(null);
  
  useEffect(() => {
    api.getContentByKey(key).then(setContent);
  }, [key]);
  
  return content?.value;
}

// 使用
const heroTitle = useContent('home.hero.title');
```

---

## ⚠️ 注意事项

### JSON 存储

- `value` 字段在数据库中存储为 JSON 字符串
- API 自动进行 JSON 序列化/反序列化
- 前端接收到的是 JavaScript 对象

### Key 唯一性

- 每个 key 必须全局唯一
- 使用 PUT 更新时会自动创建不存在的 key
- 删除 key 后可以重新创建

### 错误码

| 状态码 | 说明 |
|--------|------|
| `200` | 成功 |
| `400` | 请求参数错误（缺少 value 或 key 格式不正确） |
| `401` | 未授权（缺少 Token） |
| `403` | Token 无效 |
| `404` | 内容不存在（仅 GET 和 DELETE） |
| `500` | 服务器错误 |

---

## 📖 常见场景

### 场景 1：批量更新首页内容

```bash
# 1. 更新 Hero 标题
curl -X PUT http://localhost:3001/api/admin/content/home.hero.title \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value": {"text": "New Title"}}'

# 2. 更新 Hero 副标题
curl -X PUT http://localhost:3001/api/admin/content/home.hero.subtitle \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value": {"text": "New Subtitle"}}'
```

### 场景 2：更新联系信息

```bash
curl -X PUT http://localhost:3001/api/admin/content/contact.info \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": {
      "email": "contact@example.com",
      "phone": "+86 138 1234 5678",
      "whatsapp": "+86 138 1234 5678",
      "address": "New Address",
      "workingHours": "Mon-Fri: 9:00-18:00"
    }
  }'
```

### 场景 3：添加临时公告

```bash
curl -X PUT http://localhost:3001/api/admin/content/home.announcement \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": {
      "text": "🎉 Special offer: Contact us for a quote!",
      "type": "info",
      "enabled": true,
      "expiresAt": "2024-12-31"
    }
  }'
```

---

**测试环境**：`http://localhost:3001`  
**更新日期**：2026-02-04  
**API 版本**：v1.0
