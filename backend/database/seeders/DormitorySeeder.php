<?php

namespace Database\Seeders;

use App\Models\Bed;
use App\Models\Dormitory;
use App\Models\Region;
use App\Models\Room;
use App\Models\User;
use App\Models\WorkerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DormitorySeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('123456');
        $now = now();

        // Create landlord users for dormitories
        $landlords = [];
        $landlordData = [
            ['name' => 'Nguyễn Thị Bích Ngọc', 'email' => 'ngoc.ntb@binhminh.vn', 'phone' => '0933100001'],
            ['name' => 'Trần Quốc Hưng', 'email' => 'hung.tq@hoasen.vn', 'phone' => '0933100002'],
            ['name' => 'Lê Văn Tâm', 'email' => 'tam.lv@biendong.vn', 'phone' => '0933100003'],
            ['name' => 'Phạm Thị Hồng', 'email' => 'hong.pt@saomai.vn', 'phone' => '0933100004'],
            ['name' => 'Hoàng Đức Thịnh', 'email' => 'thinh.hd@phuquy.vn', 'phone' => '0933100005'],
        ];

        foreach ($landlordData as $ld) {
            $landlords[] = User::create([
                'name' => $ld['name'],
                'email' => $ld['email'],
                'phone' => $ld['phone'],
                'password' => $password,
                'role' => 'landlord',
                'status' => 'active',
                'email_verified_at' => $now,
                'last_login_at' => $now->copy()->subDays(rand(0, 5)),
            ]);
        }

        // Ensure regions exist
        $regionHcm = Region::firstOrCreate(
            ['province' => 'Hồ Chí Minh'],
            ['name' => 'TP. Hồ Chí Minh', 'status' => 'active']
        );
        $regionHn = Region::firstOrCreate(
            ['province' => 'Hà Nội'],
            ['name' => 'Hà Nội', 'status' => 'active']
        );
        $regionDn = Region::firstOrCreate(
            ['province' => 'Đà Nẵng'],
            ['name' => 'Đà Nẵng', 'status' => 'active']
        );
        $regionNt = Region::firstOrCreate(
            ['province' => 'Khánh Hòa'],
            ['name' => 'Nha Trang', 'status' => 'active']
        );

        // Get some worker profiles to assign as occupants
        $occupants = WorkerProfile::take(8)->get();

        // === Dormitory 1: Khu tro Binh Minh, HCM Q7, 20 phong ===
        $dorm1 = Dormitory::create([
            'landlord_id' => $landlords[0]->id,
            'region_id' => $regionHcm->id,
            'name' => 'Khu trọ Bình Minh',
            'address' => '45 Đường Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh',
            'latitude' => 10.7340,
            'longitude' => 106.7215,
            'total_rooms' => 20,
            'total_beds' => 56,
            'has_wifi' => true,
            'has_ac' => true,
            'has_hot_water' => true,
            'has_kitchen' => true,
            'has_parking' => true,
            'has_security' => true,
            'electricity_rate' => 3800,
            'water_rate' => 18000,
            'deposit_amount' => 2000000,
            'rules' => "- Giữ vệ sinh chung\n- Không gây ồn sau 22h\n- Không nuôi thú cưng\n- Đóng tiền đúng hạn (mỗi tháng ngày 5)\n- Không tự ý sửa chữa điện nước\n- Khách đến thăm phải đăng ký",
            'rating' => 4.3,
            'status' => 'active',
        ]);
        $this->createRoomsAndBeds($dorm1, 20, 1500000, 2500000, $occupants, 8);

        // === Dormitory 2: Khu tro Hoa Sen, HN Cau Giay, 15 phong ===
        $dorm2 = Dormitory::create([
            'landlord_id' => $landlords[1]->id,
            'region_id' => $regionHn->id,
            'name' => 'Khu trọ Hoa Sen',
            'address' => '78 Đường Xuân Thủy, Cầu Giấy, Hà Nội',
            'latitude' => 21.0365,
            'longitude' => 105.7813,
            'total_rooms' => 15,
            'total_beds' => 40,
            'has_wifi' => true,
            'has_ac' => false,
            'has_hot_water' => true,
            'has_kitchen' => true,
            'has_parking' => true,
            'has_security' => false,
            'electricity_rate' => 3500,
            'water_rate' => 15000,
            'deposit_amount' => 1500000,
            'rules' => "- Giữ trật tự chung\n- Không hút thuốc trong phòng\n- Không nấu ăn trong phòng\n- Đóng tiền trước ngày 10 hàng tháng\n- Tiết kiệm điện nước",
            'rating' => 3.9,
            'status' => 'active',
        ]);
        $this->createRoomsAndBeds($dorm2, 15, 1200000, 2000000, $occupants, 5);

        // === Dormitory 3: Khu tro Bien Dong, DN Son Tra, 12 phong ===
        $dorm3 = Dormitory::create([
            'landlord_id' => $landlords[2]->id,
            'region_id' => $regionDn->id,
            'name' => 'Khu trọ Biển Đông',
            'address' => '32 Đường Ngô Quyền, Sơn Trà, Đà Nẵng',
            'latitude' => 16.0678,
            'longitude' => 108.2238,
            'total_rooms' => 12,
            'total_beds' => 30,
            'has_wifi' => true,
            'has_ac' => true,
            'has_hot_water' => true,
            'has_kitchen' => false,
            'has_parking' => true,
            'has_security' => true,
            'electricity_rate' => 3500,
            'water_rate' => 14000,
            'deposit_amount' => 1200000,
            'rules' => "- Giữ gìn tài sản chung\n- Không mang chất cấm vào khu trọ\n- Không gây ồn sau 23h\n- Đóng tiền trọ trước ngày 5 hàng tháng\n- Xe để đúng nơi quy định",
            'rating' => 4.1,
            'status' => 'active',
        ]);
        $this->createRoomsAndBeds($dorm3, 12, 1000000, 1800000, $occupants, 4);

        // === Dormitory 4: Khu tro Sao Mai, Nha Trang Vinh Hai, 10 phong ===
        $dorm4 = Dormitory::create([
            'landlord_id' => $landlords[3]->id,
            'region_id' => $regionNt->id,
            'name' => 'Khu trọ Sao Mai',
            'address' => '15 Đường Phạm Văn Đồng, Vĩnh Hải, Nha Trang',
            'latitude' => 12.2690,
            'longitude' => 109.1860,
            'total_rooms' => 10,
            'total_beds' => 24,
            'has_wifi' => true,
            'has_ac' => false,
            'has_hot_water' => false,
            'has_kitchen' => true,
            'has_parking' => true,
            'has_security' => false,
            'electricity_rate' => 3200,
            'water_rate' => 12000,
            'deposit_amount' => 800000,
            'rules' => "- Giữ vệ sinh chung\n- Không gây mất trật tự\n- Đóng tiền đúng hạn\n- Tiết kiệm điện nước\n- Không tự ý cho người ngoài ở cùng",
            'rating' => 3.6,
            'status' => 'active',
        ]);
        $this->createRoomsAndBeds($dorm4, 10, 800000, 1500000, $occupants, 3);

        // === Dormitory 5: Khu tro Phu Quy, HCM Binh Tan, 25 phong ===
        $dorm5 = Dormitory::create([
            'landlord_id' => $landlords[4]->id,
            'region_id' => $regionHcm->id,
            'name' => 'Khu trọ Phú Quý',
            'address' => '200 Đường Kinh Dương Vương, Bình Tân, TP. Hồ Chí Minh',
            'latitude' => 10.7518,
            'longitude' => 106.6082,
            'total_rooms' => 25,
            'total_beds' => 70,
            'has_wifi' => true,
            'has_ac' => false,
            'has_hot_water' => true,
            'has_kitchen' => true,
            'has_parking' => true,
            'has_security' => true,
            'electricity_rate' => 3500,
            'water_rate' => 16000,
            'deposit_amount' => 1000000,
            'rules' => "- Giữ gìn vệ sinh chung\n- Không hút thuốc, uống rượu gây mất trật tự\n- Đóng tiền trước ngày 5 hàng tháng\n- Không tự ý sửa chữa điện nước\n- Xe để đúng nơi quy định\n- Giữ yên lặng sau 22h",
            'rating' => 3.8,
            'status' => 'active',
        ]);
        $this->createRoomsAndBeds($dorm5, 25, 1000000, 2000000, $occupants, 10);
    }

    /**
     * Create rooms and beds for a dormitory.
     */
    private function createRoomsAndBeds(
        Dormitory $dormitory,
        int $totalRooms,
        int $minPrice,
        int $maxPrice,
        $occupants,
        int $occupiedCount
    ): void {
        $roomTypes = ['single', 'double', 'dorm'];
        $roomConfig = [
            'single' => ['capacity' => 1, 'beds' => 1, 'area' => 12.0],
            'double' => ['capacity' => 2, 'beds' => 2, 'area' => 18.0],
            'dorm' => ['capacity' => 4, 'beds' => 4, 'area' => 28.0],
        ];

        $occupiedSoFar = 0;
        $occupantIndex = 0;

        for ($i = 1; $i <= $totalRooms; $i++) {
            $floor = (int) ceil($i / 5);
            $roomNumber = chr(64 + $floor) . str_pad($i, 2, '0', STR_PAD_LEFT);

            // Distribute room types: 30% single, 40% double, 30% dorm
            if ($i <= (int) ceil($totalRooms * 0.3)) {
                $type = 'single';
            } elseif ($i <= (int) ceil($totalRooms * 0.7)) {
                $type = 'double';
            } else {
                $type = 'dorm';
            }

            $config = $roomConfig[$type];
            $priceRange = $maxPrice - $minPrice;
            $price = $minPrice + (int) ($priceRange * ($type === 'single' ? 0.3 : ($type === 'double' ? 0.6 : 1.0)));

            // Determine room status
            $isOccupied = $occupiedSoFar < $occupiedCount && rand(0, 2) > 0;
            $roomOccupancy = 0;

            $room = Room::create([
                'dormitory_id' => $dormitory->id,
                'room_number' => $roomNumber,
                'floor' => $floor,
                'room_type' => $type,
                'area_sqm' => $config['area'],
                'capacity' => $config['capacity'],
                'current_occupancy' => 0, // Will be updated after beds
                'price' => $price,
                'amenities' => json_encode($this->getRoomAmenities($type)),
                'status' => $isOccupied ? 'occupied' : 'available',
            ]);

            // Create beds for the room
            for ($b = 1; $b <= $config['beds']; $b++) {
                $bedPosition = match ($type) {
                    'single' => 'single',
                    'double' => 'single',
                    'dorm' => $b <= 2 ? 'upper' : 'lower',
                };

                $bedPrice = (int) ($price / $config['beds']);
                $bedOccupied = $isOccupied && $b <= rand(1, $config['beds']) && $occupiedSoFar < $occupiedCount;

                $currentOccupantId = null;
                if ($bedOccupied && $occupants->count() > 0 && $occupantIndex < $occupants->count()) {
                    $currentOccupantId = $occupants[$occupantIndex % $occupants->count()]->id;
                    $occupantIndex++;
                    $occupiedSoFar++;
                    $roomOccupancy++;
                }

                Bed::create([
                    'room_id' => $room->id,
                    'bed_number' => 'G' . $b,
                    'bed_position' => $bedPosition,
                    'price' => $bedPrice,
                    'status' => $bedOccupied ? 'occupied' : ($rand = rand(0, 20) === 0 ? 'maintenance' : 'available'),
                    'current_occupant_id' => $currentOccupantId,
                ]);
            }

            // Update room occupancy
            if ($roomOccupancy > 0) {
                $room->update(['current_occupancy' => $roomOccupancy]);
            }
        }
    }

    /**
     * Get amenities based on room type.
     */
    private function getRoomAmenities(string $type): array
    {
        $base = ['Tủ quần áo', 'Quạt trần'];
        return match ($type) {
            'single' => array_merge($base, ['Bàn học', 'Giường đơn']),
            'double' => array_merge($base, ['Bàn làm việc', '2 giường đơn', 'Kệ sách']),
            'dorm' => array_merge($base, ['Giường tầng', 'Tủ cá nhân', 'Thang leo']),
        };
    }
}
