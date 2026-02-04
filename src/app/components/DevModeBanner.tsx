import { AlertCircle } from 'lucide-react';

export function DevModeBanner() {
  // Default to true if not explicitly set to 'false'
  const useMockData = import.meta.env.VITE_USE_MOCK !== 'false';
  const isDev = import.meta.env.DEV;

  // Don't show in production or when mock is explicitly disabled
  if (!isDev || !useMockData) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-yellow-800">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Development Mode:</strong> Using mock data. 
          <span className="ml-1">
            To use real backend: Set <code className="px-1 bg-yellow-100 rounded">VITE_USE_MOCK=false</code> in <code className="px-1 bg-yellow-100 rounded">.env.local</code>
          </span>
        </span>
      </div>
    </div>
  );
}