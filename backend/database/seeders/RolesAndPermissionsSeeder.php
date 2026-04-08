<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // ── Permissions ──────────────────────────────────────────────
        $permissions = [
            // Recruitment module
            ['name' => 'jobs.view', 'display_name' => 'Xem tin tuyển dụng', 'module' => 'recruitment', 'description' => 'View job postings'],
            ['name' => 'jobs.create', 'display_name' => 'Tạo tin tuyển dụng', 'module' => 'recruitment', 'description' => 'Create job postings'],
            ['name' => 'jobs.update', 'display_name' => 'Sửa tin tuyển dụng', 'module' => 'recruitment', 'description' => 'Update job postings'],
            ['name' => 'jobs.delete', 'display_name' => 'Xóa tin tuyển dụng', 'module' => 'recruitment', 'description' => 'Delete job postings'],
            ['name' => 'jobs.approve', 'display_name' => 'Duyệt tin tuyển dụng', 'module' => 'recruitment', 'description' => 'Approve job postings'],
            ['name' => 'applications.view', 'display_name' => 'Xem hồ sơ ứng tuyển', 'module' => 'recruitment', 'description' => 'View applications'],
            ['name' => 'applications.review', 'display_name' => 'Duyệt hồ sơ ứng tuyển', 'module' => 'recruitment', 'description' => 'Review applications'],
            ['name' => 'applications.manage', 'display_name' => 'Quản lý hồ sơ ứng tuyển', 'module' => 'recruitment', 'description' => 'Full manage applications'],
            ['name' => 'interviews.view', 'display_name' => 'Xem lịch phỏng vấn', 'module' => 'recruitment', 'description' => 'View interviews'],
            ['name' => 'interviews.manage', 'display_name' => 'Quản lý phỏng vấn', 'module' => 'recruitment', 'description' => 'Manage interviews'],
            ['name' => 'contracts.view', 'display_name' => 'Xem hợp đồng lao động', 'module' => 'recruitment', 'description' => 'View labor contracts'],
            ['name' => 'contracts.manage', 'display_name' => 'Quản lý hợp đồng lao động', 'module' => 'recruitment', 'description' => 'Manage labor contracts'],

            // Accommodation module
            ['name' => 'dormitories.view', 'display_name' => 'Xem danh sách trọ', 'module' => 'accommodation', 'description' => 'View dormitories'],
            ['name' => 'dormitories.manage', 'display_name' => 'Quản lý trọ', 'module' => 'accommodation', 'description' => 'Manage dormitories'],
            ['name' => 'dormitories.verify', 'display_name' => 'Xác minh trọ', 'module' => 'accommodation', 'description' => 'Verify accommodation listings'],
            ['name' => 'rooms.view', 'display_name' => 'Xem phòng trọ', 'module' => 'accommodation', 'description' => 'View rooms'],
            ['name' => 'rooms.manage', 'display_name' => 'Quản lý phòng trọ', 'module' => 'accommodation', 'description' => 'Manage rooms'],
            ['name' => 'room_contracts.view', 'display_name' => 'Xem hợp đồng thuê phòng', 'module' => 'accommodation', 'description' => 'View room contracts'],
            ['name' => 'room_contracts.manage', 'display_name' => 'Quản lý hợp đồng thuê phòng', 'module' => 'accommodation', 'description' => 'Manage room contracts'],

            // HR module
            ['name' => 'users.view', 'display_name' => 'Xem danh sách người dùng', 'module' => 'hr', 'description' => 'View user list'],
            ['name' => 'users.manage', 'display_name' => 'Quản lý người dùng', 'module' => 'hr', 'description' => 'Manage users (create, update, ban)'],
            ['name' => 'employers.verify', 'display_name' => 'Xác minh nhà tuyển dụng', 'module' => 'hr', 'description' => 'Verify employer profiles'],
            ['name' => 'workers.verify', 'display_name' => 'Xác minh nhân viên', 'module' => 'hr', 'description' => 'Verify worker profiles'],

            // System module
            ['name' => 'roles.view', 'display_name' => 'Xem vai trò', 'module' => 'system', 'description' => 'View roles and permissions'],
            ['name' => 'roles.manage', 'display_name' => 'Quản lý vai trò', 'module' => 'system', 'description' => 'Manage roles and permissions'],
            ['name' => 'departments.view', 'display_name' => 'Xem phòng ban', 'module' => 'system', 'description' => 'View departments'],
            ['name' => 'departments.manage', 'display_name' => 'Quản lý phòng ban', 'module' => 'system', 'description' => 'Manage departments'],
            ['name' => 'teams.view', 'display_name' => 'Xem nhóm', 'module' => 'system', 'description' => 'View teams'],
            ['name' => 'teams.manage', 'display_name' => 'Quản lý nhóm', 'module' => 'system', 'description' => 'Manage teams'],
            ['name' => 'tasks.view', 'display_name' => 'Xem công việc', 'module' => 'system', 'description' => 'View tasks'],
            ['name' => 'tasks.assign', 'display_name' => 'Giao công việc', 'module' => 'system', 'description' => 'Assign tasks to users'],
            ['name' => 'tasks.update', 'display_name' => 'Cập nhật công việc', 'module' => 'system', 'description' => 'Update task status and comments'],
            ['name' => 'activity_logs.view', 'display_name' => 'Xem nhật ký hoạt động', 'module' => 'system', 'description' => 'View activity logs'],
            ['name' => 'reports.view', 'display_name' => 'Xem báo cáo', 'module' => 'system', 'description' => 'View reports and analytics'],
            ['name' => 'settings.manage', 'display_name' => 'Quản lý cài đặt', 'module' => 'system', 'description' => 'Manage system settings'],
        ];

        $permissionModels = [];
        foreach ($permissions as $perm) {
            $permissionModels[$perm['name']] = Permission::create($perm);
        }

        // ── Roles ────────────────────────────────────────────────────

        // Super Admin: level 100 - full access (bypasses all permission checks)
        $superAdmin = Role::create([
            'name' => 'super_admin',
            'display_name' => 'Quản trị tối cao',
            'description' => 'Toàn quyền hệ thống, không bị giới hạn bởi quyền nào.',
            'level' => 100,
        ]);
        // super_admin has ALL permissions implicitly (checked in User model), but also attach explicitly
        $superAdmin->permissions()->attach(collect($permissionModels)->pluck('id'));

        // Admin: level 90 - nearly full access
        $admin = Role::create([
            'name' => 'admin',
            'display_name' => 'Quản trị viên',
            'description' => 'Quản trị hệ thống, quản lý người dùng và cấu hình.',
            'level' => 90,
        ]);
        $adminPermissions = collect($permissionModels)->except(['settings.manage'])->pluck('id');
        $admin->permissions()->attach($adminPermissions);

        // Manager: level 70 - departmental management
        $manager = Role::create([
            'name' => 'manager',
            'display_name' => 'Quản lý',
            'description' => 'Quản lý phòng ban, duyệt tin tuyển dụng và phân công công việc.',
            'level' => 70,
        ]);
        $managerPerms = [
            'jobs.view', 'jobs.create', 'jobs.update', 'jobs.approve',
            'applications.view', 'applications.review', 'applications.manage',
            'interviews.view', 'interviews.manage',
            'contracts.view', 'contracts.manage',
            'dormitories.view', 'dormitories.manage', 'dormitories.verify',
            'rooms.view', 'rooms.manage',
            'room_contracts.view', 'room_contracts.manage',
            'users.view', 'employers.verify', 'workers.verify',
            'departments.view', 'teams.view', 'teams.manage',
            'tasks.view', 'tasks.assign', 'tasks.update',
            'activity_logs.view', 'reports.view',
        ];
        $manager->permissions()->attach(
            collect($managerPerms)->map(fn ($name) => $permissionModels[$name]->id)
        );

        // Recruiter: level 50 - recruitment focus
        $recruiter = Role::create([
            'name' => 'recruiter',
            'display_name' => 'Nhân viên tuyển dụng',
            'description' => 'Quản lý tin tuyển dụng, xét duyệt hồ sơ và phỏng vấn.',
            'level' => 50,
        ]);
        $recruiterPerms = [
            'jobs.view', 'jobs.create', 'jobs.update',
            'applications.view', 'applications.review',
            'interviews.view', 'interviews.manage',
            'contracts.view',
            'dormitories.view', 'rooms.view',
            'users.view',
            'teams.view',
            'tasks.view', 'tasks.update',
        ];
        $recruiter->permissions()->attach(
            collect($recruiterPerms)->map(fn ($name) => $permissionModels[$name]->id)
        );

        // Coordinator: level 40 - operational coordination
        $coordinator = Role::create([
            'name' => 'coordinator',
            'display_name' => 'Điều phối viên',
            'description' => 'Điều phối công việc, hỗ trợ vận hành tuyển dụng và quản lý trọ.',
            'level' => 40,
        ]);
        $coordinatorPerms = [
            'jobs.view',
            'applications.view',
            'interviews.view',
            'dormitories.view', 'rooms.view',
            'room_contracts.view',
            'users.view',
            'teams.view',
            'tasks.view', 'tasks.update',
        ];
        $coordinator->permissions()->attach(
            collect($coordinatorPerms)->map(fn ($name) => $permissionModels[$name]->id)
        );

        // Viewer: level 10 - read-only access
        $viewer = Role::create([
            'name' => 'viewer',
            'display_name' => 'Xem',
            'description' => 'Chỉ xem thông tin, không có quyền chỉnh sửa.',
            'level' => 10,
        ]);
        $viewerPerms = [
            'jobs.view', 'applications.view', 'interviews.view', 'contracts.view',
            'dormitories.view', 'rooms.view', 'room_contracts.view',
            'users.view', 'departments.view', 'teams.view', 'tasks.view',
            'reports.view',
        ];
        $viewer->permissions()->attach(
            collect($viewerPerms)->map(fn ($name) => $permissionModels[$name]->id)
        );
    }
}
