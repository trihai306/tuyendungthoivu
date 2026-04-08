<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('staffing_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_code', 20)->unique()->comment('Auto: DH-YYYYMMDD-XXX');
            $table->uuid('client_id');
            $table->uuid('client_contact_id')->nullable();
            $table->uuid('contract_id')->nullable();

            // Job info
            $table->string('position_name', 255);
            $table->text('job_description')->nullable();
            $table->text('work_address')->nullable();
            $table->string('work_district', 100)->nullable();
            $table->string('work_city', 100)->nullable();

            // Quantity & requirements
            $table->smallInteger('quantity_needed');
            $table->smallInteger('quantity_filled')->default(0);
            $table->string('gender_requirement', 10)->nullable()->comment('male / female / any');
            $table->smallInteger('age_min')->nullable();
            $table->smallInteger('age_max')->nullable();
            $table->jsonb('required_skills')->nullable()->comment('[{skill_id, skill_name}]');
            $table->text('other_requirements')->nullable();

            // Schedule
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('shift_type', 20)->nullable()->comment('morning / afternoon / evening / double / continuous');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->smallInteger('break_minutes')->default(0);

            // Financial
            $table->decimal('worker_rate', 12, 0)->nullable()->comment('VND rate paid to worker');
            $table->string('rate_type', 10)->default('daily')->comment('hourly / daily / shift');
            $table->decimal('service_fee', 12, 0)->nullable()->comment('Fee charged to client');
            $table->string('service_fee_type', 10)->default('percent')->comment('percent / fixed');
            $table->decimal('overtime_rate', 12, 0)->nullable();

            // Management
            $table->string('urgency', 10)->default('normal')->comment('normal / urgent / critical');
            $table->string('service_type', 20)->default('short_term')->comment('short_term / long_term / shift_based / project_based');
            $table->string('status', 20)->default('draft')->comment('draft / pending / approved / rejected / recruiting / filled / in_progress / completed / cancelled');
            $table->uuid('assigned_recruiter_id')->nullable();
            $table->uuid('created_by')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->timestampTz('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->text('notes')->nullable();
            $table->string('uniform_requirement', 255)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            // Foreign keys
            $table->foreign('client_id')->references('id')->on('clients')->cascadeOnDelete();
            $table->foreign('contract_id')->references('id')->on('client_contracts')->nullOnDelete();
            $table->foreign('assigned_recruiter_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index('client_id', 'idx_staffing_orders_client_id');
            $table->index('status', 'idx_staffing_orders_status');
            $table->index('urgency', 'idx_staffing_orders_urgency');
            $table->index('assigned_recruiter_id', 'idx_staffing_orders_assigned_recruiter_id');
            $table->index('created_by', 'idx_staffing_orders_created_by');
            $table->index(['start_date', 'end_date'], 'idx_staffing_orders_dates');
            $table->index('work_city', 'idx_staffing_orders_work_city');
            $table->index(['status', 'urgency'], 'idx_staffing_orders_status_urgency');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staffing_orders');
    }
};
