<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('labor_contracts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('contract_number')->unique();
            $table->foreignUuid('application_id')->nullable()->constrained();
            $table->foreignUuid('employer_id')->constrained();
            $table->foreignUuid('worker_profile_id')->constrained('worker_profiles');
            $table->string('position');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('salary_type');
            $table->decimal('salary_amount', 12, 0);
            $table->string('shift_type')->nullable();
            $table->text('work_address')->nullable();
            $table->json('terms')->nullable();
            $table->boolean('has_housing')->default(false);
            $table->string('status')->default('draft');
            $table->timestamp('worker_signed_at')->nullable();
            $table->timestamp('employer_signed_at')->nullable();
            $table->timestamp('terminated_at')->nullable();
            $table->text('termination_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('labor_contracts');
    }
};
