import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup, Dashboard, IntakeForm, Matches, ApplicationTracker, Profile, VerifyEmail } from './pages';
import { Layout } from './components';
import { ApplicationProvider } from './context/ApplicationContext';
import { AuthProvider } from './context/AuthContext';
import { OrganizationProvider } from './context/OrganizationContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <ApplicationProvider>
          <BrowserRouter>
            <Routes>
            {/* Auth routes without layout */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/intake-form" element={<IntakeForm />} />
            
            {/* Main app routes with layout */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/matches" element={<Layout><Matches /></Layout>} />
            <Route path="/tracker" element={<Layout><ApplicationTracker /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </ApplicationProvider>
      </OrganizationProvider>
    </AuthProvider>
  );
}

export default App;
