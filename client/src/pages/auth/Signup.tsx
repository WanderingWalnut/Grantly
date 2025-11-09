import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await signUp(formData.email, formData.password);
      
      if (error) {
        setError(error.message || 'Failed to create account');
        setLoading(false);
        return;
      }

      if (user) {
        // Redirect to email verification page after successful signup
        navigate('/verify-email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="auth-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="auth-floating-decoration absolute -top-40 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="auth-floating-decoration absolute top-1/2 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="auth-floating-decoration absolute -bottom-40 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="auth-floating-decoration absolute top-20 left-1/4 w-32 h-32 bg-accent/3 rounded-full blur-2xl" />
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden sm:flex sm:w-1/2 relative items-center justify-center p-12">
        <div className="text-center max-w-lg">
          <div className="flex items-center justify-center mb-8">
            <img src="/Logo.png" alt="Grantly Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-5xl font-bold text-surface-900 civic-heading mb-6">
            Join Grantly
          </h1>
          <p className="text-xl text-surface-600 civic-text leading-relaxed mb-8">
            Register your nonprofit organization and unlock AI-powered grant discovery, application management, and funding opportunities.
          </p>
          <div className="grid grid-cols-1 gap-6 text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 rounded-xl">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-surface-900 mb-1">Smart Grant Matching</h3>
                <p className="text-surface-600">Find grants tailored to your organization's mission</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-100 rounded-xl">
                <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-surface-900 mb-1">Application Tracking</h3>
                <p className="text-surface-600">Monitor your progress from draft to award</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-100 rounded-xl">
                <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-surface-900 mb-1">Professional Assistance</h3>
                <p className="text-surface-600">Get personalized guidance throughout the process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-4 sm:p-6 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md space-y-4 my-4">
          {/* Mobile Logo */}
          <div className="sm:hidden flex justify-center mb-8">
            <img src="/Logo.png" alt="Grantly Logo" className="w-12 h-12 object-contain" />
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-surface-900 mb-1">
              Create Your Account
            </h2>
            <p className="text-sm text-surface-600">
              Register your nonprofit organization to get started
            </p>
          </div>

          {/* Form */}
          <div className="auth-form-container backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="auth-section-header text-base font-semibold text-surface-800 mb-2">Primary Contact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="contactName" className="block text-xs font-medium text-surface-700 mb-1">
                      Contact Name *
                    </label>
                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      required
                      className="auth-input w-full px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-surface-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="auth-input w-full px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="contact@organization.org"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Account Security */}
              {/* Account Security */}
              <div className="space-y-3">
                <h3 className="auth-section-header text-base font-semibold text-surface-800 mb-2">Account Security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-surface-700 mb-1">
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-surface-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="auth-input w-full px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="auth-button w-full bg-gradient-to-r from-primary to-primary/90 text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:from-primary/90 hover:to-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-surface-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

