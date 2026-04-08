# Migration Plan - Tu Mo Hinh Cu Sang Mo Hinh Cung Ung Nhan Su Thoi Vu

> **Phien ban:** 2.0
> **Ngay cap nhat:** 2026-04-08
> **Tac gia:** System Architect
> **Trang thai:** Planning

---

## 1. Tong Quan

### 1.1 Muc tieu

Chuyen doi database tu mo hinh cu (job board + nha tro) sang mo hinh moi (cung ung nhan su thoi vu) theo tung buoc an toan, dam bao:

- Khong mat du lieu quan trong
- Co the rollback tai moi phase
- Downtime toi thieu
- Test ky luong giua cac phase

### 1.2 Pham vi thay doi

| Phan loai | So luong | Chi tiet |
|-----------|----------|----------|
| Bang giu nguyen | 11 | users, roles, permissions, role_permission, role_user, departments, teams, team_members, activity_logs, notifications, personal_access_tokens |
| Bang sua | 1 | users (them truong) |
| Bang tao moi | 15 | clients, client_contacts, client_contracts, staffing_orders, workers, skills, worker_skill, assignments, attendances (moi), payrolls (moi), invoices, invoice_items, payments, worker_ratings, categories |
| Bang xoa | 14 | employers, dormitories, rooms, beds, room_contracts, room_invoices, interviews, job_posts, applications, labor_contracts, reviews, worker_profiles, worker_skills, regions |

### 1.3 Timeline

```
Phase 1 (Ngay 1-2): Tao bang moi + sua bang users
Phase 2 (Ngay 3-4): Migrate du lieu tu bang cu sang bang moi
Phase 3 (Ngay 5):   Xac nhan du lieu, test
Phase 4 (Ngay 6-7): Update backend code (Models, Controllers, Routes, Services)
Phase 5 (Ngay 8):   Xoa bang cu
Phase 6 (Ngay 9-10): Test toan dien, fix issues
```

---

## 2. Trang Thai Bang Hien Tai (Schema Cu)

### 2.1 Cac bang dang ton tai trong database

```
=== CORE (GIU) ===
users                          # Users system
password_reset_tokens          # Password reset
sessions                       # Session management
cache                          # Cache table
personal_access_tokens         # Sanctum tokens
roles                          # RBAC roles
permissions                    # RBAC permissions
role_permission                # Pivot: role-permission
role_user                      # Pivot: user-role
departments                    # Phong ban
teams                          # Teams
team_members                   # Pivot: team-user
activity_logs                  # Audit trail
notifications                  # In-app notifications
task_assignments               # Task management
task_comments                  # Task comments

=== RECRUITMENT (XOA) ===
employers                      # -> migrate sang clients
regions                        # -> khong can, dung district/city truc tiep
worker_profiles                # -> migrate sang workers
worker_skills                  # -> migrate sang worker_skill + skills
job_posts                      # -> migrate sang staffing_orders
applications                   # -> migrate sang assignments
interviews                     # -> khong migrate (khong con quy trinh interview)
labor_contracts                # -> khong migrate truc tiep

=== ACCOMMODATION (XOA) ===
dormitories                    # -> khong migrate
rooms                          # -> khong migrate
beds                           # -> khong migrate
room_contracts                 # -> khong migrate
room_invoices                  # -> khong migrate

=== OPERATIONAL (XOA + TAO LAI) ===
attendances                    # -> tao lai voi schema moi
payrolls                       # -> tao lai voi schema moi
reviews                        # -> migrate sang worker_ratings
```

---

## 3. Chi Tiet Tung Phase

### Phase 1: Tao Bang Moi + Sua Bang Users

**Thoi gian du kien:** 1-2 ngay
**Rui ro:** Thap (chi them bang/truong moi, khong anh huong he thong cu)

#### Migration 1.1: Sua bang users

File: `2026_04_10_000001_modify_users_for_staffing.php`

```php
Schema::table('users', function (Blueprint $table) {
    // Them truong moi
    $table->jsonb('managed_districts')->nullable()->after('is_active');
    $table->jsonb('kpi_target')->nullable()->after('managed_districts');

    // Xoa truong khong con dung
    $table->dropColumn('credit_score');

    // Sua default
    // role: 'worker' -> 'staff'
    // status: 'pending' -> 'active'
});

// Update existing data
DB::table('users')->where('role', 'worker')->update(['role' => 'staff']);
DB::table('users')->where('status', 'pending')->update(['status' => 'active']);
```

**Rollback:**
```php
Schema::table('users', function (Blueprint $table) {
    $table->dropColumn(['managed_districts', 'kpi_target']);
    $table->integer('credit_score')->default(100);
});
```

#### Migration 1.2: Tao bang clients

File: `2026_04_10_000002_create_clients_table.php`

```php
Schema::create('clients', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('company_name', 255);
    $table->string('tax_code', 20)->unique()->nullable();
    $table->string('industry', 100)->nullable();
    $table->string('company_size', 20)->nullable();
    $table->text('address')->nullable();
    $table->string('district', 100)->nullable();
    $table->string('city', 100)->nullable();
    $table->string('contact_name', 255)->nullable();
    $table->string('contact_phone', 15)->nullable();
    $table->string('contact_email', 255)->nullable();
    $table->string('website', 500)->nullable();
    $table->string('status', 20)->default('prospect');
    $table->text('notes')->nullable();
    $table->uuid('created_by')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
    $table->index('status');
    $table->index('city');
    $table->index('industry');
    $table->index('created_by');
});
```

#### Migration 1.3: Tao bang client_contacts

File: `2026_04_10_000003_create_client_contacts_table.php`

```php
Schema::create('client_contacts', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('client_id');
    $table->string('name', 255);
    $table->string('position', 100)->nullable();
    $table->string('phone', 15)->nullable();
    $table->string('email', 255)->nullable();
    $table->boolean('is_primary')->default(false);
    $table->text('notes')->nullable();
    $table->timestamps();

    $table->foreign('client_id')->references('id')->on('clients')->cascadeOnDelete();
    $table->index('client_id');
});
```

