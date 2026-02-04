#!/usr/bin/env node

/**
 * 后台产品管理 API 快速测试脚本
 * 运行: node server/test-admin-api.js
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
    warn('请先创建管理员账号：');
    console.log(`  curl -X POST ${API_BASE}/auth/register \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d '{"username":"admin","password":"admin123"}'`);
    return false;
  }
}

async function testGetProducts() {
  info('测试获取产品列表...');
  
  try {
    const products = await request('GET', '/admin/products', null, true);
    success(`获取产品列表成功: 共 ${products.length} 个产品`);
    
    if (products.length > 0) {
      console.log(`  示例产品: ${products[0].title} (ID: ${products[0].id})`);
    }
    
    return products;
  } catch (err) {
    error(`获取产品列表失败: ${err.message}`);
    return [];
  }
}

async function testCreateProduct() {
  info('测试创建产品...');
  
  const newProduct = {
    slug: `test-product-${Date.now()}`,
    title: 'API 测试产品',
    category: 'Dresses',
    subcategory: 'Casual Dresses',
    mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8'
    ],
    description: '这是一个通过 API 创建的测试产品',
    moq: '100 pieces',
    sampleLeadTime: '7-10 days',
    bulkLeadTime: '30-45 days',
    material: '100% Cotton',
    process: 'Digital Print',
    capacity: '50,000 pcs/month',
    packaging: 'Individual polybag',
    customOptions: ['颜色定制', '尺码范围：XS-3XL'],
    tags: ['test', 'api'],
    price: '$15.00',
    featured: false,
    active: true
  };

  try {
    const product = await request('POST', '/admin/products', newProduct, true);
    success(`创建产品成功: ${product.title} (ID: ${product.id})`);
    return product;
  } catch (err) {
    error(`创建产品失败: ${err.message}`);
    return null;
  }
}

async function testUpdateProduct(productId) {
  info(`测试更新产品 (ID: ${productId})...`);
  
  const updates = {
    title: `更新的产品标题 - ${Date.now()}`,
    price: '$20.00',
    featured: true
  };

  try {
    const product = await request('PUT', `/admin/products/${productId}`, updates, true);
    success(`更新产品成功: ${product.title}`);
    return product;
  } catch (err) {
    error(`更新产品失败: ${err.message}`);
    return null;
  }
}

async function testDeleteProduct(productId) {
  info(`测试删除产品 (ID: ${productId})...`);
  
  try {
    const result = await request('DELETE', `/admin/products/${productId}`, null, true);
    success(`删除产品成功: ${result.message}`);
    return true;
  } catch (err) {
    error(`删除产品失败: ${err.message}`);
    return false;
  }
}

async function testSearchProducts() {
  info('测试产品搜索...');
  
  try {
    const products = await request('GET', '/admin/products?search=test', null, true);
    success(`搜索产品成功: 找到 ${products.length} 个匹配产品`);
    return products;
  } catch (err) {
    error(`搜索产品失败: ${err.message}`);
    return [];
  }
}

async function testFilterByCategory() {
  info('测试按分类筛选...');
  
  try {
    const products = await request('GET', '/admin/products?category=Dresses', null, true);
    success(`按分类筛选成功: 找到 ${products.length} 个产品`);
    return products;
  } catch (err) {
    error(`按分类筛选失败: ${err.message}`);
    return [];
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 后台产品管理 API 测试');
  console.log('='.repeat(60) + '\n');

  // 1. 登录
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    error('测试中止：无法登录');
    process.exit(1);
  }

  console.log('');

  // 2. 获取产品列表
  const existingProducts = await testGetProducts();
  console.log('');

  // 3. 创建产品
  const newProduct = await testCreateProduct();
  if (!newProduct) {
    warn('跳过后续测试：无法创建产品');
    return;
  }
  console.log('');

  // 4. 更新产品
  await testUpdateProduct(newProduct.id);
  console.log('');

  // 5. 搜索产品
  await testSearchProducts();
  console.log('');

  // 6. 按分类筛选
  await testFilterByCategory();
  console.log('');

  // 7. 删除产品
  await testDeleteProduct(newProduct.id);
  console.log('');

  console.log('='.repeat(60));
  success('所有测试完成！');
  console.log('='.repeat(60) + '\n');
}

// 运行测试
runTests().catch(err => {
  console.error('\n❌ 测试执行失败:', err);
  process.exit(1);
});
