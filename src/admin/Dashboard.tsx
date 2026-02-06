import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  mainImage: string;
  moq: string;
  price?: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

interface ProductForm {
  title: string;
  category: string;
  subcategory: string;
  mainImage: string;
  description: string;
  moq: string;
  sampleLeadTime: string;
  bulkLeadTime: string;
  material: string;
  process: string;
  capacity: string;
  packaging: string;
  price: string;
  featured: boolean;
  active: boolean;
}

const defaultForm: ProductForm = {
  title: '',
  category: '连衣裙',
  subcategory: '',
  mainImage: '/placeholder.jpg',
  description: '',
  moq: '50件起订',
  sampleLeadTime: '7-10天',
  bulkLeadTime: '4-6周',
  material: '',
  process: '',
  capacity: '',
  packaging: '',
  price: '',
  featured: false,
  active: true,
};

const categories = ['连衣裙', '上衣', '裤装', '裙装', '外套', '卫衣', '运动装', '泳装'];

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('admin_token');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    const token = getToken();
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('获取产品列表失败');

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const url = editingId 
        ? `/api/admin/products?id=${editingId}` 
        : '/api/admin/products';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '保存失败');
      }

      setSuccess(editingId ? '产品更新成功！' : '产品创建成功！');
      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title,
      category: product.category,
      subcategory: product.subcategory || '',
      mainImage: product.mainImage,
      description: '',
      moq: product.moq,
      sampleLeadTime: '7-10天',
      bulkLeadTime: '4-6周',
      material: '',
      process: '',
      capacity: '',
      packaging: '',
      price: product.price || '',
      featured: product.featured,
      active: product.active,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleToggleActive = async (product: Product) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/products?id=${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !product.active }),
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('操作失败');

      setSuccess(product.active ? '产品已下架' : '产品已上架');
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`确定要删除「${product.title}」吗？此操作不可撤销。`)) return;
    
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/products?id=${product.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('删除失败');

      setSuccess('产品已删除');
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">后台管理</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin/password')}
              className="text-gray-600 hover:text-gray-800"
            >
              修改密码
            </button>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-red-900">&times;</button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
            <button onClick={() => setSuccess('')} className="ml-2 text-green-900">&times;</button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">产品管理（共 {products.length} 个）</h2>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm); }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + 添加产品
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-4">{editingId ? '编辑产品' : '新建产品'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">产品名称 *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="请输入产品名称"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">品类 *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">最小起订量</label>
                  <input
                    type="text"
                    value={form.moq}
                    onChange={e => setForm({ ...form, moq: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="如：50件起订"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">价格</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="如：¥128.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">材质</label>
                  <input
                    type="text"
                    value={form.material}
                    onChange={e => setForm({ ...form, material: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="如：100%棉"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">主图URL</label>
                  <input
                    type="text"
                    value={form.mainImage}
                    onChange={e => setForm({ ...form, mainImage: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">产品描述</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    placeholder="请输入产品描述"
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm({ ...form, featured: e.target.checked })}
                    />
                    推荐产品
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm({ ...form, active: e.target.checked })}
                    />
                    上架（前台可见）
                  </label>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? '保存中...' : (editingId ? '更新产品' : '创建产品')}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </form>
          )}

          {products.length === 0 ? (
            <p className="text-gray-500">暂无产品，点击「添加产品」创建第一个产品</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">产品名称</th>
                    <th className="px-4 py-2 text-left">品类</th>
                    <th className="px-4 py-2 text-left">价格</th>
                    <th className="px-4 py-2 text-center">推荐</th>
                    <th className="px-4 py-2 text-center">状态</th>
                    <th className="px-4 py-2 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className={!product.active ? 'bg-gray-50 opacity-60' : ''}>
                      <td className="px-4 py-3">{product.title}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">{product.price || '-'}</td>
                      <td className="px-4 py-3 text-center">{product.featured ? '★' : '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${product.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {product.active ? '已上架' : '已下架'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleToggleActive(product)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          {product.active ? '下架' : '上架'}
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-800"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