#### Migration 1.4: Tao bang client_contracts

File: `2026_04_10_000004_create_client_contracts_table.php`

```php
Schema::create('client_contracts', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('client_id');
    $table->string('contract_number', 50)->unique();
    $table->string('type', 20)->default('framework');
    $table->date('start_date');
    $table->date('end_date')->nullable();
    $table->decimal('markup_percentage', 5, 2)->nullable();
    $table->smallInteger('payment_terms')->default(30);
    $table->decimal('value', 15, 2)->nullable();
    $table->string('status', 20)->default('draft');
    $table->string('file_url', 500)->nullable();
    $table->text('notes')->nullable();
    $table->uuid('approved_by')->nullable();
    $table->timestampTz('approved_at')->nullable();
    $table->uuid('created_by')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->foreign('client_id')->references('id')->on('clients')->cascadeOnDelete();
    $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
    $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
    $table->index('client_id');
    $table->index('status');
});
```

#### Migration 1.5: Tao bang skills

File: `2026_04_10_000005_create_skills_table.php`

```php
Schema::create('skills', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name', 100)->unique();
    $table->string('category', 50)->nullable();
    $table->text('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->smallInteger('sort_order')->default(0);
    $table->timestamps();

    $table->index('category');
    $table->index('is_active');
});
```

#### Migration 1.6: Tao bang workers

File: `2026_04_10_000006_create_workers_table.php`

```php
Schema::create('workers', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('worker_code', 20)->unique();
    $table->uuid('user_id')->unique()->nullable();

    // Thong tin ca nhan
    $table->string('full_name', 255);
    $table->date('date_of_birth')->nullable();
    $table->string('gender', 10)->nullable();
    $table->string('id_number', 20)->unique()->nullable();
    $table->string('id_card_front_url', 500)->nullable();
    $table->string('id_card_back_url', 500)->nullable();
    $table->string('phone', 15);
    $table->string('email', 255)->nullable();
    $table->text('address')->nullable();
    $table->string('district', 100)->nullable();
    $table->string('city', 100)->nullable();
    $table->string('avatar_url', 500)->nullable();

    // Thong tin lao dong
    $table->text('experience_notes')->nullable();
    $table->jsonb('preferred_districts')->nullable();
    $table->string('availability', 20)->default('full_time');

    // Ngan hang
    $table->string('bank_name', 100)->nullable();
    $table->string('bank_account', 30)->nullable();
    $table->string('bank_account_name', 255)->nullable();

    // Thong ke
    $table->integer('total_orders')->default(0);
    $table->integer('total_days_worked')->default(0);
    $table->decimal('average_rating', 2, 1)->default(0);
    $table->integer('no_show_count')->default(0);
    $table->date('last_worked_date')->nullable();

    // Trang thai
    $table->string('status', 20)->default('available');
    $table->text('blacklist_reason')->nullable();
    $table->uuid('registered_by')->nullable();
    $table->text('notes')->nullable();
    $table->string('emergency_contact_name', 255)->nullable();
    $table->string('emergency_contact_phone', 15)->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
    $table->foreign('registered_by')->references('id')->on('users')->nullOnDelete();

    $table->index('status');
    $table->index('city');
    $table->index('district');
    $table->index('phone');
    $table->index('average_rating');
    $table->index('availability');
    $table->index('last_worked_date');
    $table->index('registered_by');
});
```

#### Migration 1.7: Tao bang worker_skill (pivot)

File: `2026_04_10_000007_create_worker_skill_table.php`

```php
Schema::create('worker_skill', function (Blueprint $table) {
    $table->uuid('worker_id');
    $table->uuid('skill_id');
    $table->string('level', 20)->default('intermediate');
    $table->decimal('years_experience', 3, 1)->nullable();
    $table->timestampTz('created_at')->useCurrent();

    $table->primary(['worker_id', 'skill_id']);
    $table->foreign('worker_id')->references('id')->on('workers')->cascadeOnDelete();
    $table->foreign('skill_id')->references('id')->on('skills')->cascadeOnDelete();
});
```

#### Migration 1.8: Tao bang staffing_orders

File: `2026_04_10_000008_create_staffing_orders_table.php`

```php
Schema::create('staffing_orders', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('order_code', 20)->unique();
    $table->uuid('client_id');
    $table->uuid('client_contact_id')->nullable();
    $table->uuid('contract_id')->nullable();

    // Thong tin cong viec
    $table->string('position_name', 255);
    $table->text('job_description')->nullable();
    $table->text('work_address')->nullable();
    $table->string('work_district', 100)->nullable();
    $table->string('work_city', 100)->nullable();

    // So luong & yeu cau
    $table->smallInteger('quantity_needed');
    $table->smallInteger('quantity_filled')->default(0);
    $table->string('gender_requirement', 10)->nullable();
    $table->smallInteger('age_min')->nullable();
    $table->smallInteger('age_max')->nullable();
    $table->jsonb('required_skills')->nullable();
    $table->text('other_requirements')->nullable();

    // Thoi gian
    $table->date('start_date');
    $table->date('end_date')->nullable();
    $table->string('shift_type', 20)->nullable();
    $table->time('start_time')->nullable();
    $table->time('end_time')->nullable();
    $table->smallInteger('break_minutes')->default(0);

    // Tai chinh
    $table->decimal('worker_rate', 12, 0)->nullable();
    $table->string('rate_type', 10)->default('daily');
    $table->decimal('service_fee', 12, 0)->nullable();
    $table->string('service_fee_type', 10)->default('percent');
    $table->decimal('overtime_rate', 12, 0)->nullable();

    // Quan ly
    $table->string('urgency', 10)->default('normal');
    $table->string('service_type', 20)->default('short_term');
    $table->string('status', 20)->default('draft');
    $table->uuid('assigned_recruiter_id')->nullable();
    $table->uuid('created_by')->nullable();
    $table->uuid('approved_by')->nullable();
    $table->timestampTz('approved_at')->nullable();
    $table->text('rejection_reason')->nullable();
    $table->text('cancellation_reason')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->foreign('client_id')->references('id')->on('clients');
    $table->foreign('client_contact_id')->references('id')->on('client_contacts')->nullOnDelete();
    $table->foreign('contract_id')->references('id')->on('client_contracts')->nullOnDelete();
    $table->foreign('assigned_recruiter_id')->references('id')->on('users')->nullOnDelete();
    $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
    $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();

    $table->index('client_id');
    $table->index('status');
    $table->index('urgency');
    $table->index('assigned_recruiter_id');
    $table->index('created_by');
    $table->index(['start_date', 'end_date']);
    $table->index('work_city');
    $table->index(['status', 'urgency']);
});
```

