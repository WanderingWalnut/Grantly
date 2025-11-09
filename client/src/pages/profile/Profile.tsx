import { useState } from 'react';
import { OrganizationProfileForm } from '../../components/forms/OrganizationProfileForm';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState<'organization' | 'security'>('organization');

  const tabs = [
    { id: 'organization', name: 'Organization Info', icon: 'building' },
    { id: 'security', name: 'Security', icon: 'shield' }
  ];

  const getTabIcon = (iconType: string) => {
    switch (iconType) {
      case 'building':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Settings</h1>
      </div>

      {/* Tab Navigation */}
      <div className="mb-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-primary-100/50">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'organization' | 'security')}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-civic text-white shadow-lg transform scale-105'
                    : 'text-surface-600 hover:text-primary-600 hover:bg-primary-50 hover:scale-105'
                }`}
              >
                <span className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                  {getTabIcon(tab.icon)}
                </span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Organization Info Tab */}
      {activeTab === 'organization' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100/50 p-8">
          <OrganizationProfileForm />
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100/50 p-8">
          <div className="space-y-6">
            <div className="border-b border-surface-200 pb-6">
              <h4 className="font-medium text-surface-900 mb-2">Change Password</h4>
              <p className="text-sm text-surface-600 mb-4">Update your password to keep your account secure</p>
              <button className="px-4 py-2 border-2 border-primary-500 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-200">
                Change Password
              </button>
            </div>
            
            <div className="border-b border-surface-200 pb-6">
              <h4 className="font-medium text-surface-900 mb-2">Two-Factor Authentication</h4>
              <p className="text-sm text-surface-600 mb-4">Add an extra layer of security to your account</p>
              <button className="px-4 py-2 bg-gradient-civic text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200">
                Enable 2FA
              </button>
            </div>
            
            <div>
              <h4 className="font-medium text-surface-900 mb-2">Account Deletion</h4>
              <p className="text-sm text-surface-600 mb-4">Permanently delete your account and all associated data</p>
              <button className="px-4 py-2 border-2 border-red-500 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-200">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
