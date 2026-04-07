# Thiết Kế Database Schema (Tham Khảo)

---

## 1. Sơ đồ quan hệ tổng quan

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  users   │────→│ user_profiles│     │   regions    │
└────┬─────┘     └──────────────┘     └──────┬───────┘
     │                                        │
     │ (role=employer)          (role=landlord)│
     ▼                                        ▼
┌──────────────┐                    ┌──────────────────┐
│  employers   │                    │   dormitories    │
└──────┬───────┘                    └────────┬─────────┘
       │                                     │
       ▼                                     ▼
┌──────────────┐                    ┌──────────────────┐
│  job_posts   │                    │     rooms        │
└──────┬───────┘                    └────────┬─────────┘
       │                                     │
       ▼                                     ▼
┌──────────────┐    ┌──────────┐    ┌──────────────────┐
│ applications │───→│contracts │←──→│  room_contracts  │
└──────────────┘    └────┬─────┘    └──────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ attendances  │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  payrolls    │
                  └──────────────┘
```

---

## 2. Chi tiết các bảng

### 2.1 Quản lý người dùng

```sql
-- Bảng người dùng chính
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(15) UNIQUE,
    email           VARCHAR(255) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('admin','coordinator','employer','landlord','worker')),
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','banned')),
    credit_score    INT DEFAULT 100,        -- Điểm uy tín (0-1000)
    avatar_url      VARCHAR(500),
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Hồ sơ NVTV
CREATE TABLE worker_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name       VARCHAR(100) NOT NULL,
    date_of_birth   DATE NOT NULL,
    gender          VARCHAR(10) CHECK (gender IN ('male','female','other')),
    id_card_number  VARCHAR(20),            -- CCCD (mã hóa)
    id_card_front   VARCHAR(500),           -- URL ảnh mặt trước
    id_card_back    VARCHAR(500),           -- URL ảnh mặt sau
    selfie_url      VARCHAR(500),
    permanent_address TEXT,
    current_address TEXT,
    emergency_contact_name  VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    bank_name       VARCHAR(100),
    bank_account    VARCHAR(50),            -- Mã hóa
    bank_holder     VARCHAR(100),
    health_status   VARCHAR(50),
    vehicle         VARCHAR(50),            -- Phương tiện di chuyển
    needs_housing   BOOLEAN DEFAULT FALSE,  -- Có cần chỗ ở không
    ekyc_status     VARCHAR(20) DEFAULT 'pending',
    ekyc_verified_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Kỹ năng NVTV
CREATE TABLE worker_skills (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id   UUID REFERENCES worker_profiles(id),
    skill_name  VARCHAR(100) NOT NULL,
    level       VARCHAR(20) CHECK (level IN ('beginner','intermediate','advanced')),
    years       DECIMAL(3,1)
);

-- Kinh nghiệm làm việc
CREATE TABLE worker_experiences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id       UUID REFERENCES worker_profiles(id),
    company_name    VARCHAR(200),
    position        VARCHAR(200),
    start_date      DATE,
    end_date        DATE,
    description     TEXT
);

-- Hồ sơ Nhà tuyển dụng
CREATE TABLE employers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name        VARCHAR(200) NOT NULL,
    business_license    VARCHAR(50),
    license_image_url   VARCHAR(500),
    industry            VARCHAR(100),
    company_size        VARCHAR(50),
    address             TEXT,
    latitude            DECIMAL(10,8),
    longitude           DECIMAL(11,8),
    contact_name        VARCHAR(100),
    contact_phone       VARCHAR(15),
    description         TEXT,
    verified            BOOLEAN DEFAULT FALSE,
    verified_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Tuyển dụng