#### Migration 1.9: Tao bang assignments

File: `2026_04_10_000009_create_assignments_table.php`

```php
Schema::create('assignments', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('order_id');
    $table->uuid('worker_id');
    $table->uuid('assigned_by');

    $table->string('status', 20)->default('created');
    $table->text('confirmation_note')->nullable();
    $table->text('rejection_reason')->nullable();

    $table->text('dispatch_info')->nullable();
    $table->boolean('is_reconfirmed')->default(false);
    $table->timestampTz('reconfirmed_at')->nullable();

    $table->uuid('replaced_by_id')->nullable();
    $table->text('replacement_reason')->nullable();

    $table->timestampTz('confirmed_at')->nullable();
    $table->timestampTz('started_at')->nullable();
    $table->timestampTz('completed_at')->nullable();
    $table->timestamps();

    $table->foreign('order_id')->references('id')->on('staffing_orders');
    $table->foreign('worker_id')->references('id')->on('workers');
    $table->foreign('assigned_by')->references('id')->on('users');
    $table->foreign('replaced_by_id')->references('id')->on('assignments')->nullOnDelete();

    $table->index('order_id');
    $table->index('worker_id');
    $table->index('status');
    $table->index('assigned_by');
});
```

#### Migration 1.10: Tao bang attendances (moi)

File: `2026_04_10_000010_create_new_attendances_table.php`

> Luu y: Bang `attendances` cu van con. Tao bang moi voi ten tam la `new_attendances`, sau do doi ten o Phase 5.
> Hoac: Rename bang cu thanh `old_attendances` truoc khi tao bang moi.

```php
// Rename old table first
Schema::rename('attendances', 'old_attendances');

// Create new table
Schema::create('attendances', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('assignment_id');
    $table->uuid('worker_id');
    $table->uuid('order_id');
    $table->date('work_date');

    $table->timestampTz('check_in_time')->nullable();
    $table->uuid('check_in_by')->nullable();
    $table->text('check_in_note')->nullable();
    $table->timestampTz('check_out_time')->nullable();
    $table->uuid('check_out_by')->nullable();
    $table->text('check_out_note')->nullable();

    $table->smallInteger('break_minutes')->default(0);
    $table->decimal('total_hours', 4, 1)->nullable();
    $table->decimal('overtime_hours', 4, 1)->default(0);
    $table->string('status', 20)->default('present');

    $table->boolean('is_approved')->default(false);
    $table->uuid('approved_by')->nullable();
    $table->timestampTz('approved_at')->nullable();
    $table->text('adjustment_reason')->nullable();

    $table->timestamps();

    $table->foreign('assignment_id')->references('id')->on('assignments');
    $table->foreign('worker_id')->references('id')->on('workers');
    $table->foreign('order_id')->references('id')->on('staffing_orders');
    $table->foreign('check_in_by')->references('id')->on('users')->nullOnDelete();
    $table->foreign('check_out_by')->references('id')->on('users')->nullOnDelete();
    $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();

    $table->index('assignment_id');
    $table->index('worker_id');
    $table->index('order_id');
    $table->index('work_date');
    $table->index('status');
    $table->index('is_approved');
    $table->unique(['assignment_id', 'work_date']);
});
```

#### Migration 1.11: Tao bang payrolls (moi)

File: `2026_04_10_000011_create_new_payrolls_table.php`

```php
Schema::rename('payrolls', 'old_payrolls');

Schema::create('payrolls', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('payroll_code', 20)->unique();
    $table->uuid('worker_id');
    $table->uuid('order_id')->nullable();
    $table->date('period_start');
    $table->date('period_end');

    $table->smallInteger('total_days')->default(0);
    $table->decimal('total_hours', 6, 1)->default(0);
    $table->decimal('overtime_hours', 6, 1)->default(0);

    $table->decimal('unit_price', 12, 0)->default(0);
    $table->string('rate_type', 10)->default('daily');
    $table->decimal('base_amount', 15, 2)->default(0);
    $table->decimal('overtime_amount', 15, 2)->default(0);
    $table->decimal('allowance_amount', 15, 2)->default(0);
    $table->decimal('deduction_amount', 15, 2)->default(0);
    $table->decimal('net_amount', 15, 2)->default(0);

    $table->string('status', 20)->default('draft');
    $table->uuid('approved_by')->nullable();
    $table->timestampTz('approved_at')->nullable();
    $table->timestampTz('paid_at')->nullable();
    $table->string('payment_method', 20)->nullable();
    $table->string('payment_reference', 100)->nullable();
    $table->text('notes')->nullable();
    $table->uuid('created_by')->nullable();
    $table->timestamps();

    $table->foreign('worker_id')->references('id')->on('workers');
    $table->foreign('order_id')->references('id')->on('staffing_orders')->nullOnDelete();
    $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
    $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();

    $table->index('worker_id');
    $table->index('order_id');
    $table->index('status');
    $table->index(['period_start', 'period_end']);
});
```

