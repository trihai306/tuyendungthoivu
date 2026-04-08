<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->uuid('head_user_id')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->foreign('head_user_id')
                ->references('id')->on('users')
                ->nullOnDelete();

            $table->index('status');
        });

        Schema::create('teams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('department_id');
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->uuid('lead_user_id')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->foreign('department_id')
                ->references('id')->on('departments')
                ->cascadeOnDelete();

            $table->foreign('lead_user_id')
                ->references('id')->on('users')
                ->nullOnDelete();

            $table->index('status');
        });

        Schema::create('team_members', function (Blueprint $table) {
            $table->uuid('team_id');
            $table->uuid('user_id');
            $table->string('role_in_team', 20)->default('member'); // lead, member
            $table->timestamp('joined_at')->useCurrent();

            $table->primary(['team_id', 'user_id']);

            $table->foreign('team_id')
                ->references('id')->on('teams')
                ->cascadeOnDelete();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('teams');
        Schema::dropIfExists('departments');
    }
};
