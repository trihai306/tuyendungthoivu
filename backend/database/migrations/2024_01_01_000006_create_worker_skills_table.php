<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('worker_skills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('worker_profile_id')->constrained()->cascadeOnDelete();
            $table->string('skill_name');
            $table->string('level')->default('beginner');
            $table->decimal('years', 3, 1)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_skills');
    }
};