#### Migration 1.12: Tao bang invoices

File: `2026_04_10_000012_create_invoices_table.php`

```php
Schema::create('invoices', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('invoice_number', 20)->unique();
    $table->uuid('client_id');
    $table->date('period_start');
    $table->date('period_end');

    $table->decimal('subtotal', 15, 2)->default(0);
    $table->decimal('tax_rate', 4, 2)->default(0);
    $table->decimal('tax_amount', 15, 2)->default(0);
    $table->decimal('total_amount', 15, 2)->default(0);

    $table->string('status', 20)->default('draft');
    $table->date('due_date')->nullable();
    $table->decimal('paid_amount', 15, 2)->default(0);

    $table->uuid('approved_by')->nullable();
    $table->timestampTz('approved_at')->nullable();
    $table->timestampTz('sent_at')->nullable();
    $table->text('notes')->nullable();
    $table->uuid('created_by')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->foreign('client_id')->references('id')->on('clients');
    $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
    $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();

    $table->index('client_id');
    $table->index('status');
    $table->index('due_date');
});
```

#### Migration 1.13: Tao bang invoice_items

File: `2026_04_10_000013_create_invoice_items_table.php`

```php
Schema::create('invoice_items', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('invoice_id');
    $table->uuid('order_id')->nullable();
    $table->string('description', 500);
    $table->decimal('quantity', 10, 2);
    $table->string('unit', 20)->default('day');
    $table->decimal('unit_price', 12, 0);
    $table->decimal('amount', 15, 2);
    $table->timestamps();

    $table->foreign('invoice_id')->references('id')->on('invoices')->cascadeOnDelete();
    $table->foreign('order_id')->references('id')->on('staffing_orders')->nullOnDelete();

    $table->index('invoice_id');
    $table->index('order_id');
});
```

#### Migration 1.14: Tao bang payments

File: `2026_04_10_000014_create_payments_table.php`

```php
Schema::create('payments', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('payable_type', 50);
    $table->uuid('payable_id');
    $table->decimal('amount', 15, 2);
    $table->string('payment_method', 20);
    $table->date('payment_date');
    $table->string('reference_number', 100)->nullable();
    $table->text('notes')->nullable();
    $table->uuid('recorded_by')->nullable();
    $table->timestamps();

    $table->foreign('recorded_by')->references('id')->on('users')->nullOnDelete();

    $table->index(['payable_type', 'payable_id']);
    $table->index('payment_date');
});
```

#### Migration 1.15: Tao bang worker_ratings

File: `2026_04_10_000015_create_worker_ratings_table.php`

```php
Schema::create('worker_ratings', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('worker_id');
    $table->uuid('order_id');
    $table->uuid('rated_by');
    $table->smallInteger('overall_score');
    $table->smallInteger('punctuality')->nullable();
    $table->smallInteger('skill_level')->nullable();
    $table->smallInteger('attitude')->nullable();
    $table->smallInteger('diligence')->nullable();
    $table->text('comment')->nullable();
    $table->timestampTz('created_at')->useCurrent();

    $table->foreign('worker_id')->references('id')->on('workers')->cascadeOnDelete();
    $table->foreign('order_id')->references('id')->on('staffing_orders');
    $table->foreign('rated_by')->references('id')->on('users');

    $table->index('worker_id');
    $table->index('order_id');
    $table->unique(['worker_id', 'order_id']);
});
```

#### Migration 1.16: Tao bang categories

File: `2026_04_10_000016_create_categories_table.php`

```php
Schema::create('categories', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('type', 50);
    $table->string('name', 255);
    $table->string('code', 50)->nullable();
    $table->uuid('parent_id')->nullable();
    $table->jsonb('metadata')->nullable();
    $table->smallInteger('sort_order')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();

    $table->foreign('parent_id')->references('id')->on('categories')->nullOnDelete();

    $table->index('type');
    $table->index('parent_id');
    $table->index('is_active');
});
```

---

### Phase 2: Migrate Du Lieu

**Thoi gian du kien:** 1-2 ngay
**Rui ro:** Trung binh (can kiem tra du lieu ky luong)

#### Migration 2.1: Migrate employers -> clients

File: `2026_04_10_100001_migrate_employers_to_clients.php`

```php
public function up(): void
{
    // Migrate each employer to a client
    $employers = DB::table('employers')->get();

    foreach ($employers as $employer) {
        $clientId = Str::uuid()->toString();

        // Create client
        DB::table('clients')->insert([
            'id' => $clientId,
            'company_name' => $employer->company_name,
            'industry' => $employer->industry,
            'company_size' => $employer->company_size,
            'address' => $employer->address,
            'contact_name' => $employer->contact_name,
            'contact_phone' => $employer->contact_phone,
            'status' => $employer->verified ? 'active' : 'prospect',
            'created_by' => $employer->user_id,
            'notes' => $employer->description,
            'created_at' => $employer->created_at,
            'updated_at' => $employer->updated_at,
        ]);

        // Create primary contact
        if ($employer->contact_name) {
            DB::table('client_contacts')->insert([
                'id' => Str::uuid()->toString(),
                'client_id' => $clientId,
                'name' => $employer->contact_name,
                'phone' => $employer->contact_phone,
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Luu mapping employer_id -> client_id de dung cho Phase 2.2
        DB::table('_migration_mapping')->insert([
            'old_table' => 'employers',
            'old_id' => $employer->id,
            'new_table' => 'clients',
            'new_id' => $clientId,
        ]);
    }
}
```

> **Luu y:** Tao bang tam `_migration_mapping` de luu mapping ID giua bang cu va bang moi, phuc vu cho cac buoc migrate tiep theo.

#### Migration 2.2: Migrate worker_skills -> skills + Migrate worker_profiles -> workers

File: `2026_04_10_100002_migrate_workers.php`

