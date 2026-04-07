<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('job_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employer_id')->constrained();
            $table->string('title');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->text('benefits')->nullable();
            $table->string('job_type')->nullable();
            $table->integer('positions_count');
            $table->integer('filled_count')->default(0);
            $table->string('salary_type', 20);
            $table->decimal('salary_amount', 12, 0);
            $table->string('shift_type')->nullable();
            $table->date('work_start_date');
            $table->date('work_end_date');
            $table->text('work_address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->foreignUuid('region_id')->nullable()->constrained();
            $table->boolean('has_housing')->default(false);
            $table->integer('min_age')->nullable();
            $table->integer('max_age')->nullable();
            $table->string('gender_req')->nullable();
            $table->date('deadline')->nullable();
            $table->string('status')->default('draft');
            $table->integer('view_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_posts');
    }
};
