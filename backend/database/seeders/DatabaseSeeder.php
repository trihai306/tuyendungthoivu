<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Bed;
use App\Models\Dormitory;
use App\Models\Employer;
use App\Models\JobPost;
use App\Models\LaborContract;
use App\Models\Notification;
use App\Models\Region;
use App\Models\Room;
use App\Models\User;
use App\Models\WorkerProfile;
use App\Models\WorkerSkill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed roles and permissions first (before any user assignment)
        $this->call(RolesAndPermissionsSeeder::class);

        // Admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@nvtv.vn',
            'phone' => '0900000001',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Regions
        $hcm = Region::create(['name' => 'TP. Hồ Chí Minh', 'province' => 'Hồ Chí Minh', 'status' => 'active']);
        $bd = Region::create(['name' => 'Bình Dương', 'province' => 'Bình Dương', 'status' => 'active']);
        $dn = Region::create(['name' => 'Đồng Nai', 'province' => 'Đồng Nai', 'status' => 'active']);

        // Employer 1
        $empUser1 = User::create([
            'name' => 'Nguyễn Văn Hùng',
            'email' => 'hung@abcfood.vn',
            'phone' => '0901000001',
            'password' => Hash::make('password'),
            'role' => 'employer',
            'status' => 'active',
        ]);
        $employer1 = Employer::create([
            'user_id' => $empUser1->id,
            'company_name' => 'Công ty TNHH Thực phẩm ABC',
            'industry' => 'Thực phẩm',
            'company_size' => '100-500',
            'address' => '123 Đường Nguyễn Trãi, Q.1, TP.HCM',
            'contact_name' => 'Nguyễn Văn Hùng',
            'contact_phone' => '0901000001',
            'description' => 'Công ty chuyên sản xuất và chế biến thực phẩm xuất khẩu',
            'verified' => true,
            'verified_at' => now(),
        ]);

        // Employer 2
        $empUser2 = User::create([
            'name' => 'Trần Thị Mai',
            'email' => 'mai@xyzlogistics.vn',
            'phone' => '0901000002',
            'password' => Hash::make('password'),
            'role' => 'employer',
            'status' => 'active',
        ]);
        $employer2 = Employer::create([
            'user_id' => $empUser2->id,
            'company_name' => 'Công ty CP Logistics XYZ',
            'industry' => 'Vận tải & Logistics',
            'company_size' => '50-100',
            'address' => '456 Đại lộ Bình Dương, TX.Thuận An, Bình Dương',
            'contact_name' => 'Trần Thị Mai',
            'contact_phone' => '0901000002',
            'description' => 'Dịch vụ kho bãi và vận chuyển hàng hóa',
            'verified' => true,
            'verified_at' => now(),
        ]);

        // Workers
        $workerData = [
            ['Lê Văn An', '0902000001', 'an@gmail.com', '1995-03-15', 'Nam', 'Bốc xếp hàng hóa', 'intermediate', 2.0],
            ['Phạm Thị Bích', '0902000002', 'bich@gmail.com', '1998-07-22', 'Nữ', 'Phục vụ nhà hàng', 'beginner', 0.5],
            ['Hoàng Minh Châu', '0902000003', 'chau@gmail.com', '1993-11-10', 'Nam', 'Lái xe nâng', 'advanced', 5.0],
            ['Ngô Thị Dung', '0902000004', 'dung@gmail.com', '2000-01-05', 'Nữ', 'Đóng gói sản phẩm', 'intermediate', 1.5],
            ['Vũ Đức Em', '0902000005', 'em@gmail.com', '1997-09-28', 'Nam', 'Bảo vệ', 'beginner', 0.0],
        ];

        $workerProfiles = [];
        foreach ($workerData as $w) {
            $user = User::create([
                'name' => $w[0],
                'phone' => $w[1],
                'email' => $w[2],
                'password' => Hash::make('password'),
                'role' => 'worker',
                'status' => 'active',
            ]);

            $profile = WorkerProfile::create([
                'user_id' => $user->id,
                'full_name' => $w[0],
                'date_of_birth' => $w[3],
                'gender' => $w[4],
                'needs_housing' => rand(0, 1),
                'ekyc_status' => 'verified',
            ]);

            WorkerSkill::create([
                'worker_profile_id' => $profile->id,
                'skill_name' => $w[5],
                'level' => $w[6],
                'years' => $w[7],
            ]);

            $workerProfiles[] = $profile;
        }

        // Landlord
        $landlordUser = User::create([
            'name' => 'Bùi Thanh Hà',
            'phone' => '0903000001',
            'email' => 'ha@ktx.vn',
            'password' => Hash::make('password'),
            'role' => 'landlord',
            'status' => 'active',
        ]);

        // Dormitories
        $dorm1 = Dormitory::create([
            'landlord_id' => $landlordUser->id,
            'region_id' => $hcm->id,
            'name' => 'KTX Bình Thạnh',
            'address' => '789 Xô Viết Nghệ Tĩnh, P.26, Q. Bình Thạnh, TP.HCM',
            'total_rooms' => 20,
            'total_beds' => 80,
            'has_wifi' => true,
            'has_security' => true,
            'has_parking' => true,
            'electricity_rate' => 3500,
            'water_rate' => 15000,
            'deposit_amount' => 1000000,
            'rating' => 4.2,
            'status' => 'active',
        ]);

        $dorm2 = Dormitory::create([
            'landlord_id' => $landlordUser->id,
            'region_id' => $bd->id,
            'name' => 'Nhà trọ Thuận An',
            'address' => '55 Đường ĐT743, TX. Thuận An, Bình Dương',
            'total_rooms' => 15,
            'total_beds' => 45,
            'has_wifi' => true,
            'has_hot_water' => true,
            'has_kitchen' => true,
            'electricity_rate' => 3200,
            'water_rate' => 12000,
            'deposit_amount' => 800000,
            'rating' => 3.8,
            'status' => 'active',
        ]);

        // Rooms and Beds for Dorm 1
        foreach (range(1, 5) as $i) {
            $room = Room::create([
                'dormitory_id' => $dorm1->id,
                'room_number' => 'A' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'floor' => ceil($i / 2),
                'room_type' => 'dorm',
                'area_sqm' => 25.0,
                'capacity' => 4,
                'current_occupancy' => 0,
                'price' => 800000,
                'status' => 'available',
            ]);

            // Create 4 beds per dorm room (2 bunk beds)
            foreach (range(1, 4) as $b) {
                Bed::create([
                    'room_id' => $room->id,
                    'bed_number' => 'B' . $b,
                    'bed_position' => $b <= 2 ? 'upper' : 'lower',
                    'price' => 200000,
                    'status' => 'available',
                ]);
            }
        }

        // Rooms and Beds for Dorm 2
        foreach (range(1, 4) as $i) {
            $room = Room::create([
                'dormitory_id' => $dorm2->id,
                'room_number' => 'B' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'floor' => $i <= 2 ? 1 : 2,
                'room_type' => 'single',
                'area_sqm' => 15.0,
                'capacity' => 2,
                'current_occupancy' => 0,
                'price' => 1200000,
                'status' => 'available',
            ]);

            // Create 2 beds per single room
            foreach (range(1, 2) as $b) {
                Bed::create([
                    'room_id' => $room->id,
                    'bed_number' => 'B' . $b,
                    'bed_position' => 'single',
                    'price' => 600000,
                    'status' => 'available',
                ]);
            }
        }

        // Job Posts
        $jobs = [
            [
                'employer_id' => $employer1->id,
                'title' => 'Nhân viên kho bãi',
                'description' => 'Tiếp nhận, kiểm đếm và sắp xếp hàng hóa trong kho. Đảm bảo hàng hóa được bảo quản đúng quy cách.',
                'requirements' => 'Nam, tuổi 18-40, sức khỏe tốt, chịu khó',
                'benefits' => 'Bao ăn trưa, BHXH đầy đủ, thưởng tháng 13',
                'job_type' => 'full-time',
                'positions_count' => 10,
                'salary_type' => 'monthly',
                'salary_amount' => 7000000,
                'work_start_date' => '2024-02-01',
                'work_end_date' => '2024-12-31',
                'work_address' => 'Kho ABC, KCN Tân Bình, TP.HCM',
                'region_id' => $hcm->id,
                'has_housing' => true,
                'status' => 'published',
            ],
            [
                'employer_id' => $employer1->id,
                'title' => 'Phục vụ nhà hàng',
                'description' => 'Phục vụ bàn, dọn dẹp và hỗ trợ bếp tại nhà hàng. Ca làm việc linh hoạt.',
                'requirements' => 'Nam/Nữ, ngoại hình khá, giao tiếp tốt',
                'benefits' => 'Tip phục vụ, ăn ca, đồng phục miễn phí',
                'job_type' => 'part-time',
                'positions_count' => 5,
                'salary_type' => 'hourly',
                'salary_amount' => 30000,
                'work_start_date' => '2024-01-15',
                'work_end_date' => '2024-06-30',
                'work_address' => 'Nhà hàng ABC, Q.1, TP.HCM',
                'region_id' => $hcm->id,
                'status' => 'published',
            ],
            [
                'employer_id' => $employer2->id,
                'title' => 'Lái xe tải giao hàng',
                'description' => 'Lái xe tải giao hàng trong nội thành và liên tỉnh. Đảm bảo giao hàng đúng hẹn.',
                'requirements' => 'Có bằng lái B2 trở lên, kinh nghiệm 1 năm',
                'benefits' => 'Lương cứng + phụ cấp xăng + thưởng KPI',
                'job_type' => 'full-time',
                'positions_count' => 3,
                'salary_type' => 'monthly',
                'salary_amount' => 10000000,
                'work_start_date' => '2024-02-15',
                'work_end_date' => '2025-02-14',
                'work_address' => 'Kho XYZ, KCN VSIP, Bình Dương',
                'region_id' => $bd->id,
                'status' => 'published',
            ],
            [
                'employer_id' => $employer2->id,
                'title' => 'Công nhân đóng gói',
                'description' => 'Đóng gói sản phẩm theo quy trình. Kiểm tra chất lượng sản phẩm trước khi đóng gói.',
                'requirements' => 'Nữ ưu tiên, cẩn thận, chăm chỉ',
                'benefits' => 'BHXH, phụ cấp chuyên cần, tăng ca 150%',
                'job_type' => 'full-time',
                'positions_count' => 20,
                'salary_type' => 'monthly',
                'salary_amount' => 6500000,
                'work_start_date' => '2024-01-20',
                'work_end_date' => '2024-07-20',
                'work_address' => 'Nhà máy XYZ, KCN Amata, Đồng Nai',
                'region_id' => $dn->id,
                'has_housing' => true,
                'status' => 'published',
            ],
            [
                'employer_id' => $employer1->id,
                'title' => 'Bảo vệ ca đêm',
                'description' => 'Bảo vệ an ninh khu vực kho bãi và nhà máy. Ca đêm từ 18h-6h.',
                'requirements' => 'Nam, tuổi 20-45, sức khỏe tốt, có chứng chỉ nghiệp vụ bảo vệ',
                'benefits' => 'Phụ cấp đêm, bao ăn, chỗ nghỉ tại chỗ',
                'job_type' => 'full-time',
                'positions_count' => 4,
                'salary_type' => 'monthly',
                'salary_amount' => 7500000,
                'work_start_date' => '2024-02-01',
                'work_end_date' => '2024-12-31',
                'work_address' => 'KCN Tân Bình, TP.HCM',
                'region_id' => $hcm->id,
                'status' => 'published',
            ],
        ];

        $jobPosts = [];
        foreach ($jobs as $job) {
            $jobPosts[] = JobPost::create($job);
        }

        // Applications - ensure unique (job_post_id, worker_profile_id) pairs
        $appData = [
            ['job' => 0, 'worker' => 0, 'status' => 'new'],
            ['job' => 0, 'worker' => 1, 'status' => 'reviewing'],
            ['job' => 1, 'worker' => 0, 'status' => 'interview_invited'],
            ['job' => 1, 'worker' => 2, 'status' => 'interviewed'],
            ['job' => 2, 'worker' => 1, 'status' => 'passed'],
            ['job' => 2, 'worker' => 3, 'status' => 'rejected'],
            ['job' => 3, 'worker' => 2, 'status' => 'hired'],
            ['job' => 4, 'worker' => 4, 'status' => 'new'],
        ];
        foreach ($appData as $app) {
            Application::create([
                'job_post_id' => $jobPosts[$app['job']]->id,
                'worker_profile_id' => $workerProfiles[$app['worker']]->id,
                'cover_letter' => 'Tôi rất quan tâm đến vị trí này và mong được làm việc tại công ty.',
                'status' => $app['status'],
                'match_score' => rand(50, 95) + rand(0, 99) / 100,
                'applied_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        // Labor contract for the hired application (job 3, worker 2)
        $hiredApp = Application::where('status', 'hired')->first();
        if ($hiredApp) {
            LaborContract::create([
                'contract_number' => 'LC-2024-001',
                'application_id' => $hiredApp->id,
                'employer_id' => $employer2->id,
                'worker_profile_id' => $workerProfiles[2]->id,
                'position' => 'Công nhân đóng gói',
                'start_date' => '2024-02-01',
                'end_date' => '2024-07-20',
                'salary_type' => 'monthly',
                'salary_amount' => 6500000,
                'shift_type' => 'day',
                'work_address' => 'Nhà máy XYZ, KCN Amata, Đồng Nai',
                'terms' => ['probation_days' => 30, 'overtime_rate' => 1.5],
                'has_housing' => true,
                'status' => 'active',
                'worker_signed_at' => now()->subDays(20),
                'employer_signed_at' => now()->subDays(20),
            ]);
        }

        // Notifications
        $notifUsers = User::where('role', 'worker')->take(3)->get();
        foreach ($notifUsers as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Chào mừng bạn đến với NVTV',
                'body' => 'Hãy hoàn thiện hồ sơ để tìm được việc làm phù hợp nhất.',
                'type' => 'system',
                'is_read' => false,
            ]);
        }

        Notification::create([
            'user_id' => $empUser1->id,
            'title' => 'Có ứng viên mới',
            'body' => 'Bạn có 3 ứng viên mới ứng tuyển vào các vị trí đang tuyển.',
            'type' => 'application',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $empUser2->id,
            'title' => 'Tin tuyển dụng đã được duyệt',
            'body' => 'Tin tuyển dụng "Lái xe tải giao hàng" đã được duyệt và hiển thị công khai.',
            'type' => 'job_post',
            'is_read' => true,
            'read_at' => now(),
        ]);

        // Seed departments, teams, and assign admin role
        $this->call(DepartmentsAndTeamsSeeder::class);
    }
}
