<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('contract_id')->constrained('labor_contracts');
            $table->foreignUuid('worker_profile_id')->constrained();
            $table->date('work_date');
            $table->timestamp('check_in_at')->nullable();
            $table->timestamp('check_out_at')->nullable();
            $table->string('check_in_method')->nullable();
            $table->decimal('total_hours', 4, 1)->nullable();
            $table->decimal('ot_hours', 4, 1)->default(0);
            $table->boolean('is_approved')->default(false);
            $table->foreignUuid('approved_by')->nullable()->constrained('users');
            $table->string('status')->default('present');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
