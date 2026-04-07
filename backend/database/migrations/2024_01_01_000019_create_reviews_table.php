<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reviewer_id')->constrained('users');
            $table->foreignUuid('reviewee_id')->constrained('users');
            $table->string('review_type');
            $table->uuid('contract_id')->nullable();
            $table->decimal('rating', 2, 1);
            $table->text('comment')->nullable();
            $table->boolean('would_rehire')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
