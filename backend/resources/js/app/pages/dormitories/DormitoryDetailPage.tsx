import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Building2, Wifi, Snowflake, Car, Shield, Star, MapPin } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { mockDormitories } from '../../mocks/data';

const roomTypeLabels: Record<string, string> = {
  single: 'Phòng đơn',
  double: 'Phòng đôi',
  quad: 'Phòng 4 người',
  dorm: 'Phòng tập thể',
};

const roomStatusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  available: { label: 'Còn trống', variant: 'success' },
  full: { label: 'Đã đầy', variant: 'danger' },
  maintenance: { label: 'Bảo trì', variant: 'warning' },
};

function formatPrice(amount: number) {
  return amount.toLocaleString('vi-VN') + 'd';
}

const amenities = [
  { key: 'has_wifi', icon: Wifi, label: 'Wifi' },
  { key: 'has_ac', icon: Snowflake, label: 'Điều hòa' },
  { key: 'has_parking', icon: Car, label: 'Bãi xe' },
  { key: 'has_security', icon: Shield, label: 'Bảo vệ' },
] as const;

export default function DormitoryDetailPage() {
  const { id } = useParams();
  const dorm = mockDormitories.find((d) => d.id === Number(id));

  if (!dorm) {
    return (
      <PageLayout title="Không tìm thấy">
        <div className="text-center py-16">
          <h2 className="text-lg font-semibold text-gray-900">Không tìm thấy nhà trọ</h2>
          <Link to="/dormitories" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Quay lại danh sách
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Chi tiết nhà trọ">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/dormitories" className="hover:text-blue-600 transition-colors">Nhà trọ</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{dorm.name}</span>
      </div>

      <div className="mb-6">
        <div className="h-64 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6">
          <Building2 className="h-24 w-24 text-blue-300" />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{dorm.name}</h2>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{dorm.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{dorm.rating}/5</span>
              <span className="text-sm text-gray-400 ml-2">{dorm.available_rooms} phong trong</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Tien ich</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {amenities.map((amenity) => {
              const available = dorm[amenity.key];
              return (
                <div
                  key={amenity.key}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    available ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <amenity.icon
                    className={`h-5 w-5 ${available ? 'text-blue-600' : 'text-gray-300'}`}
                  />
                  <span className={`text-sm font-medium ${available ? 'text-blue-700' : 'text-gray-400'}`}>
                    {amenity.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {dorm.rules && (
          <Card className="p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Noi quy</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{dorm.rules}</p>
          </Card>
        )}
      </div>

      <Card className="p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Danh sach phong</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">So phong</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Loai phong</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Suc chua</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Dang o</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Gia/thang</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Trang thai</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase px-6 py-3">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dorm.rooms?.map((room) => {
                const rs = roomStatusMap[room.status] || { label: room.status, variant: 'default' as const };
                return (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{room.room_number}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{roomTypeLabels[room.room_type] || room.room_type}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 text-center">{room.capacity}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 text-center">{room.current_occupancy}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">{formatPrice(room.price_per_month)}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={rs.variant}>{rs.label}</Badge>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {room.status === 'available' ? (
                        <Button size="sm" variant="outline">Dat phong</Button>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </PageLayout>
  );
}
