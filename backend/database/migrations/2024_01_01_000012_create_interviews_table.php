<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('application_id')->constrained();
            $table->string('interview_type', 20);
            $table->timestamp('scheduled_at');
            $table->text('location')->nullable();
            $table->string('meeting_link')->nullable();
            $table->string('status')->default('scheduled');
            $table->integer('rating_attitude')->nullable();
            $table->integer('rating_communication')->nullable();
            $table->integer('rating_fit')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
