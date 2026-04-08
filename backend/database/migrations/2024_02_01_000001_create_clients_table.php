<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('company_name', 255);
            $table->string('tax_code', 20)->unique()->nullable();
            $table->string('industry', 100)->nullable();
            $table->string('company_size', 20)->nullable()->comment('small / medium / large');
            $table->text('address')->nullable();
            $table->string('district', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('contact_name', 255)->nullable();
            $table->string('contact_phone', 15)->nullable();
            $table->string('contact_email', 255)->nullable();
            $table->string('website', 500)->nullable();
            $table->string('status', 20)->default('prospect')->comment('prospect / active / inactive');
            $table->text('notes')->nullable();
            $table->string('logo_path', 500)->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            // Foreign keys
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();

            // Indexes
            $table->index('company_name', 'idx_clients_company_name');
            $table->index('status', 'idx_clients_status');
            $table->index('city', 'idx_clients_city');
            $table->index('industry', 'idx_clients_industry');
            $table->index('created_by', 'idx_clients_created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
