<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invoice_id');
            $table->uuid('order_id')->nullable();
            $table->string('description', 500);
            $table->decimal('quantity', 10, 2);
            $table->string('unit', 20)->default('day')->comment('hour / day / shift / person');
            $table->decimal('unit_price', 12, 0);
            $table->decimal('amount', 15, 2);
            $table->timestampsTz();

            // Foreign keys
            $table->foreign('invoice_id')->references('id')->on('invoices')->cascadeOnDelete();
            $table->foreign('order_id')->references('id')->on('staffing_orders')->nullOnDelete();

            // Indexes
            $table->index('invoice_id', 'idx_invoice_items_invoice_id');
            $table->index('order_id', 'idx_invoice_items_order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
