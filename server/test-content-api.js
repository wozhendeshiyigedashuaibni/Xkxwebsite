#!/usr/bin/env node

/**
 * 内容管理 API 测试脚本
 * 运行: node server/test-content-api.js
 */

const API_BASE = 'http://localhost:3001/api';

let authToken = null;

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, prefix, message) {
  console.log(`${colors[color]}${prefix}${colors.reset} ${message}`);
}

function success(message) { log('green', '✓', message); }
function error(message) { log('red', '✗', message); }
function info(message) { log('blue', 'ℹ', message); }
function warn(message) { log('yellow', '⚠', message); }

async function request(method, endpoint, data = null, useAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (useAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const text = await response.text();
    
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(json.error || `HTTP ${response.status}`);
    }

    return json;
  } catch (err) {
    throw new Error(`Request failed: ${err.message}`);
  }
}

async function testLogin() {
  info('测试登录...');
  
  try {
    const data = await request('POST', '/auth/login', {
      username: 'admin',
      password: 'admin123'
    });

    if (data.token) {
      authToken = data.token;
      success(`登录成功: ${data.username}`);
      return true;
    } else {
      error('登录失败: 未返回 token');
      return false;
    }
  } catch (err) {
    error(`登录失败: ${err.message}`);
    return false;
  }
}

async function testGetAllContent() {
  info('测试获取所有内容...');
  
  try {
    const contents = await request('GET', '/admin/content', null, true);
    success(`获取内容列表成功: 共 ${contents.length} 条内容`);
    
    if (contents.length > 0) {
      console.log(`  示例: ${contents[0].key}`);
    } else {
      warn('  内容为空，请先运行: node server/seed-content.js');
    }
    
    return contents;
  } catch (err) {
    error(`获取内容列表失败: ${err.message}`);
    return [];
  }
}

async function testGetContentByKey(key) {
  info(`测试获取单个内容: ${key}...`);
  
  try {
    const content = await request('GET', `/admin/content/${key}`, null, true);
    success(`获取内容成功: ${content.key}`);
    console.log(`  Value:`, JSON.stringify(content.value, null, 2).substring(0, 100) + '...');
    return content;
  } catch (err) {
    error(`获取内容失败: ${err.message}`);
    return null;
  }
}

async function testCreateContent() {
  info('测试创建新内容...');
  
  const key = `test.content.${Date.now()}`;
  const value = {
    text: 'This is a test content',
    description: 'Created by automated test',
    createdAt: new Date().toISOString()
  };

  try {
    const content = await request('PUT', `/admin/content/${key}`, { value }, true);
    success(`创建内容成功: ${content.key}`);
    return content;
  } catch (err) {
    error(`创建内容失败: ${err.message}`);
    return null;
  }
}

async function testUpdateContent(key) {
  info(`测试更新内容: ${key}...`);
  
  const value = {
    text: `Updated at ${new Date().toISOString()}`,
    description: 'Updated by automated test',
    updateCount: Math.floor(Math.random() * 100)
  };

  try {
    const content = await request('PUT', `/admin/content/${key}`, { value }, true);
    success(`更新内容成功: ${content.key}`);
    return content;
  } catch (err) {
    error(`更新内容失败: ${err.message}`);
    return null;
  }
}

async function testUpdateComplexContent() {
  info('测试更新复杂内容结构...');
  
  const key = 'test.complex.content';
  const value = {
    title: 'Complex Content Test',
    items: [
      { label: 'Item 1', value: 'Value 1' },
      { label: 'Item 2', value: 'Value 2' },
      { label: 'Item 3', value: 'Value 3' }
    ],
    metadata: {
      author: 'Test Script',
      version: '1.0',
      tags: ['test', 'complex', 'api']
    },
    description: 'Testing complex nested structure'
  };

  try {
    const content = await request('PUT', `/admin/content/${key}`, { value }, true);
    success('更新复杂内容成功');
    console.log(`  Items count: ${content.value.items.length}`);
    return content;
  } catch (err) {
    error(`更新复杂内容失败: ${err.message}`);
    return null;
  }
}

async function testInvalidKey() {
  info('测试无效的 key 格式...');
  
  const invalidKey = 'test/invalid@key!';
  const value = { text: 'This should fail' };

  try {
    await request('PUT', `/admin/content/${invalidKey}`, { value }, true);
    error('应该拒绝无效的 key，但请求成功了');
    return false;
  } catch (err) {
    if (err.message.includes('Invalid key format')) {
      success('正确拒绝了无效的 key 格式');
      return true;
    } else {
      error(`意外的错误: ${err.message}`);
      return false;
    }
  }
}

async function testMissingValue() {
  info('测试缺少 value 参数...');
  
  const key = 'test.missing.value';

  try {
    await request('PUT', `/admin/content/${key}`, {}, true);
    error('应该拒绝缺少 value 的请求，但请求成功了');
    return false;
  } catch (err) {
    if (err.message.includes('Value is required')) {
      success('正确拒绝了缺少 value 的请求');
      return true;
    } else {
      error(`意外的错误: ${err.message}`);
      return false;
    }
  }
}

async function testDeleteContent(key) {
  info(`测试删除内容: ${key}...`);
  
  try {
    const result = await request('DELETE', `/admin/content/${key}`, null, true);
    success(`删除内容成功: ${result.message}`);
    return true;
  } catch (err) {
    error(`删除内容失败: ${err.message}`);
    return false;
  }
}

async function testDeleteNonexistent() {
  info('测试删除不存在的内容...');
  
  const key = 'nonexistent.content.key';

  try {
    await request('DELETE', `/admin/content/${key}`, null, true);
    error('应该返回 404，但请求成功了');
    return false;
  } catch (err) {
    if (err.message.includes('Content not found')) {
      success('正确返回了 404 错误');
      return true;
    } else {
      error(`意外的错误: ${err.message}`);
      return false;
    }
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 内容管理 API 测试');
  console.log('='.repeat(60) + '\n');

  // 1. 登录
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    error('测试中止：无法登录');
    process.exit(1);
  }
  console.log('');

  // 2. 获取所有内容
  const allContent = await testGetAllContent();
  console.log('');

  // 3. 获取单个内容（如果有数据）
  if (allContent.length > 0) {
    await testGetContentByKey(allContent[0].key);
    console.log('');
  }

  // 4. 创建新内容
  const newContent = await testCreateContent();
  console.log('');

  // 5. 更新内容
  if (newContent) {
    await testUpdateContent(newContent.key);
    console.log('');
  }

  // 6. 更新复杂内容结构
  await testUpdateComplexContent();
  console.log('');

  // 7. 测试无效的 key
  await testInvalidKey();
  console.log('');

  // 8. 测试缺少 value
  await testMissingValue();
  console.log('');

  // 9. 测试删除不存在的内容
  await testDeleteNonexistent();
  console.log('');

  // 10. 删除测试创建的内容
  if (newContent) {
    await testDeleteContent(newContent.key);
    console.log('');
  }

  // 清理测试数据
  info('清理测试数据...');
  try {
    await testDeleteContent('test.complex.content');
    success('测试数据清理完成');
  } catch (err) {
    warn('清理测试数据时发生错误（可能已经删除）');
  }

  console.log('');
  console.log('='.repeat(60));
  success('所有测试完成！');
  console.log('='.repeat(60) + '\n');

  // 提示
  if (allContent.length === 0) {
    warn('💡 提示：运行以下命令初始化网站内容：');
    console.log('   node server/seed-content.js\n');
  }
}

// 运行测试
runTests().catch(err => {
  console.error('\n❌ 测试执行失败:', err);
  process.exit(1);
});
