'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import TestimonialWidget from '@/components/TestimonialWidget';

export default function WidgetsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [widgetType, setWidgetType] = useState('grid');
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setUserId(data.id);
    }
  }

  const generateEmbedCode = (type: string, limit: number) => {
    return `<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/embed?userId=${userId}&type=${type}&limit=${limit}" async></script>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Widgets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Customize and embed testimonial widgets on your website</p>
        </div>

        {/* Widget Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Widget Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Widget Type
                </label>
                <select
                  value={widgetType}
                  onChange={(e) => setWidgetType(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="grid">Grid</option>
                  <option value="carousel">Carousel</option>
                  <option value="masonry">Masonry</option>
                  <option value="wall">Wall</option>
                  <option value="list">List</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Testimonials
                </label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="pt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Available Types:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Grid - Clean grid layout</li>
                  <li>• Carousel - Sliding carousel</li>
                  <li>• Masonry - Pinterest-style</li>
                  <li>• Wall - Full-width wall</li>
                  <li>• List - Simple list view</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Live Preview</h2>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[300px]">
              {userId ? (
                <TestimonialWidget userId={userId} limit={limit} type={widgetType as any} />
              ) : (
                <div className="text-center text-gray-500 py-12">Loading preview...</div>
              )}
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Embed Code</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Copy this code to your website:
            </label>
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                {generateEmbedCode(widgetType, limit)}
              </pre>
              <button
                onClick={() => copyToClipboard(generateEmbedCode(widgetType, limit))}
                className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Installation Instructions:</h3>
            <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-decimal list-inside">
              <li>Copy the embed code above</li>
              <li>Paste it in your website&apos;s HTML where you want the widget to appear</li>
              <li>The widget will automatically load your approved testimonials</li>
              <li>Customize the appearance by changing the type and limit parameters</li>
            </ol>
          </div>
        </div>

        {/* Customization Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Advanced Customization</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">URL Parameters:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">userId</code> - Your user ID</li>
                <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">type</code> - Widget type (grid, carousel, etc.)</li>
                <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">limit</code> - Max testimonials to show</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">CSS Customization:</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The widget inherits your website&apos;s styles. You can override specific styles by targeting the <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.testimonial-widget</code> class.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
