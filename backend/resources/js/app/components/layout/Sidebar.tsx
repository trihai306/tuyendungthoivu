import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Building2, Bell, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../ui/Avatar';

const navItems = [
  { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
  { icon: Briefcase, label: 'Tuyển dụng', path: '/job-posts' },
  { icon: Users, label: 'Ứng viên', path: '/applications' },
  { icon: Building2, label: 'Nhà trọ', path: '/dormitories' },
  { icon: Bell, label: 'Thông báo', path: '/notifications' },
  { icon: Settings, label: 'Cài đặt', path: '/settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-30">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">NV</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-600 leading-tight">NVTV</h1>
            <p className="text-xs text-gray-400 leading-tight">Tuyển dụng</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600 ml-0'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'User'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role === 'admin' ? 'Quản trị viên' : user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
