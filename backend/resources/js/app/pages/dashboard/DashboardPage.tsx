import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import StatsCard from '../../components/ui/StatsCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { mockDashboardStats, mockJobPosts, mockApplications } from '../../mocks/data';

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  active: { label: 'Đang tuyển', variant: 'success' },
  paused: { label: 'Tạm dừng', variant: 'warning' },
  closed: { label: 'Đã đóng', variant: 'default' },
  draft: { label: 'Nháp', variant: 'info' },
  new: { label: 'Mới', variant: 'info' },
  reviewing: { label: 'Đang xem', variant: 'warning' },
  interview_invited: { label: 'Mời PV', variant: 'info' },
  interviewed: { label: 'Đã PV', variant: 'info' },
  passed: { label: 'Đạt', variant: 'success' },
  rejected: { label: 'Từ chối', variant: 'danger' },
  hired: { label: 'Nhận việc', variant: 'success' },
  withdrawn: { label: 'Rút', variant: 'default' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
}

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <PageLayout title="Tổng quan">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Tổng NVTV"
          value={stats.total_workers.toLocaleString()}
          icon={Users}
          color="blue"
          trend={{ direction: 'up', percentage: stats.workers_trend }}
        />
        <StatsCard
          title="Tổng NTD"
          value={stats.total_employers.toLocaleString()}
          icon={Building2}
          color="green"
          trend={{ direction: 'up', percentage: stats.employers_trend }}
        />
        <StatsCard
          title="Tin tuyển dụng"
          value={stats.total_job_posts.toLocaleString()}
          icon={Briefcase}
          color="purple"
          trend={{ direction: 'up', percentage: stats.job_posts_trend }}
        />
        <StatsCard
          title="Đơn ứng tuyển"
          value={stats.total_applications.toLocaleString()}
          icon={FileText}
          color="orange"
          trend={{ direction: 'up', percentage: stats.applications_trend }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Tin tuyển dụng mới nhất</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Vị trí</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Công ty</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Số lượng</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Trạng thái</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockJobPosts.slice(0, 5).map((job) => {
                  const s = statusMap[job.status] || { label: job.status, variant: 'default' as const };
                  return (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{job.employer?.company_name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 text-center">{job.filled_count}/{job.positions_count}</td>
                      <td className="px-6 py-3 text-center">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500 text-right">{formatDate(job.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-0">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Đơn ứng tuyển gần đây</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Ứng viên</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Vị trí</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Trạng thái</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Ngày nộp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockApplications.slice(0, 5).map((app) => {
                  const s = statusMap[app.status] || { label: app.status, variant: 'default' as const };
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{app.worker?.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{app.job_post?.title}</td>
                      <td className="px-6 py-3 text-center">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500 text-right">{formatDate(app.applied_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
