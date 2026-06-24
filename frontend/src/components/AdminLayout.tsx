import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, Users, FileText, Settings, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Operations Desk', path: '/admin/front-desk', icon: <FileText size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
    { name: 'Semesters & Labs', path: '/admin/semesters', icon: <Calendar size={20} /> },
    { name: 'Batches', path: '/admin/batches', icon: <Users size={20} /> },
    { name: 'Reports & Logs', path: '/admin/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-amity-blue text-white flex flex-col">
        <div className="p-6 border-b border-blue-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-amity-yellow rounded-sm flex items-center justify-center font-bold text-amity-blue text-lg">
            LU
          </div>
          <span className="text-xl font-bold tracking-wider">LAB ADMIN</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-6 py-3 transition ${
                    location.pathname === item.path 
                      ? 'bg-blue-900 border-r-4 border-amity-yellow text-amity-yellow' 
                      : 'hover:bg-blue-800 text-gray-300 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <Link to="/" className="flex items-center space-x-3 px-2 py-2 text-gray-300 hover:text-white transition">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-amity-blue text-white flex items-center justify-center font-bold">A</div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
