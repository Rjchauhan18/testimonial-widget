'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface CollectionPage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  brand_color: string;
  created_at: string;
}

export default function CollectionPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<CollectionPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('collection_pages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading pages:', error);
    } else {
      setPages(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collection Pages</h1>
            <p className="text-gray-600 mt-1">Create pages where customers can submit testimonials</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + New Collection Page
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">No collection pages yet</h3>
            <p className="text-gray-600 mt-2">Create your first page to start collecting testimonials</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Page
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <div key={page.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900">{page.title}</h3>
                {page.description && (
                  <p className="text-gray-600 mt-2">{page.description}</p>
                )}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Slug:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded">{page.slug}</code>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Color:</span>
                    <div 
                      className="ml-2 w-6 h-6 rounded border"
                      style={{ backgroundColor: page.brand_color }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`/submit/${page.slug}`}
                    target="_blank"
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition text-sm"
                  >
                    View Page
                  </a>
                  <a
                    href={`/dashboard/collection-pages/${page.id}`}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-center rounded hover:bg-gray-200 transition text-sm"
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadPages();
            }}
          />
        )}
      </div>
    </div>
  );
}

function CreateModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [brandColor, setBrandColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please login');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('collection_pages').insert({
      user_id: user.id,
      title,
      slug,
      description,
      brand_color: brandColor,
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Create Collection Page</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., Customer Testimonials"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., customer-testimonials"
              required
            />
            <p className="text-xs text-gray-500 mt-1">URL will be: /submit/{slug || 'your-slug'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
              placeholder="Optional description for your page"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Color</label>
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="mt-1 w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
