import React, { useState, useEffect } from 'react';
import Router from './components/Router';
import LogoWithRipples from './components/LogoWithRipples';
import './Splash.css'; 
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); // 5 seconds splash
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <LogoWithRipples />
      </div>
    );
  }

  return (
    <>
      <Router />
    </>
  );
}

export default App;
