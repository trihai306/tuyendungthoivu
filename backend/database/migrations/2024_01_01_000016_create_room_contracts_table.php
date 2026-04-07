<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('room_contracts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('contract_number')->unique();
            $table->foreignUuid('worker_profile_id')->constrained();
            $table->foreignUuid('dormitory_id')->constrained();
            $table->foreignUuid('room_id')->constrained();
            $table->foreignUuid('bed_id')->nullable()->constrained();
            $table->foreignUuid('labor_contract_id')->nullable()->constrained('labor_contracts');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('monthly_rent', 12, 0);
            $table->decimal('deposit_amount', 12, 0)->nullable();
            $table->string('payment_method')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('signed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_contracts');
    }
};
