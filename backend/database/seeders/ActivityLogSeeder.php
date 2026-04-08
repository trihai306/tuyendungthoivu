<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Application;
use App\Models\Dormitory;
use App\Models\Employer;
use App\Models\JobPost;
use App\Models\TaskAssignment;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // Fetch users
        $staffUsers = User::whereNotNull('employee_code')->get()->keyBy('employee_code');
        $employerUsers = User::where('role', 'employer')->get()->values();
        $workerUsers = User::where('role', 'worker')->get()->values();

        // Fetch entities for references
        $jobPosts = JobPost::take(5)->get();
        $applications = Application::take(5)->get();
        $employers = Employer::take(3)->get();
        $tasks = TaskAssignment::take(5)->get();
        $dormitories = Dormitory::take(3)->get();

        $ipAddresses = [
            '113.160.224.50',  // VN - Viettel
            '14.241.120.33',   // VN - VNPT
            '27.72.88.100',    // VN - Viettel
            '171.248.50.25',   // VN - Mobifone
            '42.112.33.180',   // VN - FPT
            '103.199.70.15',   // VN - CMC
            '118.70.82.90',    // VN - FPT
            '183.80.44.60',    // VN - VNPT
            '192.168.1.100',   // Local/VPN
            '10.0.0.50',       // Internal
        ];

        $logs = [
            // === Login events (10) ===
            [
                'user_id' => $staffUsers['NV001']->id ?? null,
                'action' => 'login',
                'description' => 'Nguyễn Văn Hải đã đăng nhập hệ thống.',
                'ip_address' => $ipAddresses[0],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0', 'device' => 'desktop'],
                'created_at' => $now->copy()->subHours(2),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'login',
                'description' => 'Lê Hoàng Nam đã đăng nhập hệ thống.',
                'ip_address' => $ipAddresses[1],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/123.0', 'device' => 'desktop'],
                'created_at' => $now->copy()->subHours(1),
            ],
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'action' => 'login',
                'description' => 'Trần Thị Mai đã đăng nhập hệ thống.',
                'ip_address' => $ipAddresses[2],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS) Safari', 'device' => 'mobile'],
                'created_at' => $now->copy()->subMinutes(30),
            ],
            [
                'user_id' => $staffUsers['NV002']->id ?? null,
                'action' => 'login',
                'description' => 'Trần Thị Lan đã đăng nhập hệ thống.',
                'ip_address' => $ipAddresses[4],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Windows NT 10.0) Firefox/124.0', 'device' => 'desktop'],
                'created_at' => $now->copy()->subHours(5),
            ],
            [
                'user_id' => $employerUsers->count() > 0 ? $employerUsers[0]->id : null,
                'action' => 'login',
                'description' => 'Nhà tuyển dụng Thực phẩm Việt đã đăng nhập.',
                'ip_address' => $ipAddresses[3],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Windows NT 10.0) Chrome/123.0', 'device' => 'desktop'],
                'created_at' => $now->copy()->subHours(4),
            ],
            [
                'user_id' => $workerUsers->count() > 0 ? $workerUsers[0]->id : null,
                'action' => 'login',
                'description' => 'Ứng viên Nguyễn Thị Hoa đã đăng nhập.',
                'ip_address' => $ipAddresses[5],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Android) Chrome Mobile', 'device' => 'mobile'],
                'created_at' => $now->copy()->subHours(3),
            ],
            [
                'user_id' => $staffUsers['NV006']->id ?? null,
                'action' => 'login',
                'description' => 'Nguyễn Minh Tuấn đã đăng nhập hệ thống.',
                'ip_address' => $ipAddresses[6],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Macintosh) Safari/605.1.15', 'device' => 'desktop'],
                'created_at' => $now->copy()->subHours(4),
            ],
            [
                'user_id' => $staffUsers['NV004']->id ?? null,
                'action' => 'login',
                'description' => 'Phạm Văn Đức đã đăng nhập hệ thống.',
                'ip_address' => $ipAddresses[7],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Windows NT 10.0) Edge/123.0', 'device' => 'desktop'],
                'created_at' => $now->copy()->subHours(3),
            ],
            [
                'user_id' => $staffUsers['NV010']->id ?? null,
                'action' => 'login',
                'description' => 'Hoàng Thị Ngọc đã đăng nhập hệ thống.',
                'ip_address' => $ipAddresses[8],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Windows NT 10.0) Chrome/123.0', 'device' => 'desktop'],
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $workerUsers->count() > 4 ? $workerUsers[4]->id : null,
                'action' => 'login',
                'description' => 'Ứng viên Hoàng Thị Mai đã đăng nhập.',
                'ip_address' => $ipAddresses[3],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (iPhone) Safari', 'device' => 'mobile'],
                'created_at' => $now->copy()->subDay(),
            ],

            // === Job post events (8) ===
            [
                'user_id' => $employerUsers->count() > 0 ? $employerUsers[0]->id : null,
                'action' => 'created',
                'description' => 'Tạo tin tuyển dụng "Nhân viên phục vụ nhà hàng".',
                'loggable_type' => $jobPosts->count() > 0 ? 'App\\Models\\JobPost' : null,
                'loggable_id' => $jobPosts->count() > 0 ? $jobPosts[0]->id : null,
                'ip_address' => $ipAddresses[3],
                'metadata' => ['employer' => 'Công ty TNHH Thực phẩm Việt', 'positions' => 5],
                'created_at' => $now->copy()->subDays(6),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'approved',
                'description' => 'Duyệt tin tuyển dụng "Nhân viên phục vụ nhà hàng".',
                'loggable_type' => $jobPosts->count() > 0 ? 'App\\Models\\JobPost' : null,
                'loggable_id' => $jobPosts->count() > 0 ? $jobPosts[0]->id : null,
                'ip_address' => $ipAddresses[1],
                'metadata' => ['previous_status' => 'pending', 'new_status' => 'published'],
                'created_at' => $now->copy()->subDays(5),
            ],
            [
                'user_id' => $employerUsers->count() > 1 ? $employerUsers[1]->id : null,
                'action' => 'created',
                'description' => 'Tạo tin tuyển dụng "Lễ tân khách sạn".',
                'loggable_type' => $jobPosts->count() > 1 ? 'App\\Models\\JobPost' : null,
                'loggable_id' => $jobPosts->count() > 1 ? $jobPosts[1]->id : null,
                'ip_address' => $ipAddresses[5],
                'metadata' => ['employer' => 'Khách sạn Sunrise', 'positions' => 3],
                'created_at' => $now->copy()->subDays(5),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'approved',
                'description' => 'Duyệt tin tuyển dụng "Lễ tân khách sạn".',
                'loggable_type' => $jobPosts->count() > 1 ? 'App\\Models\\JobPost' : null,
                'loggable_id' => $jobPosts->count() > 1 ? $jobPosts[1]->id : null,
                'ip_address' => $ipAddresses[1],
                'metadata' => ['previous_status' => 'pending', 'new_status' => 'published'],
                'created_at' => $now->copy()->subDays(4),
            ],
            [
                'user_id' => $employerUsers->count() > 2 ? $employerUsers[2]->id : null,
                'action' => 'created',
                'description' => 'Tạo tin tuyển dụng "Nhân viên bán hàng" tại MegaMart.',
                'loggable_type' => $jobPosts->count() > 2 ? 'App\\Models\\JobPost' : null,
                'loggable_id' => $jobPosts->count() > 2 ? $jobPosts[2]->id : null,
                'ip_address' => $ipAddresses[4],
                'metadata' => ['employer' => 'Siêu thị MegaMart', 'positions' => 10],
                'created_at' => $now->copy()->subDays(4),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'approved',
                'description' => 'Duyệt tin tuyển dụng "Nhân viên bán hàng".',
                'loggable_type' => $jobPosts->count() > 2 ? 'App\\Models\\JobPost' : null,
                'loggable_id' => $jobPosts->count() > 2 ? $jobPosts[2]->id : null,
                'ip_address' => $ipAddresses[1],
                'metadata' => ['previous_status' => 'pending', 'new_status' => 'published'],
                'created_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id' => $employerUsers->count() > 0 ? $employerUsers[0]->id : null,
                'action' => 'updated',
                'description' => 'Cập nhật tin tuyển dụng "Nhân viên phục vụ nhà hàng" - điều chỉnh mức lương.',
                'loggable_type' => $jobPosts->count() > 0 ? 'App\\Models\\JobPost' : null,
                'loggable_id' => $jobPosts->count() > 0 ? $jobPosts[0]->id : null,
                'ip_address' => $ipAddresses[3],
                'metadata' => ['changed_fields' => ['salary_amount'], 'old_salary' => 6000000, 'new_salary' => 6500000],
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'updated',
                'description' => 'Đóng tin tuyển dụng "Quản lý ca" - đã tuyển đủ.',
                'loggable_type' => $jobPosts->count() > 4 ? 'App\\Models\\JobPost' : null,
                'loggable_id' => $jobPosts->count() > 4 ? $jobPosts[4]->id : null,
                'ip_address' => $ipAddresses[1],
                'metadata' => ['previous_status' => 'published', 'new_status' => 'closed', 'reason' => 'Đã tuyển đủ'],
                'created_at' => $now->copy()->subDays(1),
            ],

            // === Application events (10) ===
            [
                'user_id' => $workerUsers->count() > 0 ? $workerUsers[0]->id : null,
                'action' => 'created',
                'description' => 'Nguyễn Thị Hoa nộp hồ sơ ứng tuyển vị trí Nhân viên phục vụ.',
                'loggable_type' => $applications->count() > 0 ? 'App\\Models\\Application' : null,
                'loggable_id' => $applications->count() > 0 ? $applications[0]->id : null,
                'ip_address' => $ipAddresses[5],
                'metadata' => ['job_title' => 'Nhân viên phục vụ nhà hàng', 'match_score' => 85.50],
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $workerUsers->count() > 4 ? $workerUsers[4]->id : null,
                'action' => 'created',
                'description' => 'Hoàng Thị Mai nộp hồ sơ ứng tuyển vị trí Nhân viên bán hàng.',
                'loggable_type' => $applications->count() > 1 ? 'App\\Models\\Application' : null,
                'loggable_id' => $applications->count() > 1 ? $applications[1]->id : null,
                'ip_address' => $ipAddresses[3],
                'metadata' => ['job_title' => 'Nhân viên bán hàng', 'match_score' => 78.30],
                'created_at' => $now->copy()->subDay(),
            ],
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'action' => 'updated',
                'description' => 'Cập nhật trạng thái hồ sơ: đang xem xét.',
                'loggable_type' => $applications->count() > 2 ? 'App\\Models\\Application' : null,
                'loggable_id' => $applications->count() > 2 ? $applications[2]->id : null,
                'ip_address' => $ipAddresses[2],
                'metadata' => ['previous_status' => 'new', 'new_status' => 'reviewing'],
                'created_at' => $now->copy()->subDays(5),
            ],
            [
                'user_id' => $staffUsers['NV007']->id ?? null,
                'action' => 'updated',
                'description' => 'Cập nhật trạng thái hồ sơ: vào danh sách chọn lọc.',
                'loggable_type' => $applications->count() > 3 ? 'App\\Models\\Application' : null,
                'loggable_id' => $applications->count() > 3 ? $applications[3]->id : null,
                'ip_address' => $ipAddresses[6],
                'metadata' => ['previous_status' => 'reviewing', 'new_status' => 'shortlisted'],
                'created_at' => $now->copy()->subDays(4),
            ],
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'action' => 'updated',
                'description' => 'Mời phỏng vấn ứng viên Lê Thị Thanh.',
                'loggable_type' => $applications->count() > 4 ? 'App\\Models\\Application' : null,
                'loggable_id' => $applications->count() > 4 ? $applications[4]->id : null,
                'ip_address' => $ipAddresses[2],
                'metadata' => ['previous_status' => 'shortlisted', 'new_status' => 'interview_invited'],
                'created_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'action' => 'updated',
                'description' => 'Cập nhật trạng thái: đã phỏng vấn.',
                'loggable_type' => $applications->count() > 4 ? 'App\\Models\\Application' : null,
                'loggable_id' => $applications->count() > 4 ? $applications[4]->id : null,
                'ip_address' => $ipAddresses[2],
                'metadata' => ['previous_status' => 'interview_invited', 'new_status' => 'interviewed'],
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'updated',
                'description' => 'Tuyển dụng ứng viên thành công.',
                'loggable_type' => $applications->count() > 4 ? 'App\\Models\\Application' : null,
                'loggable_id' => $applications->count() > 4 ? $applications[4]->id : null,
                'ip_address' => $ipAddresses[1],
                'metadata' => ['previous_status' => 'interviewed', 'new_status' => 'hired'],
                'created_at' => $now->copy()->subDay(),
            ],
            [
                'user_id' => $staffUsers['NV007']->id ?? null,
                'action' => 'updated',
                'description' => 'Từ chối hồ sơ: không đáp ứng yêu cầu kỹ thuật.',
                'ip_address' => $ipAddresses[6],
                'metadata' => ['previous_status' => 'reviewing', 'new_status' => 'rejected', 'reason' => 'Không đủ kinh nghiệm'],
                'created_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id' => $workerUsers->count() > 9 ? $workerUsers[9]->id : null,
                'action' => 'created',
                'description' => 'Lý Văn Sơn nộp hồ sơ ứng tuyển vị trí Lái xe giao hàng.',
                'ip_address' => $ipAddresses[7],
                'metadata' => ['job_title' => 'Lái xe giao hàng', 'match_score' => 92.40],
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $workerUsers->count() > 3 ? $workerUsers[3]->id : null,
                'action' => 'created',
                'description' => 'Phạm Đức Mạnh nộp hồ sơ ứng tuyển vị trí Bảo vệ tòa nhà.',
                'ip_address' => $ipAddresses[5],
                'metadata' => ['job_title' => 'Bảo vệ tòa nhà', 'match_score' => 90.20],
                'created_at' => $now->copy()->subDay(),
            ],

            // === Task events (8) ===
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'assigned',
                'description' => 'Giao việc duyệt hồ sơ ứng viên cho Trần Thị Mai.',
                'loggable_type' => $tasks->count() > 0 ? 'App\\Models\\TaskAssignment' : null,
                'loggable_id' => $tasks->count() > 0 ? $tasks[0]->id : null,
                'ip_address' => $ipAddresses[1],
                'metadata' => ['assigned_to' => 'Trần Thị Mai', 'deadline' => $now->copy()->addDays(2)->toISOString()],
                'created_at' => $now->copy()->subHours(6),
            ],
            [
                'user_id' => $staffUsers['NV001']->id ?? null,
                'action' => 'assigned',
                'description' => 'Giao việc duyệt tin tuyển dụng Pha chế cho Lê Hoàng Nam.',
                'loggable_type' => $tasks->count() > 2 ? 'App\\Models\\TaskAssignment' : null,
                'loggable_id' => $tasks->count() > 2 ? $tasks[2]->id : null,
                'ip_address' => $ipAddresses[0],
                'metadata' => ['assigned_to' => 'Lê Hoàng Nam', 'priority' => 'high'],
                'created_at' => $now->copy()->subHours(5),
            ],
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'action' => 'updated',
                'description' => 'Bắt đầu phỏng vấn ứng viên Ngô Văn Tài.',
                'loggable_type' => $tasks->count() > 3 ? 'App\\Models\\TaskAssignment' : null,
                'loggable_id' => $tasks->count() > 3 ? $tasks[3]->id : null,
                'ip_address' => $ipAddresses[2],
                'metadata' => ['previous_status' => 'pending', 'new_status' => 'in_progress'],
                'created_at' => $now->copy()->subHours(3),
            ],
            [
                'user_id' => $staffUsers['NV007']->id ?? null,
                'action' => 'updated',
                'description' => 'Hoàn thành duyệt hồ sơ ứng viên Lê Thị Thanh.',
                'ip_address' => $ipAddresses[6],
                'metadata' => ['previous_status' => 'in_progress', 'new_status' => 'completed'],
                'created_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id' => $staffUsers['NV010']->id ?? null,
                'action' => 'updated',
                'description' => 'Hoàn thành kiểm tra nhà trọ Hoa Sen.',
                'loggable_type' => $dormitories->count() > 1 ? 'App\\Models\\Dormitory' : null,
                'loggable_id' => $dormitories->count() > 1 ? $dormitories[1]->id : null,
                'ip_address' => $ipAddresses[8],
                'metadata' => ['task_type' => 'verify_accommodation', 'result' => 'pass_with_notes'],
                'created_at' => $now->copy()->subDays(4),
            ],
            [
                'user_id' => $staffUsers['NV004']->id ?? null,
                'action' => 'assigned',
                'description' => 'Giao việc kiểm tra nhà trọ Bình Minh cho Hoàng Thị Ngọc.',
                'loggable_type' => $dormitories->count() > 0 ? 'App\\Models\\Dormitory' : null,
                'loggable_id' => $dormitories->count() > 0 ? $dormitories[0]->id : null,
                'ip_address' => $ipAddresses[7],
                'metadata' => ['assigned_to' => 'Hoàng Thị Ngọc'],
                'created_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id' => $staffUsers['NV009']->id ?? null,
                'action' => 'updated',
                'description' => 'Hoàn thành xác minh doanh nghiệp FPT Software.',
                'loggable_type' => $employers->count() > 0 ? 'App\\Models\\Employer' : null,
                'loggable_id' => $employers->count() > 0 ? $employers[0]->id : null,
                'ip_address' => $ipAddresses[4],
                'metadata' => ['task_type' => 'verify_employer', 'result' => 'verified'],
                'created_at' => $now->copy()->subDays(5),
            ],
            [
                'user_id' => $staffUsers['NV002']->id ?? null,
                'action' => 'assigned',
                'description' => 'Giao việc xác minh doanh nghiệp Tiki cho Trần Văn Bình.',
                'ip_address' => $ipAddresses[4],
                'metadata' => ['assigned_to' => 'Trần Văn Bình', 'employer' => 'Tiki Corporation'],
                'created_at' => $now->copy()->subDays(2),
            ],

            // === Employer verification events (4) ===
            [
                'user_id' => $staffUsers['NV009']->id ?? null,
                'action' => 'approved',
                'description' => 'Xác minh doanh nghiệp Công ty TNHH Thực phẩm Việt.',
                'loggable_type' => $employers->count() > 0 ? 'App\\Models\\Employer' : null,
                'loggable_id' => $employers->count() > 0 ? $employers[0]->id : null,
                'ip_address' => $ipAddresses[4],
                'metadata' => ['tax_code_verified' => true, 'license_verified' => true],
                'created_at' => $now->copy()->subDays(7),
            ],
            [
                'user_id' => $staffUsers['NV011']->id ?? null,
                'action' => 'approved',
                'description' => 'Xác minh doanh nghiệp Khách sạn Sunrise.',
                'loggable_type' => $employers->count() > 1 ? 'App\\Models\\Employer' : null,
                'loggable_id' => $employers->count() > 1 ? $employers[1]->id : null,
                'ip_address' => $ipAddresses[6],
                'metadata' => ['tax_code_verified' => true, 'license_verified' => true],
                'created_at' => $now->copy()->subDays(6),
            ],
            [
                'user_id' => $staffUsers['NV011']->id ?? null,
                'action' => 'approved',
                'description' => 'Xác minh doanh nghiệp Siêu thị MegaMart.',
                'loggable_type' => $employers->count() > 2 ? 'App\\Models\\Employer' : null,
                'loggable_id' => $employers->count() > 2 ? $employers[2]->id : null,
                'ip_address' => $ipAddresses[6],
                'metadata' => ['tax_code_verified' => true, 'license_verified' => true, 'site_visit' => true],
                'created_at' => $now->copy()->subDays(5),
            ],
            [
                'user_id' => $staffUsers['NV001']->id ?? null,
                'action' => 'updated',
                'description' => 'Cập nhật cấu hình hệ thống: thêm template email phỏng vấn.',
                'ip_address' => $ipAddresses[9],
                'metadata' => ['module' => 'settings', 'setting' => 'email_templates', 'action' => 'add_interview_template'],
                'created_at' => $now->copy()->subDays(6),
            ],

            // === Dormitory events (4) ===
            [
                'user_id' => $staffUsers['NV004']->id ?? null,
                'action' => 'approved',
                'description' => 'Duyệt khu trọ Bình Minh vào hệ thống liên kết.',
                'loggable_type' => $dormitories->count() > 0 ? 'App\\Models\\Dormitory' : null,
                'loggable_id' => $dormitories->count() > 0 ? $dormitories[0]->id : null,
                'ip_address' => $ipAddresses[7],
                'metadata' => ['dormitory_name' => 'Khu trọ Bình Minh', 'total_rooms' => 20],
                'created_at' => $now->copy()->subDays(5),
            ],
            [
                'user_id' => $staffUsers['NV004']->id ?? null,
                'action' => 'approved',
                'description' => 'Duyệt khu trọ Hoa Sen vào hệ thống liên kết.',
                'loggable_type' => $dormitories->count() > 1 ? 'App\\Models\\Dormitory' : null,
                'loggable_id' => $dormitories->count() > 1 ? $dormitories[1]->id : null,
                'ip_address' => $ipAddresses[7],
                'metadata' => ['dormitory_name' => 'Khu trọ Hoa Sen', 'total_rooms' => 15],
                'created_at' => $now->copy()->subDays(4),
            ],
            [
                'user_id' => $staffUsers['NV010']->id ?? null,
                'action' => 'updated',
                'description' => 'Cập nhật thông tin phòng tại khu trọ Biển Đông.',
                'loggable_type' => $dormitories->count() > 2 ? 'App\\Models\\Dormitory' : null,
                'loggable_id' => $dormitories->count() > 2 ? $dormitories[2]->id : null,
                'ip_address' => $ipAddresses[8],
                'metadata' => ['updated_fields' => ['rooms', 'pricing'], 'dormitory_name' => 'Khu trọ Biển Đông'],
                'created_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id' => $staffUsers['NV001']->id ?? null,
                'action' => 'login',
                'description' => 'Nguyễn Văn Hải đã đăng nhập hệ thống (phiên trước).',
                'ip_address' => $ipAddresses[0],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Windows NT 10.0) Chrome/123.0', 'device' => 'desktop'],
                'created_at' => $now->copy()->subDays(1)->subHours(6),
            ],

            // === Logout events (3) ===
            [
                'user_id' => $staffUsers['NV001']->id ?? null,
                'action' => 'logout',
                'description' => 'Nguyễn Văn Hải đã đăng xuất.',
                'ip_address' => $ipAddresses[0],
                'created_at' => $now->copy()->subDays(1)->subHours(2),
            ],
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'action' => 'logout',
                'description' => 'Trần Thị Mai đã đăng xuất.',
                'ip_address' => $ipAddresses[2],
                'created_at' => $now->copy()->subDays(1)->subHours(1),
            ],
            [
                'user_id' => $staffUsers['NV002']->id ?? null,
                'action' => 'logout',
                'description' => 'Trần Thị Lan đã đăng xuất.',
                'ip_address' => $ipAddresses[4],
                'created_at' => $now->copy()->subDays(2)->subHours(3),
            ],

            // === Additional entries to reach 50 ===
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'login',
                'description' => 'Lê Hoàng Nam đã đăng nhập hệ thống (phiên trước).',
                'ip_address' => $ipAddresses[1],
                'metadata' => ['user_agent' => 'Mozilla/5.0 (Macintosh) Chrome/123.0', 'device' => 'desktop'],
                'created_at' => $now->copy()->subDays(3)->subHours(8),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'action' => 'logout',
                'description' => 'Lê Hoàng Nam đã đăng xuất.',
                'ip_address' => $ipAddresses[1],
                'created_at' => $now->copy()->subDays(3)->subHours(1),
            ],
            [
                'user_id' => $staffUsers['NV008']->id ?? null,
                'action' => 'updated',
                'description' => 'Đỗ Thị Lan bắt đầu soạn báo cáo tuyển dụng tháng 3.',
                'ip_address' => $ipAddresses[6],
                'metadata' => ['task_type' => 'custom', 'status' => 'in_progress'],
                'created_at' => $now->copy()->subDays(3),
            ],
        ];

        foreach ($logs as $log) {
            if (!isset($log['user_id']) || !$log['user_id']) {
                continue;
            }

            // Convert metadata to JSON if present
            if (isset($log['metadata']) && is_array($log['metadata'])) {
                $log['metadata'] = json_encode($log['metadata']);
            }

            ActivityLog::create($log);
        }
    }
}