```sql
-- Tin tuyển dụng
CREATE TABLE job_posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id     UUID REFERENCES employers(id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    requirements    TEXT,
    benefits        TEXT,
    job_type        VARCHAR(50),             -- phục vụ, kho, sản xuất, bán hàng, sự kiện...
    positions_count INT NOT NULL,             -- Số lượng cần tuyển
    filled_count    INT DEFAULT 0,            -- Đã tuyển được
    salary_type     VARCHAR(20) CHECK (salary_type IN ('hourly','daily','shift','monthly')),
    salary_amount   DECIMAL(12,0) NOT NULL,   -- VND
    salary_ot_rate  DECIMAL(3,2) DEFAULT 1.5, -- Hệ số OT
    shift_type      VARCHAR(20),              -- morning, afternoon, evening, night, flexible
    work_start_date DATE NOT NULL,
    work_end_date   DATE NOT NULL,
    work_address    TEXT NOT NULL,
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    region_id       UUID REFERENCES regions(id),
    has_housing     BOOLEAN DEFAULT FALSE,    -- Có hỗ trợ chỗ ở
    preferred_dorm_id UUID REFERENCES dormitories(id),
    min_age         INT,
    max_age         INT,
    gender_req      VARCHAR(10),              -- male, female, any
    deadline        DATE,
    status          VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','pending','active','paused','closed','expired')),
    view_count      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Đơn ứng tuyển
CREATE TABLE applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_post_id     UUID REFERENCES job_posts(id),
    worker_id       UUID REFERENCES worker_profiles(id),
    cover_letter    TEXT,
    status          VARCHAR(20) DEFAULT 'new' CHECK (status IN (
        'new','reviewing','interview_invited','interviewed',
        'passed','rejected','hired','withdrawn','standby'
    )),
    match_score     DECIMAL(5,2),             -- AI matching score (0-100)
    notes           TEXT,                      -- Ghi chú NTD
    applied_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_post_id, worker_id)            -- Không ứng tuyển trùng
);

-- Lịch phỏng vấn
CREATE TABLE interviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID REFERENCES applications(id),
    interview_type  VARCHAR(20) CHECK (interview_type IN ('in_person','video','phone')),
    scheduled_at    TIMESTAMPTZ NOT NULL,
    location        TEXT,
    meeting_link    VARCHAR(500),
    status          VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled','confirmed','completed','cancelled','no_show'
    )),
    rating_attitude     INT CHECK (rating_attitude BETWEEN 1 AND 5),
    rating_communication INT CHECK (rating_communication BETWEEN 1 AND 5),
    rating_fit          INT CHECK (rating_fit BETWEEN 1 AND 5),
    feedback        TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Hợp đồng lao động
CREATE TABLE labor_contracts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE,
    application_id  UUID REFERENCES applications(id),
    employer_id     UUID REFERENCES employers(id),
    worker_id       UUID REFERENCES worker_profiles(id),
    position        VARCHAR(200),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    salary_type     VARCHAR(20),
    salary_amount   DECIMAL(12,0),
    shift_type      VARCHAR(20),
    work_address    TEXT,
    terms           JSONB,                    -- Điều khoản chi tiết
    has_housing     BOOLEAN DEFAULT FALSE,
    status          VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
        'draft','pending_worker','pending_employer','active',
        'completed','terminated_early','expired'
    )),
    worker_signed_at    TIMESTAMPTZ,
    employer_signed_at  TIMESTAMPTZ,
    terminated_at       TIMESTAMPTZ,
    termination_reason  TEXT,
    pdf_url         VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.3 Chấm công & Lương

```sql
-- Chấm công
CREATE TABLE attendances (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID REFERENCES labor_contracts(id),
    worker_id       UUID REFERENCES worker_profiles(id),
    work_date       DATE NOT NULL,
    check_in_at     TIMESTAMPTZ,
    check_out_at    TIMESTAMPTZ,
    check_in_method VARCHAR(20),              -- qr, gps, face, manual
    check_in_lat    DECIMAL(10,8),
    check_in_lng    DECIMAL(11,8),
    check_in_photo  VARCHAR(500),
    check_out_method VARCHAR(20),
    total_hours     DECIMAL(4,1),
    ot_hours        DECIMAL(4,1) DEFAULT 0,
    is_approved     BOOLEAN DEFAULT FALSE,
    approved_by     UUID REFERENCES users(id),
    status          VARCHAR(20) DEFAULT 'present' CHECK (status IN (
        'present','absent_excused','absent_unexcused','late','leave','holiday'
    )),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng lương
CREATE TABLE payrolls (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID REFERENCES labor_contracts(id),
    worker_id       UUID REFERENCES worker_profiles(id),
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    total_shifts    INT,
    total_hours     DECIMAL(6,1),
    ot_hours        DECIMAL(6,1),
    base_salary     DECIMAL(12,0),            -- Lương cơ bản
    ot_salary       DECIMAL(12,0),            -- Lương OT
    allowances      DECIMAL(12,0) DEFAULT 0,  -- Phụ cấp
    gross_salary    DECIMAL(12,0),            -- Tổng thu nhập
    housing_deduct  DECIMAL(12,0) DEFAULT 0,  -- Khấu trừ trọ
    advance_deduct  DECIMAL(12,0) DEFAULT 0,  -- Khấu trừ tạm ứng
    penalty_deduct  DECIMAL(12,0) DEFAULT 0,  -- Khấu trừ phạt
    insurance_deduct DECIMAL(12,0) DEFAULT 0, -- BHXH/BHYT
    total_deductions DECIMAL(12,0) DEFAULT 0,
    net_salary      DECIMAL(12,0),            -- Lương thực nhận
    status          VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
        'draft','pending_approval','approved','paid','disputed'
    )),
    paid_at         TIMESTAMPTZ,
    payment_method  VARCHAR(20),
    payment_ref     VARCHAR(100),
    pdf_url         VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Tạm ứng lương
