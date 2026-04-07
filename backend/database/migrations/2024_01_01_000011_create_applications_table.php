<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('job_post_id')->constrained();
            $table->foreignUuid('worker_profile_id')->constrained();
            $table->text('cover_letter')->nullable();
            $table->string('status')->default('new');
            $table->decimal('match_score', 5, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();

            $table->unique(['job_post_id', 'worker_profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