```php
public function up(): void
{
    // 1. Extract unique skills from worker_skills table
    $uniqueSkills = DB::table('worker_skills')
        ->select('skill_name')
        ->distinct()
        ->pluck('skill_name');

    $skillMap = []; // old_skill_name => new_skill_id

    foreach ($uniqueSkills as $skillName) {
        $skillId = Str::uuid()->toString();
        DB::table('skills')->insert([
            'id' => $skillId,
            'name' => $skillName,
            'category' => 'General',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $skillMap[$skillName] = $skillId;
    }

    // 2. Migrate worker_profiles -> workers
    $profiles = DB::table('worker_profiles')
        ->whereNull('deleted_at')
        ->get();

    $codeCounter = 1;

    foreach ($profiles as $profile) {
        $workerId = Str::uuid()->toString();
        $workerCode = 'WK-' . str_pad($codeCounter++, 5, '0', STR_PAD_LEFT);

        DB::table('workers')->insert([
            'id' => $workerId,
            'worker_code' => $workerCode,
            'user_id' => $profile->user_id,
            'full_name' => $profile->full_name,
            'date_of_birth' => $profile->date_of_birth,
            'gender' => $profile->gender,
            'id_number' => $profile->id_card_number,
            'id_card_front_url' => $profile->id_card_front ?? null,
            'id_card_back_url' => $profile->id_card_back ?? null,
            'phone' => DB::table('users')->where('id', $profile->user_id)->value('phone') ?? 'unknown',
            'email' => DB::table('users')->where('id', $profile->user_id)->value('email'),
            'address' => $profile->current_address,
            'district' => $profile->district ?? null,
            'city' => $profile->city ?? null,
            'avatar_url' => $profile->selfie_url,
            'experience_notes' => $profile->bio,
            'preferred_districts' => $profile->desired_locations,
            'availability' => 'full_time',
            'bank_name' => $profile->bank_name,
            'bank_account' => $profile->bank_account,
            'bank_account_name' => $profile->bank_holder,
            'average_rating' => $profile->rating ?? 0,
            'status' => match ($profile->availability_status ?? 'available') {
                'available' => 'available',
                'busy', 'working' => 'assigned',
                'inactive' => 'inactive',
                default => 'available',
            },
            'emergency_contact_name' => $profile->emergency_contact_name,
            'emergency_contact_phone' => $profile->emergency_contact_phone,
            'created_at' => $profile->created_at,
            'updated_at' => $profile->updated_at,
        ]);

        // Luu mapping
        DB::table('_migration_mapping')->insert([
            'old_table' => 'worker_profiles',
            'old_id' => $profile->id,
            'new_table' => 'workers',
            'new_id' => $workerId,
        ]);

        // 3. Migrate skills for this worker
        $workerSkills = DB::table('worker_skills')
            ->where('worker_profile_id', $profile->id)
            ->get();

        foreach ($workerSkills as $ws) {
            if (isset($skillMap[$ws->skill_name])) {
                DB::table('worker_skill')->insertOrIgnore([
                    'worker_id' => $workerId,
                    'skill_id' => $skillMap[$ws->skill_name],
                    'level' => $ws->level ?? 'intermediate',
                    'years_experience' => $ws->years,
                    'created_at' => now(),
                ]);
            }
        }
    }
}
```

#### Migration 2.3: Migrate job_posts -> staffing_orders + applications -> assignments

File: `2026_04_10_100003_migrate_orders_and_assignments.php`

```php
public function up(): void
{
    $jobPosts = DB::table('job_posts')
        ->whereNull('deleted_at')
        ->get();

    $orderCounter = 1;

    foreach ($jobPosts as $job) {
        // Tim client tuong ung tu employer
        $clientId = DB::table('_migration_mapping')
            ->where('old_table', 'employers')
            ->where('old_id', $job->employer_id)
            ->value('new_id');

        if (!$clientId) continue;

        $orderId = Str::uuid()->toString();
        $orderCode = 'DH-' . now()->format('Ymd') . '-' . str_pad($orderCounter++, 3, '0', STR_PAD_LEFT);

        DB::table('staffing_orders')->insert([
            'id' => $orderId,
            'order_code' => $orderCode,
            'client_id' => $clientId,
            'position_name' => $job->title,
            'job_description' => $job->description,
            'work_address' => $job->work_address,
            'quantity_needed' => $job->positions_count,
            'quantity_filled' => $job->filled_count,
            'gender_requirement' => $job->gender_req,
            'age_min' => $job->min_age,
            'age_max' => $job->max_age,
            'start_date' => $job->work_start_date,
            'end_date' => $job->work_end_date,
            'shift_type' => $job->shift_type,
            'worker_rate' => $job->salary_amount,
            'rate_type' => $job->salary_type == 'hourly' ? 'hourly' : 'daily',
            'urgency' => 'normal',
            'service_type' => 'short_term',
            'status' => match ($job->status) {
                'draft' => 'draft',
                'active', 'open' => 'recruiting',
                'filled' => 'filled',
                'closed', 'completed' => 'completed',
                'cancelled' => 'cancelled',
                default => 'draft',
            },
            'notes' => $job->requirements,
            'created_at' => $job->created_at,
            'updated_at' => $job->updated_at,
        ]);

        // Luu mapping
        DB::table('_migration_mapping')->insert([
            'old_table' => 'job_posts',
            'old_id' => $job->id,
            'new_table' => 'staffing_orders',
            'new_id' => $orderId,
        ]);

        // Migrate applications -> assignments
        $applications = DB::table('applications')
            ->where('job_post_id', $job->id)
            ->get();

        foreach ($applications as $app) {
            $workerId = DB::table('_migration_mapping')
                ->where('old_table', 'worker_profiles')
                ->where('old_id', $app->worker_profile_id)
                ->value('new_id');

            if (!$workerId) continue;

            // Lay user_id de dung cho assigned_by (fallback to first admin)
            $assignedBy = DB::table('users')
                ->where('role', 'admin')
                ->value('id');

            DB::table('assignments')->insert([
                'id' => Str::uuid()->toString(),
                'order_id' => $orderId,
                'worker_id' => $workerId,
                'assigned_by' => $assignedBy ?? $app->worker_profile_id,
                'status' => match ($app->status) {
                    'new', 'pending' => 'created',
                    'shortlisted', 'contacted' => 'contacted',
                    'accepted', 'hired' => 'confirmed',
                    'rejected' => 'rejected',
                    'cancelled' => 'cancelled',
                    default => 'created',
                },
                'confirmation_note' => $app->notes,
                'created_at' => $app->created_at,
                'updated_at' => $app->updated_at,
            ]);
        }
    }
}
```

