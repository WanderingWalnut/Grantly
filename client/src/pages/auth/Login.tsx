import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic (e.g., call API)
    console.log('Login submitted:', formData);
    
    // Redirect to dashboard after successful login
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      {/* Left Side - Branding */}
      <div className="hidden sm:flex sm:w-1/2 relative items-center justify-center p-12">
        <div className="text-center max-w-lg">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-civic rounded-3xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-3xl">G</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-surface-900 civic-heading mb-6">
            Welcome to Grantly
          </h1>
          <p className="text-xl text-surface-600 civic-text leading-relaxed mb-8">
            Your intelligent grant discovery and application assistant. Find the perfect funding opportunities for your organization.
          </p>
          <div className="grid grid-cols-1 gap-6 text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 rounded-xl">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-surface-900 mb-1">AI-Powered Matching</h3>
                <p className="text-surface-600">Find grants tailored to your organization's mission and needs</p>
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
                <h3 className="font-bold text-surface-900 mb-1">Intelligent Assistance</h3>
                <p className="text-surface-600">Get personalized guidance throughout the process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="auth-form-container bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100/50 p-8">
            {/* Mobile Logo */}
            <div className="sm:hidden flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-civic rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">G</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-surface-900 civic-heading mb-2">
                Sign In
              </h2>
              <p className="text-surface-600 civic-text">
                Access your grant management dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-surface-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="auth-input w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 text-lg"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-surface-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="auth-input w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 text-lg"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-surface-900 font-medium">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="auth-button w-full group bg-gradient-civic text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <svg className="-ml-1 mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In to Dashboard
                </div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-surface-600">
                New to Grantly?{' '}
                <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

