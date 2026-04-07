import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { mockUser } from '../../mocks/data';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(mockUser);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <AuthLayout>
      <div>
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">NV</span>
          </div>
          <span className="text-xl font-bold text-blue-600">NVTV</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">Đăng nhập</h2>
        <p className="text-gray-500 mb-8">Chào mừng bạn quay trở lại</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            type="tel"
            required
            icon={<Phone className="h-4 w-4" />}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            type="password"
            required
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Quên mật khẩu?
            </a>
          </div>

          <Button type="submit" fullWidth loading={loading} size="lg">
            Đăng nhập
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
