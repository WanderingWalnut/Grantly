import type { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { useApplications } from '../../hooks';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { successMessages, removeSuccessMessage } = useApplications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-100 via-primary-50/30 to-secondary-50/20">
      <Navigation />
      
      {/* Global Success Messages - Stacked */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
        {successMessages.map((message, index) => (
          <div 
            key={message.id}
            className="animate-in slide-in-from-top-5 fade-in duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-green-400 max-w-md">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Application Started Successfully!</h3>
                  <p className="text-sm text-green-50">
                    Your application for <span className="font-semibold">"{message.grantTitle}"</span> has been started. View it in the Application Tracker.
                  </p>
                </div>
                <button 
                  onClick={() => removeSuccessMessage(message.id)}
                  className="flex-shrink-0 text-white hover:text-green-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <main className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};