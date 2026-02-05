import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugInfo(null);

    if (!username && !email) {
      setError('请输入用户名或邮箱');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '请求失败');
      }

      setSuccess(data.message || '如果账号存在，重置链接已发送');
      
      // 开发环境显示调试信息
      if (data.debug) {
        setDebugInfo(data.debug);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">忘记密码</h1>
        
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
        
        {debugInfo && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm">
            <p className="font-semibold mb-1">开发环境调试信息：</p>
            <p className="break-all">重置链接: <a href={debugInfo.resetUrl} className="underline">{debugInfo.resetUrl}</a></p>
            <p>有效期至: {new Date(debugInfo.expiresAt).toLocaleString()}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入用户名"
            />
          </div>

          <div className="mb-4 text-center text-gray-500">或</div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入绑定邮箱"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {loading ? '提交中...' : '发送重置链接'}
          </button>
          
          <div className="text-center">
            <Link to="/admin/login" className="text-sm text-blue-600 hover:text-blue-800">
              返回登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
