<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number', 20)->unique()->comment('Auto: INV-YYYYMM-XXX');
            $table->uuid('client_id');
            $table->date('period_start');
            $table->date('period_end');

            // Amounts
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax_rate', 4, 2)->default(0)->comment('Tax rate % e.g. 10.00');
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);

            // Payment
            $table->string('status', 20)->default('draft')
                ->comment('draft / approved / sent / partially_paid / paid / overdue / cancelled');
            $table->date('due_date')->nullable();
            $table->decimal('paid_amount', 15, 2)->default(0);

            // Management
            $table->uuid('approved_by')->nullable();
            $table->timestampTz('approved_at')->nullable();
            $table->timestampTz('sent_at')->nullable();
            $table->text('notes')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            // Foreign keys
            $table->foreign('client_id')->references('id')->on('clients')->cascadeOnDelete();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index('client_id', 'idx_invoices_client_id');
            $table->index('status', 'idx_invoices_status');
            $table->index('due_date', 'idx_invoices_due_date');
            $table->index(['period_start', 'period_end'], 'idx_invoices_period');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