#### Migration 2.4: Migrate reviews -> worker_ratings

File: `2026_04_10_100004_migrate_reviews.php`

```php
public function up(): void
{
    $reviews = DB::table('reviews')->get();

    foreach ($reviews as $review) {
        // Tim worker_id moi
        $workerId = DB::table('_migration_mapping')
            ->where('old_table', 'worker_profiles')
            ->where('old_id', $review->reviewable_id) // Gia su reviews la polymorphic
            ->where('old_table', 'worker_profiles')
            ->value('new_id');

        if (!$workerId) continue;

        DB::table('worker_ratings')->insertOrIgnore([
            'id' => Str::uuid()->toString(),
            'worker_id' => $workerId,
            'order_id' => DB::table('staffing_orders')->inRandomOrder()->value('id'), // Fallback
            'rated_by' => $review->reviewer_id ?? DB::table('users')->where('role', 'admin')->value('id'),
            'overall_score' => $review->rating ?? 3,
            'comment' => $review->comment ?? null,
            'created_at' => $review->created_at ?? now(),
        ]);
    }
}
```

---

### Phase 3: Xac Nhan Du Lieu

**Thoi gian du kien:** 1 ngay

#### Checklist xac nhan

```
[ ] So luong clients = so luong employers
[ ] So luong workers = so luong worker_profiles (khong bi deleted)
[ ] So luong staffing_orders = so luong job_posts (khong bi deleted)
[ ] Moi worker co it nhat 1 skill (neu cu co)
[ ] Khong co orphan records (foreign key violations)
[ ] worker_code la unique va dung format WK-XXXXX
[ ] order_code la unique va dung format DH-YYYYMMDD-XXX
[ ] Status mapping dung (khong co status la trung)
```

#### Script kiem tra

File: `2026_04_10_200001_verify_migration_data.php`

```php
public function up(): void
{
    // Count verification
    $employerCount = DB::table('employers')->count();
    $clientCount = DB::table('clients')->count();
    
    if ($clientCount < $employerCount) {
        throw new \RuntimeException(
            "Client count ({$clientCount}) < employer count ({$employerCount}). Migration may be incomplete."
        );
    }

    $profileCount = DB::table('worker_profiles')->whereNull('deleted_at')->count();
    $workerCount = DB::table('workers')->count();
    
    if ($workerCount < $profileCount) {
        throw new \RuntimeException(
            "Worker count ({$workerCount}) < profile count ({$profileCount}). Migration may be incomplete."
        );
    }

    // Check for orphan foreign keys
    $orphanAssignments = DB::table('assignments')
        ->leftJoin('workers', 'assignments.worker_id', '=', 'workers.id')
        ->whereNull('workers.id')
        ->count();
    
    if ($orphanAssignments > 0) {
        throw new \RuntimeException("{$orphanAssignments} assignments co worker_id khong ton tai.");
    }

    // Log success
    Log::info('Migration verification passed', [
        'clients' => $clientCount,
        'workers' => $workerCount,
        'orders' => DB::table('staffing_orders')->count(),
        'assignments' => DB::table('assignments')->count(),
    ]);
}
```

---

### Phase 4: Update Backend Code

**Thoi gian du kien:** 2-3 ngay
**Rui ro:** Cao (thay doi code, can test ky)

#### 4.1 Models moi can tao

```
app/Models/
├── Client.php                 # MOI
├── ClientContact.php          # MOI
├── ClientContract.php         # MOI
├── StaffingOrder.php          # MOI (thay JobPost)
├── Worker.php                 # MOI (thay WorkerProfile)
├── Skill.php                  # MOI
├── Assignment.php             # MOI (thay Application)
├── Attendance.php             # SUA (schema moi)
├── Payroll.php                # SUA (schema moi)
├── Invoice.php                # MOI
├── InvoiceItem.php            # MOI
├── Payment.php                # MOI
├── WorkerRating.php           # MOI
├── Category.php               # MOI
```

#### 4.2 Models cu can xoa

```
app/Models/
├── Employer.php               # XOA
├── Dormitory.php              # XOA
├── Room.php                   # XOA
├── Bed.php                    # XOA
├── RoomContract.php           # XOA
├── RoomInvoice.php            # XOA
├── Interview.php              # XOA
├── JobPost.php                # XOA
├── Application.php            # XOA
├── LaborContract.php          # XOA
├── Review.php                 # XOA
├── WorkerProfile.php          # XOA
├── Region.php                 # XOA
```

#### 4.3 Controllers moi can tao

```
app/Http/Controllers/Api/V1/
├── ClientController.php            # MOI
├── ClientContactController.php     # MOI
├── ClientContractController.php    # MOI
├── StaffingOrderController.php     # MOI (thay JobPostController)
├── WorkerController.php            # MOI (thay WorkerProfileController)
├── AssignmentController.php        # MOI (thay ApplicationController)
├── AttendanceController.php        # SUA
├── PayrollController.php           # SUA
├── InvoiceController.php           # MOI
├── PaymentController.php           # MOI
├── SkillController.php             # MOI
├── CategoryController.php          # MOI
├── DashboardController.php         # SUA
├── ReportController.php            # MOI
```

