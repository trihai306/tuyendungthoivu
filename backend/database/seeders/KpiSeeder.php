<?php

namespace Database\Seeders;

use App\Models\KpiConfig;
use App\Models\StaffSalaryConfig;
use App\Models\User;
use Illuminate\Database\Seeder;

class KpiSeeder extends Seeder
{
    public function run(): void
    {
        // ── KPI Configs ─────────────────────────────────────────────

        $configs = [
            [
                'name' => 'Số đơn hàng tạo mới',
                'code' => 'orders_created',
                'description' => 'Tổng số đơn hàng staffing được tạo trong kỳ',
                'unit' => 'count',
                'applicable_roles' => ['sales', 'manager'],
                'calculation_method' => 'auto',
                'auto_source' => 'orders_created',
                'default_target' => 10,
                'weight' => 2,
                'sort_order' => 1,
            ],
            [
                'name' => 'Số đơn hoàn thành',
                'code' => 'orders_completed',
                'description' => 'Số đơn hàng được hoàn thành đúng yêu cầu',
                'unit' => 'count',
                'applicable_roles' => ['recruiter', 'coordinator'],
                'calculation_method' => 'auto',
                'auto_source' => 'orders_completed',
                'default_target' => 8,
                'weight' => 2,
                'sort_order' => 2,
            ],
            [
                'name' => 'Tỷ lệ đáp ứng nhân sự',
                'code' => 'fill_rate',
                'description' => 'Phần trăm vị trí được lấp đầy so với yêu cầu',
                'unit' => 'percent',
                'applicable_roles' => ['recruiter', 'coordinator'],
                'calculation_method' => 'auto',
                'auto_source' => 'fill_rate',
                'default_target' => 85,
                'weight' => 3,
                'sort_order' => 3,
            ],
            [
                'name' => 'Số workers phân công',
                'code' => 'workers_assigned',
                'description' => 'Tổng số lượt phân công workers trong kỳ',
                'unit' => 'count',
                'applicable_roles' => ['recruiter', 'coordinator'],
                'calculation_method' => 'auto',
                'auto_source' => 'workers_assigned',
                'default_target' => 30,
                'weight' => 1.5,
                'sort_order' => 4,
            ],
            [
                'name' => 'Doanh thu đơn hàng',
                'code' => 'revenue',
                'description' => 'Tổng doanh thu từ phí dịch vụ đơn hàng',
                'unit' => 'amount',
                'applicable_roles' => ['sales', 'manager'],
                'calculation_method' => 'auto',
                'auto_source' => 'revenue',
                'default_target' => 100000000,
                'weight' => 3,
                'sort_order' => 5,
            ],
            [
                'name' => 'Đánh giá hài lòng khách hàng',
                'code' => 'client_satisfaction',
                'description' => 'Điểm đánh giá trung bình từ khách hàng (1-5)',
                'unit' => 'score',
                'applicable_roles' => ['recruiter', 'coordinator', 'manager'],
                'calculation_method' => 'manual',
                'default_target' => 4,
                'weight' => 2,
                'sort_order' => 6,
            ],
            [
                'name' => 'Tỷ lệ no-show workers',
                'code' => 'no_show_rate',
                'description' => 'Phần trăm workers không đến làm việc (thấp hơn = tốt hơn)',
                'unit' => 'percent',
                'applicable_roles' => ['recruiter', 'coordinator'],
                'calculation_method' => 'manual',
                'default_target' => 5,
                'weight' => 2,
                'sort_order' => 7,
            ],
            [
                'name' => 'Hoàn thành công việc nội bộ',
                'code' => 'task_completion',
                'description' => 'Phần trăm task được hoàn thành đúng hạn',
                'unit' => 'percent',
                'applicable_roles' => ['staff', 'recruiter', 'coordinator', 'manager'],
                'calculation_method' => 'manual',
                'default_target' => 90,
                'weight' => 1,
                'sort_order' => 8,
            ],
            [
                'name' => 'Số khách hàng mới',
                'code' => 'new_clients',
                'description' => 'Số lượng khách hàng mới được phát triển trong kỳ',
                'unit' => 'count',
                'applicable_roles' => ['sales'],
                'calculation_method' => 'auto',
                'auto_source' => 'new_clients',
                'default_target' => 5,
                'weight' => 2.5,
                'sort_order' => 9,
            ],
            [
                'name' => 'Giá trị hợp đồng ký mới',
                'code' => 'contract_value',
                'description' => 'Tổng giá trị hợp đồng được ký trong kỳ (VNĐ)',
                'unit' => 'amount',
                'applicable_roles' => ['sales', 'manager'],
                'calculation_method' => 'auto',
                'auto_source' => 'contract_value',
                'default_target' => 200000000,
                'weight' => 3,
                'sort_order' => 10,
            ],
            [
                'name' => 'Doanh thu thu hồi',
                'code' => 'invoice_collected',
                'description' => 'Tổng tiền thực thu từ hóa đơn trong kỳ (VNĐ)',
                'unit' => 'amount',
                'applicable_roles' => ['sales', 'accountant'],
                'calculation_method' => 'auto',
                'auto_source' => 'invoice_collected',
                'default_target' => 150000000,
                'weight' => 2.5,
                'sort_order' => 11,
            ],
        ];

        foreach ($configs as $config) {
            KpiConfig::updateOrCreate(
                ['code' => $config['code']],
                $config,
            );
        }

        // ── Staff Salary Configs ────────────────────────────────────

        $staffSalaries = [
            ['employee_code' => 'NV001', 'base_salary' => 25000000, 'allowance' => 5000000, 'kpi_bonus_rate' => 20],
            ['employee_code' => 'NV002', 'base_salary' => 18000000, 'allowance' => 3000000, 'kpi_bonus_rate' => 15],
            ['employee_code' => 'NV003', 'base_salary' => 22000000, 'allowance' => 4000000, 'kpi_bonus_rate' => 20],
            ['employee_code' => 'NV004', 'base_salary' => 22000000, 'allowance' => 4000000, 'kpi_bonus_rate' => 20],
            ['employee_code' => 'NV005', 'base_salary' => 12000000, 'allowance' => 2000000, 'kpi_bonus_rate' => 15],
            ['employee_code' => 'NV006', 'base_salary' => 12000000, 'allowance' => 2000000, 'kpi_bonus_rate' => 15],
            ['employee_code' => 'NV007', 'base_salary' => 12000000, 'allowance' => 2000000, 'kpi_bonus_rate' => 15],
            ['employee_code' => 'NV008', 'base_salary' => 11000000, 'allowance' => 2000000, 'kpi_bonus_rate' => 15],
            ['employee_code' => 'NV009', 'base_salary' => 10000000, 'allowance' => 1500000, 'kpi_bonus_rate' => 10],
            ['employee_code' => 'NV010', 'base_salary' => 10000000, 'allowance' => 1500000, 'kpi_bonus_rate' => 10],
            ['employee_code' => 'NV011', 'base_salary' => 10000000, 'allowance' => 1500000, 'kpi_bonus_rate' => 10],
            ['employee_code' => 'NV012', 'base_salary' => 8000000, 'allowance' => 1000000, 'kpi_bonus_rate' => 5],
        ];

        $admin = User::where('employee_code', 'NV001')->first();

        foreach ($staffSalaries as $salaryData) {
            $user = User::where('employee_code', $salaryData['employee_code'])->first();
            if (!$user) {
                continue;
            }

            StaffSalaryConfig::updateOrCreate(
                ['user_id' => $user->id, 'effective_from' => '2024-01-01'],
                [
                    'base_salary' => $salaryData['base_salary'],
                    'allowance' => $salaryData['allowance'],
                    'kpi_bonus_rate' => $salaryData['kpi_bonus_rate'],
                    'effective_from' => '2024-01-01',
                    'notes' => 'Cấu hình lương ban đầu',
                    'created_by' => $admin?->id,
                ],
            );
        }
    }
}