CREATE TABLE salary_advances (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID REFERENCES labor_contracts(id),
    worker_id       UUID REFERENCES worker_profiles(id),
    amount          DECIMAL(12,0) NOT NULL,
    reason          TEXT,
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','deducted')),
    approved_by     UUID REFERENCES users(id),
    approved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.4 Quản lý nhà trọ

```sql
-- Khu vực
CREATE TABLE regions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    boundary        JSONB,                    -- GeoJSON polygon
    radius_km       DECIMAL(5,1),
    province        VARCHAR(100),
    district        VARCHAR(100),
    status          VARCHAR(20) DEFAULT 'active',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Khu trọ
CREATE TABLE dormitories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id     UUID REFERENCES users(id),
    region_id       UUID REFERENCES regions(id),
    name            VARCHAR(200) NOT NULL,
    address         TEXT NOT NULL,
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    total_rooms     INT DEFAULT 0,
    total_beds      INT DEFAULT 0,
    has_wifi        BOOLEAN DEFAULT FALSE,
    has_ac          BOOLEAN DEFAULT FALSE,
    has_hot_water   BOOLEAN DEFAULT FALSE,
    has_kitchen     BOOLEAN DEFAULT FALSE,
    has_parking     BOOLEAN DEFAULT FALSE,
    has_laundry     BOOLEAN DEFAULT FALSE,
    has_security    BOOLEAN DEFAULT FALSE,
    has_camera      BOOLEAN DEFAULT FALSE,
    curfew_time     TIME,                     -- Giờ giới nghiêm
    electricity_rate DECIMAL(8,0),            -- Giá điện/KWh
    water_rate      DECIMAL(8,0),             -- Giá nước/m3
    deposit_amount  DECIMAL(12,0),            -- Tiền cọc
    rules           TEXT,                      -- Nội quy
    cancellation_policy TEXT,
    photos          JSONB,                    -- Array URLs
    rating          DECIMAL(2,1) DEFAULT 0,
    review_count    INT DEFAULT 0,
    quality_tier    VARCHAR(10) CHECK (quality_tier IN ('basic','standard','premium')),
    status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','removed')),
    verified_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Phòng
CREATE TABLE rooms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id    UUID REFERENCES dormitories(id),
    room_number     VARCHAR(20) NOT NULL,
    floor           INT,
    room_type       VARCHAR(20) CHECK (room_type IN ('single','double','dorm')),
    area_sqm        DECIMAL(5,1),
    capacity        INT NOT NULL,              -- Sức chứa tối đa
    current_occupancy INT DEFAULT 0,
    price           DECIMAL(12,0) NOT NULL,    -- Giá/tháng
    amenities       JSONB,                     -- Tiện ích riêng phòng
    photos          JSONB,
    status          VARCHAR(20) DEFAULT 'available' CHECK (status IN (
        'available','occupied','reserved','maintenance','cleaning'
    )),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Giường (cho phòng ký túc xá)
CREATE TABLE beds (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID REFERENCES rooms(id),
    bed_number      VARCHAR(10) NOT NULL,
    bed_position    VARCHAR(10) CHECK (bed_position IN ('upper','lower','single')),
    price           DECIMAL(12,0),
    status          VARCHAR(20) DEFAULT 'available' CHECK (status IN (
        'available','occupied','reserved','maintenance'
    )),
    current_occupant_id UUID REFERENCES worker_profiles(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Hợp đồng thuê trọ
CREATE TABLE room_contracts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE,
    worker_id       UUID REFERENCES worker_profiles(id),
    dormitory_id    UUID REFERENCES dormitories(id),
    room_id         UUID REFERENCES rooms(id),
    bed_id          UUID REFERENCES beds(id),  -- NULL nếu thuê nguyên phòng
    labor_contract_id UUID REFERENCES labor_contracts(id), -- Liên kết HĐ lao động
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    monthly_rent    DECIMAL(12,0) NOT NULL,
    deposit_amount  DECIMAL(12,0),
    payment_method  VARCHAR(20) CHECK (payment_method IN ('salary_deduct','self_pay')),
    status          VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
        'draft','active','expired','terminated','pending_checkout'
    )),
    signed_at       TIMESTAMPTZ,
    pdf_url         VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ số điện nước
CREATE TABLE utility_readings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID REFERENCES rooms(id),
    reading_date    DATE NOT NULL,
    electricity_prev DECIMAL(10,1),
    electricity_curr DECIMAL(10,1),
    electricity_used DECIMAL(10,1),
    water_prev      DECIMAL(10,1),
    water_curr      DECIMAL(10,1),
    water_used      DECIMAL(10,1),
    photo_electricity VARCHAR(500),           -- Ảnh đồng hồ điện
    photo_water     VARCHAR(500),              -- Ảnh đồng hồ nước
    recorded_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Hóa đơn trọ
CREATE TABLE room_invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number  VARCHAR(50) UNIQUE,
    room_contract_id UUID REFERENCES room_contracts(id),
    worker_id       UUID REFERENCES worker_profiles(id),
    billing_month   DATE NOT NULL,             -- Tháng tính (yyyy-mm-01)
    rent_amount     DECIMAL(12,0),
    electricity_amount DECIMAL(12,0),
    water_amount    DECIMAL(12,0),
    internet_amount DECIMAL(12,0),
    trash_amount    DECIMAL(12,0),
    other_amount    DECIMAL(12,0) DEFAULT 0,
    other_description TEXT,
    late_fee        DECIMAL(12,0) DEFAULT 0,
    total_amount    DECIMAL(12,0),
    paid_amount     DECIMAL(12,0) DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN (
        'unpaid','partial','paid','overdue','bad_debt'
    )),
    due_date        DATE,
    paid_at         TIMESTAMPTZ,
    payment_method  VARCHAR(20),
    is_salary_deducted BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Yêu cầu bảo trì
CREATE TABLE maintenance_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id    UUID REFERENCES dormitories(id),
    room_id         UUID REFERENCES rooms(id),
    reported_by     UUID REFERENCES users(id),
    category        VARCHAR(50) CHECK (category IN ('electrical','plumbing','furniture','other')),
    description     TEXT NOT NULL,
    photos          JSONB,
    urgency         VARCHAR(20) CHECK (urgency IN ('low','medium','high','emergency')),
    status          VARCHAR(20) DEFAULT 'new' CHECK (status IN (
        'new','acknowledged','in_progress','completed','confirmed'
    )),
    cost            DECIMAL(12,0),
    cost_bearer     VARCHAR(20) CHECK (cost_bearer IN ('landlord','worker','shared')),
    completed_at    TIMESTAMPTZ,
    confirmed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Vi phạm nội quy
CREATE TABLE violations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id    UUID REFERENCES dormitories(id),
    worker_id       UUID REFERENCES worker_profiles(id),
    room_id         UUID REFERENCES rooms(id),
    violation_type  VARCHAR(100),
    description     TEXT NOT NULL,
    evidence        JSONB,                     -- Ảnh/video bằng chứng
    severity        VARCHAR(20) CHECK (severity IN ('minor','moderate','severe')),
    action_taken    VARCHAR(50) CHECK (action_taken IN ('warning','fine','final_warning','termination')),
    fine_amount     DECIMAL(12,0),
    violation_count INT DEFAULT 1,             -- Lần vi phạm thứ mấy
    worker_response TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.5 Đánh giá & Review

```sql
-- Đánh giá hai chiều
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id     UUID REFERENCES users(id),
    reviewee_id     UUID REFERENCES users(id),
    review_type     VARCHAR(20) CHECK (review_type IN (
        'employer_to_worker','worker_to_employer',
        'worker_to_dorm','dorm_to_worker'
    )),
    contract_id     UUID,                      -- HĐ lao động hoặc HĐ trọ
    rating          DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
    rating_detail   JSONB,                     -- Chi tiết từng tiêu chí
    comment         TEXT,
    would_rehire    BOOLEAN,                   -- NTD: có muốn tuyển lại?
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.6 Hệ thống hỗ trợ

```sql
-- Thông báo
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    title           VARCHAR(200) NOT NULL,
    body            TEXT NOT NULL,
    type            VARCHAR(50),               -- job_match, interview, contract, payment, maintenance...
    reference_type  VARCHAR(50),               -- Loại entity liên quan
    reference_id    UUID,                      -- ID entity liên quan
    channels        JSONB DEFAULT '["push"]',  -- ["push","sms","email","zalo"]
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Chat/Tin nhắn
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id       UUID REFERENCES users(id),
    content         TEXT,
    message_type    VARCHAR(20) DEFAULT 'text', -- text, image, file, location, voice
    file_url        VARCHAR(500),
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            VARCHAR(20) CHECK (type IN ('direct','group')),
    name            VARCHAR(200),              -- Tên nhóm (nếu group)
    participants    JSONB NOT NULL,            -- Array user_ids
    last_message_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket hỗ trợ
CREATE TABLE support_tickets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number   VARCHAR(20) UNIQUE,
    user_id         UUID REFERENCES users(id),
    category        VARCHAR(50),
    subject         VARCHAR(200),
    description     TEXT,
    attachments     JSONB,
    priority        VARCHAR(20) CHECK (priority IN ('low','medium','high')),
    status          VARCHAR(20) DEFAULT 'new' CHECK (status IN (
        'new','in_progress','waiting_response','resolved','closed'
    )),
    assigned_to     UUID REFERENCES users(id),
    resolved_at     TIMESTAMPTZ,
    satisfaction    INT CHECK (satisfaction BETWEEN 1 AND 5),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(50) NOT NULL,       -- create, update, delete, login, export...
    entity_type     VARCHAR(50),
    entity_id       UUID,
    old_data        JSONB,
    new_data        JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Indexes quan trọng

```sql
-- Performance indexes
CREATE INDEX idx_job_posts_region ON job_posts(region_id, status);
CREATE INDEX idx_job_posts_location ON job_posts USING gist (
    ST_MakePoint(longitude, latitude)
);
CREATE INDEX idx_applications_status ON applications(job_post_id, status);
CREATE INDEX idx_attendances_date ON attendances(contract_id, work_date);
CREATE INDEX idx_room_invoices_month ON room_invoices(room_contract_id, billing_month);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, sent_at DESC);
CREATE INDEX idx_dormitories_region ON dormitories(region_id, status);
CREATE INDEX idx_rooms_status ON rooms(dormitory_id, status);
```
