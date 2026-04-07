import { useState } from 'react';
import { LayoutGrid, Table2, Eye, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { mockApplications } from '../../mocks/data';
import type { Application } from '../../types';

type ViewMode = 'kanban' | 'table';

const kanbanColumns = [
  { key: 'new', label: 'Mới', color: 'bg-blue-500', statuses: ['new'] },
  { key: 'reviewing', label: 'Đang xem', color: 'bg-yellow-500', statuses: ['reviewing'] },
  { key: 'interview', label: 'Phỏng vấn', color: 'bg-purple-500', statuses: ['interview_invited', 'interviewed'] },
  { key: 'passed', label: 'Đạt', color: 'bg-green-500', statuses: ['passed'] },
  { key: 'hired', label: 'Nhận việc', color: 'bg-emerald-500', statuses: ['hired'] },
];

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
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
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function KanbanCard({ app }: { app: Application }) {
  return (
    <Card className="p-3 mb-3" hover>
      <div className="flex items-start gap-3">
        <Avatar name={app.worker?.name || ''} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{app.worker?.name}</p>
          <p className="text-xs text-gray-500 truncate">{app.job_post?.title}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        {app.match_score && (
          <Badge variant={app.match_score >= 80 ? 'success' : app.match_score >= 60 ? 'warning' : 'default'}>
            {app.match_score}% phù hợp
          </Badge>
        )}
        <span className="text-xs text-gray-400">{formatDate(app.applied_at)}</span>
      </div>
    </Card>
  );
}

export default function ApplicationsPage() {
  const [view, setView] = useState<ViewMode>('kanban');

  return (
    <PageLayout title="Quản lý ứng viên">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          Tổng cộng <span className="font-semibold text-gray-900">{mockApplications.length}</span> đơn ứng tuyển
        </p>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('kanban')}
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              view === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </button>
          <button
            onClick={() => setView('table')}
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              view === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <Table2 className="h-4 w-4" />
            Bảng
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const apps = mockApplications.filter((a) => col.statuses.includes(a.status));
            return (
              <div key={col.key} className="flex-shrink-0 w-72">
                <div className="flex items-center gap-2 mb-3">
                  <div className={clsx('h-2 w-2 rounded-full', col.color)} />
                  <h3 className="text-sm font-semibold text-gray-700">{col.label}</h3>
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {apps.length}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 min-h-[200px]">
                  {apps.map((app) => (
                    <KanbanCard key={app.id} app={app} />
                  ))}
                  {apps.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">Không có ứng viên</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Ứng viên</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Vị trí</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Trạng thái</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Điểm phù hợp</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Ngày ứng tuyển</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockApplications.map((app) => {
                  const s = statusMap[app.status] || { label: app.status, variant: 'default' as const };
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={app.worker?.name || ''} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{app.worker?.name}</p>
                            <p className="text-xs text-gray-500">{app.worker?.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{app.job_post?.title}</td>
                      <td className="px-6 py-3 text-center">
                        <Badge variant={s.variant}>{s.label}</Badge>
                      </td>
                      <td className="px-6 py-3 text-center">
                        {app.match_score ? (
                          <span className="text-sm font-medium text-gray-900">{app.match_score}%</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500 text-right">{formatDate(app.applied_at)}</td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageLayout>
  );
}
