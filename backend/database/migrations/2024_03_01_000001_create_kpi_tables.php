<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // KPI metric definitions
        Schema::create('kpi_configs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->comment('e.g. So khach hang moi, Ty le dap ung');
            $table->string('code', 50)->unique()->comment('e.g. new_clients, fill_rate');
            $table->text('description')->nullable();
            $table->string('unit', 20)->default('count')->comment('count, percent, amount, hours, score');
            $table->json('applicable_roles')->comment('["sales","recruiter","manager"]');
            $table->string('calculation_method', 20)->default('manual')->comment('manual / auto');
            $table->string('auto_source', 50)->nullable()->comment('orders_count, fill_rate, revenue, etc.');
            $table->decimal('default_target', 12, 2)->default(0);
            $table->decimal('weight', 5, 2)->default(1)->comment('Default weight for scoring');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestampsTz();

            $table->index('is_active', 'idx_kpi_configs_active');
            $table->index('code', 'idx_kpi_configs_code');
        });

        // KPI evaluation periods
        Schema::create('kpi_periods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->comment('e.g. Thang 04/2026, Q1/2026');
            $table->string('type', 20)->default('monthly')->comment('monthly / quarterly / yearly');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status', 20)->default('open')->comment('open / closed / locked');
            $table->uuid('created_by')->nullable();
            $table->timestampsTz();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->index('status', 'idx_kpi_periods_status');
            $table->index(['start_date', 'end_date'], 'idx_kpi_periods_dates');
        });

        // Individual KPI scores per employee per period
        Schema::create('kpi_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('kpi_period_id');
            $table->uuid('user_id')->comment('Staff member being evaluated');
            $table->uuid('kpi_config_id');
            $table->decimal('target_value', 12, 2)->default(0);
            $table->decimal('actual_value', 12, 2)->nullable();
            $table->decimal('score', 5, 2)->nullable()->comment('0-100 calculated score');
            $table->decimal('weight', 5, 2)->default(1)->comment('Weight of this KPI');
            $table->text('notes')->nullable();
            $table->uuid('evaluated_by')->nullable();
            $table->timestampTz('evaluated_at')->nullable();
            $table->timestampsTz();

            $table->foreign('kpi_period_id')->references('id')->on('kpi_periods')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('kpi_config_id')->references('id')->on('kpi_configs')->cascadeOnDelete();
            $table->foreign('evaluated_by')->references('id')->on('users')->nullOnDelete();

            $table->unique(['kpi_period_id', 'user_id', 'kpi_config_id'], 'uk_kpi_records_period_user_config');
            $table->index('user_id', 'idx_kpi_records_user');
            $table->index('kpi_period_id', 'idx_kpi_records_period');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_records');
        Schema::dropIfExists('kpi_periods');
        Schema::dropIfExists('kpi_configs');
    }
};
