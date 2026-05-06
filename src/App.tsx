import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ServicePage from './pages/ServicePage';

function LoadingScreen() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / 20);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <img src="/MC.svg" alt="MC ExteriorCare" className="w-24 h-24 mx-auto mb-8" />
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">MC ExteriorCare</h1>
        <p className="text-neutral-600 mb-8">Loading...</p>
        
        <div className="w-64 h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-neutral-500 mt-4">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

function AppContent() {
  const [showApp, setShowApp] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowApp(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  if (!showApp) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/service/:serviceId" element={<ServicePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppContent />;
}
