<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payrolls_v2', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('payroll_code', 20)->unique()->comment('Auto: PRL-YYYYMM-XXX');
            $table->uuid('worker_id');
            $table->uuid('order_id')->nullable()->comment('Nullable for consolidated payrolls');
            $table->date('period_start');
            $table->date('period_end');

            // Work details
            $table->smallInteger('total_days')->default(0);
            $table->decimal('total_hours', 6, 1)->default(0);
            $table->decimal('overtime_hours', 6, 1)->default(0);

            // Salary details
            $table->decimal('unit_price', 12, 0)->default(0)->comment('VND per hour or per day');
            $table->string('rate_type', 10)->default('daily')->comment('hourly / daily / shift');
            $table->decimal('base_amount', 15, 2)->default(0);
            $table->decimal('overtime_amount', 15, 2)->default(0);
            $table->decimal('allowance_amount', 15, 2)->default(0);
            $table->decimal('deduction_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->default(0);

            // Status
            $table->string('status', 20)->default('draft')->comment('draft / reviewed / approved / paid');
            $table->uuid('approved_by')->nullable();
            $table->timestampTz('approved_at')->nullable();
            $table->timestampTz('paid_at')->nullable();
            $table->string('payment_method', 20)->nullable()->comment('cash / bank_transfer');
            $table->string('payment_reference', 100)->nullable();
            $table->text('notes')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestampsTz();

            // Foreign keys
            $table->foreign('worker_id')->references('id')->on('workers')->cascadeOnDelete();
            $table->foreign('order_id')->references('id')->on('staffing_orders')->nullOnDelete();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index('worker_id', 'idx_payrolls_v2_worker_id');
            $table->index('order_id', 'idx_payrolls_v2_order_id');
            $table->index('status', 'idx_payrolls_v2_status');
            $table->index(['period_start', 'period_end'], 'idx_payrolls_v2_period');
            $table->index('paid_at', 'idx_payrolls_v2_paid_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls_v2');
    }
};
