<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('task_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('type', 30); // review_application, interview_candidate, verify_employer, verify_accommodation, approve_job, custom
            $table->string('priority', 10)->default('medium'); // low, medium, high, urgent
            $table->string('status', 20)->default('pending'); // pending, in_progress, completed, cancelled, overdue
            $table->uuid('assigned_by'); // User who created/assigned the task
            $table->uuid('assigned_to'); // User who is assigned to do the task
            $table->nullableMorphs('related'); // related_type + related_id for polymorphic link
            $table->timestamp('deadline')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('assigned_by')
                ->references('id')->on('users')
                ->cascadeOnDelete();

            $table->foreign('assigned_to')
                ->references('id')->on('users')
                ->cascadeOnDelete();

            $table->index('status');
            $table->index('priority');
            $table->index('type');
            $table->index('deadline');
        });

        Schema::create('task_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->uuid('user_id');
            $table->text('content');
            $table->timestamps();

            $table->foreign('task_id')
                ->references('id')->on('task_assignments')
                ->cascadeOnDelete();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_comments');
        Schema::dropIfExists('task_assignments');
    }
};
