<?php

namespace App\Enums;

enum TaskType: string
{
    case ReviewApplication = 'review_application';
    case InterviewCandidate = 'interview_candidate';
    case VerifyEmployer = 'verify_employer';
    case VerifyAccommodation = 'verify_accommodation';
    case ApproveJob = 'approve_job';
    case Custom = 'custom';

    /**
     * Get all enum values as a flat array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get a human-readable label for the task type.
     */
    public function label(): string
    {
        return match ($this) {
            self::ReviewApplication => 'Duyệt hồ sơ ứng tuyển',
            self::InterviewCandidate => 'Phỏng vấn ứng viên',
            self::VerifyEmployer => 'Xác minh nhà tuyển dụng',
            self::VerifyAccommodation => 'Xác minh chỗ ở',
            self::ApproveJob => 'Duyệt tin tuyển dụng',
            self::Custom => 'Tùy chỉnh',
        };
    }
}
