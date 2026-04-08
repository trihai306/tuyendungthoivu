<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 50)->unique(); // super_admin, admin, manager, recruiter, coordinator, viewer
            $table->string('display_name', 100);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('level')->default(0); // Higher number = higher authority
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->unique(); // e.g. jobs.create, users.manage
            $table->string('display_name', 150);
            $table->string('module', 50); // recruitment, accommodation, hr, system
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('module');
        });

        Schema::create('role_permission', function (Blueprint $table) {
            $table->uuid('role_id');
            $table->uuid('permission_id');

            $table->primary(['role_id', 'permission_id']);

            $table->foreign('role_id')
                ->references('id')->on('roles')
                ->cascadeOnDelete();

            $table->foreign('permission_id')
                ->references('id')->on('permissions')
                ->cascadeOnDelete();
        });

        // Assign role to user (many-to-many to support multiple roles per user)
        Schema::create('role_user', function (Blueprint $table) {
            $table->uuid('role_id');
            $table->uuid('user_id');

            $table->primary(['role_id', 'user_id']);

            $table->foreign('role_id')
                ->references('id')->on('roles')
                ->cascadeOnDelete();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
