import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = ({ title }) => {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Workspace Panel */}
      <div className="flex-1 flex flex-col pl-64 min-h-screen">
        {/* Navigation Bar */}
        <Navbar title={title} />

        {/* Content Container */}
        <main className="flex-1 pt-24 px-8 pb-12 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
