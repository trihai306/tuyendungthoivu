<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\JobPost;
use App\Models\WorkerProfile;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // Fetch all worker profiles (20 workers)
        $workers = WorkerProfile::all();

        // Fetch job posts by title
        $jobPhucVu = JobPost::where('title', 'Nhân viên phục vụ nhà hàng')->first();
        $jobLeTan = JobPost::where('title', 'Lễ tân khách sạn')->first();
        $jobBanHang = JobPost::where('title', 'Nhân viên bán hàng')->first();
        $jobPhuBep = JobPost::where('title', 'Phụ bếp nhà hàng')->first();
        $jobDonPhong = JobPost::where('title', 'Nhân viên dọn phòng')->first();
        $jobBaoVe = JobPost::where('title', 'Bảo vệ tòa nhà')->first();
        $jobLaiXe = JobPost::where('title', 'Lái xe giao hàng')->first();
        $jobKho = JobPost::where('title', 'Nhân viên kho')->first();
        $jobKySu = JobPost::where('title', 'Kỹ sư phần mềm')->first();
        $jobKinhDoanh = JobPost::where('title', 'Nhân viên kinh doanh')->first();
        $jobPhaChe = JobPost::where('title', 'Pha chế')->first();
        $jobCskh = JobPost::where('title', 'Nhân viên chăm sóc khách hàng')->first();
        $jobQuanLyCa = JobPost::where('title', 'Quản lý ca')->first();
        $jobVeSinh = JobPost::where('title', 'Nhân viên vệ sinh')->first();

        // Worker index mapping for readability
        // 0: Hoa (Phuc vu, Pha che) - HCM
        // 1: Hung (Lai xe, Giao hang) - HN
        // 2: Thanh (Don phong, Giat ui) - DN
        // 3: Manh (Bao ve) - HCM
        // 4: Mai (Ban hang, CRM) - HN
        // 5: Quang (Ky thuat dien, Sua chua) - Nha Trang
        // 6: Linh (Ke toan, Excel, SAP) - HCM
        // 7: Tai (Phuc vu, Le tan) - HP
        // 8: Phuong (Phuc vu, Don phong) - DN
        // 9: Son (Lai xe, Boc xep) - HCM
        // 10: Hanh (Pha che, Phuc vu) - HN
        // 11: Thang (Bao ve, Giam sat) - Nha Trang
        // 12: Kim (Marketing, Content) - HCM
        // 13: Long (Kho van, Kiem ke) - HN
        // 14: Ngan (Nau an, Phu bep) - DN
        // 15: Dung (Sua chua, Bao tri) - HCM
        // 16: Yen (Ban hang, Tu van) - HP
        // 17: Kien (CNTT, Sua may tinh) - HN
        // 18: Oanh (Giat ui, Don phong, Nau an) - Nha Trang
        // 19: Phuc (Giao hang, Lai xe may) - HCM

        $coverLetters = [
            'Kính gửi quý công ty, tôi rất hứng thú với vị trí này và tin rằng kinh nghiệm làm việc trước đây của tôi sẽ phù hợp với yêu cầu công việc. Tôi mong muốn được cống hiến và phát triển cùng công ty.',
            'Tôi viết thư này để ứng tuyển vào vị trí đang tuyển. Với kinh nghiệm và kỹ năng hiện có, tôi tự tin có thể đảm nhận tốt công việc được giao.',
            'Em xin gửi hồ sơ ứng tuyển vào vị trí này. Em là người chăm chỉ, cẩn thận và luôn sẵn sàng học hỏi những điều mới. Em mong được công ty tạo cơ hội.',
            'Tôi xin ứng tuyển vị trí này tại quý công ty. Tôi có niềm đam mê với công việc và luôn nỗ lực hoàn thành tốt nhất nhiệm vụ được giao.',
            'Kính gửi phòng Nhân sự, tôi đã tìm hiểu về công ty và rất ấn tượng với môi trường làm việc chuyên nghiệp. Tôi mong muốn được trở thành một phần của đội ngũ.',
            'Em rất quan tâm đến cơ hội việc làm này. Dù chưa có nhiều kinh nghiệm nhưng em có sự nhiệt huyết và khả năng học hỏi nhanh. Em cam kết sẽ cố gắng hết mình.',
            'Tôi đang tìm kiếm một công việc phù hợp với kỹ năng và mong muốn phát triển nghề nghiệp. Vị trí này hoàn toàn phù hợp với định hướng của tôi.',
        ];

        $applications = [
            // === pending (8) ===
            ['job' => $jobPhucVu, 'worker' => $workers[0], 'status' => 'new', 'days_ago' => 2, 'score' => 85.50],
            ['job' => $jobBanHang, 'worker' => $workers[4], 'status' => 'new', 'days_ago' => 1, 'score' => 78.30],
            ['job' => $jobDonPhong, 'worker' => $workers[18], 'status' => 'new', 'days_ago' => 3, 'score' => 72.10],
            ['job' => $jobBaoVe, 'worker' => $workers[3], 'status' => 'new', 'days_ago' => 1, 'score' => 90.20],
            ['job' => $jobKho, 'worker' => $workers[13], 'status' => 'new', 'days_ago' => 4, 'score' => 88.00],
            ['job' => $jobLaiXe, 'worker' => $workers[9], 'status' => 'new', 'days_ago' => 2, 'score' => 92.40],
            ['job' => $jobPhaChe, 'worker' => $workers[10], 'status' => 'new', 'days_ago' => 5, 'score' => 86.70],
            ['job' => $jobCskh, 'worker' => $workers[6], 'status' => 'new', 'days_ago' => 1, 'score' => 74.50],

            // === reviewing (5) ===
            ['job' => $jobPhucVu, 'worker' => $workers[7], 'status' => 'reviewing', 'days_ago' => 7, 'score' => 82.30],
            ['job' => $jobLeTan, 'worker' => $workers[7], 'status' => 'reviewing', 'days_ago' => 8, 'score' => 88.60],
            ['job' => $jobDonPhong, 'worker' => $workers[2], 'status' => 'reviewing', 'days_ago' => 6, 'score' => 91.20],
            ['job' => $jobKinhDoanh, 'worker' => $workers[4], 'status' => 'reviewing', 'days_ago' => 5, 'score' => 80.10],
            ['job' => $jobKySu, 'worker' => $workers[17], 'status' => 'reviewing', 'days_ago' => 10, 'score' => 76.80],

            // === shortlisted (4) ===
            ['job' => $jobPhucVu, 'worker' => $workers[8], 'status' => 'shortlisted', 'days_ago' => 12, 'score' => 87.90],
            ['job' => $jobBanHang, 'worker' => $workers[16], 'status' => 'shortlisted', 'days_ago' => 10, 'score' => 79.50],
            ['job' => $jobLaiXe, 'worker' => $workers[1], 'status' => 'shortlisted', 'days_ago' => 14, 'score' => 94.30],
            ['job' => $jobBanHang, 'worker' => $workers[0], 'status' => 'shortlisted', 'days_ago' => 11, 'score' => 83.40],

            // === interview (5) ===
            ['job' => $jobLeTan, 'worker' => $workers[2], 'status' => 'interview_invited', 'days_ago' => 15, 'score' => 85.20],
            ['job' => $jobBaoVe, 'worker' => $workers[11], 'status' => 'interview_invited', 'days_ago' => 13, 'score' => 91.00],
            ['job' => $jobKho, 'worker' => $workers[9], 'status' => 'interviewed', 'days_ago' => 18, 'score' => 86.50],
            ['job' => $jobKinhDoanh, 'worker' => $workers[12], 'status' => 'interviewed', 'days_ago' => 16, 'score' => 73.80],
            ['job' => $jobPhuBep, 'worker' => $workers[14], 'status' => 'interview_invited', 'days_ago' => 12, 'score' => 89.10],

            // === accepted (4) ===
            ['job' => $jobQuanLyCa, 'worker' => $workers[7], 'status' => 'passed', 'days_ago' => 25, 'score' => 92.70],
            ['job' => $jobVeSinh, 'worker' => $workers[18], 'status' => 'hired', 'days_ago' => 28, 'score' => 81.30],
            ['job' => $jobDonPhong, 'worker' => $workers[19], 'status' => 'passed', 'days_ago' => 20, 'score' => 88.40],
            ['job' => $jobLaiXe, 'worker' => $workers[19], 'status' => 'hired', 'days_ago' => 22, 'score' => 95.00],

            // === rejected (3) ===
            ['job' => $jobKySu, 'worker' => $workers[6], 'status' => 'rejected', 'days_ago' => 20, 'score' => 45.30],
            ['job' => $jobLeTan, 'worker' => $workers[16], 'status' => 'rejected', 'days_ago' => 18, 'score' => 52.10],
            ['job' => $jobPhucVu, 'worker' => $workers[15], 'status' => 'rejected', 'days_ago' => 15, 'score' => 38.70],

            // === withdrawn (1) ===
            ['job' => $jobBanHang, 'worker' => $workers[12], 'status' => 'withdrawn', 'days_ago' => 9, 'score' => 65.20],
        ];

        // Track unique pairs to avoid duplicates
        $existingPairs = [];

        foreach ($applications as $index => $app) {
            if (!$app['job'] || !$app['worker']) {
                continue;
            }

            $pairKey = $app['job']->id . '-' . $app['worker']->id;
            if (in_array($pairKey, $existingPairs)) {
                continue; // Skip duplicate pairs
            }
            $existingPairs[] = $pairKey;

            Application::create([
                'job_post_id' => $app['job']->id,
                'worker_profile_id' => $app['worker']->id,
                'cover_letter' => $coverLetters[$index % count($coverLetters)],
                'status' => $app['status'],
                'match_score' => $app['score'],
                'notes' => in_array($app['status'], ['rejected', 'withdrawn'])
                    ? ($app['status'] === 'rejected' ? 'Hồ sơ không đáp ứng yêu cầu tối thiểu.' : 'Ứng viên chủ động rút hồ sơ.')
                    : null,
                'applied_at' => $now->copy()->subDays($app['days_ago']),
            ]);
        }
    }
}
