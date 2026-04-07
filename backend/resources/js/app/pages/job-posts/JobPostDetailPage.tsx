import { useParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin, Calendar, Clock, Users, Home, Building2, Eye } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { mockJobPosts } from '../../mocks/data';

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  active: { label: 'Đang tuyển', variant: 'success' },
  paused: { label: 'Tạm dừng', variant: 'warning' },
  closed: { label: 'Đã đóng', variant: 'default' },
  draft: { label: 'Nháp', variant: 'info' },
};

const shiftLabels: Record<string, string> = {
  morning: 'Ca sáng (6h-14h)',
  afternoon: 'Ca chiều (14h-22h)',
  evening: 'Ca tối (18h-22h)',
  night: 'Ca đêm (22h-6h)',
  flexible: 'Linh hoạt',
};

const salaryTypeLabels: Record<string, string> = {
  hourly: '/giờ',
  daily: '/ngày',
  shift: '/ca',
  monthly: '/tháng',
};

function formatSalary(amount: number) {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export default function JobPostDetailPage() {
  const { id } = useParams();
  const job = mockJobPosts.find((j) => j.id === Number(id));

  if (!job) {
    return (
      <PageLayout title="Không tìm thấy">
        <div className="text-center py-16">
          <h2 className="text-lg font-semibold text-gray-900">Không tìm thấy tin tuyển dụng</h2>
          <Link to="/job-posts" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Quay lại danh sách
          </Link>
        </div>
      </PageLayout>
    );
  }

  const s = statusMap[job.status] || { label: job.status, variant: 'default' as const };
  const progress = job.positions_count > 0 ? (job.filled_count / job.positions_count) * 100 : 0;

  return (
    <PageLayout title="Chi tiết tin tuyển dụng">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/job-posts" className="hover:text-blue-600 transition-colors">Tuyển dụng</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Chi tiết tin</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <Badge variant={s.variant}>{s.label}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>{job.employer?.company_name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{job.view_count} lượt xem</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Mô tả công việc</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </Card>

          {job.requirements && (
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Yêu cầu ứng viên</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </Card>
          )}

          {job.benefits && (
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Quyền lợi</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.benefits}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-1">Mức lương</p>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {formatSalary(job.salary_amount)}
            </p>
            <p className="text-sm text-gray-400 mb-5">
              {salaryTypeLabels[job.salary_type] || ''}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{job.work_address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{job.work_start_date} - {job.work_end_date}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{shiftLabels[job.shift_type] || job.shift_type}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{job.filled_count}/{job.positions_count} vị trí</span>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Tiến độ tuyển dụng</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {job.has_housing && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Home className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Có hỗ trợ nhà ở</span>
              </div>
            )}

            <Button fullWidth size="lg" className="mt-6">
              Ứng tuyển ngay
            </Button>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
