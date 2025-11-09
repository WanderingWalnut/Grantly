import { useNavigate } from 'react-router-dom';

export const VerifyEmail = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/intake-form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Content Card */}
      <div className="relative w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center shadow-lg">
              <svg 
                className="w-8 h-8 text-primary-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-surface-900 mb-3">
            Verify Your Email
          </h1>

          {/* Description */}
          <div className="text-center space-y-2 mb-5">
            <p className="text-base text-surface-700">
              We've sent a verification email to you.
            </p>
            <p className="text-sm text-surface-600">
              Please check your inbox and click the verification link.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5">
            <h3 className="font-semibold text-sm text-blue-900 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              What's Next?
            </h3>
            <ul className="space-y-1.5 text-xs text-blue-800">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>Open your email and find the verification message</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>Click "Next" below to set up your organization profile</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div>
            <button
              onClick={handleNext}
              className="w-full bg-white text-primary py-3 px-6 rounded-xl font-semibold text-base hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl border-2 border-primary"
            >
              Next: Complete Organization Profile
            </button>
          </div>

          {/* Note */}
          <div className="mt-4 pt-4 border-t border-surface-200">
            <p className="text-xs text-center text-surface-500">
              <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Check your spam folder if you don't see the email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
