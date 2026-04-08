<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class DepartmentsAndTeamsSeeder extends Seeder
{
    public function run(): void
    {
        // ── Departments ──────────────────────────────────────────────

        $recruitment = Department::create([
            'name' => 'Phòng Tuyển dụng',
            'description' => 'Quản lý toàn bộ quy trình tuyển dụng nhân viên thời vụ, từ đăng tin đến ký hợp đồng.',
            'status' => 'active',
        ]);

        $accommodation = Department::create([
            'name' => 'Phòng Quản lý trọ',
            'description' => 'Quản lý hệ thống nhà trọ liên kết, hỗ trợ nhân viên thời vụ tìm chỗ ở.',
            'status' => 'active',
        ]);

        $operations = Department::create([
            'name' => 'Phòng Vận hành',
            'description' => 'Vận hành hệ thống, hỗ trợ kỹ thuật và quản trị nền tảng.',
            'status' => 'active',
        ]);

        // ── Teams for Recruitment Department ─────────────────────────

        Team::create([
            'department_id' => $recruitment->id,
            'name' => 'Nhóm Tuyển dụng HCM',
            'description' => 'Phụ trách tuyển dụng khu vực TP. Hồ Chí Minh và vùng lân cận.',
            'status' => 'active',
        ]);

        Team::create([
            'department_id' => $recruitment->id,
            'name' => 'Nhóm Tuyển dụng Bình Dương - Đồng Nai',
            'description' => 'Phụ trách tuyển dụng khu vực Bình Dương, Đồng Nai và các tỉnh lân cận.',
            'status' => 'active',
        ]);

        Team::create([
            'department_id' => $recruitment->id,
            'name' => 'Nhóm Xét duyệt hồ sơ',
            'description' => 'Xét duyệt và sàng lọc hồ sơ ứng viên, xác minh thông tin.',
            'status' => 'active',
        ]);

        // ── Teams for Accommodation Department ───────────────────────

        Team::create([
            'department_id' => $accommodation->id,
            'name' => 'Nhóm Kiểm định nhà trọ',
            'description' => 'Khảo sát, kiểm tra và xác minh chất lượng nhà trọ liên kết.',
            'status' => 'active',
        ]);

        Team::create([
            'department_id' => $accommodation->id,
            'name' => 'Nhóm Hỗ trợ thuê trọ',
            'description' => 'Hỗ trợ nhân viên thời vụ tìm và thuê phòng trọ phù hợp.',
            'status' => 'active',
        ]);

        // ── Teams for Operations Department ──────────────────────────

        Team::create([
            'department_id' => $operations->id,
            'name' => 'Nhóm Kỹ thuật',
            'description' => 'Phát triển, bảo trì và hỗ trợ kỹ thuật cho nền tảng.',
            'status' => 'active',
        ]);

        Team::create([
            'department_id' => $operations->id,
            'name' => 'Nhóm CSKH',
            'description' => 'Chăm sóc khách hàng, xử lý khiếu nại và phản hồi.',
            'status' => 'active',
        ]);

        // Assign admin user as super_admin role
        $admin = User::where('email', 'admin@nvtv.vn')->first();
        if ($admin) {
            $superAdminRole = \App\Models\Role::where('name', 'super_admin')->first();
            if ($superAdminRole) {
                $admin->roles()->syncWithoutDetaching([$superAdminRole->id]);
            }

            // Assign admin to operations department
            $admin->update([
                'department_id' => $operations->id,
                'position' => 'Quản trị viên hệ thống',
                'employee_code' => 'NV-001',
                'hire_date' => '2024-01-01',
                'is_active' => true,
            ]);
        }
    }
}
