import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  // Auth Flow
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Authenticated App Layout
  return (
    <div className="flex h-screen bg-background text-gray-100 font-sans overflow-hidden">
      {/* Mobile Sidebar Toggle Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onLogout={handleLogout}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header for Menu Toggle */}
        <div className="lg:hidden h-16 bg-surface border-b border-gray-800 flex items-center px-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-bold text-white">FiscalCtl Mobile</span>
        </div>

        {/* Dashboard Content */}
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
