'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    website_url: '',
    contact_email: '',
  });

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
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setUser(data);
      setFormData({
        company_name: data.company_name || '',
        website_url: data.website_url || '',
        contact_email: data.contact_email || session.user.email,
      });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('users')
      .update(formData)
      .eq('id', user.id);

    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      alert('Settings saved successfully!');
    }
    setLoading(false);
  }

  async function handleChangePassword() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const newPassword = prompt('Enter new password:');
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Password updated successfully!');
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Settings</h2>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://yourcompany.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="contact@yourcompany.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Security</h2>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={handleChangePassword}
                className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 border-red-200 dark:border-red-900/20">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <button
            onClick={async () => {
              if (!confirm('Are you sure? This will permanently delete your account and all data.')) return;
              
              const confirmation = prompt('This action cannot be undone. Type DELETE to confirm:');
              if (confirmation !== 'DELETE') {
                alert('Confirmation failed. Account not deleted.');
                return;
              }
              
              const { error } = await supabase.rpc('delete_user_account');
              if (error) {
                alert('Error: ' + error.message);
              } else {
                await supabase.auth.signOut();
                router.push('/login');
              }
            }}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
