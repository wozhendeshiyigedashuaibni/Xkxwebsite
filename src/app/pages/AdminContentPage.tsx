/**
 * Admin Content Page
 * 后台内容管理页面：网站文案编辑
 */

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { api } from '@/lib/api';
import { AdminLayout } from '../components/AdminLayout';
import {
  Search,
  Edit2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Check,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { ContentItem } from '@/lib/api';

export default function AdminContentPage() {
  const { token } = useAdminAuth();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [filteredContents, setFilteredContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['home']));

  // 加载内容列表
  const loadContents = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError('');
      const data = await api.adminGetContent(token);
      setContents(data);
      setFilteredContents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, [token]);

  // 搜索筛选
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredContents(
        contents.filter(
          (c) =>
            c.key.toLowerCase().includes(query) ||
            JSON.stringify(c.value).toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredContents(contents);
    }
  }, [contents, searchQuery]);

  // 分组内容
  const groupedContents = filteredContents.reduce((acc, content) => {
    const prefix = content.key.split('.')[0];
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(content);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  // 开始编辑
  const handleEdit = (content: ContentItem) => {
    setEditingKey(content.key);
    setEditValue(JSON.stringify(content.value, null, 2));
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  // 保存编辑
  const handleSave = async (key: string) => {
    if (!token) return;

    try {
      setSaving(true);
      const value = JSON.parse(editValue);
      const updated = await api.adminUpdateContent(token, key, value);
      
      setContents((prev) =>
        prev.map((c) => (c.key === key ? updated : c))
      );
      
      setEditingKey(null);
      setEditValue('');
      showSuccess('Content updated successfully');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to save content');
      }
    } finally {
      setSaving(false);
    }
  };

  // 显示成功消息
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // 切换分组展开状态
  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Edit website content and copy ({filteredContents.length} items)
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by key or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Grouped Content */}
        <div className="space-y-4">
          {Object.keys(groupedContents).length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No content found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            Object.entries(groupedContents).map(([group, items]) => (
              <div key={group} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedGroups.has(group) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {group}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({items.length} items)
                    </span>
                  </div>
                </button>

                {/* Group Content */}
                {expandedGroups.has(group) && (
                  <div className="divide-y divide-gray-200">
                    {items.map((content) => (
                      <div key={content.key} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {content.key}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Last updated:{' '}
                              {new Date(content.updatedAt).toLocaleString()}
                            </p>
                          </div>
                          {editingKey !== content.key && (
                            <button
                              onClick={() => handleEdit(content)}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                          )}
                        </div>

                        {editingKey === content.key ? (
                          <div className="space-y-3">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={10}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSave(content.key)}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {saving ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4" />
                                    Save
                                  </>
                                )}
                              </button>
                              <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words overflow-x-auto">
                              {JSON.stringify(content.value, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                Content Editing Tips
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Content is stored in JSON format</li>
                <li>• Make sure to maintain valid JSON syntax</li>
                <li>• Changes are reflected immediately on the website</li>
                <li>• Run <code className="bg-blue-100 px-1 rounded">node server/seed-content.js</code> to reset to defaults</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}