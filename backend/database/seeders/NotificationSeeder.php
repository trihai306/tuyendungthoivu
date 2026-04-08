<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\JobPost;
use App\Models\Notification;
use App\Models\TaskAssignment;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // Fetch staff users
        $staffUsers = User::whereNotNull('employee_code')->get()->keyBy('employee_code');

        // Fetch employer users (re-index from 0)
        $employerUsers = User::where('role', 'employer')->get()->values();

        // Fetch worker users (re-index from 0)
        $workerUsers = User::where('role', 'worker')->get()->values();

        // Fetch some reference entities
        $applications = Application::take(5)->get();
        $jobPosts = JobPost::take(5)->get();
        $tasks = TaskAssignment::take(5)->get();

        $notifications = [
            // === application_received (6) - for recruiters/managers ===
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'title' => 'Hồ sơ ứng tuyển mới',
                'body' => 'Ứng viên Nguyễn Thị Hoa đã nộp hồ sơ ứng tuyển vị trí Nhân viên phục vụ nhà hàng.',
                'type' => 'application_received',
                'reference_type' => $applications->count() > 0 ? 'App\\Models\\Application' : null,
                'reference_id' => $applications->count() > 0 ? $applications[0]->id : null,
                'is_read' => false,
                'created_at' => $now->copy()->subHours(3),
            ],
            [
                'user_id' => $staffUsers['NV007']->id ?? null,
                'title' => 'Hồ sơ ứng tuyển mới',
                'body' => 'Ứng viên Hoàng Thị Mai đã nộp hồ sơ ứng tuyển vị trí Nhân viên bán hàng tại MegaMart.',
                'type' => 'application_received',
                'reference_type' => $applications->count() > 1 ? 'App\\Models\\Application' : null,
                'reference_id' => $applications->count() > 1 ? $applications[1]->id : null,
                'is_read' => false,
                'created_at' => $now->copy()->subHours(5),
            ],
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'title' => 'Hồ sơ ứng tuyển mới',
                'body' => 'Ứng viên Lý Văn Sơn đã nộp hồ sơ ứng tuyển vị trí Lái xe giao hàng tại Tiki.',
                'type' => 'application_received',
                'is_read' => true,
                'read_at' => $now->copy()->subHours(2),
                'created_at' => $now->copy()->subHours(6),
            ],
            [
                'user_id' => $staffUsers['NV006']->id ?? null,
                'title' => 'Hồ sơ ứng tuyển mới',
                'body' => 'Ứng viên Phạm Đức Mạnh đã nộp hồ sơ ứng tuyển vị trí Bảo vệ tòa nhà.',
                'type' => 'application_received',
                'is_read' => false,
                'created_at' => $now->copy()->subHours(8),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'title' => '5 hồ sơ mới hôm nay',
                'body' => 'Hệ thống đã nhận được 5 hồ sơ ứng tuyển mới trong ngày. Vui lòng xem xét và phân công duyệt hồ sơ.',
                'type' => 'application_received',
                'is_read' => true,
                'read_at' => $now->copy()->subHours(1),
                'created_at' => $now->copy()->subHours(4),
            ],
            [
                'user_id' => $staffUsers['NV008']->id ?? null,
                'title' => 'Hồ sơ ứng tuyển mới',
                'body' => 'Ứng viên Đinh Văn Long đã nộp hồ sơ ứng tuyển vị trí Nhân viên kho tại Masan.',
                'type' => 'application_received',
                'is_read' => false,
                'created_at' => $now->copy()->subDays(1),
            ],

            // === application_status_changed (5) - for workers ===
            [
                'user_id' => $workerUsers->count() > 0 ? $workerUsers[0]->id : null,
                'title' => 'Cập nhật trạng thái hồ sơ',
                'body' => 'Hồ sơ ứng tuyển vị trí Nhân viên phục vụ nhà hàng của bạn đang được xem xét.',
                'type' => 'application_status_changed',
                'is_read' => false,
                'created_at' => $now->copy()->subHours(2),
            ],
            [
                'user_id' => $workerUsers->count() > 2 ? $workerUsers[2]->id : null,
                'title' => 'Hồ sơ được chọn vào vòng phỏng vấn',
                'body' => 'Chúc mừng! Hồ sơ ứng tuyển vị trí Lễ tân khách sạn của bạn đã được chọn vào vòng phỏng vấn.',
                'type' => 'application_status_changed',
                'is_read' => true,
                'read_at' => $now->copy()->subHours(4),
                'created_at' => $now->copy()->subHours(8),
            ],
            [
                'user_id' => $workerUsers->count() > 1 ? $workerUsers[1]->id : null,
                'title' => 'Hồ sơ vào danh sách chọn lọc',
                'body' => 'Hồ sơ ứng tuyển vị trí Lái xe giao hàng của bạn đã được đưa vào danh sách chọn lọc. Chúng tôi sẽ liên hệ sớm.',
                'type' => 'application_status_changed',
                'is_read' => true,
                'read_at' => $now->copy()->subDays(1),
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $workerUsers->count() > 6 ? $workerUsers[6]->id : null,
                'title' => 'Hồ sơ không đạt yêu cầu',
                'body' => 'Rất tiếc, hồ sơ ứng tuyển vị trí Kỹ sư phần mềm của bạn chưa đáp ứng yêu cầu. Hãy thử ứng tuyển các vị trí khác.',
                'type' => 'application_status_changed',
                'is_read' => false,
                'created_at' => $now->copy()->subDays(1),
            ],
            [
                'user_id' => $workerUsers->count() > 7 ? $workerUsers[7]->id : null,
                'title' => 'Chúc mừng! Bạn đã được tuyển dụng',
                'body' => 'Chúc mừng! Bạn đã được tuyển dụng vào vị trí Quản lý ca tại Khách sạn Sunrise. Vui lòng liên hệ để hoàn tất thủ tục.',
                'type' => 'application_status_changed',
                'is_read' => true,
                'read_at' => $now->copy()->subDays(3),
                'created_at' => $now->copy()->subDays(4),
            ],

            // === job_approved (4) - for employer users ===
            [
                'user_id' => $employerUsers->count() > 0 ? $employerUsers[0]->id : null,
                'title' => 'Tin tuyển dụng đã được duyệt',
                'body' => 'Tin tuyển dụng "Nhân viên phục vụ nhà hàng" đã được duyệt và hiển thị công khai trên hệ thống.',
                'type' => 'job_approved',
                'reference_type' => $jobPosts->count() > 0 ? 'App\\Models\\JobPost' : null,
                'reference_id' => $jobPosts->count() > 0 ? $jobPosts[0]->id : null,
                'is_read' => true,
                'read_at' => $now->copy()->subDays(5),
                'created_at' => $now->copy()->subDays(6),
            ],
            [
                'user_id' => $employerUsers->count() > 1 ? $employerUsers[1]->id : null,
                'title' => 'Tin tuyển dụng đã được duyệt',
                'body' => 'Tin tuyển dụng "Lễ tân khách sạn" đã được duyệt và đang hiển thị cho ứng viên.',
                'type' => 'job_approved',
                'is_read' => true,
                'read_at' => $now->copy()->subDays(3),
                'created_at' => $now->copy()->subDays(4),
            ],
            [
                'user_id' => $employerUsers->count() > 2 ? $employerUsers[2]->id : null,
                'title' => 'Tin tuyển dụng đã được duyệt',
                'body' => 'Tin tuyển dụng "Nhân viên bán hàng" tại MegaMart đã được duyệt thành công.',
                'type' => 'job_approved',
                'is_read' => false,
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $employerUsers->count() > 8 ? $employerUsers[8]->id : null,
                'title' => 'Tin tuyển dụng đã được duyệt',
                'body' => 'Tin tuyển dụng "Lái xe giao hàng" của Tiki đã được duyệt và publish.',
                'type' => 'job_approved',
                'is_read' => true,
                'read_at' => $now->copy()->subDays(7),
                'created_at' => $now->copy()->subDays(8),
            ],

            // === task_assigned (6) - for staff ===
            [
                'user_id' => $staffUsers['NV005']->id ?? null,
                'title' => 'Công việc mới được giao',
                'body' => 'Bạn được giao nhiệm vụ: Duyệt hồ sơ ứng viên Nguyễn Thị Hoa. Deadline: 2 ngày.',
                'type' => 'task_assigned',
                'reference_type' => $tasks->count() > 0 ? 'App\\Models\\TaskAssignment' : null,
                'reference_id' => $tasks->count() > 0 ? $tasks[0]->id : null,
                'is_read' => true,
                'read_at' => $now->copy()->subHours(1),
                'created_at' => $now->copy()->subHours(3),
            ],
            [
                'user_id' => $staffUsers['NV010']->id ?? null,
                'title' => 'Công việc mới được giao',
                'body' => 'Bạn được giao nhiệm vụ: Kiểm tra nhà trọ Bình Minh. Deadline: 3 ngày.',
                'type' => 'task_assigned',
                'is_read' => false,
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $staffUsers['NV011']->id ?? null,
                'title' => 'Công việc mới được giao',
                'body' => 'Bạn được giao nhiệm vụ: Xác minh doanh nghiệp Tiki Corporation. Deadline: 2 ngày.',
                'type' => 'task_assigned',
                'is_read' => true,
                'read_at' => $now->copy()->subDay(),
                'created_at' => $now->copy()->subDays(2),
            ],
            [
                'user_id' => $staffUsers['NV003']->id ?? null,
                'title' => 'Công việc mới được giao',
                'body' => 'Bạn được giao nhiệm vụ: Duyệt tin tuyển dụng Pha chế. Deadline: 1 ngày. Ưu tiên cao.',
                'type' => 'task_assigned',
                'is_read' => false,
                'created_at' => $now->copy()->subHours(6),
            ],
            [
                'user_id' => $staffUsers['NV008']->id ?? null,
                'title' => 'Công việc mới được giao',
                'body' => 'Bạn được giao nhiệm vụ: Báo cáo tuyển dụng tháng 3. Deadline: 4 ngày.',
                'type' => 'task_assigned',
                'is_read' => false,
                'created_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id' => $staffUsers['NV006']->id ?? null,
                'title' => 'Công việc mới được giao',
                'body' => 'Bạn được giao nhiệm vụ: Phỏng vấn ứng viên Đoàn Văn Thắng - Bảo vệ. Deadline: 1 ngày.',
                'type' => 'task_assigned',
                'is_read' => true,
                'read_at' => $now->copy()->subHours(4),
                'created_at' => $now->copy()->subHours(8),
            ],

            // === interview_scheduled (3) - for workers ===
            [
                'user_id' => $workerUsers->count() > 2 ? $workerUsers[2]->id : null,
                'title' => 'Lịch phỏng vấn đã được xác nhận',
                'body' => 'Lịch phỏng vấn vị trí Lễ tân khách sạn Sunrise đã được xác nhận vào ngày mai lúc 9:00. Địa điểm: 120 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng.',
                'type' => 'interview_scheduled',
                'is_read' => true,
                'read_at' => $now->copy()->subHours(12),
                'created_at' => $now->copy()->subDay(),
            ],
            [
                'user_id' => $workerUsers->count() > 9 ? $workerUsers[9]->id : null,
                'title' => 'Lịch phỏng vấn đã được xác nhận',
                'body' => 'Lịch phỏng vấn vị trí Nhân viên kho tại Masan đã được xác nhận vào ngày 10/04 lúc 14:00. Địa điểm: KCN Tân Phú Trung.',
                'type' => 'interview_scheduled',
                'is_read' => false,
                'created_at' => $now->copy()->subHours(10),
            ],
            [
                'user_id' => $workerUsers->count() > 3 ? $workerUsers[3]->id : null,
                'title' => 'Nhắc nhở phỏng vấn ngày mai',
                'body' => 'Nhắc nhở: Bạn có lịch phỏng vấn vị trí Bảo vệ tòa nhà vào ngày mai lúc 10:30 tại 200 Điện Biên Phủ, Bình Thạnh.',
                'type' => 'interview_scheduled',
                'is_read' => false,
                'created_at' => $now->copy()->subHours(4),
            ],

            // === Additional notifications to reach 30 ===
            [
                'user_id' => $staffUsers['NV007']->id ?? null,
                'title' => 'Nhắc nhở: deadline công việc sắp đến',
                'body' => 'Công việc "Duyệt hồ sơ ứng viên Hoàng Thị Mai" sắp đến deadline. Vui lòng hoàn thành trong 24h.',
                'type' => 'task_assigned',
                'is_read' => false,
                'created_at' => $now->copy()->subHours(2),
            ],
            [
                'user_id' => $workerUsers->count() > 5 ? $workerUsers[5]->id : null,
                'title' => 'Cập nhật hồ sơ thành công',
                'body' => 'Hồ sơ cá nhân của bạn đã được cập nhật thành công. Bạn có thể bắt đầu ứng tuyển các vị trí phù hợp.',
                'type' => 'application_status_changed',
                'is_read' => true,
                'read_at' => $now->copy()->subDays(2),
                'created_at' => $now->copy()->subDays(3),
            ],
            [
                'user_id' => $employerUsers->count() > 5 ? $employerUsers[5]->id : null,
                'title' => 'Có 2 ứng viên mới ứng tuyển',
                'body' => 'Tin tuyển dụng "Bảo vệ tòa nhà" đã nhận được 2 hồ sơ ứng tuyển mới.',
                'type' => 'application_received',
                'is_read' => false,
                'created_at' => $now->copy()->subDay(),
            ],
            [
                'user_id' => $employerUsers->count() > 3 ? $employerUsers[3]->id : null,
                'title' => 'Tin tuyển dụng đã được duyệt',
                'body' => 'Tin tuyển dụng "Phụ bếp nhà hàng" của nhà hàng Phố Xanh đã được duyệt và publish.',
                'type' => 'job_approved',
                'is_read' => true,
                'read_at' => $now->copy()->subDays(4),
                'created_at' => $now->copy()->subDays(5),
            ],
            [
                'user_id' => $workerUsers->count() > 11 ? $workerUsers[11]->id : null,
                'title' => 'Có việc làm phù hợp với bạn',
                'body' => 'Vị trí "Bảo vệ tòa nhà" tại Công ty An Ninh Sài Gòn phù hợp với kỹ năng của bạn. Hãy ứng tuyển ngay!',
                'type' => 'application_status_changed',
                'is_read' => false,
                'created_at' => $now->copy()->subHours(8),
            ],
            [
                'user_id' => $staffUsers['NV004']->id ?? null,
                'title' => 'Báo cáo kiểm tra nhà trọ',
                'body' => 'Hoàng Thị Ngọc đã hoàn thành báo cáo kiểm tra khu trọ Hoa Sen. Kết quả: Đạt yêu cầu (có ghi chú).',
                'type' => 'task_assigned',
                'is_read' => true,
                'read_at' => $now->copy()->subDays(5),
                'created_at' => $now->copy()->subDays(6),
            ],
        ];

        foreach ($notifications as $notif) {
            if (!$notif['user_id']) {
                continue;
            }
            Notification::create($notif);
        }
    }
}
