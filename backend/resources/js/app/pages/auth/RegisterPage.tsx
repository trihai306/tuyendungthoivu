import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const roleOptions = [
  { value: 'worker', label: 'Nhân viên thời vụ (NVTV)' },
  { value: 'employer', label: 'Nhà tuyển dụng (NTD)' },
  { value: 'landlord', label: 'Chủ trọ' },
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/login');
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

        <h2 className="text-2xl font-bold text-gray-900 mb-1">Đăng ký tài khoản</h2>
        <p className="text-gray-500 mb-8">Tạo tài khoản để bắt đầu sử dụng</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Họ tên"
            placeholder="Nhập họ và tên"
            required
            icon={<User className="h-4 w-4" />}
          />
          <Input
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            type="tel"
            required
            icon={<Phone className="h-4 w-4" />}
          />
          <Input
            label="Email"
            placeholder="Nhập địa chỉ email"
            type="email"
            icon={<Mail className="h-4 w-4" />}
          />
          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            type="password"
            required
            icon={<Lock className="h-4 w-4" />}
          />
          <Select label="Vai trò" options={roleOptions} required />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Đăng ký
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Đăng nhập
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
