<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('employers', function (Blueprint $table) {
            // License image
            $table->string('license_image_url', 500)->nullable()->after('business_license');

            // Tax code
            $table->string('tax_code', 50)->nullable()->after('license_image_url');

            // City/District for filtering
            $table->string('city', 100)->nullable()->after('address');
            $table->string('district', 100)->nullable()->after('city');

            // Logo and website
            $table->string('logo', 500)->nullable()->after('description');
            $table->string('website', 500)->nullable()->after('logo');

            // Rating
            $table->decimal('rating', 2, 1)->default(0)->after('website');
            $table->integer('review_count')->default(0)->after('rating');

            // Soft delete support
            $table->softDeletes();

            // Indexes
            $table->index('city');
            $table->index('district');
            $table->index('industry');
            $table->index('verified');
            $table->index('tax_code');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::table('employers', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropIndex(['city']);
            $table->dropIndex(['district']);
            $table->dropIndex(['industry']);
            $table->dropIndex(['verified']);
            $table->dropIndex(['tax_code']);
            $table->dropIndex(['rating']);

            $table->dropColumn([
                'license_image_url',
                'tax_code',
                'city',
                'district',
                'logo',
                'website',
                'rating',
                'review_count',
            ]);
        });
    }
};
