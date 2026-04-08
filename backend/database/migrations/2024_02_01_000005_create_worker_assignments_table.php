<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->uuid('worker_id');
            $table->uuid('assigned_by');

            // Status
            $table->string('status', 20)->default('created')
                ->comment('created / contacted / confirmed / working / completed / rejected / cancelled / no_contact / replaced');
            $table->text('confirmation_note')->nullable();
            $table->text('rejection_reason')->nullable();

            // Dispatch
            $table->text('dispatch_info')->nullable()->comment('Location, time, contact info sent to worker');
            $table->boolean('is_reconfirmed')->default(false);
            $table->timestampTz('reconfirmed_at')->nullable();

            // Replacement
            $table->uuid('replaced_by_id')->nullable()->comment('Self-ref: new assignment replacing this one');
            $table->text('replacement_reason')->nullable();

            // Timestamps
            $table->timestampTz('confirmed_at')->nullable();
            $table->timestampTz('started_at')->nullable();
            $table->timestampTz('completed_at')->nullable();
            $table->timestampsTz();

            // Foreign keys
            $table->foreign('order_id')->references('id')->on('staffing_orders')->cascadeOnDelete();
            $table->foreign('worker_id')->references('id')->on('workers')->cascadeOnDelete();
            $table->foreign('assigned_by')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('replaced_by_id')->references('id')->on('assignments')->nullOnDelete();

            // Indexes
            $table->index('order_id', 'idx_assignments_order_id');
            $table->index('worker_id', 'idx_assignments_worker_id');
            $table->index('status', 'idx_assignments_status');
            $table->index('assigned_by', 'idx_assignments_assigned_by');

            // Unique constraint: one active assignment per worker per order
            // We use a regular unique as partial unique is not supported in Laravel Schema Builder
            // The application layer handles the partial unique logic
            $table->unique(['order_id', 'worker_id'], 'unique_assignments_order_worker');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
