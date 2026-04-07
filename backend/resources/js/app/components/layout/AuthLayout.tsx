import type { ReactNode } from 'react';
import { Briefcase, Users, Building2, Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const features = [
  { icon: Briefcase, text: 'Kết nối việc làm nhanh chóng' },
  { icon: Users, text: 'Quản lý nguồn nhân lực hiệu quả' },
  { icon: Building2, text: 'Hỗ trợ nhà trọ liên kết' },
  { icon: Shield, text: 'Bảo mật và đáng tin cậy' },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex-col justify-center px-16">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-xl">NV</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">NVTV</h1>
              <p className="text-blue-200 text-sm">Hệ thống tuyển dụng nhân viên thời vụ</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">
            Nền tảng tuyển dụng nhân viên thời vụ hàng đầu Việt Nam
          </h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Kết nối doanh nghiệp với nguồn lao động chất lượng. Quản lý tuyển dụng, ứng viên và nhà trọ liên kết trong một hệ thống duy nhất.
          </p>

          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-blue-200" />
                </div>
                <span className="text-blue-50">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
