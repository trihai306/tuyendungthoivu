<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attendances_v2', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('assignment_id');
            $table->uuid('worker_id');
            $table->uuid('order_id');
            $table->date('work_date');

            // Check in/out
            $table->timestampTz('check_in_time')->nullable();
            $table->uuid('check_in_by')->nullable();
            $table->text('check_in_note')->nullable();
            $table->timestampTz('check_out_time')->nullable();
            $table->uuid('check_out_by')->nullable();
            $table->text('check_out_note')->nullable();

            // Calculation
            $table->smallInteger('break_minutes')->default(0);
            $table->decimal('total_hours', 4, 1)->nullable();
            $table->decimal('overtime_hours', 4, 1)->default(0);
            $table->string('status', 20)->default('present')
                ->comment('present / late / absent / half_day / excused');

            // Approval
            $table->boolean('is_approved')->default(false);
            $table->uuid('approved_by')->nullable();
            $table->timestampTz('approved_at')->nullable();
            $table->text('adjustment_reason')->nullable();

            $table->timestampsTz();

            // Foreign keys
            $table->foreign('assignment_id')->references('id')->on('assignments')->cascadeOnDelete();
            $table->foreign('worker_id')->references('id')->on('workers')->cascadeOnDelete();
            $table->foreign('order_id')->references('id')->on('staffing_orders')->cascadeOnDelete();
            $table->foreign('check_in_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('check_out_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index('assignment_id', 'idx_attendances_v2_assignment_id');
            $table->index('worker_id', 'idx_attendances_v2_worker_id');
            $table->index('order_id', 'idx_attendances_v2_order_id');
            $table->index('work_date', 'idx_attendances_v2_work_date');
            $table->index('status', 'idx_attendances_v2_status');
            $table->index('is_approved', 'idx_attendances_v2_is_approved');

            // One record per assignment per day
            $table->unique(['assignment_id', 'work_date'], 'unique_attendances_v2_assignment_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances_v2');
    }
};
