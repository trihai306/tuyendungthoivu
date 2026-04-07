<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('worker_profiles', function (Blueprint $table) {
            // ID card images
            $table->string('id_card_front', 500)->nullable()->after('id_card_number');
            $table->string('id_card_back', 500)->nullable()->after('id_card_front');

            // Selfie / portrait photo
            $table->string('selfie_url', 500)->nullable()->after('id_card_back');

            // Health and transport
            $table->string('health_status', 50)->nullable()->after('bank_holder');
            $table->string('vehicle', 50)->nullable()->after('health_status');

            // Professional info
            $table->json('skills')->nullable()->after('vehicle');
            $table->decimal('experience_years', 3, 1)->default(0)->after('skills');
            $table->string('education')->nullable()->after('experience_years');
            $table->text('bio')->nullable()->after('education');

            // Availability and rating
            $table->string('availability_status', 20)->default('available')->after('bio');
            $table->decimal('rating', 2, 1)->default(0)->after('availability_status');
            $table->integer('review_count')->default(0)->after('rating');

            // City/District for filtering
            $table->string('city', 100)->nullable()->after('current_address');
            $table->string('district', 100)->nullable()->after('city');

            // Desired job preferences
            $table->json('desired_job_types')->nullable()->after('review_count');
            $table->json('desired_locations')->nullable()->after('desired_job_types');
            $table->decimal('desired_salary', 12, 0)->nullable()->after('desired_locations');
            $table->string('preferred_shift', 20)->nullable()->after('desired_salary');

            // eKYC verified timestamp
            $table->timestamp('ekyc_verified_at')->nullable()->after('ekyc_status');

            // Soft delete support
            $table->softDeletes();

            // Indexes
            $table->index('city');
            $table->index('district');
            $table->index('availability_status');
            $table->index('ekyc_status');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::table('worker_profiles', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropIndex(['city']);
            $table->dropIndex(['district']);
            $table->dropIndex(['availability_status']);
            $table->dropIndex(['ekyc_status']);
            $table->dropIndex(['rating']);

            $table->dropColumn([
                'id_card_front',
                'id_card_back',
                'selfie_url',
                'health_status',
                'vehicle',
                'skills',
                'experience_years',
                'education',
                'bio',
                'availability_status',
                'rating',
                'review_count',
                'city',
                'district',
                'desired_job_types',
                'desired_locations',
                'desired_salary',
                'preferred_shift',
                'ekyc_verified_at',
            ]);
        });
    }
};
