<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('client_contracts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('client_id');
            $table->string('contract_number', 50)->unique();
            $table->string('type', 20)->default('framework')->comment('framework / per_order');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('markup_percentage', 5, 2)->nullable();
            $table->smallInteger('payment_terms')->default(30)->comment('Payment days: 7/15/30');
            $table->decimal('value', 15, 2)->nullable();
            $table->string('status', 20)->default('draft')->comment('draft / active / expired / terminated');
            $table->string('file_path', 500)->nullable();
            $table->text('notes')->nullable();
            $table->string('signed_by', 255)->nullable();
            $table->uuid('approved_by')->nullable();
            $table->timestampTz('approved_at')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            // Foreign keys
            $table->foreign('client_id')->references('id')->on('clients')->cascadeOnDelete();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index('client_id', 'idx_client_contracts_client_id');
            $table->index('status', 'idx_client_contracts_status');
            $table->index(['start_date', 'end_date'], 'idx_client_contracts_dates');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_contracts');
    }
};