#### 4.4 Routes cap nhat

File: `routes/api.php`

```php
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Auth (giu nguyen)
    Route::prefix('auth')->group(function () { /* ... */ });

    // Clients
    Route::apiResource('clients', ClientController::class);
    Route::prefix('clients/{client}')->group(function () {
        Route::apiResource('contacts', ClientContactController::class);
        Route::apiResource('contracts', ClientContractController::class);
        Route::patch('contracts/{contract}/approve', [ClientContractController::class, 'approve']);
        Route::get('orders', [ClientController::class, 'orders']);
        Route::get('stats', [ClientController::class, 'stats']);
    });

    // Orders
    Route::apiResource('orders', StaffingOrderController::class);
    Route::prefix('orders/{order}')->group(function () {
        Route::patch('submit', [StaffingOrderController::class, 'submit']);
        Route::patch('approve', [StaffingOrderController::class, 'approve']);
        Route::patch('reject', [StaffingOrderController::class, 'reject']);
        Route::patch('assign-recruiter', [StaffingOrderController::class, 'assignRecruiter']);
        Route::patch('cancel', [StaffingOrderController::class, 'cancel']);
        Route::patch('complete', [StaffingOrderController::class, 'complete']);
        Route::get('assignments', [AssignmentController::class, 'byOrder']);
        Route::post('assignments', [AssignmentController::class, 'store']);
        Route::post('assignments/bulk', [AssignmentController::class, 'bulkStore']);
        Route::get('attendance', [AttendanceController::class, 'byOrder']);
        Route::get('attendance/summary', [AttendanceController::class, 'orderSummary']);
        Route::get('timeline', [StaffingOrderController::class, 'timeline']);
    });

    // Workers
    Route::apiResource('workers', WorkerController::class);
    Route::get('workers/available', [WorkerController::class, 'available']);
    Route::get('workers/suggest', [WorkerController::class, 'suggest']);
    Route::patch('workers/{worker}/status', [WorkerController::class, 'changeStatus']);
    Route::prefix('workers/{worker}')->group(function () {
        Route::get('assignments', [WorkerController::class, 'assignments']);
        Route::get('ratings', [WorkerController::class, 'ratings']);
        Route::post('ratings', [WorkerRatingController::class, 'store']);
        Route::get('attendance', [AttendanceController::class, 'byWorker']);
        Route::get('payroll', [PayrollController::class, 'byWorker']);
    });

    // Assignments
    Route::apiResource('assignments', AssignmentController::class)->only(['index', 'update']);
    Route::prefix('assignments/{assignment}')->group(function () {
        Route::patch('contact', [AssignmentController::class, 'markContacted']);
        Route::patch('confirm', [AssignmentController::class, 'confirm']);
        Route::patch('reject', [AssignmentController::class, 'reject']);
        Route::patch('cancel', [AssignmentController::class, 'cancel']);
        Route::patch('replace', [AssignmentController::class, 'replace']);
        Route::patch('dispatch', [AssignmentController::class, 'dispatch']);
        Route::patch('reconfirm', [AssignmentController::class, 'reconfirm']);
    });
    Route::get('assignments/calendar', [AssignmentController::class, 'calendar']);
    Route::get('assignments/today', [AssignmentController::class, 'today']);

    // Attendance
    Route::post('attendance/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('attendance/check-out', [AttendanceController::class, 'checkOut']);
    Route::post('attendance/bulk-check-in', [AttendanceController::class, 'bulkCheckIn']);
    Route::post('attendance/bulk-check-out', [AttendanceController::class, 'bulkCheckOut']);
    Route::put('attendance/{attendance}', [AttendanceController::class, 'update']);
    Route::patch('attendance/{attendance}/approve', [AttendanceController::class, 'approve']);
    Route::post('attendance/approve-batch', [AttendanceController::class, 'batchApprove']);

    // Payroll
    Route::get('payroll', [PayrollController::class, 'index']);
    Route::post('payroll/calculate', [PayrollController::class, 'calculate']);
    Route::get('payroll/{payroll}', [PayrollController::class, 'show']);
    Route::patch('payroll/{payroll}/approve', [PayrollController::class, 'approve']);
    Route::patch('payroll/{payroll}/mark-paid', [PayrollController::class, 'markPaid']);
    Route::get('payroll/export', [PayrollController::class, 'export']);

    // Invoices
    Route::apiResource('invoices', InvoiceController::class);
    Route::patch('invoices/{invoice}/approve', [InvoiceController::class, 'approve']);
    Route::patch('invoices/{invoice}/send', [InvoiceController::class, 'markSent']);
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'generatePdf']);
    Route::get('invoices/{invoice}/payments', [PaymentController::class, 'byInvoice']);
    Route::post('invoices/{invoice}/payments', [PaymentController::class, 'store']);

    // Finance
    Route::prefix('finance')->group(function () {
        Route::get('revenue', [ReportController::class, 'revenue']);
        Route::get('receivables', [ReportController::class, 'receivables']);
        Route::get('payables', [ReportController::class, 'payables']);
        Route::get('profit-loss', [ReportController::class, 'profitLoss']);
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('overview', [DashboardController::class, 'overview']);
        Route::get('recruiter', [DashboardController::class, 'recruiter']);
        Route::get('sales', [DashboardController::class, 'sales']);
        Route::get('accountant', [DashboardController::class, 'accountant']);
        Route::get('stats', [DashboardController::class, 'stats']);
    });

    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('attendance/daily', [ReportController::class, 'attendanceDaily']);
        Route::get('attendance/weekly', [ReportController::class, 'attendanceWeekly']);
        Route::get('attendance/monthly', [ReportController::class, 'attendanceMonthly']);
        Route::get('attendance/export', [ReportController::class, 'attendanceExport']);
    });

    // System (giu nguyen co ban)
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('skills', SkillController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::get('activity-logs', [ActivityLogController::class, 'index']);
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::patch('notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Staff
    Route::apiResource('staff', StaffController::class);
    Route::get('staff/{staff}/kpi', [StaffController::class, 'kpi']);
    Route::get('staff/kpi/overview', [StaffController::class, 'kpiOverview']);
});
```

