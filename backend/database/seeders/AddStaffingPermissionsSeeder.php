<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

/**
 * Add missing staffing-module permissions and assign them to existing roles.
 * Safe to run multiple times (uses firstOrCreate).
 */
class AddStaffingPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // ── New permissions to add ──────────────────────────────────
        $newPermissions = [
            // Clients
            ['name' => 'clients.view', 'display_name' => 'Xem khách hàng', 'module' => 'clients', 'description' => 'View client list and details'],
            ['name' => 'clients.create', 'display_name' => 'Thêm khách hàng', 'module' => 'clients', 'description' => 'Create new clients'],
            ['name' => 'clients.update', 'display_name' => 'Sửa khách hàng', 'module' => 'clients', 'description' => 'Update client information'],
            ['name' => 'clients.delete', 'display_name' => 'Xóa khách hàng', 'module' => 'clients', 'description' => 'Delete clients'],

            // Staffing Orders
            ['name' => 'orders.view', 'display_name' => 'Xem đơn hàng', 'module' => 'orders', 'description' => 'View staffing orders'],
            ['name' => 'orders.create', 'display_name' => 'Tạo đơn hàng', 'module' => 'orders', 'description' => 'Create staffing orders'],
            ['name' => 'orders.update', 'display_name' => 'Sửa đơn hàng', 'module' => 'orders', 'description' => 'Update staffing orders'],
            ['name' => 'orders.delete', 'display_name' => 'Xóa đơn hàng', 'module' => 'orders', 'description' => 'Delete staffing orders'],
            ['name' => 'orders.approve', 'display_name' => 'Duyệt đơn hàng', 'module' => 'orders', 'description' => 'Approve staffing orders'],
            ['name' => 'orders.assign', 'display_name' => 'Phân công đơn hàng', 'module' => 'orders', 'description' => 'Assign recruiter to orders'],

            // Workers
            ['name' => 'workers.view', 'display_name' => 'Xem ứng viên', 'module' => 'workers', 'description' => 'View worker pool'],
            ['name' => 'workers.create', 'display_name' => 'Thêm ứng viên', 'module' => 'workers', 'description' => 'Add new workers'],
            ['name' => 'workers.update', 'display_name' => 'Sửa ứng viên', 'module' => 'workers', 'description' => 'Update worker info'],
            ['name' => 'workers.delete', 'display_name' => 'Xóa ứng viên', 'module' => 'workers', 'description' => 'Delete workers'],
            ['name' => 'workers.assign_staff', 'display_name' => 'Gán người phụ trách', 'module' => 'workers', 'description' => 'Assign staff to manage workers'],
            ['name' => 'workers.change_status', 'display_name' => 'Đổi trạng thái ứng viên', 'module' => 'workers', 'description' => 'Change worker status'],

            // Payroll
            ['name' => 'payroll.view', 'display_name' => 'Xem bảng lương workers', 'module' => 'payroll', 'description' => 'View worker payroll'],
            ['name' => 'payroll.calculate', 'display_name' => 'Tính lương workers', 'module' => 'payroll', 'description' => 'Calculate worker payroll'],
            ['name' => 'payroll.approve', 'display_name' => 'Duyệt lương workers', 'module' => 'payroll', 'description' => 'Approve worker payroll'],
            ['name' => 'payroll.pay', 'display_name' => 'Thanh toán lương workers', 'module' => 'payroll', 'description' => 'Mark worker payroll as paid'],

            // Invoices
            ['name' => 'invoices.view', 'display_name' => 'Xem hóa đơn', 'module' => 'invoices', 'description' => 'View invoices'],
            ['name' => 'invoices.create', 'display_name' => 'Tạo hóa đơn', 'module' => 'invoices', 'description' => 'Create invoices'],
            ['name' => 'invoices.update', 'display_name' => 'Sửa hóa đơn', 'module' => 'invoices', 'description' => 'Update invoices'],
            ['name' => 'invoices.send', 'display_name' => 'Gửi hóa đơn', 'module' => 'invoices', 'description' => 'Send invoices to clients'],
            ['name' => 'invoices.payment', 'display_name' => 'Ghi nhận thanh toán', 'module' => 'invoices', 'description' => 'Record invoice payments'],

            // Revenue
            ['name' => 'revenue.view', 'display_name' => 'Xem doanh thu & báo cáo', 'module' => 'revenue', 'description' => 'View revenue dashboard'],

            // KPI
            ['name' => 'kpi.view', 'display_name' => 'Xem KPI', 'module' => 'kpi', 'description' => 'View KPI periods and records'],
            ['name' => 'kpi.evaluate', 'display_name' => 'Đánh giá KPI', 'module' => 'kpi', 'description' => 'Evaluate KPI records'],
            ['name' => 'kpi.config', 'display_name' => 'Cấu hình KPI', 'module' => 'kpi', 'description' => 'Manage KPI configs'],

            // Staff Payroll
            ['name' => 'staff_payroll.view', 'display_name' => 'Xem lương nhân viên', 'module' => 'staff_payroll', 'description' => 'View staff payroll'],
            ['name' => 'staff_payroll.manage', 'display_name' => 'Quản lý lương nhân viên', 'module' => 'staff_payroll', 'description' => 'Manage staff payroll'],
        ];

        // Create permissions (skip if already exists)
        $permModels = [];
        foreach ($newPermissions as $perm) {
            $permModels[$perm['name']] = Permission::firstOrCreate(
                ['name' => $perm['name']],
                $perm
            );
        }

        $p = fn (string ...$names) => collect($names)
            ->map(fn ($n) => $permModels[$n]->id)
            ->toArray();

        // ── Assign to roles ─────────────────────────────────────────

        // super_admin: ALL permissions
        $superAdmin = Role::where('name', 'super_admin')->first();
        if ($superAdmin) {
            $superAdmin->permissions()->syncWithoutDetaching(
                collect($permModels)->pluck('id')
            );
        }

        // admin: ALL except settings.manage (already excluded)
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->permissions()->syncWithoutDetaching(
                collect($permModels)->pluck('id')
            );
        }

        // manager: full staffing + finance + KPI view/evaluate
        $manager = Role::where('name', 'manager')->first();
        if ($manager) {
            $manager->permissions()->syncWithoutDetaching($p(
                'clients.view', 'clients.create', 'clients.update', 'clients.delete',
                'orders.view', 'orders.create', 'orders.update', 'orders.delete',
                'orders.approve', 'orders.assign',
                'workers.view', 'workers.create', 'workers.update', 'workers.delete',
                'workers.assign_staff', 'workers.change_status',
                'payroll.view', 'payroll.calculate', 'payroll.approve', 'payroll.pay',
                'invoices.view', 'invoices.create', 'invoices.update', 'invoices.send', 'invoices.payment',
                'revenue.view',
                'kpi.view', 'kpi.evaluate',
            ));
        }

        // recruiter: view clients, CRUD orders/workers (own), assignments, attendance
        $recruiter = Role::where('name', 'recruiter')->first();
        if ($recruiter) {
            $recruiter->permissions()->syncWithoutDetaching($p(
                'clients.view',
                'orders.view', 'orders.create', 'orders.update',
                'workers.view', 'workers.create', 'workers.update',
            ));
        }

        // coordinator: view only
        $coordinator = Role::where('name', 'coordinator')->first();
        if ($coordinator) {
            $coordinator->permissions()->syncWithoutDetaching($p(
                'clients.view', 'orders.view', 'workers.view',
            ));
        }

        // viewer: view only
        $viewer = Role::where('name', 'viewer')->first();
        if ($viewer) {
            $viewer->permissions()->syncWithoutDetaching($p(
                'clients.view', 'orders.view', 'workers.view',
            ));
        }

        $this->command->info('Added ' . count($newPermissions) . ' staffing permissions and assigned to roles.');
    }
}
