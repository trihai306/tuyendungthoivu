<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('contract_id')->constrained('labor_contracts');
            $table->foreignUuid('worker_profile_id')->constrained();
            $table->date('period_start');
            $table->date('period_end');
            $table->integer('total_shifts')->nullable();
            $table->decimal('total_hours', 6, 1)->nullable();
            $table->decimal('ot_hours', 6, 1)->nullable();
            $table->decimal('base_salary', 12, 0)->nullable();
            $table->decimal('ot_salary', 12, 0)->nullable();
            $table->decimal('allowances', 12, 0)->default(0);
            $table->decimal('gross_salary', 12, 0)->nullable();
            $table->decimal('housing_deduct', 12, 0)->default(0);
            $table->decimal('advance_deduct', 12, 0)->default(0);
            $table->decimal('net_salary', 12, 0)->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_method')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
