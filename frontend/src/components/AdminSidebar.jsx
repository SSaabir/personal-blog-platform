import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut, Shield } from 'lucide-react';
import { useContext } from 'react';
import AdminAuthContext from '../context/AdminAuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { admin, logout } = useContext(AdminAuthContext);

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/posts', icon: FileText, label: 'Posts' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-accent-800 min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-accent-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-secondary-500 to-secondary-700 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Admin Panel</h2>
            <p className="text-accent-300 text-sm">{admin?.role || 'Administrator'}</p>
          </div>
        </div>
        <div className="bg-accent-700 rounded-lg p-3">
          <p className="text-accent-200 text-xs mb-1">Logged in as</p>
          <p className="font-semibold text-sm truncate">{admin?.email}</p>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-secondary-600 text-white shadow-lg'
                    : 'text-accent-200 hover:bg-accent-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-accent-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-accent-200 hover:bg-red-600 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
