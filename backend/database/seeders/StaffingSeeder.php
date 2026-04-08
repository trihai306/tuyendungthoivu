<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class StaffingSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Get staff users for references
        $adminUser = DB::table('users')->where('employee_code', 'NV001')->first();
        $managerUser = DB::table('users')->where('employee_code', 'NV003')->first();
        $recruiter1 = DB::table('users')->where('employee_code', 'NV005')->first();
        $recruiter2 = DB::table('users')->where('employee_code', 'NV006')->first();
        $recruiter3 = DB::table('users')->where('employee_code', 'NV007')->first();
        $recruiter4 = DB::table('users')->where('employee_code', 'NV008')->first();

        $recruiterIds = array_filter([
            $recruiter1?->id,
            $recruiter2?->id,
            $recruiter3?->id,
            $recruiter4?->id,
        ]);
        $managerIds = array_filter([$managerUser?->id, $adminUser?->id]);

        // ================================================================
        // 1. SKILLS CATALOG
        // ================================================================
        $skillsData = [
            ['name' => 'Bốc xếp hàng hóa', 'category' => 'Lao động phổ thông', 'sort_order' => 1],
            ['name' => 'Phụ bàn / Phục vụ', 'category' => 'Dịch vụ F&B', 'sort_order' => 2],
            ['name' => 'Đóng gói sản phẩm', 'category' => 'Lao động phổ thông', 'sort_order' => 3],
            ['name' => 'Bảo vệ / An ninh', 'category' => 'Bảo vệ', 'sort_order' => 4],
            ['name' => 'Lái xe tải nhẹ', 'category' => 'Vận tải', 'sort_order' => 5],
            ['name' => 'Nấu ăn cơ bản', 'category' => 'Dịch vụ F&B', 'sort_order' => 6],
            ['name' => 'Dọn phòng khách sạn', 'category' => 'Dịch vụ', 'sort_order' => 7],
            ['name' => 'Phụ hồ / Xây dựng', 'category' => 'Xây dựng', 'sort_order' => 8],
            ['name' => 'Giám sát công nhân', 'category' => 'Quản lý', 'sort_order' => 9],
            ['name' => 'Kiểm hàng / QC', 'category' => 'Lao động phổ thông', 'sort_order' => 10],
            ['name' => 'Lắp ráp linh kiện', 'category' => 'Sản xuất', 'sort_order' => 11],
            ['name' => 'Nhân viên kho', 'category' => 'Lao động phổ thông', 'sort_order' => 12],
            ['name' => 'PG / Tiếp thị', 'category' => 'Marketing', 'sort_order' => 13],
            ['name' => 'Rửa chén / Vệ sinh', 'category' => 'Dịch vụ', 'sort_order' => 14],
            ['name' => 'Pha chế cơ bản', 'category' => 'Dịch vụ F&B', 'sort_order' => 15],
        ];

        $skillIds = [];
        foreach ($skillsData as $skill) {
            $id = Str::uuid()->toString();
            $skillIds[$skill['name']] = $id;
            DB::table('skills')->insert([
                'id' => $id,
                'name' => $skill['name'],
                'category' => $skill['category'],
                'is_active' => true,
                'sort_order' => $skill['sort_order'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // ================================================================
        // 2. CLIENTS (10 companies)
        // ================================================================
        $salesUserId = $recruiter1?->id ?? $adminUser?->id;

        $clientsData = [
            [
                'company_name' => 'Công ty TNHH Thực phẩm Việt Hưng',
                'tax_code' => '0301234567',
                'industry' => 'Sản xuất thực phẩm',
                'company_size' => 'large',
                'address' => '88 Đường Nguyễn Huệ, Quận 1',
                'district' => 'Quận 1',
                'city' => 'Hồ Chí Minh',
                'contact_name' => 'Nguyễn Văn Phong',
                'contact_phone' => '0965200001',
                'contact_email' => 'phong@viethung.vn',
                'website' => 'https://viethung.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Khách sạn Sunrise Đà Nẵng',
                'tax_code' => '0401567890',
                'industry' => 'Khách sạn / Nhà hàng',
                'company_size' => 'medium',
                'address' => '120 Võ Nguyên Giáp, Sơn Trà',
                'district' => 'Sơn Trà',
                'city' => 'Đà Nẵng',
                'contact_name' => 'Trần Minh Đức',
                'contact_phone' => '0965200002',
                'contact_email' => 'duc@sunrisehotel.vn',
                'website' => 'https://sunrisehotel.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Siêu thị MegaMart',
                'tax_code' => '0101234890',
                'industry' => 'Bán lẻ',
                'company_size' => 'large',
                'address' => '25 Láng Hạ, Ba Đình',
                'district' => 'Ba Đình',
                'city' => 'Hà Nội',
                'contact_name' => 'Lê Thanh Hằng',
                'contact_phone' => '0965200003',
                'contact_email' => 'hang@megamart.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Nhà máy Samsung HCMC CE Complex',
                'tax_code' => '3602345678',
                'industry' => 'Sản xuất điện tử',
                'company_size' => 'large',
                'address' => 'Khu chế xuất Tân Thuận, Quận 7',
                'district' => 'Quận 7',
                'city' => 'Hồ Chí Minh',
                'contact_name' => 'Phạm Quốc Anh',
                'contact_phone' => '0965200004',
                'contact_email' => 'anh.pham@samsung-ce.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Công ty CP Sự kiện Golden Gate',
                'tax_code' => '0302345670',
                'industry' => 'Sự kiện / F&B',
                'company_size' => 'medium',
                'address' => '198 Trần Hưng Đạo, Quận 5',
                'district' => 'Quận 5',
                'city' => 'Hồ Chí Minh',
                'contact_name' => 'Huỳnh Thị Ngọc Trâm',
                'contact_phone' => '0965200005',
                'contact_email' => 'tram@goldengate.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Công ty TNHH Logistics Tân Cảng',
                'tax_code' => '0303456789',
                'industry' => 'Logistics / Kho vận',
                'company_size' => 'large',
                'address' => '722 Điện Biên Phủ, Bình Thạnh',
                'district' => 'Bình Thạnh',
                'city' => 'Hồ Chí Minh',
                'contact_name' => 'Võ Minh Trí',
                'contact_phone' => '0965200006',
                'contact_email' => 'tri@tancang-logistics.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Khu Công nghiệp Amata Đồng Nai',
                'tax_code' => '3601567890',
                'industry' => 'Khu công nghiệp',
                'company_size' => 'large',
                'address' => 'Km 31 QL1A, Long Bình, Biên Hòa',
                'district' => 'Biên Hòa',
                'city' => 'Đồng Nai',
                'contact_name' => 'Đặng Thị Minh Châu',
                'contact_phone' => '0965200007',
                'contact_email' => 'chau@amata.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Resort Biển Xanh Nha Trang',
                'tax_code' => '4201234567',
                'industry' => 'Du lịch / Resort',
                'company_size' => 'medium',
                'address' => '68 Trần Phú, Vĩnh Hải',
                'district' => 'Vĩnh Hải',
                'city' => 'Nha Trang',
                'contact_name' => 'Nguyễn Đình Khoa',
                'contact_phone' => '0965200008',
                'contact_email' => 'khoa@bienxanh.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Công ty XD Hòa Bình',
                'tax_code' => '0304567890',
                'industry' => 'Xây dựng',
                'company_size' => 'large',
                'address' => '235 Lý Chính Thắng, Quận 3',
                'district' => 'Quận 3',
                'city' => 'Hồ Chí Minh',
                'contact_name' => 'Lý Quang Huy',
                'contact_phone' => '0965200009',
                'contact_email' => 'huy@hbc.vn',
                'status' => 'active',
            ],
            [
                'company_name' => 'Công ty TNHH May mặc Đại Phát',
                'tax_code' => '3700234567',
                'industry' => 'May mặc / Dệt may',
                'company_size' => 'medium',
                'address' => 'Lô C2, KCN Sóng Thần, Dĩ An',
                'district' => 'Dĩ An',
                'city' => 'Bình Dương',
                'contact_name' => 'Bùi Hồng Sơn',
                'contact_phone' => '0965200010',
                'contact_email' => 'son@daiphat.vn',
                'status' => 'prospect',
            ],
        ];

        $clientIds = [];
        foreach ($clientsData as $client) {
            $id = Str::uuid()->toString();
            $clientIds[] = $id;
            DB::table('clients')->insert(array_merge($client, [
                'id' => $id,
                'created_by' => $salesUserId,
                'created_at' => $now->copy()->subDays(rand(30, 180)),
                'updated_at' => $now,
            ]));
        }

        // ================================================================
        // 3. CLIENT CONTRACTS (5 contracts)
        // ================================================================
        $contractIds = [];
        $contractsData = [
            [
                'client_idx' => 0,
                'contract_number' => 'HD-2025-001',
                'type' => 'framework',
                'start_date' => '2025-01-01',
                'end_date' => '2025-12-31',
                'markup_percentage' => 15.00,
                'payment_terms' => 30,
                'value' => 500000000.00,
                'status' => 'active',
            ],
            [
                'client_idx' => 1,
                'contract_number' => 'HD-2025-002',
                'type' => 'framework',
                'start_date' => '2025-03-01',
                'end_date' => '2025-12-31',
                'markup_percentage' => 12.00,
                'payment_terms' => 15,
                'value' => 200000000.00,
                'status' => 'active',
            ],
            [
                'client_idx' => 3,
                'contract_number' => 'HD-2025-003',
                'type' => 'framework',
                'start_date' => '2025-02-01',
                'end_date' => '2026-01-31',
                'markup_percentage' => 18.00,
                'payment_terms' => 30,
                'value' => 1200000000.00,
                'status' => 'active',
            ],
            [
                'client_idx' => 5,
                'contract_number' => 'HD-2025-004',
                'type' => 'per_order',
                'start_date' => '2025-06-01',
                'end_date' => null,
                'markup_percentage' => 10.00,
                'payment_terms' => 7,
                'value' => null,
                'status' => 'active',
            ],
            [
                'client_idx' => 8,
                'contract_number' => 'HD-2024-010',
                'type' => 'framework',
                'start_date' => '2024-06-01',
                'end_date' => '2025-05-31',
                'markup_percentage' => 20.00,
                'payment_terms' => 30,
                'value' => 800000000.00,
                'status' => 'expired',
            ],
        ];

        foreach ($contractsData as $contract) {
            $id = Str::uuid()->toString();
            $contractIds[] = $id;
            $clientIdx = $contract['client_idx'];
            unset($contract['client_idx']);

            DB::table('client_contracts')->insert(array_merge($contract, [
                'id' => $id,
                'client_id' => $clientIds[$clientIdx],
                'approved_by' => $managerUser?->id,
                'approved_at' => $contract['status'] === 'active' ? $now->copy()->subDays(rand(10, 60)) : null,
                'created_by' => $salesUserId,
                'created_at' => $now->copy()->subDays(rand(30, 200)),
                'updated_at' => $now,
            ]));
        }

        // ================================================================
        // 4. WORKERS (30 workers)
        // ================================================================
        $workersData = [
            ['full_name' => 'Nguyễn Văn An', 'dob' => '1995-03-15', 'gender' => 'male', 'phone' => '0901000001', 'id_number' => '079095001001', 'district' => 'Quận 7', 'city' => 'Hồ Chí Minh', 'skills' => ['Bốc xếp hàng hóa', 'Nhân viên kho'], 'status' => 'available'],
            ['full_name' => 'Trần Thị Bích', 'dob' => '1998-07-22', 'gender' => 'female', 'phone' => '0901000002', 'id_number' => '079098002002', 'district' => 'Quận 1', 'city' => 'Hồ Chí Minh', 'skills' => ['Phụ bàn / Phục vụ', 'Pha chế cơ bản'], 'status' => 'assigned'],
            ['full_name' => 'Lê Minh Cường', 'dob' => '1990-11-08', 'gender' => 'male', 'phone' => '0901000003', 'id_number' => '079090003003', 'district' => 'Bình Thạnh', 'city' => 'Hồ Chí Minh', 'skills' => ['Lái xe tải nhẹ', 'Bốc xếp hàng hóa'], 'status' => 'available'],
            ['full_name' => 'Phạm Thị Dung', 'dob' => '1997-01-30', 'gender' => 'female', 'phone' => '0901000004', 'id_number' => '079097004004', 'district' => 'Thủ Đức', 'city' => 'Hồ Chí Minh', 'skills' => ['Đóng gói sản phẩm', 'Kiểm hàng / QC'], 'status' => 'available'],
            ['full_name' => 'Hoàng Văn Em', 'dob' => '1993-05-12', 'gender' => 'male', 'phone' => '0901000005', 'id_number' => '079093005005', 'district' => 'Quận 12', 'city' => 'Hồ Chí Minh', 'skills' => ['Bảo vệ / An ninh', 'Giám sát công nhân'], 'status' => 'assigned'],
            ['full_name' => 'Vũ Thị Phương', 'dob' => '1999-09-18', 'gender' => 'female', 'phone' => '0901000006', 'id_number' => '079099006006', 'district' => 'Quận 3', 'city' => 'Hồ Chí Minh', 'skills' => ['PG / Tiếp thị', 'Phụ bàn / Phục vụ'], 'status' => 'available'],
            ['full_name' => 'Đỗ Quốc Giang', 'dob' => '1991-02-25', 'gender' => 'male', 'phone' => '0901000007', 'id_number' => '079091007007', 'district' => 'Biên Hòa', 'city' => 'Đồng Nai', 'skills' => ['Phụ hồ / Xây dựng', 'Bốc xếp hàng hóa'], 'status' => 'available'],
            ['full_name' => 'Nguyễn Thị Hoa', 'dob' => '1996-12-05', 'gender' => 'female', 'phone' => '0901000008', 'id_number' => '079096008008', 'district' => 'Dĩ An', 'city' => 'Bình Dương', 'skills' => ['Đóng gói sản phẩm', 'Lắp ráp linh kiện'], 'status' => 'assigned'],
            ['full_name' => 'Trần Văn Ích', 'dob' => '1994-08-14', 'gender' => 'male', 'phone' => '0901000009', 'id_number' => '079094009009', 'district' => 'Gò Vấp', 'city' => 'Hồ Chí Minh', 'skills' => ['Nhân viên kho', 'Bốc xếp hàng hóa', 'Lái xe tải nhẹ'], 'status' => 'available'],
            ['full_name' => 'Lý Thị Kim', 'dob' => '2000-04-20', 'gender' => 'female', 'phone' => '0901000010', 'id_number' => '079000010010', 'district' => 'Quận 10', 'city' => 'Hồ Chí Minh', 'skills' => ['Dọn phòng khách sạn', 'Rửa chén / Vệ sinh'], 'status' => 'available'],
            ['full_name' => 'Bùi Văn Long', 'dob' => '1988-06-11', 'gender' => 'male', 'phone' => '0901000011', 'id_number' => '079088011011', 'district' => 'Tân Phú', 'city' => 'Hồ Chí Minh', 'skills' => ['Bảo vệ / An ninh'], 'status' => 'available'],
            ['full_name' => 'Ngô Thị Mai', 'dob' => '1997-10-03', 'gender' => 'female', 'phone' => '0901000012', 'id_number' => '079097012012', 'district' => 'Quận 5', 'city' => 'Hồ Chí Minh', 'skills' => ['Nấu ăn cơ bản', 'Phụ bàn / Phục vụ'], 'status' => 'available'],
            ['full_name' => 'Phan Thanh Nam', 'dob' => '1992-03-27', 'gender' => 'male', 'phone' => '0901000013', 'id_number' => '079092013013', 'district' => 'Thuận An', 'city' => 'Bình Dương', 'skills' => ['Lắp ráp linh kiện', 'Đóng gói sản phẩm', 'Kiểm hàng / QC'], 'status' => 'assigned'],
            ['full_name' => 'Đặng Thị Oanh', 'dob' => '1995-11-16', 'gender' => 'female', 'phone' => '0901000014', 'id_number' => '079095014014', 'district' => 'Quận 2', 'city' => 'Hồ Chí Minh', 'skills' => ['PG / Tiếp thị'], 'status' => 'available'],
            ['full_name' => 'Lê Hữu Phúc', 'dob' => '1989-07-09', 'gender' => 'male', 'phone' => '0901000015', 'id_number' => '079089015015', 'district' => 'Quận 9', 'city' => 'Hồ Chí Minh', 'skills' => ['Giám sát công nhân', 'Bốc xếp hàng hóa'], 'status' => 'available'],
            ['full_name' => 'Trương Thị Quỳnh', 'dob' => '1998-02-14', 'gender' => 'female', 'phone' => '0901000016', 'id_number' => '079098016016', 'district' => 'Sơn Trà', 'city' => 'Đà Nẵng', 'skills' => ['Dọn phòng khách sạn', 'Phụ bàn / Phục vụ'], 'status' => 'available'],
            ['full_name' => 'Hồ Văn Rạng', 'dob' => '1993-09-01', 'gender' => 'male', 'phone' => '0901000017', 'id_number' => '079093017017', 'district' => 'Hải Châu', 'city' => 'Đà Nẵng', 'skills' => ['Bốc xếp hàng hóa', 'Nhân viên kho'], 'status' => 'available'],
            ['full_name' => 'Nguyễn Thị Sen', 'dob' => '2001-05-28', 'gender' => 'female', 'phone' => '0901000018', 'id_number' => '079001018018', 'district' => 'Tân Bình', 'city' => 'Hồ Chí Minh', 'skills' => ['Pha chế cơ bản', 'Phụ bàn / Phục vụ'], 'status' => 'available'],
            ['full_name' => 'Cao Văn Thắng', 'dob' => '1987-12-19', 'gender' => 'male', 'phone' => '0901000019', 'id_number' => '079087019019', 'district' => 'Bình Tân', 'city' => 'Hồ Chí Minh', 'skills' => ['Phụ hồ / Xây dựng', 'Lái xe tải nhẹ'], 'status' => 'inactive'],
            ['full_name' => 'Mai Thị Uyên', 'dob' => '1996-08-07', 'gender' => 'female', 'phone' => '0901000020', 'id_number' => '079096020020', 'district' => 'Quận 4', 'city' => 'Hồ Chí Minh', 'skills' => ['Đóng gói sản phẩm', 'Nhân viên kho'], 'status' => 'available'],
            ['full_name' => 'Đinh Công Vinh', 'dob' => '1994-01-23', 'gender' => 'male', 'phone' => '0901000021', 'id_number' => '079094021021', 'district' => 'Quận 6', 'city' => 'Hồ Chí Minh', 'skills' => ['Bốc xếp hàng hóa', 'Đóng gói sản phẩm'], 'status' => 'available'],
            ['full_name' => 'Trần Thị Xuyến', 'dob' => '1999-06-15', 'gender' => 'female', 'phone' => '0901000022', 'id_number' => '079099022022', 'district' => 'Nhà Bè', 'city' => 'Hồ Chí Minh', 'skills' => ['Rửa chén / Vệ sinh', 'Dọn phòng khách sạn'], 'status' => 'available'],
            ['full_name' => 'Phạm Anh Yên', 'dob' => '1991-04-02', 'gender' => 'male', 'phone' => '0901000023', 'id_number' => '079091023023', 'district' => 'Cần Giờ', 'city' => 'Hồ Chí Minh', 'skills' => ['Bảo vệ / An ninh', 'Bốc xếp hàng hóa'], 'status' => 'available'],
            ['full_name' => 'Huỳnh Thị Ánh', 'dob' => '2000-10-10', 'gender' => 'female', 'phone' => '0901000024', 'id_number' => '079000024024', 'district' => 'Vĩnh Hải', 'city' => 'Nha Trang', 'skills' => ['Phụ bàn / Phục vụ', 'Dọn phòng khách sạn'], 'status' => 'available'],
            ['full_name' => 'Lương Văn Bảo', 'dob' => '1990-08-30', 'gender' => 'male', 'phone' => '0901000025', 'id_number' => '079090025025', 'district' => 'Quận 8', 'city' => 'Hồ Chí Minh', 'skills' => ['Lái xe tải nhẹ', 'Nhân viên kho', 'Bốc xếp hàng hóa'], 'status' => 'available'],
            ['full_name' => 'Tô Thị Cẩm', 'dob' => '1997-02-18', 'gender' => 'female', 'phone' => '0901000026', 'id_number' => '079097026026', 'district' => 'Quận 11', 'city' => 'Hồ Chí Minh', 'skills' => ['Nấu ăn cơ bản', 'Rửa chén / Vệ sinh'], 'status' => 'available'],
            ['full_name' => 'Nguyễn Hải Đăng', 'dob' => '1993-12-12', 'gender' => 'male', 'phone' => '0901000027', 'id_number' => '079093027027', 'district' => 'Thủ Dầu Một', 'city' => 'Bình Dương', 'skills' => ['Lắp ráp linh kiện', 'Kiểm hàng / QC'], 'status' => 'available'],
            ['full_name' => 'Võ Thị Hạnh', 'dob' => '1995-07-05', 'gender' => 'female', 'phone' => '0901000028', 'id_number' => '079095028028', 'district' => 'Quận Phú Nhuận', 'city' => 'Hồ Chí Minh', 'skills' => ['PG / Tiếp thị', 'Phụ bàn / Phục vụ'], 'status' => 'available'],
            ['full_name' => 'Trịnh Văn Khải', 'dob' => '1986-11-25', 'gender' => 'male', 'phone' => '0901000029', 'id_number' => '079086029029', 'district' => 'Quận 7', 'city' => 'Hồ Chí Minh', 'skills' => ['Giám sát công nhân', 'Bảo vệ / An ninh'], 'status' => 'blacklisted'],
            ['full_name' => 'Đoàn Thị Liên', 'dob' => '1998-09-09', 'gender' => 'female', 'phone' => '0901000030', 'id_number' => '079098030030', 'district' => 'Tân Phú', 'city' => 'Hồ Chí Minh', 'skills' => ['Đóng gói sản phẩm', 'Kiểm hàng / QC'], 'status' => 'available'],
        ];

        $workerIds = [];
        $workerNum = 1;
        foreach ($workersData as $w) {
            $id = Str::uuid()->toString();
            $workerIds[] = $id;
            $workerCode = 'WK-' . str_pad($workerNum, 5, '0', STR_PAD_LEFT);

            $registeredBy = $recruiterIds[array_rand($recruiterIds)] ?? null;

            DB::table('workers')->insert([
                'id' => $id,
                'worker_code' => $workerCode,
                'full_name' => $w['full_name'],
                'date_of_birth' => $w['dob'],
                'gender' => $w['gender'],
                'id_number' => $w['id_number'],
                'phone' => $w['phone'],
                'address' => $w['district'] . ', ' . $w['city'],
                'district' => $w['district'],
                'city' => $w['city'],
                'availability' => 'full_time',
                'preferred_districts' => json_encode([$w['district']]),
                'bank_name' => ['Vietcombank', 'BIDV', 'Techcombank', 'VPBank', 'ACB'][rand(0, 4)],
                'bank_account' => '0' . rand(100000000, 999999999),
                'bank_account_name' => strtoupper($this->removeDiacritics($w['full_name'])),
                'total_orders' => rand(0, 20),
                'total_days_worked' => rand(0, 200),
                'average_rating' => round(rand(30, 50) / 10, 1),
                'no_show_count' => rand(0, 3),
                'last_worked_date' => $w['status'] === 'assigned' ? $now->copy()->subDays(rand(0, 3))->toDateString() : ($w['status'] === 'available' ? $now->copy()->subDays(rand(5, 60))->toDateString() : null),
                'status' => $w['status'],
                'blacklist_reason' => $w['status'] === 'blacklisted' ? 'Trộm cắp tài sản tại nơi làm việc' : null,
                'registered_by' => $registeredBy,
                'emergency_contact_name' => 'Người thân ' . $w['full_name'],
                'emergency_contact_phone' => '090' . rand(1000000, 9999999),
                'created_at' => $now->copy()->subDays(rand(30, 365)),
                'updated_at' => $now,
            ]);

            // Attach skills
            foreach ($w['skills'] as $skillName) {
                if (isset($skillIds[$skillName])) {
                    DB::table('worker_skill')->insert([
                        'worker_id' => $id,
                        'skill_id' => $skillIds[$skillName],
                        'level' => ['beginner', 'intermediate', 'advanced'][rand(0, 2)],
                        'years_experience' => round(rand(5, 50) / 10, 1),
                        'created_at' => $now,
                    ]);
                }
            }

            $workerNum++;
        }

        // ================================================================
        // 5. STAFFING ORDERS (15 orders)
        // ================================================================
        $ordersData = [
            ['client_idx' => 0, 'contract_idx' => 0, 'position' => 'Công nhân đóng gói thực phẩm', 'qty' => 10, 'filled' => 10, 'city' => 'Hồ Chí Minh', 'district' => 'Quận 1', 'status' => 'completed', 'urgency' => 'normal', 'service_type' => 'short_term', 'rate' => 250000, 'start' => -45, 'end' => -15],
            ['client_idx' => 0, 'contract_idx' => 0, 'position' => 'Nhân viên kho bốc xếp', 'qty' => 5, 'filled' => 5, 'city' => 'Hồ Chí Minh', 'district' => 'Quận 1', 'status' => 'in_progress', 'urgency' => 'normal', 'service_type' => 'long_term', 'rate' => 280000, 'start' => -10, 'end' => 20],
            ['client_idx' => 1, 'contract_idx' => 1, 'position' => 'Nhân viên phục vụ nhà hàng', 'qty' => 8, 'filled' => 6, 'city' => 'Đà Nẵng', 'district' => 'Sơn Trà', 'status' => 'recruiting', 'urgency' => 'urgent', 'service_type' => 'shift_based', 'rate' => 200000, 'start' => 3, 'end' => 33],
            ['client_idx' => 1, 'contract_idx' => 1, 'position' => 'Nhân viên dọn phòng khách sạn', 'qty' => 4, 'filled' => 4, 'city' => 'Đà Nẵng', 'district' => 'Sơn Trà', 'status' => 'filled', 'urgency' => 'normal', 'service_type' => 'short_term', 'rate' => 220000, 'start' => 5, 'end' => 35],
            ['client_idx' => 2, 'contract_idx' => null, 'position' => 'Nhân viên sắp xếp kệ hàng', 'qty' => 15, 'filled' => 0, 'city' => 'Hà Nội', 'district' => 'Ba Đình', 'status' => 'pending', 'urgency' => 'urgent', 'service_type' => 'project_based', 'rate' => 230000, 'start' => 7, 'end' => 14],
            ['client_idx' => 3, 'contract_idx' => 2, 'position' => 'Công nhân lắp ráp linh kiện', 'qty' => 20, 'filled' => 18, 'city' => 'Hồ Chí Minh', 'district' => 'Quận 7', 'status' => 'in_progress', 'urgency' => 'normal', 'service_type' => 'long_term', 'rate' => 300000, 'start' => -30, 'end' => 60],
            ['client_idx' => 3, 'contract_idx' => 2, 'position' => 'Nhân viên kiểm tra chất lượng QC', 'qty' => 5, 'filled' => 5, 'city' => 'Hồ Chí Minh', 'district' => 'Quận 7', 'status' => 'completed', 'urgency' => 'normal', 'service_type' => 'short_term', 'rate' => 320000, 'start' => -60, 'end' => -30],
            ['client_idx' => 4, 'contract_idx' => null, 'position' => 'PG / Nhân viên sự kiện', 'qty' => 12, 'filled' => 0, 'city' => 'Hồ Chí Minh', 'district' => 'Quận 5', 'status' => 'draft', 'urgency' => 'critical', 'service_type' => 'short_term', 'rate' => 350000, 'start' => 2, 'end' => 4],
            ['client_idx' => 5, 'contract_idx' => 3, 'position' => 'Nhân viên bốc xếp kho hàng', 'qty' => 8, 'filled' => 8, 'city' => 'Hồ Chí Minh', 'district' => 'Bình Thạnh', 'status' => 'in_progress', 'urgency' => 'normal', 'service_type' => 'shift_based', 'rate' => 270000, 'start' => -5, 'end' => 25],
            ['client_idx' => 6, 'contract_idx' => null, 'position' => 'Công nhân sản xuất KCN', 'qty' => 30, 'filled' => 12, 'city' => 'Đồng Nai', 'district' => 'Biên Hòa', 'status' => 'recruiting', 'urgency' => 'urgent', 'service_type' => 'long_term', 'rate' => 260000, 'start' => 5, 'end' => 95],
            ['client_idx' => 7, 'contract_idx' => null, 'position' => 'Nhân viên phục vụ resort', 'qty' => 6, 'filled' => 0, 'city' => 'Nha Trang', 'district' => 'Vĩnh Hải', 'status' => 'approved', 'urgency' => 'normal', 'service_type' => 'short_term', 'rate' => 240000, 'start' => 10, 'end' => 40],
            ['client_idx' => 8, 'contract_idx' => 4, 'position' => 'Phụ hồ xây dựng công trình', 'qty' => 10, 'filled' => 10, 'city' => 'Hồ Chí Minh', 'district' => 'Quận 3', 'status' => 'completed', 'urgency' => 'normal', 'service_type' => 'project_based', 'rate' => 280000, 'start' => -90, 'end' => -30],
            ['client_idx' => 8, 'contract_idx' => 4, 'position' => 'Công nhân sơn nước', 'qty' => 5, 'filled' => 3, 'city' => 'Hồ Chí Minh', 'district' => 'Quận 3', 'status' => 'cancelled', 'urgency' => 'normal', 'service_type' => 'short_term', 'rate' => 300000, 'start' => -20, 'end' => -5],
            ['client_idx' => 5, 'contract_idx' => 3, 'position' => 'Nhân viên bảo vệ kho hàng', 'qty' => 3, 'filled' => 3, 'city' => 'Hồ Chí Minh', 'district' => 'Bình Thạnh', 'status' => 'in_progress', 'urgency' => 'normal', 'service_type' => 'long_term', 'rate' => 250000, 'start' => -15, 'end' => 75],
            ['client_idx' => 9, 'contract_idx' => null, 'position' => 'Công nhân may mặc', 'qty' => 25, 'filled' => 0, 'city' => 'Bình Dương', 'district' => 'Dĩ An', 'status' => 'rejected', 'urgency' => 'normal', 'service_type' => 'long_term', 'rate' => 240000, 'start' => 14, 'end' => 104],
        ];

        $orderIds = [];
        $orderNum = 1;
        foreach ($ordersData as $o) {
            $id = Str::uuid()->toString();
            $orderIds[] = $id;
            $orderCode = 'DH-' . $now->format('Ymd') . '-' . str_pad($orderNum, 3, '0', STR_PAD_LEFT);
            $recruiterId = $recruiterIds[array_rand($recruiterIds)] ?? null;

            $isApproved = in_array($o['status'], ['approved', 'recruiting', 'filled', 'in_progress', 'completed']);

            DB::table('staffing_orders')->insert([
                'id' => $id,
                'order_code' => $orderCode,
                'client_id' => $clientIds[$o['client_idx']],
                'contract_id' => $o['contract_idx'] !== null ? $contractIds[$o['contract_idx']] : null,
                'position_name' => $o['position'],
                'job_description' => 'Mô tả công việc chi tiết cho vị trí ' . $o['position'],
                'work_address' => $o['district'] . ', ' . $o['city'],
                'work_district' => $o['district'],
                'work_city' => $o['city'],
                'quantity_needed' => $o['qty'],
                'quantity_filled' => $o['filled'],
                'gender_requirement' => ['any', 'male', 'female', 'any', 'any'][rand(0, 4)],
                'age_min' => 18,
                'age_max' => rand(40, 55),
                'start_date' => $now->copy()->addDays($o['start'])->toDateString(),
                'end_date' => $now->copy()->addDays($o['end'])->toDateString(),
                'shift_type' => ['morning', 'afternoon', 'double'][rand(0, 2)],
                'start_time' => '07:00',
                'end_time' => '17:00',
                'break_minutes' => 60,
                'worker_rate' => $o['rate'],
                'rate_type' => 'daily',
                'service_fee' => round($o['rate'] * 0.15),
                'service_fee_type' => 'fixed',
                'urgency' => $o['urgency'],
                'service_type' => $o['service_type'],
                'status' => $o['status'],
                'assigned_recruiter_id' => $recruiterId,
                'created_by' => $salesUserId,
                'approved_by' => $isApproved ? ($managerIds[array_rand($managerIds)] ?? null) : null,
                'approved_at' => $isApproved ? $now->copy()->subDays(rand(1, 30)) : null,
                'rejection_reason' => $o['status'] === 'rejected' ? 'Khách hàng chưa ký hợp đồng' : null,
                'cancellation_reason' => $o['status'] === 'cancelled' ? 'Khách hàng hủy dự án' : null,
                'notes' => null,
                'created_at' => $now->copy()->subDays(rand(30, 100)),
                'updated_at' => $now,
            ]);

            $orderNum++;
        }

        // ================================================================
        // 6. ASSIGNMENTS (40 assignments)
        // ================================================================
        // Map orders that should have assignments (in_progress, completed, filled, recruiting with some filled)
        $assignmentRecords = [];
        $assignmentIds = [];
        $assignmentWorkerOrderPairs = []; // track unique pairs

        // Helper: get active orders with filled workers
        $activeOrders = [
            ['order_idx' => 0, 'worker_idxs' => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'status' => 'completed'],
            ['order_idx' => 1, 'worker_idxs' => [0, 2, 8, 9, 20], 'status' => 'working'],
            ['order_idx' => 2, 'worker_idxs' => [1, 5, 11, 15, 17, 23], 'status' => 'confirmed'],
            ['order_idx' => 3, 'worker_idxs' => [9, 15, 21, 23], 'status' => 'confirmed'],
            ['order_idx' => 5, 'worker_idxs' => [3, 7, 12, 26, 27, 29, 4, 13, 19, 20, 0, 8, 14, 24, 25, 10, 21, 22], 'status' => 'working'],
            ['order_idx' => 6, 'worker_idxs' => [3, 7, 12, 26, 27], 'status' => 'completed'],
            ['order_idx' => 8, 'worker_idxs' => [0, 2, 8, 14, 20, 24, 6, 10], 'status' => 'working'],
            ['order_idx' => 11, 'worker_idxs' => [6, 18, 2, 14, 0, 8, 20, 24, 10, 22], 'status' => 'completed'],
            ['order_idx' => 13, 'worker_idxs' => [4, 10, 22], 'status' => 'working'],
        ];

        $assignmentStatuses = [
            'completed' => 'completed',
            'working' => 'working',
            'confirmed' => 'confirmed',
        ];

        foreach ($activeOrders as $ao) {
            foreach ($ao['worker_idxs'] as $workerIdx) {
                if ($workerIdx >= count($workerIds)) continue;

                $pairKey = $orderIds[$ao['order_idx']] . '-' . $workerIds[$workerIdx];
                if (isset($assignmentWorkerOrderPairs[$pairKey])) continue;
                $assignmentWorkerOrderPairs[$pairKey] = true;

                $aId = Str::uuid()->toString();
                $assignmentIds[] = $aId;
                $status = $assignmentStatuses[$ao['status']] ?? 'created';
                $assignerId = $recruiterIds[array_rand($recruiterIds)] ?? $adminUser?->id;

                DB::table('assignments')->insert([
                    'id' => $aId,
                    'order_id' => $orderIds[$ao['order_idx']],
                    'worker_id' => $workerIds[$workerIdx],
                    'assigned_by' => $assignerId,
                    'status' => $status,
                    'dispatch_info' => 'Tập trung tại ' . $ordersData[$ao['order_idx']]['district'] . ' lúc 6:45 sáng',
                    'is_reconfirmed' => in_array($status, ['working', 'completed']),
                    'reconfirmed_at' => in_array($status, ['working', 'completed']) ? $now->copy()->subDays(rand(1, 5)) : null,
                    'confirmed_at' => in_array($status, ['confirmed', 'working', 'completed']) ? $now->copy()->subDays(rand(5, 15)) : null,
                    'started_at' => in_array($status, ['working', 'completed']) ? $now->copy()->subDays(rand(1, 30)) : null,
                    'completed_at' => $status === 'completed' ? $now->copy()->subDays(rand(1, 15)) : null,
                    'created_at' => $now->copy()->subDays(rand(15, 60)),
                    'updated_at' => $now,
                ]);
            }
        }

        // ================================================================
        // 7. ATTENDANCES (100 records)
        // ================================================================
        $attendanceCount = 0;
        $attendancePairs = []; // track unique assignment_id + work_date

        foreach ($assignmentIds as $idx => $asmId) {
            if ($attendanceCount >= 100) break;

            // Get the assignment row
            $assignment = DB::table('assignments')->where('id', $asmId)->first();
            if (!$assignment || !in_array($assignment->status, ['working', 'completed'])) continue;

            // Generate 1-5 attendance days per assignment
            $daysCount = rand(1, 5);
            for ($d = 0; $d < $daysCount && $attendanceCount < 100; $d++) {
                $workDate = $now->copy()->subDays(rand(1, 30))->toDateString();
                $pairKey = $asmId . '-' . $workDate;
                if (isset($attendancePairs[$pairKey])) continue;
                $attendancePairs[$pairKey] = true;

                $attStatus = ['present', 'present', 'present', 'late', 'half_day'][rand(0, 4)];
                $checkIn = Carbon::parse($workDate . ' 07:00:00')->addMinutes($attStatus === 'late' ? rand(10, 45) : rand(0, 5));
                $checkOut = $attStatus === 'half_day'
                    ? Carbon::parse($workDate . ' 12:00:00')
                    : Carbon::parse($workDate . ' 17:00:00')->addMinutes(rand(0, 30));
                $totalHours = round($checkOut->diffInMinutes($checkIn) / 60 - 1, 1); // minus 1h break
                $overtimeHours = max(0, round($totalHours - 8, 1));

                DB::table('attendances_v2')->insert([
                    'id' => Str::uuid()->toString(),
                    'assignment_id' => $asmId,
                    'worker_id' => $assignment->worker_id,
                    'order_id' => $assignment->order_id,
                    'work_date' => $workDate,
                    'check_in_time' => $checkIn,
                    'check_in_by' => $recruiterIds[array_rand($recruiterIds)] ?? null,
                    'check_out_time' => $checkOut,
                    'check_out_by' => $recruiterIds[array_rand($recruiterIds)] ?? null,
                    'break_minutes' => 60,
                    'total_hours' => max(0, $totalHours),
                    'overtime_hours' => $overtimeHours,
                    'status' => $attStatus,
                    'is_approved' => (bool)rand(0, 1),
                    'approved_by' => rand(0, 1) ? ($managerIds[array_rand($managerIds)] ?? null) : null,
                    'approved_at' => rand(0, 1) ? $now->copy()->subDays(rand(0, 5)) : null,
                    'created_at' => $now->copy()->subDays(rand(0, 30)),
                    'updated_at' => $now,
                ]);

                $attendanceCount++;
            }
        }

        // ================================================================
        // 8. PAYROLLS (15 payrolls)
        // ================================================================
        $payrollIds = [];
        $payrollNum = 1;
        $payrollWorkers = array_slice($workerIds, 0, 15);

        foreach ($payrollWorkers as $idx => $wId) {
            $pId = Str::uuid()->toString();
            $payrollIds[] = $pId;
            $payrollCode = 'PRL-' . $now->format('Ym') . '-' . str_pad($payrollNum, 3, '0', STR_PAD_LEFT);

            $totalDays = rand(10, 26);
            $totalHours = $totalDays * 8;
            $otHours = rand(0, 20);
            $unitPrice = [250000, 280000, 300000, 320000, 260000][rand(0, 4)];
            $baseAmount = $totalDays * $unitPrice;
            $otAmount = $otHours * round($unitPrice / 8 * 1.5);
            $allowance = rand(0, 5) * 100000;
            $deduction = rand(0, 2) * 50000;
            $netAmount = $baseAmount + $otAmount + $allowance - $deduction;

            $paidStatuses = ['draft', 'draft', 'reviewed', 'approved', 'paid'];
            $pStatus = $paidStatuses[rand(0, 4)];

            DB::table('payrolls_v2')->insert([
                'id' => $pId,
                'payroll_code' => $payrollCode,
                'worker_id' => $wId,
                'order_id' => $orderIds[rand(0, min(count($orderIds) - 1, 14))],
                'period_start' => $now->copy()->startOfMonth()->subMonth()->toDateString(),
                'period_end' => $now->copy()->endOfMonth()->subMonth()->toDateString(),
                'total_days' => $totalDays,
                'total_hours' => $totalHours,
                'overtime_hours' => $otHours,
                'unit_price' => $unitPrice,
                'rate_type' => 'daily',
                'base_amount' => $baseAmount,
                'overtime_amount' => $otAmount,
                'allowance_amount' => $allowance,
                'deduction_amount' => $deduction,
                'net_amount' => $netAmount,
                'status' => $pStatus,
                'approved_by' => $pStatus === 'approved' || $pStatus === 'paid' ? ($managerIds[array_rand($managerIds)] ?? null) : null,
                'approved_at' => $pStatus === 'approved' || $pStatus === 'paid' ? $now->copy()->subDays(rand(1, 10)) : null,
                'paid_at' => $pStatus === 'paid' ? $now->copy()->subDays(rand(1, 5)) : null,
                'payment_method' => $pStatus === 'paid' ? (['cash', 'bank_transfer'][rand(0, 1)]) : null,
                'payment_reference' => $pStatus === 'paid' ? 'TXN-' . rand(100000, 999999) : null,
                'created_by' => $adminUser?->id,
                'created_at' => $now->copy()->subDays(rand(5, 20)),
                'updated_at' => $now,
            ]);

            $payrollNum++;
        }

        // ================================================================
        // 9. INVOICES (8 invoices) + ITEMS
        // ================================================================
        $invoiceIds = [];
        $invoiceNum = 1;
        $invoiceData = [
            ['client_idx' => 0, 'status' => 'paid', 'orders' => [0]],
            ['client_idx' => 0, 'status' => 'sent', 'orders' => [1]],
            ['client_idx' => 1, 'status' => 'draft', 'orders' => [2, 3]],
            ['client_idx' => 3, 'status' => 'paid', 'orders' => [6]],
            ['client_idx' => 3, 'status' => 'approved', 'orders' => [5]],
            ['client_idx' => 5, 'status' => 'sent', 'orders' => [8, 13]],
            ['client_idx' => 8, 'status' => 'paid', 'orders' => [11]],
            ['client_idx' => 8, 'status' => 'overdue', 'orders' => [12]],
        ];

        foreach ($invoiceData as $inv) {
            $invId = Str::uuid()->toString();
            $invoiceIds[] = $invId;
            $invCode = 'INV-' . $now->format('Ym') . '-' . str_pad($invoiceNum, 3, '0', STR_PAD_LEFT);

            $subtotal = 0;
            $items = [];

            foreach ($inv['orders'] as $orderIdx) {
                if ($orderIdx >= count($ordersData)) continue;
                $o = $ordersData[$orderIdx];
                $qty = $o['filled'] > 0 ? $o['filled'] : $o['qty'];
                $days = abs($o['end'] - $o['start']);
                $unitP = $o['rate'] + round($o['rate'] * 0.15); // rate + service fee
                $amount = $qty * $days * $unitP;
                $subtotal += $amount;

                $items[] = [
                    'id' => Str::uuid()->toString(),
                    'invoice_id' => $invId,
                    'order_id' => $orderIds[$orderIdx],
                    'description' => $o['position'] . ' - ' . $qty . ' người x ' . $days . ' ngày',
                    'quantity' => $qty * $days,
                    'unit' => 'day',
                    'unit_price' => $unitP,
                    'amount' => $amount,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            $taxRate = 10.00;
            $taxAmount = round($subtotal * $taxRate / 100, 2);
            $totalAmount = $subtotal + $taxAmount;
            $paidAmount = in_array($inv['status'], ['paid']) ? $totalAmount : (in_array($inv['status'], ['partially_paid']) ? round($totalAmount / 2) : 0);

            DB::table('invoices')->insert([
                'id' => $invId,
                'invoice_number' => $invCode,
                'client_id' => $clientIds[$inv['client_idx']],
                'period_start' => $now->copy()->startOfMonth()->subMonth()->toDateString(),
                'period_end' => $now->copy()->endOfMonth()->subMonth()->toDateString(),
                'subtotal' => $subtotal,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'status' => $inv['status'],
                'due_date' => $now->copy()->addDays(rand(-10, 30))->toDateString(),
                'approved_by' => in_array($inv['status'], ['approved', 'sent', 'paid', 'overdue']) ? ($managerIds[array_rand($managerIds)] ?? null) : null,
                'approved_at' => in_array($inv['status'], ['approved', 'sent', 'paid', 'overdue']) ? $now->copy()->subDays(rand(5, 20)) : null,
                'sent_at' => in_array($inv['status'], ['sent', 'paid', 'overdue']) ? $now->copy()->subDays(rand(3, 15)) : null,
                'created_by' => $adminUser?->id,
                'created_at' => $now->copy()->subDays(rand(10, 30)),
                'updated_at' => $now,
            ]);

            foreach ($items as $item) {
                DB::table('invoice_items')->insert($item);
            }

            $invoiceNum++;
        }

        // ================================================================
        // 10. PAYMENTS (10 payments)
        // ================================================================
        $paymentNum = 0;

        // Payments for paid invoices
        foreach ($invoiceIds as $idx => $invId) {
            if ($paymentNum >= 6) break;
            $invoice = DB::table('invoices')->where('id', $invId)->first();
            if (!$invoice || !in_array($invoice->status, ['paid'])) continue;

            DB::table('payments')->insert([
                'id' => Str::uuid()->toString(),
                'payable_type' => 'invoice',
                'payable_id' => $invId,
                'amount' => $invoice->total_amount,
                'payment_method' => 'bank_transfer',
                'payment_date' => $now->copy()->subDays(rand(1, 15))->toDateString(),
                'reference_number' => 'VCB-' . rand(10000000, 99999999),
                'notes' => 'Thanh toán hóa đơn ' . $invoice->invoice_number,
                'recorded_by' => $adminUser?->id,
                'created_at' => $now->copy()->subDays(rand(1, 15)),
                'updated_at' => $now,
            ]);
            $paymentNum++;
        }

        // Payments for paid payrolls
        foreach ($payrollIds as $idx => $pId) {
            if ($paymentNum >= 10) break;
            $payroll = DB::table('payrolls_v2')->where('id', $pId)->first();
            if (!$payroll || $payroll->status !== 'paid') continue;

            DB::table('payments')->insert([
                'id' => Str::uuid()->toString(),
                'payable_type' => 'payroll',
                'payable_id' => $pId,
                'amount' => $payroll->net_amount,
                'payment_method' => $payroll->payment_method ?? 'bank_transfer',
                'payment_date' => Carbon::parse($payroll->paid_at)->toDateString(),
                'reference_number' => $payroll->payment_reference ?? 'CASH-' . rand(1000, 9999),
                'notes' => 'Trả lương worker - ' . $payroll->payroll_code,
                'recorded_by' => $adminUser?->id,
                'created_at' => $payroll->paid_at,
                'updated_at' => $now,
            ]);
            $paymentNum++;
        }

        // Fill remaining payments if needed
        while ($paymentNum < 10) {
            // Extra payment records for partially paid invoices or ad-hoc
            $targetInvId = $invoiceIds[array_rand($invoiceIds)];
            DB::table('payments')->insert([
                'id' => Str::uuid()->toString(),
                'payable_type' => 'invoice',
                'payable_id' => $targetInvId,
                'amount' => rand(1, 50) * 1000000,
                'payment_method' => ['bank_transfer', 'cash'][rand(0, 1)],
                'payment_date' => $now->copy()->subDays(rand(1, 30))->toDateString(),
                'reference_number' => 'TXN-' . rand(10000000, 99999999),
                'notes' => 'Thanh toán một phần',
                'recorded_by' => $adminUser?->id,
                'created_at' => $now->copy()->subDays(rand(1, 30)),
                'updated_at' => $now,
            ]);
            $paymentNum++;
        }

        // ================================================================
        // 11. WORKER RATINGS (for completed orders)
        // ================================================================
        $ratingPairs = [];
        $completedOrderIdxs = [0, 6, 11]; // orders with 'completed' status

        foreach ($completedOrderIdxs as $orderIdx) {
            if ($orderIdx >= count($orderIds)) continue;
            $orderId = $orderIds[$orderIdx];

            // Get assignments for this order
            $orderAssignments = DB::table('assignments')
                ->where('order_id', $orderId)
                ->where('status', 'completed')
                ->get();

            foreach ($orderAssignments as $asm) {
                $ratingKey = $asm->worker_id . '-' . $orderId;
                if (isset($ratingPairs[$ratingKey])) continue;
                $ratingPairs[$ratingKey] = true;

                $overall = rand(3, 5);
                DB::table('worker_ratings')->insert([
                    'id' => Str::uuid()->toString(),
                    'worker_id' => $asm->worker_id,
                    'order_id' => $orderId,
                    'rated_by' => $asm->assigned_by,
                    'overall_score' => $overall,
                    'punctuality' => rand(max(1, $overall - 1), 5),
                    'skill_level' => rand(max(1, $overall - 1), 5),
                    'attitude' => rand(max(1, $overall - 1), 5),
                    'diligence' => rand(max(1, $overall - 1), 5),
                    'comment' => [
                        'Làm việc chăm chỉ, đúng giờ',
                        'Hoàn thành tốt công việc được giao',
                        'Cần cải thiện tốc độ làm việc',
                        'Thái độ tốt, hòa đồng với đồng nghiệp',
                        'Có kinh nghiệm, làm việc nhanh nhẹn',
                    ][rand(0, 4)],
                    'created_at' => $now->copy()->subDays(rand(1, 30)),
                ]);
            }
        }
    }

    /**
     * Simple diacritics removal for Vietnamese names (for bank account name).
     */
    private function removeDiacritics(string $str): string
    {
        $map = [
            'à' => 'a', 'á' => 'a', 'ả' => 'a', 'ã' => 'a', 'ạ' => 'a',
            'ă' => 'a', 'ằ' => 'a', 'ắ' => 'a', 'ẳ' => 'a', 'ẵ' => 'a', 'ặ' => 'a',
            'â' => 'a', 'ầ' => 'a', 'ấ' => 'a', 'ẩ' => 'a', 'ẫ' => 'a', 'ậ' => 'a',
            'đ' => 'd',
            'è' => 'e', 'é' => 'e', 'ẻ' => 'e', 'ẽ' => 'e', 'ẹ' => 'e',
            'ê' => 'e', 'ề' => 'e', 'ế' => 'e', 'ể' => 'e', 'ễ' => 'e', 'ệ' => 'e',
            'ì' => 'i', 'í' => 'i', 'ỉ' => 'i', 'ĩ' => 'i', 'ị' => 'i',
            'ò' => 'o', 'ó' => 'o', 'ỏ' => 'o', 'õ' => 'o', 'ọ' => 'o',
            'ô' => 'o', 'ồ' => 'o', 'ố' => 'o', 'ổ' => 'o', 'ỗ' => 'o', 'ộ' => 'o',
            'ơ' => 'o', 'ờ' => 'o', 'ớ' => 'o', 'ở' => 'o', 'ỡ' => 'o', 'ợ' => 'o',
            'ù' => 'u', 'ú' => 'u', 'ủ' => 'u', 'ũ' => 'u', 'ụ' => 'u',
            'ư' => 'u', 'ừ' => 'u', 'ứ' => 'u', 'ử' => 'u', 'ữ' => 'u', 'ự' => 'u',
            'ỳ' => 'y', 'ý' => 'y', 'ỷ' => 'y', 'ỹ' => 'y', 'ỵ' => 'y',
            'À' => 'A', 'Á' => 'A', 'Ả' => 'A', 'Ã' => 'A', 'Ạ' => 'A',
            'Ă' => 'A', 'Ằ' => 'A', 'Ắ' => 'A', 'Ẳ' => 'A', 'Ẵ' => 'A', 'Ặ' => 'A',
            'Â' => 'A', 'Ầ' => 'A', 'Ấ' => 'A', 'Ẩ' => 'A', 'Ẫ' => 'A', 'Ậ' => 'A',
            'Đ' => 'D',
            'È' => 'E', 'É' => 'E', 'Ẻ' => 'E', 'Ẽ' => 'E', 'Ẹ' => 'E',
            'Ê' => 'E', 'Ề' => 'E', 'Ế' => 'E', 'Ể' => 'E', 'Ễ' => 'E', 'Ệ' => 'E',
            'Ì' => 'I', 'Í' => 'I', 'Ỉ' => 'I', 'Ĩ' => 'I', 'Ị' => 'I',
            'Ò' => 'O', 'Ó' => 'O', 'Ỏ' => 'O', 'Õ' => 'O', 'Ọ' => 'O',
            'Ô' => 'O', 'Ồ' => 'O', 'Ố' => 'O', 'Ổ' => 'O', 'Ỗ' => 'O', 'Ộ' => 'O',
            'Ơ' => 'O', 'Ờ' => 'O', 'Ớ' => 'O', 'Ở' => 'O', 'Ỡ' => 'O', 'Ợ' => 'O',
            'Ù' => 'U', 'Ú' => 'U', 'Ủ' => 'U', 'Ũ' => 'U', 'Ụ' => 'U',
            'Ư' => 'U', 'Ừ' => 'U', 'Ứ' => 'U', 'Ử' => 'U', 'Ữ' => 'U', 'Ự' => 'U',
            'Ỳ' => 'Y', 'Ý' => 'Y', 'Ỷ' => 'Y', 'Ỹ' => 'Y', 'Ỵ' => 'Y',
        ];

        return strtr($str, $map);
    }
}
