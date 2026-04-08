<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('payable_type', 50)->comment('invoice / payroll');
            $table->uuid('payable_id');
            $table->decimal('amount', 15, 2);
            $table->string('payment_method', 20)->comment('bank_transfer / cash / check');
            $table->date('payment_date');
            $table->string('reference_number', 100)->nullable();
            $table->text('notes')->nullable();
            $table->uuid('recorded_by')->nullable();
            $table->timestampsTz();

            // Foreign keys
            $table->foreign('recorded_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index(['payable_type', 'payable_id'], 'idx_payments_payable');
            $table->index('payment_date', 'idx_payments_payment_date');
            $table->index('recorded_by', 'idx_payments_recorded_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
