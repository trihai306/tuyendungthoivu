import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Save, Eye } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const jobTypeOptions = [
  { value: 'kho_bai', label: 'Kho b\u00e0i' },
  { value: 'phuc_vu', label: 'Ph\u1ee5c v\u1ee5' },
  { value: 'san_xuat', label: 'S\u1ea3n xu\u1ea5t' },
  { value: 'ban_hang', label: 'B\u00e1n h\u00e0ng' },
  { value: 'su_kien', label: 'S\u1ef1 ki\u1ec7n' },
  { value: 'bao_ve', label: 'B\u1ea3o v\u1ec7' },
  { value: 'giao_hang', label: 'Giao h\u00e0ng' },
  { value: 'khac', label: 'Kh\u00e1c' },
];

const salaryTypeOptions = [
  { value: 'hourly', label: 'Theo gi\u1edd' },
  { value: 'daily', label: 'Theo ng\u00e0y' },
  { value: 'shift', label: 'Theo ca' },
  { value: 'monthly', label: 'Theo th\u00e1ng' },
];

const shiftTypeOptions = [
  { value: 'morning', label: 'Ca s\u00e1ng (6h-14h)' },
  { value: 'afternoon', label: 'Ca chi\u1ec1u (14h-22h)' },
  { value: 'evening', label: 'Ca t\u1ed1i (18h-22h)' },
  { value: 'night', label: 'Ca \u0111\u00eam (22h-6h)' },
  { value: 'flexible', label: 'Linh ho\u1ea1t' },
];

export default function CreateJobPostPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasHousing, setHasHousing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/job-posts');
    }, 1000);
  };

  return (
    <PageLayout title="\u0110\u0103ng tin tuy\u1ec3n d\u1ee5ng">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/job-posts" className="hover:text-blue-600 transition-colors">
          Tuy\u1ec3n d\u1ee5ng
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">\u0110\u0103ng tin m\u1edbi</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Th\u00f4ng tin c\u01a1 b\u1ea3n
              </h3>
              <div className="space-y-4">
                <Input
                  label="Ti\u00eau \u0111\u1ec1 tin tuy\u1ec3n d\u1ee5ng"
                  placeholder="V\u00ed d\u1ee5: Tuy\u1ec3n nh\u00e2n vi\u00ean kho b\u00e0i"
                  required
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select label="Lo\u1ea1i c\u00f4ng vi\u1ec7c" options={jobTypeOptions} required />
                  <Input
                    label="S\u1ed1 l\u01b0\u1ee3ng c\u1ea7n tuy\u1ec3n"
                    type="number"
                    placeholder="V\u00ed d\u1ee5: 10"
                    min={1}
                    required
                  />
                </div>
                <Textarea
                  label="M\u00f4 t\u1ea3 c\u00f4ng vi\u1ec7c"
                  placeholder="M\u00f4 t\u1ea3 chi ti\u1ebft v\u1ec1 c\u00f4ng vi\u1ec7c, nhi\u1ec7m v\u1ee5..."
                  rows={5}
                  required
                />
              </div>
            </Card>

            {/* Salary & schedule */}
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                L\u01b0\u01a1ng & l\u1ecbch l\u00e0m vi\u1ec7c
              </h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select label="H\u00ecnh th\u1ee9c tr\u1ea3 l\u01b0\u01a1ng" options={salaryTypeOptions} required />
                  <Input
                    label="M\u1ee9c l\u01b0\u01a1ng (VN\u0110)"
                    type="number"
                    placeholder="V\u00ed d\u1ee5: 250000"
                    min={0}
                    required
                  />
                </div>
                <Select label="Ca l\u00e0m vi\u1ec7c" options={shiftTypeOptions} required />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Ng\u00e0y b\u1eaft \u0111\u1ea7u" type="date" required />
                  <Input label="Ng\u00e0y k\u1ebft th\u00fac" type="date" required />
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                \u0110\u1ecba \u0111i\u1ec3m l\u00e0m vi\u1ec7c
              </h3>
              <div className="space-y-4">
                <Input
                  label="\u0110\u1ecba ch\u1ec9 l\u00e0m vi\u1ec7c"
                  placeholder="Nh\u1eadp \u0111\u1ecba ch\u1ec9 c\u1ee5 th\u1ec3"
                  required
                />
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="has-housing"
                    checked={hasHousing}
                    onChange={(e) => setHasHousing(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="has-housing" className="text-sm text-gray-700">
                    C\u00f3 h\u1ed7 tr\u1ee3 nh\u00e0 \u1edf cho nh\u00e2n vi\u00ean
                  </label>
                </div>
              </div>
            </Card>

            {/* Requirements & benefits */}
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Y\u00eau c\u1ea7u & quy\u1ec1n l\u1ee3i
              </h3>
              <div className="space-y-4">
                <Textarea
                  label="Y\u00eau c\u1ea7u \u1ee9ng vi\u00ean"
                  placeholder="V\u00ed d\u1ee5: S\u1ee9c kh\u1ecfe t\u1ed1t, ch\u1ecbu kh\u00f3..."
                  rows={4}
                />
                <Textarea
                  label="Quy\u1ec1n l\u1ee3i"
                  placeholder="V\u00ed d\u1ee5: B\u1ea3o hi\u1ec3m, th\u01b0\u1edfng, xe \u0111\u01b0a \u0111\u00f3n..."
                  rows={4}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                \u0110\u0103ng tin
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Xem l\u1ea1i th\u00f4ng tin tr\u01b0\u1edbc khi \u0111\u0103ng. Tin \u0111\u0103ng s\u1ebd \u0111\u01b0\u1ee3c duy\u1ec7t tr\u01b0\u1edbc khi hi\u1ec3n th\u1ecb.
              </p>
              <div className="space-y-3">
                <Button type="submit" fullWidth loading={loading}>
                  <Save className="h-4 w-4" />
                  \u0110\u0103ng tin tuy\u1ec3n d\u1ee5ng
                </Button>
                <Button type="button" variant="outline" fullWidth>
                  <Eye className="h-4 w-4" />
                  Xem tr\u01b0\u1edbc
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => navigate('/job-posts')}
                >
                  H\u1ee7y b\u1ecf
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-100">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                M\u1eb9o \u0111\u0103ng tin hi\u1ec7u qu\u1ea3
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  Ti\u00eau \u0111\u1ec1 r\u00f5 r\u00e0ng, c\u1ee5 th\u1ec3 v\u1ecb tr\u00ed c\u1ea7n tuy\u1ec3n
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  M\u00f4 t\u1ea3 chi ti\u1ebft c\u00f4ng vi\u1ec7c v\u00e0 y\u00eau c\u1ea7u
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  Ghi r\u00f5 m\u1ee9c l\u01b0\u01a1ng v\u00e0 quy\u1ec1n l\u1ee3i
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  C\u1eadp nh\u1eadt \u0111\u1ecba ch\u1ec9 ch\u00ednh x\u00e1c
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </form>
    </PageLayout>
  );
}
