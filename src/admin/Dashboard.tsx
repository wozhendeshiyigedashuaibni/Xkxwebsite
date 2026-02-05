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
  category: 'Dresses',
  subcategory: '',
  mainImage: '/placeholder.jpg',
  description: '',
  moq: '50 pcs',
  sampleLeadTime: '7-10 days',
  bulkLeadTime: '4-6 weeks',
  material: '',
  process: '',
  capacity: '',
  packaging: '',
  price: '',
  featured: false,
  active: true,
};

const categories = ['Dresses', 'Tops', 'Pants', 'Skirts', 'Outerwear', 'Hoodies', 'Activewear', 'Swimwear'];

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

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
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
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccess(editingId ? 'Product updated!' : 'Product created!');
      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
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
      sampleLeadTime: '7-10 days',
      bulkLeadTime: '4-6 weeks',
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

      if (!response.ok) throw new Error('Failed to update product');

      setSuccess(`Product ${product.active ? 'deactivated' : 'activated'}!`);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    
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

      if (!response.ok) throw new Error('Failed to delete product');

      setSuccess('Product deleted!');
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin/password')}
              className="text-gray-600 hover:text-gray-800"
            >
              Change Password
            </button>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
              Logout
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
            <h2 className="text-xl font-semibold">Products ({products.length})</h2>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm); }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Product
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-4">{editingId ? 'Edit Product' : 'New Product'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
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
                  <label className="block text-sm font-medium mb-1">MOQ</label>
                  <input
                    type="text"
                    value={form.moq}
                    onChange={e => setForm({ ...form, moq: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="50 pcs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="$25.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Material</label>
                  <input
                    type="text"
                    value={form.material}
                    onChange={e => setForm({ ...form, material: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Main Image URL</label>
                  <input
                    type="text"
                    value={form.mainImage}
                    onChange={e => setForm({ ...form, mainImage: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm({ ...form, featured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm({ ...form, active: e.target.checked })}
                    />
                    Active (visible on frontend)
                  </label>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {products.length === 0 ? (
            <p className="text-gray-500">No products found. Click "Add Product" to create one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-center">Featured</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-right">Actions</th>
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
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(product)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          {product.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
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
