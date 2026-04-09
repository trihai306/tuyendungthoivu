<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Base salary configuration for each staff member
        Schema::create('staff_salary_configs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->decimal('base_salary', 15, 0)->default(0)->comment('VND monthly base salary');
            $table->decimal('allowance', 15, 0)->default(0)->comment('VND monthly allowance');
            $table->decimal('kpi_bonus_rate', 5, 2)->default(0)->comment('% bonus based on KPI score');
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->text('notes')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestampsTz();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->index('user_id', 'idx_staff_salary_user');
            $table->index(['effective_from', 'effective_to'], 'idx_staff_salary_effective');
        });

        // Monthly staff payroll records
        Schema::create('staff_payrolls', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('payroll_code', 20)->unique()->comment('Auto: SPR-YYYYMM-XXX');
            $table->uuid('user_id');
            $table->smallInteger('period_month')->comment('1-12');
            $table->smallInteger('period_year');

            // Salary components
            $table->decimal('base_salary', 15, 0)->default(0);
            $table->decimal('allowance', 15, 0)->default(0);
            $table->decimal('kpi_score', 5, 2)->nullable()->comment('Overall KPI score 0-100');
            $table->decimal('kpi_bonus', 15, 0)->default(0)->comment('Bonus from KPI');
            $table->decimal('overtime_amount', 15, 0)->default(0);
            $table->decimal('deduction_amount', 15, 0)->default(0);
            $table->text('deduction_notes')->nullable();
            $table->decimal('gross_amount', 15, 0)->default(0);
            $table->decimal('insurance_amount', 15, 0)->default(0)->comment('BHXH + BHYT + BHTN');
            $table->decimal('tax_amount', 15, 0)->default(0)->comment('PIT');
            $table->decimal('net_amount', 15, 0)->default(0);

            // Attendance summary
            $table->smallInteger('working_days')->default(0);
            $table->smallInteger('absent_days')->default(0);
            $table->smallInteger('late_count')->default(0);

            // Status workflow
            $table->string('status', 20)->default('draft')->comment('draft / reviewed / approved / paid');
            $table->uuid('calculated_by')->nullable();
            $table->uuid('reviewed_by')->nullable();
            $table->timestampTz('reviewed_at')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->timestampTz('approved_at')->nullable();
            $table->timestampTz('paid_at')->nullable();
            $table->string('payment_method', 20)->nullable()->comment('cash / bank_transfer');
            $table->string('payment_reference', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestampsTz();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('calculated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->unique(['user_id', 'period_month', 'period_year'], 'uk_staff_payrolls_user_period');
            $table->index('status', 'idx_staff_payrolls_status');
            $table->index(['period_month', 'period_year'], 'idx_staff_payrolls_period');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_payrolls');
        Schema::dropIfExists('staff_salary_configs');
    }
};
