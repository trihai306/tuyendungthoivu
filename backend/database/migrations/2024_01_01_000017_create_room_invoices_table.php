<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('room_invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->foreignUuid('room_contract_id')->constrained();
            $table->foreignUuid('worker_profile_id')->constrained();
            $table->date('billing_month');
            $table->decimal('rent_amount', 12, 0)->nullable();
            $table->decimal('electricity_amount', 12, 0)->nullable();
            $table->decimal('water_amount', 12, 0)->nullable();
            $table->decimal('total_amount', 12, 0)->nullable();
            $table->decimal('paid_amount', 12, 0)->default(0);
            $table->string('status')->default('unpaid');
            $table->date('due_date')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_invoices');
    }
};
