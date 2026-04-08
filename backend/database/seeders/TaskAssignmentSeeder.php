<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Dormitory;
use App\Models\JobPost;
use App\Models\TaskAssignment;
use App\Models\TaskComment;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // Fetch staff users by employee_code
        $hai = User::where('employee_code', 'NV001')->first();   // Super Admin
        $lan = User::where('employee_code', 'NV002')->first();   // Admin
        $nam = User::where('employee_code', 'NV003')->first();   // Manager Tuyen dung
        $duc = User::where('employee_code', 'NV004')->first();   // Manager Tro
        $mai = User::where('employee_code', 'NV005')->first();   // Recruiter 1
        $tuan = User::where('employee_code', 'NV006')->first();  // Recruiter 2
        $dung = User::where('employee_code', 'NV007')->first();  // Recruiter 3
        $lanDo = User::where('employee_code', 'NV008')->first(); // Recruiter 4
        $hung = User::where('employee_code', 'NV009')->first();  // Coordinator 1
        $ngoc = User::where('employee_code', 'NV010')->first();  // Coordinator 2
        $binh = User::where('employee_code', 'NV011')->first();  // Coordinator 3

        // Fetch some applications and jobs for related entities
        $applications = Application::take(10)->get();
        $jobPosts = JobPost::where('status', 'pending')->take(3)->get();
        $dormitories = Dormitory::take(3)->get();

        $tasks = [
            // === pending (5) ===
            [
                'title' => 'Duyệt hồ sơ ứng viên Nguyễn Thị Hoa',
                'description' => 'Xem xét hồ sơ ứng viên Nguyễn Thị Hoa ứng tuyển vị trí Nhân viên phục vụ nhà hàng. Kiểm tra kinh nghiệm, kỹ năng và đánh giá mức độ phù hợp.',
                'type' => 'review_application',
                'priority' => 'medium',
                'status' => 'pending',
                'assigned_by' => $nam->id,
                'assigned_to' => $mai->id,
                'related_type' => $applications->count() > 0 ? 'App\\Models\\Application' : null,
                'related_id' => $applications->count() > 0 ? $applications[0]->id : null,
                'deadline' => $now->copy()->addDays(2),
            ],
            [
                'title' => 'Duyệt hồ sơ ứng viên Hoàng Thị Mai',
                'description' => 'Xem xét hồ sơ ứng viên Hoàng Thị Mai ứng tuyển vị trí Nhân viên bán hàng tại MegaMart.',
                'type' => 'review_application',
                'priority' => 'medium',
                'status' => 'pending',
                'assigned_by' => $nam->id,
                'assigned_to' => $dung->id,
                'related_type' => $applications->count() > 1 ? 'App\\Models\\Application' : null,
                'related_id' => $applications->count() > 1 ? $applications[1]->id : null,
                'deadline' => $now->copy()->addDays(3),
            ],
            [
                'title' => 'Duyệt tin tuyển dụng Pha chế',
                'description' => 'Duyệt tin tuyển dụng vị trí Pha chế của nhà hàng Phố Xanh. Kiểm tra nội dung, mức lương và yêu cầu.',
                'type' => 'approve_job',
                'priority' => 'high',
                'status' => 'pending',
                'assigned_by' => $hai->id,
                'assigned_to' => $nam->id,
                'related_type' => $jobPosts->count() > 0 ? 'App\\Models\\JobPost' : null,
                'related_id' => $jobPosts->count() > 0 ? $jobPosts[0]->id : null,
                'deadline' => $now->copy()->addDay(),
            ],
            [
                'title' => 'Cập nhật JD Lái xe giao hàng',
                'description' => 'Cập nhật mô tả công việc vị trí Lái xe giao hàng tại Tiki theo yêu cầu mới từ nhà tuyển dụng. Bổ sung yêu cầu về bằng lái và kinh nghiệm.',
                'type' => 'custom',
                'priority' => 'low',
                'status' => 'pending',
                'assigned_by' => $nam->id,
                'assigned_to' => $tuan->id,
                'deadline' => $now->copy()->addDays(5),
            ],
            [
                'title' => 'Kiểm tra nhà trọ Sao Mai',
                'description' => 'Kiểm tra cơ sở vật chất, an ninh và điều kiện vệ sinh tại khu trọ Sao Mai, Nha Trang. Báo cáo chi tiết về tình trạng phòng và hạ tầng.',
                'type' => 'verify_accommodation',
                'priority' => 'medium',
                'status' => 'pending',
                'assigned_by' => $duc->id,
                'assigned_to' => $ngoc->id,
                'related_type' => $dormitories->count() > 2 ? 'App\\Models\\Dormitory' : null,
                'related_id' => $dormitories->count() > 2 ? $dormitories[2]->id : null,
                'deadline' => $now->copy()->addDays(7),
            ],

            // === in_progress (6) ===
            [
                'title' => 'Phỏng vấn ứng viên Ngô Văn Tài - Lễ tân',
                'description' => 'Phỏng vấn ứng viên Ngô Văn Tài cho vị trí Lễ tân khách sạn Sunrise. Đánh giá kỹ năng giao tiếp tiếng Anh, thái độ và kinh nghiệm.',
                'type' => 'interview_candidate',
                'priority' => 'high',
                'status' => 'in_progress',
                'assigned_by' => $nam->id,
                'assigned_to' => $mai->id,
                'related_type' => $applications->count() > 4 ? 'App\\Models\\Application' : null,
                'related_id' => $applications->count() > 4 ? $applications[4]->id : null,
                'deadline' => $now->copy()->addDays(1),
                'started_at' => $now->copy()->subHours(3),
            ],
            [
                'title' => 'Xác minh doanh nghiệp Tiki Corporation',
                'description' => 'Xác minh thông tin đăng ký kinh doanh, giấy phép và tính hợp pháp của Tiki Corporation. Kiểm tra mã số thuế và địa chỉ thực tế.',
                'type' => 'verify_employer',
                'priority' => 'high',
                'status' => 'in_progress',
                'assigned_by' => $lan->id,
                'assigned_to' => $binh->id,
                'deadline' => $now->copy()->addDays(2),
                'started_at' => $now->copy()->subDay(),
            ],
            [
                'title' => 'Duyệt tin tuyển dụng Thực tập sinh Marketing',
                'description' => 'Xem xét và duyệt tin tuyển dụng Thực tập sinh Marketing của MegaMart. Đánh giá nội dung và mức trợ cấp.',
                'type' => 'approve_job',
                'priority' => 'medium',
                'status' => 'in_progress',
                'assigned_by' => $hai->id,
                'assigned_to' => $nam->id,
                'related_type' => $jobPosts->count() > 1 ? 'App\\Models\\JobPost' : null,
                'related_id' => $jobPosts->count() > 1 ? $jobPosts[1]->id : null,
                'deadline' => $now->copy()->addDays(1),
                'started_at' => $now->copy()->subHours(5),
            ],
            [
                'title' => 'Kiểm tra nhà trọ Bình Minh',
                'description' => 'Kiểm tra định kỳ khu trọ Bình Minh, Q7. Kiểm tra hệ thống PCCC, an ninh, vệ sinh chung và phản hồi từ người thuê.',
                'type' => 'verify_accommodation',
                'priority' => 'medium',
                'status' => 'in_progress',
                'assigned_by' => $duc->id,
                'assigned_to' => $ngoc->id,
                'related_type' => $dormitories->count() > 0 ? 'App\\Models\\Dormitory' : null,
                'related_id' => $dormitories->count() > 0 ? $dormitories[0]->id : null,
                'deadline' => $now->copy()->addDays(3),
                'started_at' => $now->copy()->subDays(2),
            ],
            [
                'title' => 'Phỏng vấn ứng viên Đoàn Văn Thắng - Bảo vệ',
                'description' => 'Phỏng vấn ứng viên Đoàn Văn Thắng cho vị trí Bảo vệ tòa nhà tại An Ninh Sài Gòn. Kiểm tra chứng chỉ nghiệp vụ và kinh nghiệm.',
                'type' => 'interview_candidate',
                'priority' => 'high',
                'status' => 'in_progress',
                'assigned_by' => $nam->id,
                'assigned_to' => $tuan->id,
                'deadline' => $now->copy()->addDays(1),
                'started_at' => $now->copy()->subHours(6),
            ],
            [
                'title' => 'Báo cáo tuyển dụng tháng 3',
                'description' => 'Tổng hợp báo cáo tuyển dụng tháng 3: số lượng tin đăng, ứng viên, phỏng vấn, tuyển dụng thành công và tỷ lệ chuyển đổi.',
                'type' => 'custom',
                'priority' => 'medium',
                'status' => 'in_progress',
                'assigned_by' => $nam->id,
                'assigned_to' => $lanDo->id,
                'deadline' => $now->copy()->addDays(4),
                'started_at' => $now->copy()->subDays(3),
            ],

            // === completed (5) ===
            [
                'title' => 'Duyệt hồ sơ ứng viên Lê Thị Thanh - Dọn phòng',
                'description' => 'Đã duyệt hồ sơ ứng viên Lê Thị Thanh cho vị trí Nhân viên dọn phòng tại Resort Biển Xanh.',
                'type' => 'review_application',
                'priority' => 'medium',
                'status' => 'completed',
                'assigned_by' => $nam->id,
                'assigned_to' => $dung->id,
                'deadline' => $now->copy()->subDays(3),
                'started_at' => $now->copy()->subDays(5),
                'completed_at' => $now->copy()->subDays(3),
                'notes' => 'Hồ sơ đạt yêu cầu. Ứng viên có kinh nghiệm phù hợp.',
            ],
            [
                'title' => 'Xác minh doanh nghiệp FPT Software',
                'description' => 'Đã xác minh đầy đủ thông tin FPT Software: giấy phép kinh doanh, mã số thuế, trụ sở chính.',
                'type' => 'verify_employer',
                'priority' => 'high',
                'status' => 'completed',
                'assigned_by' => $lan->id,
                'assigned_to' => $hung->id,
                'deadline' => $now->copy()->subDays(7),
                'started_at' => $now->copy()->subDays(10),
                'completed_at' => $now->copy()->subDays(7),
                'notes' => 'Doanh nghiệp hợp lệ, mã số thuế chính xác, trụ sở hoạt động bình thường.',
            ],
            [
                'title' => 'Duyệt tin Nhân viên phục vụ nhà hàng',
                'description' => 'Đã duyệt tin tuyển dụng Nhân viên phục vụ của Công ty Thực phẩm Việt.',
                'type' => 'approve_job',
                'priority' => 'high',
                'status' => 'completed',
                'assigned_by' => $hai->id,
                'assigned_to' => $nam->id,
                'deadline' => $now->copy()->subDays(12),
                'started_at' => $now->copy()->subDays(13),
                'completed_at' => $now->copy()->subDays(12),
                'notes' => 'Tin tuyển dụng đã được duyệt và publish.',
            ],
            [
                'title' => 'Phỏng vấn ứng viên Trần Văn Hùng - Lái xe',
                'description' => 'Đã phỏng vấn ứng viên Trần Văn Hùng cho vị trí Lái xe giao hàng tại Tiki.',
                'type' => 'interview_candidate',
                'priority' => 'high',
                'status' => 'completed',
                'assigned_by' => $nam->id,
                'assigned_to' => $mai->id,
                'deadline' => $now->copy()->subDays(5),
                'started_at' => $now->copy()->subDays(7),
                'completed_at' => $now->copy()->subDays(5),
                'notes' => 'Ứng viên đạt yêu cầu. Có bằng lái B2 và 5 năm kinh nghiệm. Đề xuất tuyển.',
            ],
            [
                'title' => 'Kiểm tra nhà trọ Hoa Sen',
                'description' => 'Đã hoàn thành kiểm tra khu trọ Hoa Sen, Cầu Giấy.',
                'type' => 'verify_accommodation',
                'priority' => 'medium',
                'status' => 'completed',
                'assigned_by' => $duc->id,
                'assigned_to' => $ngoc->id,
                'related_type' => $dormitories->count() > 1 ? 'App\\Models\\Dormitory' : null,
                'related_id' => $dormitories->count() > 1 ? $dormitories[1]->id : null,
                'deadline' => $now->copy()->subDays(8),
                'started_at' => $now->copy()->subDays(10),
                'completed_at' => $now->copy()->subDays(8),
                'notes' => 'Cơ sở vật chất đạt yêu cầu. Cần bổ sung bình cứu hỏa tầng 2.',
            ],

            // === overdue (3) ===
            [
                'title' => 'Duyệt hồ sơ ứng viên Lý Văn Sơn',
                'description' => 'Duyệt hồ sơ ứng viên Lý Văn Sơn ứng tuyển vị trí Nhân viên kho tại Masan.',
                'type' => 'review_application',
                'priority' => 'high',
                'status' => 'overdue',
                'assigned_by' => $nam->id,
                'assigned_to' => $lanDo->id,
                'deadline' => $now->copy()->subDays(2),
                'started_at' => $now->copy()->subDays(4),
            ],
            [
                'title' => 'Duyệt tin CSKH Tiki',
                'description' => 'Duyệt tin tuyển dụng Nhân viên CSKH của Tiki Corporation. Đã quá hạn deadline.',
                'type' => 'approve_job',
                'priority' => 'urgent',
                'status' => 'overdue',
                'assigned_by' => $hai->id,
                'assigned_to' => $nam->id,
                'related_type' => $jobPosts->count() > 2 ? 'App\\Models\\JobPost' : null,
                'related_id' => $jobPosts->count() > 2 ? $jobPosts[2]->id : null,
                'deadline' => $now->copy()->subDay(),
            ],
            [
                'title' => 'Xác minh doanh nghiệp Masan Group',
                'description' => 'Xác minh thông tin doanh nghiệp Masan Group. Deadline đã qua.',
                'type' => 'verify_employer',
                'priority' => 'urgent',
                'status' => 'overdue',
                'assigned_by' => $lan->id,
                'assigned_to' => $binh->id,
                'deadline' => $now->copy()->subDays(3),
                'started_at' => $now->copy()->subDays(5),
            ],

            // === cancelled (1) ===
            [
                'title' => 'Phỏng vấn ứng viên Kim - Marketing',
                'description' => 'Phỏng vấn đã bị hủy do ứng viên rút hồ sơ.',
                'type' => 'interview_candidate',
                'priority' => 'low',
                'status' => 'cancelled',
                'assigned_by' => $nam->id,
                'assigned_to' => $mai->id,
                'deadline' => $now->copy()->subDays(1),
                'notes' => 'Ứng viên đã rút hồ sơ. Hủy lịch phỏng vấn.',
            ],
        ];

        $taskModels = [];
        foreach ($tasks as $task) {
            $taskModels[] = TaskAssignment::create($task);
        }

        // Create 2-3 comments for each task
        $this->createComments($taskModels, [
            $hai, $lan, $nam, $duc, $mai, $tuan, $dung, $lanDo, $hung, $ngoc, $binh,
        ]);
    }

    /**
     * Create comments for tasks.
     */
    private function createComments(array $tasks, array $users): void
    {
        $now = now();

        $commentTemplates = [
            'review_application' => [
                'Đã nhận hồ sơ, đang xem xét kỹ năng và kinh nghiệm của ứng viên.',
                'Hồ sơ khá tốt, match score cao. Nên chuyển sang vòng phỏng vấn.',
                'Cần bổ sung thêm thông tin về kinh nghiệm làm việc.',
                'Đã liên hệ ứng viên để xác nhận thông tin.',
                'Hồ sơ đạt yêu cầu cơ bản, đề xuất shortlist.',
            ],
            'interview_candidate' => [
                'Đã liên hệ ứng viên, lịch phỏng vấn đã được xác nhận.',
                'Ứng viên thể hiện tốt trong phần giao tiếp.',
                'Cần xác minh thêm về chứng chỉ và kinh nghiệm thực tế.',
                'Đánh giá: thái độ tốt, kỹ năng phù hợp.',
                'Ứng viên xin dời lịch phỏng vấn sang ngày mai.',
            ],
            'verify_employer' => [
                'Đã kiểm tra giấy phép kinh doanh, mã số thuế hợp lệ.',
                'Đang liên hệ Sở KH&ĐT để xác minh thông tin.',
                'Hồ sơ doanh nghiệp đầy đủ, đã xác minh địa chỉ thực tế.',
                'Cần bổ sung giấy phép hoạt động ngành.',
            ],
            'verify_accommodation' => [
                'Đã đến kiểm tra cơ sở. Nhìn chung đạt yêu cầu.',
                'Cần bổ sung thêm bình cứu hỏa và lối thoát hiểm.',
                'Vệ sinh sạch sẽ, an ninh tốt, wifi hoạt động ổn định.',
                'Phản hồi từ người thuê: hài lòng với dịch vụ.',
            ],
            'approve_job' => [
                'Nội dung tin tuyển dụng rõ ràng, mức lương phù hợp thị trường.',
                'Cần chỉnh sửa phần yêu cầu ứng viên cho rõ hơn.',
                'Đã duyệt, tin sẽ được publish trong 24h.',
                'Lương offer thấp hơn thị trường, cần trao đổi lại với employer.',
            ],
            'custom' => [
                'Đang xử lý, dự kiến hoàn thành đúng hạn.',
                'Cần thêm thông tin từ bộ phận liên quan.',
                'Đã hoàn thành 70% công việc.',
                'Update: đang chờ phản hồi từ đối tác.',
            ],
        ];

        foreach ($tasks as $index => $task) {
            $type = $task->type->value ?? $task->type;
            $templates = $commentTemplates[$type] ?? $commentTemplates['custom'];

            $commentCount = rand(2, 3);
            for ($c = 0; $c < $commentCount; $c++) {
                $commentUser = $users[array_rand($users)];

                // Use assignee or assigner as commenter with higher probability
                if (rand(0, 2) === 0) {
                    $commentUser = collect($users)->firstWhere('id', $task->assigned_to) ?? $commentUser;
                } elseif (rand(0, 2) === 0) {
                    $commentUser = collect($users)->firstWhere('id', $task->assigned_by) ?? $commentUser;
                }

                TaskComment::create([
                    'task_id' => $task->id,
                    'user_id' => $commentUser->id,
                    'content' => $templates[$c % count($templates)],
                    'created_at' => $now->copy()->subDays(rand(0, 5))->subHours(rand(1, 12)),
                    'updated_at' => $now->copy()->subDays(rand(0, 5))->subHours(rand(1, 12)),
                ]);
            }
        }
    }
}
