<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('worker_ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('worker_id');
            $table->uuid('order_id');
            $table->uuid('rated_by');
            $table->smallInteger('overall_score')->comment('1-5');
            $table->smallInteger('punctuality')->nullable()->comment('1-5');
            $table->smallInteger('skill_level')->nullable()->comment('1-5');
            $table->smallInteger('attitude')->nullable()->comment('1-5');
            $table->smallInteger('diligence')->nullable()->comment('1-5');
            $table->text('comment')->nullable();
            $table->timestampTz('created_at')->nullable();

            // Foreign keys
            $table->foreign('worker_id')->references('id')->on('workers')->cascadeOnDelete();
            $table->foreign('order_id')->references('id')->on('staffing_orders')->cascadeOnDelete();
            $table->foreign('rated_by')->references('id')->on('users')->cascadeOnDelete();

            // Indexes
            $table->index('worker_id', 'idx_worker_ratings_worker_id');
            $table->index('order_id', 'idx_worker_ratings_order_id');

            // One rating per worker per order
            $table->unique(['worker_id', 'order_id'], 'unique_worker_ratings_worker_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_ratings');
    }
};
