import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Wifi, Snowflake, Car, Shield, Star } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import { mockDormitories } from '../../mocks/data';

function formatPrice(amount: number) {
  return (amount / 1000000).toFixed(1) + ' triệu';
}

export default function DormitoriesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockDormitories.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PageLayout title="Nhà trọ liên kết">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhà trọ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {filtered.map((dorm) => (
          <Link to={`/dormitories/${dorm.id}`} key={dorm.id}>
            <Card hover className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Building2 className="h-16 w-16 text-blue-300" />
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{dorm.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{dorm.address}</p>

                <div className="flex items-center gap-3 mb-3">
                  <Wifi className={`h-4 w-4 ${dorm.has_wifi ? 'text-blue-500' : 'text-gray-200'}`} />
                  <Snowflake className={`h-4 w-4 ${dorm.has_ac ? 'text-blue-500' : 'text-gray-200'}`} />
                  <Car className={`h-4 w-4 ${dorm.has_parking ? 'text-blue-500' : 'text-gray-200'}`} />
                  <Shield className={`h-4 w-4 ${dorm.has_security ? 'text-blue-500' : 'text-gray-200'}`} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{dorm.rating}</span>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">
                    {formatPrice(dorm.price_range_min)} - {formatPrice(dorm.price_range_max)}
                  </p>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {dorm.available_rooms}/{dorm.total_rooms} phòng trống
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
