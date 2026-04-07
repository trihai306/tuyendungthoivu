import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Search, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { mockJobPosts } from '../../mocks/data';

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang tuyển' },
  { key: 'paused', label: 'Tạm dừng' },
  { key: 'closed', label: 'Đã đóng' },
];

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  active: { label: 'Đang tuyển', variant: 'success' },
  paused: { label: 'Tạm dừng', variant: 'warning' },
  closed: { label: 'Đã đóng', variant: 'default' },
  draft: { label: 'Nháp', variant: 'info' },
};

function formatSalary(amount: number, type: string) {
  const formatted = amount.toLocaleString('vi-VN');
  const suffix = type === 'monthly' ? '/tháng' : type === 'daily' ? '/ngày' : '/ca';
  return `${formatted}đ ${suffix}`;
}

const ITEMS_PER_PAGE = 6;

export default function JobPostsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = mockJobPosts.filter((job) => {
    if (activeTab !== 'all' && job.status !== activeTab) return false;
    if (search && !job.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <PageLayout title="Tin tuyển dụng">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
              className={clsx(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tin..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-60"
            />
          </div>
          <Link to="/job-posts/create">
            <Button size="md">
              <Plus className="h-4 w-4" />
              Tạo tin mới
            </Button>
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="rounded-full bg-gray-100 p-4 mb-4 inline-flex">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy tin tuyển dụng</h3>
          <p className="text-sm text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {paged.map((job) => {
              const s = statusMap[job.status] || { label: job.status, variant: 'default' as const };
              const progress = job.positions_count > 0 ? (job.filled_count / job.positions_count) * 100 : 0;

              return (
                <Card key={job.id} hover className="p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm text-gray-500">{job.employer?.company_name}</p>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-3">{job.title}</h3>

                  <Badge variant="success" className="self-start mb-3">
                    {formatSalary(job.salary_amount, job.salary_type)}
                  </Badge>

                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{job.work_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{job.work_start_date} - {job.work_end_date}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Vị trí đã tuyển</span>
                      <span>{job.filled_count}/{job.positions_count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{job.view_count} lượt xem</span>
                    </div>
                    <Link
                      to={`/job-posts/${job.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Xem chi tiết &rarr;
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
