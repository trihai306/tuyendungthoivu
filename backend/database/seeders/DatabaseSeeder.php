<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // 1. Roles & Permissions (foundation for RBAC)
            RolesAndPermissionsSeeder::class,

            // 2. Departments & Teams (organization structure)
            DepartmentsAndTeamsSeeder::class,

            // 3. Staff users (admin, managers, recruiters, coordinators, viewer)
            UserSeeder::class,

            // 4. Worker profiles (20 workers with skills)
            WorkerProfileSeeder::class,

            // 5. Employer profiles (10 companies)
            EmployerSeeder::class,

            // 6. Job posts (15 jobs linked to employers)
            JobPostSeeder::class,

            // 7. Dormitories with rooms and beds (5 dormitories)
            DormitorySeeder::class,

            // 8. Applications (30 applications linking workers to jobs)
            ApplicationSeeder::class,

            // 9. Task assignments with comments (20 tasks)
            TaskAssignmentSeeder::class,

            // 10. Notifications (30 notifications)
            NotificationSeeder::class,

            // 11. Activity logs (50 entries)
            ActivityLogSeeder::class,
        ]);
    }
}
