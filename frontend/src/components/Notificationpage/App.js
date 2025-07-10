
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';          
import Notification from './components/Notification';
import HomePage from './components/HomePage';     
import Events from './components/Events';          
import Dashboard from './components/Dashboard';    
import Clubs from './components/Clubs';            

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-purple-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/events" element={<Events />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clubs" element={<Clubs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

