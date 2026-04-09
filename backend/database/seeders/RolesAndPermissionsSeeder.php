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
            // ── Legacy modules (recruitment, accommodation) ─────────
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
            ['name' => 'dormitories.view', 'display_name' => 'Xem danh sách trọ', 'module' => 'accommodation', 'description' => 'View dormitories'],
            ['name' => 'dormitories.manage', 'display_name' => 'Quản lý trọ', 'module' => 'accommodation', 'description' => 'Manage dormitories'],
            ['name' => 'dormitories.verify', 'display_name' => 'Xác minh trọ', 'module' => 'accommodation', 'description' => 'Verify accommodation listings'],
            ['name' => 'rooms.view', 'display_name' => 'Xem phòng trọ', 'module' => 'accommodation', 'description' => 'View rooms'],
            ['name' => 'rooms.manage', 'display_name' => 'Quản lý phòng trọ', 'module' => 'accommodation', 'description' => 'Manage rooms'],
            ['name' => 'room_contracts.view', 'display_name' => 'Xem hợp đồng thuê phòng', 'module' => 'accommodation', 'description' => 'View room contracts'],
            ['name' => 'room_contracts.manage', 'display_name' => 'Quản lý hợp đồng thuê phòng', 'module' => 'accommodation', 'description' => 'Manage room contracts'],

            // ── Clients ─────────────────────────────────────────────
            ['name' => 'clients.view', 'display_name' => 'Xem khách hàng', 'module' => 'clients', 'description' => 'View client list and details'],
            ['name' => 'clients.create', 'display_name' => 'Thêm khách hàng', 'module' => 'clients', 'description' => 'Create new clients'],
            ['name' => 'clients.update', 'display_name' => 'Sửa khách hàng', 'module' => 'clients', 'description' => 'Update client information'],
            ['name' => 'clients.delete', 'display_name' => 'Xóa khách hàng', 'module' => 'clients', 'description' => 'Delete clients'],

            // ── Staffing Orders ─────────────────────────────────────
            ['name' => 'orders.view', 'display_name' => 'Xem đơn hàng', 'module' => 'orders', 'description' => 'View staffing orders'],
            ['name' => 'orders.create', 'display_name' => 'Tạo đơn hàng', 'module' => 'orders', 'description' => 'Create staffing orders'],
            ['name' => 'orders.update', 'display_name' => 'Sửa đơn hàng', 'module' => 'orders', 'description' => 'Update staffing orders'],
            ['name' => 'orders.delete', 'display_name' => 'Xóa đơn hàng', 'module' => 'orders', 'description' => 'Delete staffing orders'],
            ['name' => 'orders.approve', 'display_name' => 'Duyệt đơn hàng', 'module' => 'orders', 'description' => 'Approve staffing orders'],
            ['name' => 'orders.assign', 'display_name' => 'Phân công đơn hàng', 'module' => 'orders', 'description' => 'Assign recruiter to orders'],

            // ── Workers (Pool) ──────────────────────────────────────
            ['name' => 'workers.view', 'display_name' => 'Xem ứng viên', 'module' => 'workers', 'description' => 'View worker pool'],
            ['name' => 'workers.create', 'display_name' => 'Thêm ứng viên', 'module' => 'workers', 'description' => 'Add new workers'],
            ['name' => 'workers.update', 'display_name' => 'Sửa ứng viên', 'module' => 'workers', 'description' => 'Update worker info'],
            ['name' => 'workers.delete', 'display_name' => 'Xóa ứng viên', 'module' => 'workers', 'description' => 'Delete workers'],
            ['name' => 'workers.assign_staff', 'display_name' => 'Gán người phụ trách', 'module' => 'workers', 'description' => 'Assign staff to manage workers'],
            ['name' => 'workers.change_status', 'display_name' => 'Đổi trạng thái ứng viên', 'module' => 'workers', 'description' => 'Change worker status (blacklist, etc.)'],

            // ── Assignments (Dispatch) ──────────────────────────────
            ['name' => 'assignments.view', 'display_name' => 'Xem phân công', 'module' => 'assignments', 'description' => 'View assignments / dispatch board'],
            ['name' => 'assignments.create', 'display_name' => 'Tạo phân công', 'module' => 'assignments', 'description' => 'Assign workers to orders'],
            ['name' => 'assignments.update', 'display_name' => 'Cập nhật phân công', 'module' => 'assignments', 'description' => 'Update assignment status'],
            ['name' => 'assignments.delete', 'display_name' => 'Hủy phân công', 'module' => 'assignments', 'description' => 'Cancel / remove assignments'],

            // ── Attendance ──────────────────────────────────────────
            ['name' => 'attendance.view', 'display_name' => 'Xem chấm công', 'module' => 'attendance', 'description' => 'View attendance records and reports'],
            ['name' => 'attendance.checkin', 'display_name' => 'Chấm công (check-in/out)', 'module' => 'attendance', 'description' => 'Check-in / check-out workers'],
            ['name' => 'attendance.approve', 'display_name' => 'Duyệt chấm công', 'module' => 'attendance', 'description' => 'Approve attendance records'],

            // ── Payroll (Workers) ───────────────────────────────────
            ['name' => 'payroll.view', 'display_name' => 'Xem bảng lương workers', 'module' => 'payroll', 'description' => 'View worker payroll'],
            ['name' => 'payroll.calculate', 'display_name' => 'Tính lương workers', 'module' => 'payroll', 'description' => 'Calculate worker payroll'],
            ['name' => 'payroll.approve', 'display_name' => 'Duyệt lương workers', 'module' => 'payroll', 'description' => 'Approve worker payroll'],
            ['name' => 'payroll.pay', 'display_name' => 'Thanh toán lương workers', 'module' => 'payroll', 'description' => 'Mark worker payroll as paid'],

            // ── Invoices ────────────────────────────────────────────
            ['name' => 'invoices.view', 'display_name' => 'Xem hóa đơn', 'module' => 'invoices', 'description' => 'View invoices'],
            ['name' => 'invoices.create', 'display_name' => 'Tạo hóa đơn', 'module' => 'invoices', 'description' => 'Create invoices'],
            ['name' => 'invoices.update', 'display_name' => 'Sửa hóa đơn', 'module' => 'invoices', 'description' => 'Update invoices'],
            ['name' => 'invoices.send', 'display_name' => 'Gửi hóa đơn', 'module' => 'invoices', 'description' => 'Send invoices to clients'],
            ['name' => 'invoices.payment', 'display_name' => 'Ghi nhận thanh toán', 'module' => 'invoices', 'description' => 'Record invoice payments'],

            // ── Revenue & Reports ───────────────────────────────────
            ['name' => 'revenue.view', 'display_name' => 'Xem doanh thu & báo cáo', 'module' => 'revenue', 'description' => 'View revenue dashboard and reports'],

            // ── KPI ─────────────────────────────────────────────────
            ['name' => 'kpi.view', 'display_name' => 'Xem KPI', 'module' => 'kpi', 'description' => 'View KPI periods, records, summaries'],
            ['name' => 'kpi.evaluate', 'display_name' => 'Đánh giá KPI', 'module' => 'kpi', 'description' => 'Evaluate and score KPI records'],
            ['name' => 'kpi.config', 'display_name' => 'Cấu hình KPI', 'module' => 'kpi', 'description' => 'Manage KPI configs, create periods'],

            // ── Staff Payroll ───────────────────────────────────────
            ['name' => 'staff_payroll.view', 'display_name' => 'Xem lương nhân viên', 'module' => 'staff_payroll', 'description' => 'View internal staff payroll'],
            ['name' => 'staff_payroll.manage', 'display_name' => 'Quản lý lương nhân viên', 'module' => 'staff_payroll', 'description' => 'Calculate, approve, pay staff payroll'],

            // ── HR / System ─────────────────────────────────────────
            ['name' => 'users.view', 'display_name' => 'Xem nhân sự nội bộ', 'module' => 'hr', 'description' => 'View internal staff list'],
            ['name' => 'users.manage', 'display_name' => 'Quản lý nhân sự nội bộ', 'module' => 'hr', 'description' => 'Manage internal staff (create, update, deactivate)'],
            ['name' => 'employers.verify', 'display_name' => 'Xác minh nhà tuyển dụng', 'module' => 'hr', 'description' => 'Verify employer profiles'],
            ['name' => 'workers.verify', 'display_name' => 'Xác minh nhân viên', 'module' => 'hr', 'description' => 'Verify worker profiles'],
            ['name' => 'roles.view', 'display_name' => 'Xem vai trò & phân quyền', 'module' => 'system', 'description' => 'View roles and permissions'],
            ['name' => 'roles.manage', 'display_name' => 'Quản lý vai trò & phân quyền', 'module' => 'system', 'description' => 'Manage roles and permissions'],
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

        $p = fn (string ...$names) => collect($names)->map(fn ($n) => $permissionModels[$n]->id);

        // ── Roles ────────────────────────────────────────────────────

        // Super Admin: level 100 – full access (bypasses all checks)
        $superAdmin = Role::create([
            'name' => 'super_admin',
            'display_name' => 'Quản trị tối cao',
            'description' => 'Toàn quyền hệ thống, không bị giới hạn bởi quyền nào.',
            'level' => 100,
        ]);
        $superAdmin->permissions()->attach(collect($permissionModels)->pluck('id'));

        // Admin: level 90 – nearly full access
        $admin = Role::create([
            'name' => 'admin',
            'display_name' => 'Quản trị viên',
            'description' => 'Quản trị hệ thống, quản lý người dùng và cấu hình.',
            'level' => 90,
        ]);
        $admin->permissions()->attach(
            collect($permissionModels)->except(['settings.manage'])->pluck('id')
        );

        // Manager: level 70 – operational management
        $manager = Role::create([
            'name' => 'manager',
            'display_name' => 'Quản lý',
            'description' => 'Quản lý vận hành, duyệt đơn hàng, tài chính, KPI.',
            'level' => 70,
        ]);
        $manager->permissions()->attach($p(
            // Clients
            'clients.view', 'clients.create', 'clients.update', 'clients.delete',
            // Orders
            'orders.view', 'orders.create', 'orders.update', 'orders.delete',
            'orders.approve', 'orders.assign',
            // Workers
            'workers.view', 'workers.create', 'workers.update', 'workers.delete',
            'workers.assign_staff', 'workers.change_status',
            // Assignments
            'assignments.view', 'assignments.create', 'assignments.update', 'assignments.delete',
            // Attendance
            'attendance.view', 'attendance.checkin', 'attendance.approve',
            // Payroll
            'payroll.view', 'payroll.calculate', 'payroll.approve', 'payroll.pay',
            // Invoices
            'invoices.view', 'invoices.create', 'invoices.update', 'invoices.send', 'invoices.payment',
            // Revenue
            'revenue.view',
            // KPI (view + evaluate, NOT config)
            'kpi.view', 'kpi.evaluate',
            // Legacy
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
        ));

        // Recruiter: level 50 – field operations
        $recruiter = Role::create([
            'name' => 'recruiter',
            'display_name' => 'Nhân viên tuyển dụng',
            'description' => 'Tuyển chọn, điều phối workers, xử lý đơn hàng được giao.',
            'level' => 50,
        ]);
        $recruiter->permissions()->attach($p(
            // Clients (view only)
            'clients.view',
            // Orders (view, create, update own)
            'orders.view', 'orders.create', 'orders.update',
            // Workers (full CRUD on own)
            'workers.view', 'workers.create', 'workers.update',
            // Assignments (create, update own)
            'assignments.view', 'assignments.create', 'assignments.update',
            // Attendance (view + check-in)
            'attendance.view', 'attendance.checkin',
            // Legacy
            'jobs.view', 'jobs.create', 'jobs.update',
            'applications.view', 'applications.review',
            'interviews.view', 'interviews.manage',
            'contracts.view',
            'dormitories.view', 'rooms.view',
            'users.view',
            'teams.view',
            'tasks.view', 'tasks.update',
        ));

        // Coordinator: level 40 – support operations
        $coordinator = Role::create([
            'name' => 'coordinator',
            'display_name' => 'Điều phối viên',
            'description' => 'Hỗ trợ điều phối, chấm công, theo dõi vận hành.',
            'level' => 40,
        ]);
        $coordinator->permissions()->attach($p(
            'clients.view',
            'orders.view',
            'workers.view',
            'assignments.view',
            'attendance.view', 'attendance.checkin',
            // Legacy
            'jobs.view', 'applications.view', 'interviews.view',
            'dormitories.view', 'rooms.view', 'room_contracts.view',
            'users.view', 'teams.view',
            'tasks.view', 'tasks.update',
        ));

        // Viewer: level 10 – read only
        $viewer = Role::create([
            'name' => 'viewer',
            'display_name' => 'Xem',
            'description' => 'Chỉ xem thông tin, không có quyền chỉnh sửa.',
            'level' => 10,
        ]);
        $viewer->permissions()->attach($p(
            'clients.view', 'orders.view', 'workers.view', 'assignments.view',
            'attendance.view',
            // Legacy
            'jobs.view', 'applications.view', 'interviews.view', 'contracts.view',
            'dormitories.view', 'rooms.view', 'room_contracts.view',
            'users.view', 'departments.view', 'teams.view', 'tasks.view',
            'reports.view',
        ));
    }
}
