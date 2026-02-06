import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const mustChange = (location.state as any)?.mustChange || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }

    if (newPassword.length < 8) {
      setError('新密码至少需要8个字符');
      return;
    }
    
    if (newPassword === 'admin123') {
      setError('不能使用默认密码，请设置更安全的密码');
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.status === 401) {
        if (data.code === 'WRONG_PASSWORD') {
          setError('当前密码错误');
        } else {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
        }
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || '修改失败');
      }

      setSuccess('密码修改成功，请重新登录');
      setTimeout(() => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">修改密码</h1>
          {!mustChange && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              返回后台
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {mustChange && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
              当前使用默认密码，请设置新密码后继续使用
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                当前密码
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入当前密码"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                新密码
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入新密码"
                minLength={8}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                密码至少8个字符，不能使用默认密码
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                确认新密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="请再次输入新密码"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '提交中...' : '确认修改'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
