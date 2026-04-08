<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('department_id')->nullable()->after('avatar_url');
            $table->uuid('team_id')->nullable()->after('department_id');
            $table->string('position', 100)->nullable()->after('team_id');
            $table->string('phone_ext', 10)->nullable()->after('position');
            $table->string('employee_code', 30)->nullable()->unique()->after('phone_ext');
            $table->date('hire_date')->nullable()->after('employee_code');
            $table->boolean('is_active')->default(true)->after('hire_date');

            $table->foreign('department_id')
                ->references('id')->on('departments')
                ->nullOnDelete();

            $table->foreign('team_id')
                ->references('id')->on('teams')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropForeign(['team_id']);
            $table->dropColumn([
                'department_id',
                'team_id',
                'position',
                'phone_ext',
                'employee_code',
                'hire_date',
                'is_active',
            ]);
        });
    }
};
