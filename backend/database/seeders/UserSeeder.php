<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch departments
        $recruitment = Department::where('name', 'Phòng Tuyển dụng')->first();
        $accommodation = Department::where('name', 'Phòng Quản lý trọ')->first();
        $operations = Department::where('name', 'Phòng Vận hành')->first();

        // Fetch teams
        $teamTdHcm = Team::where('name', 'Nhóm Tuyển dụng HCM')->first();
        $teamTdBdDn = Team::where('name', 'Nhóm Tuyển dụng Bình Dương - Đồng Nai')->first();
        $teamXetDuyet = Team::where('name', 'Nhóm Xét duyệt hồ sơ')->first();
        $teamKiemDinh = Team::where('name', 'Nhóm Kiểm định nhà trọ')->first();
        $teamHoTroThue = Team::where('name', 'Nhóm Hỗ trợ thuê trọ')->first();
        $teamKyThuat = Team::where('name', 'Nhóm Kỹ thuật')->first();
        $teamCskh = Team::where('name', 'Nhóm CSKH')->first();

        // Fetch roles
        $superAdminRole = Role::where('name', 'super_admin')->first();
        $adminRole = Role::where('name', 'admin')->first();
        $managerRole = Role::where('name', 'manager')->first();
        $recruiterRole = Role::where('name', 'recruiter')->first();
        $coordinatorRole = Role::where('name', 'coordinator')->first();
        $viewerRole = Role::where('name', 'viewer')->first();

        $password = Hash::make('123456');
        $now = now();

        // Staff users data
        $staffUsers = [
            // 1. Super Admin
            [
                'name' => 'Nguyễn Văn Hải',
                'email' => 'admin@nvtv.vn',
                'phone' => '0912345001',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $operations->id,
                'team_id' => $teamKyThuat->id,
                'position' => 'Giám đốc Vận hành',
                'employee_code' => 'NV001',
                'hire_date' => '2023-01-15',
                'is_active' => true,
                'last_login_at' => $now->copy()->subHours(2),
                '_role' => $superAdminRole,
                '_team_role' => 'lead',
            ],
            // 2. Admin
            [
                'name' => 'Trần Thị Lan',
                'email' => 'lan.tran@nvtv.vn',
                'phone' => '0912345002',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $operations->id,
                'team_id' => $teamCskh->id,
                'position' => 'Quản trị viên hệ thống',
                'employee_code' => 'NV002',
                'hire_date' => '2023-03-01',
                'is_active' => true,
                'last_login_at' => $now->copy()->subHours(5),
                '_role' => $adminRole,
                '_team_role' => 'lead',
            ],
            // 3. Manager Tuyen dung
            [
                'name' => 'Lê Hoàng Nam',
                'email' => 'nam.le@nvtv.vn',
                'phone' => '0912345003',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $recruitment->id,
                'team_id' => $teamTdHcm->id,
                'position' => 'Trưởng phòng Tuyển dụng',
                'employee_code' => 'NV003',
                'hire_date' => '2023-02-15',
                'is_active' => true,
                'last_login_at' => $now->copy()->subHours(1),
                '_role' => $managerRole,
                '_team_role' => 'lead',
            ],
            // 4. Manager Tro
            [
                'name' => 'Phạm Văn Đức',
                'email' => 'duc.pham@nvtv.vn',
                'phone' => '0912345004',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $accommodation->id,
                'team_id' => $teamKiemDinh->id,
                'position' => 'Trưởng phòng Quản lý trọ',
                'employee_code' => 'NV004',
                'hire_date' => '2023-04-01',
                'is_active' => true,
                'last_login_at' => $now->copy()->subHours(3),
                '_role' => $managerRole,
                '_team_role' => 'lead',
            ],
            // 5. Recruiter 1
            [
                'name' => 'Trần Thị Mai',
                'email' => 'mai.tran@nvtv.vn',
                'phone' => '0912345005',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $recruitment->id,
                'team_id' => $teamTdHcm->id,
                'position' => 'Nhân viên Tuyển dụng',
                'employee_code' => 'NV005',
                'hire_date' => '2023-06-01',
                'is_active' => true,
                'last_login_at' => $now->copy()->subMinutes(30),
                '_role' => $recruiterRole,
                '_team_role' => 'member',
            ],
            // 6. Recruiter 2
            [
                'name' => 'Nguyễn Minh Tuấn',
                'email' => 'tuan.nguyen@nvtv.vn',
                'phone' => '0912345006',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $recruitment->id,
                'team_id' => $teamTdBdDn->id,
                'position' => 'Nhân viên Tuyển dụng',
                'employee_code' => 'NV006',
                'hire_date' => '2023-07-15',
                'is_active' => true,
                'last_login_at' => $now->copy()->subHours(4),
                '_role' => $recruiterRole,
                '_team_role' => 'member',
            ],
            // 7. Recruiter 3
            [
                'name' => 'Phạm Thùy Dung',
                'email' => 'dung.pham@nvtv.vn',
                'phone' => '0912345007',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $recruitment->id,
                'team_id' => $teamXetDuyet->id,
                'position' => 'Nhân viên Tuyển dụng',
                'employee_code' => 'NV007',
                'hire_date' => '2023-08-01',
                'is_active' => true,
                'last_login_at' => $now->copy()->subDay(),
                '_role' => $recruiterRole,
                '_team_role' => 'lead',
            ],
            // 8. Recruiter 4
            [
                'name' => 'Đỗ Thị Lan',
                'email' => 'lan.do@nvtv.vn',
                'phone' => '0912345008',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $recruitment->id,
                'team_id' => $teamXetDuyet->id,
                'position' => 'Nhân viên Tuyển dụng',
                'employee_code' => 'NV008',
                'hire_date' => '2023-09-15',
                'is_active' => true,
                'last_login_at' => $now->copy()->subHours(6),
                '_role' => $recruiterRole,
                '_team_role' => 'member',
            ],
            // 9. Coordinator 1
            [
                'name' => 'Vũ Văn Hùng',
                'email' => 'hung.vu@nvtv.vn',
                'phone' => '0912345009',
                'password' => $password,
                'role' => 'coordinator',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $recruitment->id,
                'team_id' => $teamTdHcm->id,
                'position' => 'Điều phối viên Tuyển dụng',
                'employee_code' => 'NV009',
                'hire_date' => '2023-10-01',
                'is_active' => true,
                'last_login_at' => $now->copy()->subHours(8),
                '_role' => $coordinatorRole,
                '_team_role' => 'member',
            ],
            // 10. Coordinator 2
            [
                'name' => 'Hoàng Thị Ngọc',
                'email' => 'ngoc.hoang@nvtv.vn',
                'phone' => '0912345010',
                'password' => $password,
                'role' => 'coordinator',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $accommodation->id,
                'team_id' => $teamHoTroThue->id,
                'position' => 'Điều phối viên Quản lý trọ',
                'employee_code' => 'NV010',
                'hire_date' => '2023-11-01',
                'is_active' => true,
                'last_login_at' => $now->copy()->subDays(2),
                '_role' => $coordinatorRole,
                '_team_role' => 'lead',
            ],
            // 11. Coordinator 3
            [
                'name' => 'Trần Văn Bình',
                'email' => 'binh.tran@nvtv.vn',
                'phone' => '0912345011',
                'password' => $password,
                'role' => 'coordinator',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $operations->id,
                'team_id' => $teamCskh->id,
                'position' => 'Điều phối viên Vận hành',
                'employee_code' => 'NV011',
                'hire_date' => '2024-01-15',
                'is_active' => true,
                'last_login_at' => $now->copy()->subHours(12),
                '_role' => $coordinatorRole,
                '_team_role' => 'member',
            ],
            // 12. Viewer
            [
                'name' => 'Lý Thị Hương',
                'email' => 'huong.ly@nvtv.vn',
                'phone' => '0912345012',
                'password' => $password,
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => $now,
                'department_id' => $operations->id,
                'team_id' => null,
                'position' => 'Nhân viên theo dõi',
                'employee_code' => 'NV012',
                'hire_date' => '2024-03-01',
                'is_active' => true,
                'last_login_at' => $now->copy()->subDays(3),
                '_role' => $viewerRole,
                '_team_role' => null,
            ],
        ];

        foreach ($staffUsers as $data) {
            $roleModel = $data['_role'];
            $teamRole = $data['_team_role'];
            unset($data['_role'], $data['_team_role']);

            $user = User::create($data);

            // Attach RBAC role
            if ($roleModel) {
                $user->roles()->attach($roleModel->id);
            }

            // Attach team membership via pivot table
            if ($user->team_id && $teamRole) {
                DB::table('team_members')->insert([
                    'team_id' => $user->team_id,
                    'user_id' => $user->id,
                    'role_in_team' => $teamRole,
                    'joined_at' => $user->hire_date,
                ]);
            }
        }

        // Update department heads
        $hai = User::where('employee_code', 'NV001')->first();
        $nam = User::where('employee_code', 'NV003')->first();
        $duc = User::where('employee_code', 'NV004')->first();

        if ($hai) {
            $operations->update(['head_user_id' => $hai->id]);
        }
        if ($nam) {
            $recruitment->update(['head_user_id' => $nam->id]);
        }
        if ($duc) {
            $accommodation->update(['head_user_id' => $duc->id]);
        }

        // Update team leads
        if ($nam) {
            $teamTdHcm->update(['lead_user_id' => $nam->id]);
        }
        $tuan = User::where('employee_code', 'NV006')->first();
        if ($tuan) {
            $teamTdBdDn->update(['lead_user_id' => $tuan->id]);
        }
        $dung = User::where('employee_code', 'NV007')->first();
        if ($dung) {
            $teamXetDuyet->update(['lead_user_id' => $dung->id]);
        }
        if ($duc) {
            $teamKiemDinh->update(['lead_user_id' => $duc->id]);
        }
        $ngoc = User::where('employee_code', 'NV010')->first();
        if ($ngoc) {
            $teamHoTroThue->update(['lead_user_id' => $ngoc->id]);
        }
        $lan = User::where('employee_code', 'NV002')->first();
        if ($lan) {
            $teamCskh->update(['lead_user_id' => $lan->id]);
        }
    }
}
