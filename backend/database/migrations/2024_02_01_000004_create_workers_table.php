<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Skills catalog table
        Schema::create('skills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->unique();
            $table->string('category', 50)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->smallInteger('sort_order')->default(0);
            $table->timestampsTz();

            $table->index('category', 'idx_skills_category');
            $table->index('is_active', 'idx_skills_is_active');
        });

        // Workers table (replaces worker_profiles)
        Schema::create('workers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('worker_code', 20)->unique()->comment('Auto: WK-XXXXX');
            $table->uuid('user_id')->unique()->nullable();

            // Personal info
            $table->string('full_name', 255);
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 10)->nullable()->comment('male / female');
            $table->string('id_number', 20)->unique()->nullable()->comment('CCCD/CMND');
            $table->string('id_card_front_url', 500)->nullable();
            $table->string('id_card_back_url', 500)->nullable();
            $table->string('phone', 15);
            $table->string('email', 255)->nullable();
            $table->text('address')->nullable();
            $table->string('district', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('avatar_url', 500)->nullable();

            // Work info
            $table->text('experience_notes')->nullable();
            $table->jsonb('preferred_districts')->nullable()->comment('["Quan 1", "Quan 7"]');
            $table->string('availability', 20)->default('full_time')->comment('full_time / part_time / weekends_only');

            // Bank info
            $table->string('bank_name', 100)->nullable();
            $table->string('bank_account', 30)->nullable();
            $table->string('bank_account_name', 255)->nullable();

            // Stats (auto-calculated)
            $table->integer('total_orders')->default(0);
            $table->integer('total_days_worked')->default(0);
            $table->decimal('average_rating', 2, 1)->default(0);
            $table->integer('no_show_count')->default(0);
            $table->date('last_worked_date')->nullable();

            // Status
            $table->string('status', 20)->default('available')->comment('available / assigned / inactive / blacklisted');
            $table->text('blacklist_reason')->nullable();
            $table->uuid('registered_by')->nullable()->comment('Recruiter who registered this worker');
            $table->text('notes')->nullable();
            $table->string('emergency_contact_name', 255)->nullable();
            $table->string('emergency_contact_phone', 15)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('registered_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index('status', 'idx_workers_status');
            $table->index('city', 'idx_workers_city');
            $table->index('district', 'idx_workers_district');
            $table->index('phone', 'idx_workers_phone');
            $table->index('registered_by', 'idx_workers_registered_by');
            $table->index('average_rating', 'idx_workers_average_rating');
            $table->index('availability', 'idx_workers_availability');
            $table->index('last_worked_date', 'idx_workers_last_worked_date');
        });

        // Worker-Skill pivot table
        Schema::create('worker_skill', function (Blueprint $table) {
            $table->uuid('worker_id');
            $table->uuid('skill_id');
            $table->string('level', 20)->default('intermediate')->comment('beginner / intermediate / advanced');
            $table->decimal('years_experience', 3, 1)->nullable();
            $table->timestampTz('created_at')->nullable();

            $table->primary(['worker_id', 'skill_id']);
            $table->foreign('worker_id')->references('id')->on('workers')->cascadeOnDelete();
            $table->foreign('skill_id')->references('id')->on('skills')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_skill');
        Schema::dropIfExists('workers');
        Schema::dropIfExists('skills');
    }
};