---

### Phase 5: Xoa Bang Cu

**Thoi gian du kien:** 1 ngay
**Rui ro:** Thap (neu Phase 3 xac nhan ok)

> **QUAN TRONG:** Chi chay Phase 5 sau khi da xac nhan Phase 2 + Phase 3 thanh cong va backend code moi da hoat dong tot.

File: `2026_04_10_300001_drop_old_tables.php`

```php
public function up(): void
{
    // Drop in reverse dependency order
    Schema::dropIfExists('room_invoices');
    Schema::dropIfExists('room_contracts');
    Schema::dropIfExists('beds');
    Schema::dropIfExists('rooms');
    Schema::dropIfExists('dormitories');

    Schema::dropIfExists('interviews');
    Schema::dropIfExists('applications');
    Schema::dropIfExists('labor_contracts');

    Schema::dropIfExists('old_attendances');      // Renamed in Phase 1
    Schema::dropIfExists('old_payrolls');          // Renamed in Phase 1

    Schema::dropIfExists('reviews');
    Schema::dropIfExists('worker_skills');         // Old skill table
    Schema::dropIfExists('worker_profiles');
    Schema::dropIfExists('job_posts');
    Schema::dropIfExists('employers');
    Schema::dropIfExists('regions');

    // Drop migration mapping table
    Schema::dropIfExists('_migration_mapping');
}

public function down(): void
{
    // KHONG rollback duoc - cac bang cu se mat vinh vien
    // Neu can rollback, restore tu database backup
    throw new \RuntimeException(
        'Cannot rollback: old tables have been dropped permanently. Restore from backup if needed.'
    );
}
```

---

## 4. Rollback Strategy

### 4.1 Truoc khi bat dau

1. **Full database backup** truoc khi chay Phase 1
2. **Test toan bo tren staging environment** truoc khi chay tren production

### 4.2 Rollback theo phase

| Phase | Rollback method |
|-------|----------------|
| Phase 1 | `php artisan migrate:rollback` - Xoa bang moi, revert thay doi users |
| Phase 2 | `php artisan migrate:rollback` - Xoa du lieu moi import |
| Phase 3 | Khong can rollback (chi verification) |
| Phase 4 | Git revert code changes |
| Phase 5 | **KHONG THE ROLLBACK** - Restore tu backup |

### 4.3 Bang tam _migration_mapping

```php
// Tao truoc khi bat dau Phase 2
Schema::create('_migration_mapping', function (Blueprint $table) {
    $table->id();
    $table->string('old_table', 50);
    $table->uuid('old_id');
    $table->string('new_table', 50);
    $table->uuid('new_id');
    $table->timestamps();

    $table->index(['old_table', 'old_id']);
    $table->index(['new_table', 'new_id']);
});
```

---

## 5. Checklist Truoc Khi Deploy

```
=== Truoc khi bat dau ===
[ ] Backup database day du
[ ] Test toan bo migration tren staging
[ ] Thong bao team ve downtime (neu can)
[ ] Chuan bi rollback plan

=== Sau Phase 1 ===
[ ] Tat ca bang moi da duoc tao
[ ] Bang users da duoc cap nhat
[ ] Khong co loi foreign key

=== Sau Phase 2 ===
[ ] Du lieu employers -> clients: so luong khop
[ ] Du lieu worker_profiles -> workers: so luong khop
[ ] Du lieu job_posts -> staffing_orders: so luong khop
[ ] Du lieu applications -> assignments: so luong khop
[ ] Skills da duoc extract va map dung
[ ] worker_code va order_code dung format

=== Sau Phase 3 ===
[ ] Verification script chay thanh cong
[ ] Khong co orphan records
[ ] Spot check 10 records ngau nhien cho moi bang

=== Sau Phase 4 ===
[ ] Routes moi hoat dong
[ ] Authentication van hoat dong
[ ] RBAC van hoat dong
[ ] API endpoints tra ve dung data
[ ] Frontend giao tiep dung voi API moi

=== Sau Phase 5 ===
[ ] Bang cu da xoa
[ ] _migration_mapping da xoa
[ ] Khong con references den bang cu trong code
[ ] He thong hoat dong binh thuong

=== Test cuoi cung ===
[ ] Tao khach hang moi
[ ] Tao don hang moi
[ ] Duyet don hang
[ ] Phan cong worker
[ ] Check-in/check-out
[ ] Tinh luong
[ ] Tao hoa don
[ ] Dashboard hien thi dung
[ ] Notifications gui dung
```

---

## 6. Timeline Tong Hop

```
Ngay 1:  Phase 1 - Tao bang moi (migrations 1.1 - 1.16)
Ngay 2:  Phase 1 - Test cac bang moi, fix issues
Ngay 3:  Phase 2 - Migrate du lieu (migrations 2.1 - 2.4)
Ngay 4:  Phase 3 - Xac nhan du lieu, fix issues
Ngay 5:  Phase 4 - Update Models + Enums + Policies
Ngay 6:  Phase 4 - Update Controllers + Routes + Requests + Resources
Ngay 7:  Phase 4 - Update Services + Actions + Events/Listeners
Ngay 8:  Phase 4 - Test API endpoints
Ngay 9:  Phase 5 - Xoa bang cu
Ngay 10: Phase 6 - Test toan dien, fix final issues
```

> **Ghi chu:** Timeline nay la du kien. Co the nhanh hon neu du lieu it, hoac cham hon neu co nhieu issues phat sinh trong qua trinh migrate.
