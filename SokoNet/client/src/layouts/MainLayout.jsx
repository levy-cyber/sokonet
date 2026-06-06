import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { useContext } from 'react';

export default function MainLayout({ children }) {
  const { sidebarOpen } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto flex min-h-screen gap-6 px-4 py-5 lg:px-6">
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} w-full max-w-[280px] lg:block`}>
          <Sidebar />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/90 shadow-soft backdrop-blur-xl">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
