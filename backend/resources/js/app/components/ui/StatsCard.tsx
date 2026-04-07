import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

const colorClasses = {
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
  green: { bg: 'bg-green-100', icon: 'text-green-600' },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600' },
  orange: { bg: 'bg-orange-100', icon: 'text-orange-600' },
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={clsx(
                  'text-sm font-medium',
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.direction === 'up' ? '+' : '-'}{trend.percentage}%
              </span>
              <span className="text-sm text-gray-400">so với tháng trước</span>
            </div>
          )}
        </div>
        <div className={clsx('rounded-full p-3', colors.bg)}>
          <Icon className={clsx('h-6 w-6', colors.icon)} />
        </div>
      </div>
    </div>
  );
}
