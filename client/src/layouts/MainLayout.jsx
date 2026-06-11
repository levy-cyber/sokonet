import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = ({ title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Workspace Panel */}
      <div className="flex-1 flex flex-col pl-0 lg:pl-64 min-h-screen transition-all duration-300">
        {/* Navigation Bar */}
        <Navbar title={title} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Container */}
        <main className="flex-1 pt-20 lg:pt-24 px-4 lg:px-8 pb-8 lg:pb-12 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;