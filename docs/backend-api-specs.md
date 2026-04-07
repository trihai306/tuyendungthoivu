# Backend API Specifications
# Tuyển Dụng Nhân Viên Thời Vụ & Quản Lý Trọ Liên Kết

> **Tech Stack:** Laravel 11 + PHP 8.3 + PostgreSQL + Laravel Sanctum + Redis + Queue
> **Base URL:** `https://api.example.com/api/v1`
> **Auth:** Bearer Token (Laravel Sanctum)
> **Format:** JSON (UTF-8)

---

## 1. API Endpoints

---

### 1.1 Auth Module

#### `POST /api/v1/auth/register` - Dang ky tai khoan

**Middleware:** `throttle:5,1`

**Request Body:**
```json
{
  "phone": "0901234567",
  "email": "user@example.com",
  "password": "MyP@ssw0rd",
  "password_confirmation": "MyP@ssw0rd",
  "role": "worker",
  "full_name": "Nguyen Van A"
}
```

| Field | Type | Validation |
|-------|------|------------|
| phone | string | required, regex:/^0[0-9]{9}$/, unique:users |
| email | string | required, email, unique:users |
| password | string | required, min:8, confirmed, mixed_case, numbers |
| role | string | required, in:worker,employer,landlord |
| full_name | string | required, max:100 |

**Response 201:**
```json
{
  "success": true,
  "message": "Dang ky thanh cong. Vui long xac minh OTP.",
  "data": {
    "user": {
      "id": "uuid-here",
      "phone": "0901234567",
      "email": "user@example.com",
      "role": "worker",
      "status": "pending",
      "created_at": "2026-04-07T10:00:00Z"
    },
    "requires_otp": true
  }
}
```

**Response 422:**
```json
{
  "success": false,
  "message": "Du lieu khong hop le.",
  "errors": {
    "phone": ["So dien thoai da duoc su dung."],
    "password": ["Mat khau phai co it nhat 8 ky tu."]
  }
}
```

---

#### `POST /api/v1/auth/login` - Dang nhap

**Middleware:** `throttle:10,1`

**Request Body:**
```json
{
  "login": "0901234567",
  "password": "MyP@ssw0rd",
  "device_name": "iPhone 15",
  "fcm_token": "firebase-token-here"
}
```

| Field | Type | Validation |
|-------|------|------------|
| login | string | required (phone hoac email) |
| password | string | required |
| device_name | string | required, max:100 |
| fcm_token | string | nullable |

**Response 200:**
```json
{
  "success": true,
  "message": "Dang nhap thanh cong.",
  "data": {
    "user": {
      "id": "uuid-here",
      "phone": "0901234567",
      "email": "user@example.com",
      "role": "worker",
      "status": "active",
      "credit_score": 100,
      "avatar_url": null
    },
    "token": "1|abc123tokenhere",
    "token_type": "Bearer",
    "expires_at": "2026-05-07T10:00:00Z"
  }
}
```

**Response 401:**
```json
{
  "success": false,
  "message": "Thong tin dang nhap khong chinh xac."
}
```

**Response 403:**
```json
{
  "success": false,
  "message": "Tai khoan chua duoc kich hoat. Vui long xac minh OTP."
}
```

---

#### `POST /api/v1/auth/send-otp` - Gui OTP

**Middleware:** `throttle:3,5`

**Request Body:**
```json
{
  "phone": "0901234567",
  "type": "registration"
}
```

| Field | Type | Validation |
|-------|------|------------|
| phone | string | required, regex:/^0[0-9]{9}$/ |
| type | string | required, in:registration,login,password_reset |

**Response 200:**
```json
{
  "success": true,
  "message": "OTP da duoc gui den so dien thoai cua ban.",
  "data": {
    "expires_in": 300,
    "retry_after": 60
  }
}
```

---

#### `POST /api/v1/auth/verify-otp` - Xac minh OTP

**Middleware:** `throttle:5,5`

**Request Body:**
```json
{
  "phone": "0901234567",
  "otp": "123456",
  "type": "registration"
}
```

| Field | Type | Validation |
|-------|------|------------|
| phone | string | required |
| otp | string | required, digits:6 |
| type | string | required, in:registration,login,password_reset |

**Response 200:**
```json
{
  "success": true,
  "message": "Xac minh OTP thanh cong.",
  "data": {
    "user": { "id": "uuid", "status": "active" },
    "token": "1|abc123tokenhere"
  }
}
```

**Response 422:**
```json
{
  "success": false,
  "message": "Ma OTP khong hop le hoac da het han."
}
```

---

#### `POST /api/v1/auth/logout` - Dang xuat

**Middleware:** `auth:sanctum`

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Dang xuat thanh cong."
}
```

---

#### `POST /api/v1/auth/refresh` - Refresh token

**Middleware:** `auth:sanctum`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "2|newtokenhere",
    "token_type": "Bearer",
    "expires_at": "2026-05-07T10:00:00Z"
  }
}
```

---

#### `POST /api/v1/auth/forgot-password` - Quen mat khau

**Middleware:** `throttle:3,5`

**Request Body:**
```json
{
  "phone": "0901234567"
}
```

| Field | Type | Validation |
|-------|------|------------|
| phone | string | required, exists:users,phone |

**Response 200:**
```json
{
  "success": true,
  "message": "OTP dat lai mat khau da duoc gui."
}
```

---

#### `POST /api/v1/auth/reset-password` - Dat lai mat khau

**Middleware:** `throttle:5,5`

**Request Body:**
```json
{
  "phone": "0901234567",
  "otp": "123456",
  "password": "NewP@ssw0rd",
  "password_confirmation": "NewP@ssw0rd"
}
```

| Field | Type | Validation |
|-------|------|------------|
| phone | string | required |
| otp | string | required, digits:6 |
| password | string | required, min:8, confirmed, mixed_case, numbers |

**Response 200:**
```json
{
  "success": true,
  "message": "Dat lai mat khau thanh cong. Vui long dang nhap lai."
}
```

---

### 1.2 Profile Module

#### `GET /api/v1/profile` - Xem thong tin ca nhan

**Middleware:** `auth:sanctum`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone": "0901234567",
    "email": "user@example.com",
    "role": "worker",
    "status": "active",
    "credit_score": 100,
    "avatar_url": "https://storage.example.com/avatars/uuid.jpg",
    "profile": {
      "full_name": "Nguyen Van A",
      "date_of_birth": "1998-05-15",
      "gender": "male",
      "id_card_number": "****1234",
      "permanent_address": "Ha Noi",
      "current_address": "Binh Duong",
      "emergency_contact_name": "Nguyen Thi B",
      "emergency_contact_phone": "0909876543",
      "bank_name": "Vietcombank",
      "bank_account": "****5678",
      "bank_holder": "NGUYEN VAN A",
      "health_status": "good",
      "vehicle": "motorbike",
      "needs_housing": true,
      "ekyc_status": "verified",
      "skills": [
        { "skill_name": "Phuc vu", "level": "intermediate", "years": 2.0 }
      ],
      "experiences": [
        {
          "company_name": "Cong ty A",
          "position": "Phuc vu",
          "start_date": "2024-01-01",
          "end_date": "2024-06-30",
          "description": "Phuc vu nha hang"
        }
      ]
    }
  }
}
```

---

#### `PUT /api/v1/profile` - Cap nhat thong tin ca nhan

**Middleware:** `auth:sanctum`

**Request Body (worker):**
```json
{
  "full_name": "Nguyen Van A",
  "date_of_birth": "1998-05-15",
  "gender": "male",
  "permanent_address": "Ha Noi",
  "current_address": "Binh Duong",
  "emergency_contact_name": "Nguyen Thi B",
  "emergency_contact_phone": "0909876543",
  "bank_name": "Vietcombank",
  "bank_account": "1234567890",
  "bank_holder": "NGUYEN VAN A",
  "health_status": "good",
  "vehicle": "motorbike",
  "needs_housing": true
}
```

| Field | Type | Validation |
|-------|------|------------|
| full_name | string | required, max:100 |
| date_of_birth | date | required, before:today, after:1950-01-01 |
| gender | string | required, in:male,female,other |
| permanent_address | string | nullable, max:500 |
| current_address | string | nullable, max:500 |
| emergency_contact_name | string | nullable, max:100 |
| emergency_contact_phone | string | nullable, regex:/^0[0-9]{9}$/ |
| bank_name | string | nullable, max:100 |
| bank_account | string | nullable, max:50 |
| bank_holder | string | nullable, max:100 |
| health_status | string | nullable, in:good,fair,poor |
| vehicle | string | nullable, in:motorbike,bicycle,walking,car,none |
| needs_housing | boolean | nullable |

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat thong tin thanh cong.",
  "data": { "...profile object..." }
}
```

---

#### `POST /api/v1/profile/avatar` - Upload avatar

**Middleware:** `auth:sanctum`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| avatar | file | required, image, mimes:jpg,jpeg,png, max:2048 |

**Response 200:**
```json
{
  "success": true,
  "data": { "avatar_url": "https://storage.example.com/avatars/uuid.jpg" }
}
```

---

#### `POST /api/v1/profile/ekyc` - Upload CCCD va selfie de eKYC

**Middleware:** `auth:sanctum, role:worker`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| id_card_front | file | required, image, mimes:jpg,jpeg,png, max:5120 |
| id_card_back | file | required, image, mimes:jpg,jpeg,png, max:5120 |
| selfie | file | required, image, mimes:jpg,jpeg,png, max:5120 |

**Response 200:**
```json
{
  "success": true,
  "message": "Ho so eKYC da duoc gui. Ket qua se duoc tra trong 1-5 phut.",
  "data": {
    "ekyc_status": "processing",
    "extracted_info": {
      "full_name": "NGUYEN VAN A",
      "date_of_birth": "15/05/1998",
      "id_card_number": "0123456789XX",
      "gender": "Nam"
    }
  }
}
```

---

#### `PUT /api/v1/profile/employer` - Cap nhat ho so nha tuyen dung

**Middleware:** `auth:sanctum, role:employer`

**Request Body:**
```json
{
  "company_name": "Cong ty TNHH ABC",
  "business_license": "0123456789",
  "industry": "San xuat",
  "company_size": "100-500",
  "address": "KCN Bac Thang Long, Ha Noi",
  "latitude": 21.0735,
  "longitude": 105.7676,
  "contact_name": "Nguyen Van B",
  "contact_phone": "0901111222",
  "description": "Cong ty san xuat linh kien dien tu"
}
```

| Field | Type | Validation |
|-------|------|------------|
| company_name | string | required, max:200 |
| business_license | string | nullable, max:50 |
| industry | string | nullable, max:100 |
| company_size | string | nullable, in:1-10,11-50,51-100,100-500,500+ |
| address | string | required, max:500 |
| latitude | decimal | nullable, between:-90,90 |
| longitude | decimal | nullable, between:-180,180 |
| contact_name | string | required, max:100 |
| contact_phone | string | required, regex:/^0[0-9]{9}$/ |
| description | string | nullable, max:2000 |

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat ho so doanh nghiep thanh cong.",
  "data": { "...employer object..." }
}
```

---

#### `POST /api/v1/profile/employer/license` - Upload giay phep kinh doanh

**Middleware:** `auth:sanctum, role:employer`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| license_image | file | required, mimes:jpg,jpeg,png,pdf, max:10240 |

**Response 200:**
```json
{
  "success": true,
  "message": "Giay phep kinh doanh da duoc gui de xac minh."
}
```

---

#### `POST /api/v1/profile/skills` - Them ky nang

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "skills": [
    { "skill_name": "Phuc vu", "level": "intermediate", "years": 2.0 },
    { "skill_name": "Kho bai", "level": "beginner", "years": 0.5 }
  ]
}
```

| Field | Type | Validation |
|-------|------|------------|
| skills | array | required, min:1 |
| skills.*.skill_name | string | required, max:100 |
| skills.*.level | string | required, in:beginner,intermediate,advanced |
| skills.*.years | decimal | nullable, min:0, max:50 |

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat ky nang thanh cong.",
  "data": { "skills": ["..."] }
}
```

---

#### `POST /api/v1/profile/experiences` - Them kinh nghiem

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "company_name": "Cong ty XYZ",
  "position": "Nhan vien kho",
  "start_date": "2024-01-01",
  "end_date": "2024-06-30",
  "description": "Quan ly hang hoa trong kho"
}
```

| Field | Type | Validation |
|-------|------|------------|
| company_name | string | required, max:200 |
| position | string | required, max:200 |
| start_date | date | required |
| end_date | date | nullable, after:start_date |
| description | string | nullable, max:1000 |

**Response 201:**
```json
{
  "success": true,
  "message": "Them kinh nghiem thanh cong.",
  "data": { "...experience object..." }
}
```

---

### 1.3 Job Posts Module

#### `GET /api/v1/jobs` - Danh sach tin tuyen dung (public)

**Middleware:** `throttle:60,1`

**Query Parameters:**

| Param | Type | Validation | Mo ta |
|-------|------|------------|-------|
| keyword | string | nullable, max:100 | Tim theo tieu de, mo ta |
| region_id | uuid | nullable, exists:regions,id | Loc theo khu vuc |
| job_type | string | nullable | Loai cong viec |
| salary_min | integer | nullable, min:0 | Luong toi thieu |
| salary_max | integer | nullable, min:0 | Luong toi da |
| salary_type | string | nullable, in:hourly,daily,shift,monthly | Kieu luong |
| shift_type | string | nullable | Ca lam viec |
| has_housing | boolean | nullable | Co cho o khong |
| lat | decimal | nullable | Vi do (de tinh khoang cach) |
| lng | decimal | nullable | Kinh do |
| radius | integer | nullable, min:1, max:50 | Ban kinh (km) |
| sort_by | string | nullable, in:newest,salary_high,salary_low,distance,match_score | Sap xep |
| page | integer | nullable, min:1 | Trang |
| per_page | integer | nullable, min:5, max:50 | So luong/trang |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Tuyen 50 cong nhan dong goi",
        "employer": {
          "id": "uuid",
          "company_name": "Cong ty ABC",
          "rating": 4.5,
          "verified": true
        },
        "job_type": "warehouse",
        "positions_count": 50,
        "filled_count": 20,
        "salary_type": "shift",
        "salary_amount": 200000,
        "shift_type": "morning",
        "work_start_date": "2026-04-15",
        "work_end_date": "2026-07-15",
        "work_address": "KCN Bac Thang Long, Ha Noi",
        "latitude": 21.0735,
        "longitude": 105.7676,
        "region": { "id": "uuid", "name": "KCN Bac Thang Long" },
        "has_housing": true,
        "deadline": "2026-04-12",
        "distance_km": 2.5,
        "match_score": 85.5,
        "view_count": 1250,
        "created_at": "2026-04-01T08:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 15,
      "total": 120,
      "last_page": 8
    }
  }
}
```

---

#### `GET /api/v1/jobs/{id}` - Chi tiet tin tuyen dung

**Middleware:** `throttle:60,1`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Tuyen 50 cong nhan dong goi",
    "description": "Mo ta chi tiet cong viec...",
    "requirements": "Yeu cau ung vien...",
    "benefits": "Phuc loi...",
    "employer": {
      "id": "uuid",
      "company_name": "Cong ty ABC",
      "industry": "San xuat",
      "rating": 4.5,
      "review_count": 89,
      "verified": true
    },
    "job_type": "warehouse",
    "positions_count": 50,
    "filled_count": 20,
    "salary_type": "shift",
    "salary_amount": 200000,
    "salary_ot_rate": 1.5,
    "shift_type": "morning",
    "work_start_date": "2026-04-15",
    "work_end_date": "2026-07-15",
    "work_address": "KCN Bac Thang Long, Ha Noi",
    "latitude": 21.0735,
    "longitude": 105.7676,
    "region": { "id": "uuid", "name": "KCN Bac Thang Long" },
    "has_housing": true,
    "preferred_dormitory": {
      "id": "uuid",
      "name": "Tro Hoang Anh",
      "distance_km": 1.2,
      "price_from": 800000,
      "rating": 4.2
    },
    "min_age": 18,
    "max_age": 45,
    "gender_req": "any",
    "deadline": "2026-04-12",
    "status": "active",
    "view_count": 1250,
    "created_at": "2026-04-01T08:00:00Z",
    "has_applied": false
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "message": "Khong tim thay tin tuyen dung."
}
```

---

#### `POST /api/v1/jobs` - Tao tin tuyen dung

**Middleware:** `auth:sanctum, role:employer`

**Request Body:**
```json
{
  "title": "Tuyen 50 cong nhan dong goi",
  "description": "Mo ta chi tiet cong viec...",
  "requirements": "Nam/Nu, 18-45 tuoi, suc khoe tot",
  "benefits": "An trua, xe dua don",
  "job_type": "warehouse",
  "positions_count": 50,
  "salary_type": "shift",
  "salary_amount": 200000,
  "salary_ot_rate": 1.5,
  "shift_type": "morning",
  "work_start_date": "2026-04-15",
  "work_end_date": "2026-07-15",
  "work_address": "KCN Bac Thang Long, Ha Noi",
  "latitude": 21.0735,
  "longitude": 105.7676,
  "region_id": "uuid",
  "has_housing": true,
  "preferred_dorm_id": "uuid",
  "min_age": 18,
  "max_age": 45,
  "gender_req": "any",
  "deadline": "2026-04-12",
  "status": "draft"
}
```

| Field | Type | Validation |
|-------|------|------------|
| title | string | required, max:200 |
| description | string | required, max:5000 |
| requirements | string | nullable, max:2000 |
| benefits | string | nullable, max:2000 |
| job_type | string | required, max:50 |
| positions_count | integer | required, min:1, max:1000 |
| salary_type | string | required, in:hourly,daily,shift,monthly |
| salary_amount | integer | required, min:10000 |
| salary_ot_rate | decimal | nullable, min:1.0, max:3.0 |
| shift_type | string | nullable, in:morning,afternoon,evening,night,flexible |
| work_start_date | date | required, after_or_equal:today |
| work_end_date | date | required, after:work_start_date |
| work_address | string | required, max:500 |
| latitude | decimal | nullable, between:-90,90 |
| longitude | decimal | nullable, between:-180,180 |
| region_id | uuid | nullable, exists:regions,id |
| has_housing | boolean | nullable |
| preferred_dorm_id | uuid | nullable, exists:dormitories,id |
| min_age | integer | nullable, min:15, max:65 |
| max_age | integer | nullable, min:15, max:65, gte:min_age |
| gender_req | string | nullable, in:male,female,any |
| deadline | date | nullable, after:today |
| status | string | nullable, in:draft,pending |

**Response 201:**
```json
{
  "success": true,
  "message": "Tao tin tuyen dung thanh cong.",
  "data": { "...job post object..." }
}
```

---

#### `PUT /api/v1/jobs/{id}` - Cap nhat tin tuyen dung

**Middleware:** `auth:sanctum, role:employer`

**Request Body:** Giong POST, tat ca fields la nullable.

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat tin tuyen dung thanh cong.",
  "data": { "...job post object..." }
}
```

**Response 403:**
```json
{
  "success": false,
  "message": "Ban khong co quyen chinh sua tin tuyen dung nay."
}
```

---

#### `DELETE /api/v1/jobs/{id}` - Xoa tin tuyen dung

**Middleware:** `auth:sanctum, role:employer`

**Response 200:**
```json
{
  "success": true,
  "message": "Xoa tin tuyen dung thanh cong."
}
```

---

#### `PATCH /api/v1/jobs/{id}/status` - Doi trang thai tin

**Middleware:** `auth:sanctum, role:employer,admin,coordinator`

**Request Body:**
```json
{
  "status": "active",
  "reason": "Da duyet"
}
```

| Field | Type | Validation |
|-------|------|------------|
| status | string | required, in:pending,active,paused,closed |
| reason | string | nullable, max:500, required_if:status,closed |

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat trang thai thanh cong."
}
```

---

#### `GET /api/v1/jobs/my` - Tin tuyen dung cua toi (NTD)

**Middleware:** `auth:sanctum, role:employer`

**Query Parameters:** `status`, `page`, `per_page`

**Response 200:** Giong danh sach jobs nhung chi tra ve tin cua NTD dang dang nhap.

---

### 1.4 Applications Module

#### `POST /api/v1/jobs/{jobId}/apply` - Ung tuyen

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "cover_letter": "Toi muon ung tuyen vi tri nay vi..."
}
```

| Field | Type | Validation |
|-------|------|------------|
| cover_letter | string | nullable, max:2000 |

**Response 201:**
```json
{
  "success": true,
  "message": "Ung tuyen thanh cong.",
  "data": {
    "id": "uuid",
    "job_post_id": "uuid",
    "status": "new",
    "match_score": 82.5,
    "applied_at": "2026-04-07T10:00:00Z"
  }
}
```

**Response 409:**
```json
{
  "success": false,
  "message": "Ban da ung tuyen vi tri nay roi."
}
```

**Response 422:**
```json
{
  "success": false,
  "message": "Tin tuyen dung da het han hoac da du nguoi."
}
```

---

#### `GET /api/v1/applications/my` - Don ung tuyen cua toi (NVTV)

**Middleware:** `auth:sanctum, role:worker`

**Query Parameters:**

| Param | Type | Mo ta |
|-------|------|-------|
| status | string | Loc theo trang thai |
| page | integer | Trang |
| per_page | integer | So luong/trang |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "job_post": {
          "id": "uuid",
          "title": "Tuyen 50 cong nhan dong goi",
          "company_name": "Cong ty ABC",
          "salary_amount": 200000,
          "salary_type": "shift"
        },
        "status": "reviewing",
        "match_score": 82.5,
        "applied_at": "2026-04-07T10:00:00Z",
        "updated_at": "2026-04-08T09:00:00Z"
      }
    ],
    "pagination": { "..." }
  }
}
```

---

#### `GET /api/v1/jobs/{jobId}/applications` - Danh sach ung vien (NTD)

**Middleware:** `auth:sanctum, role:employer,coordinator,admin`

**Query Parameters:**

| Param | Type | Mo ta |
|-------|------|-------|
| status | string | in:new,reviewing,interview_invited,interviewed,passed,rejected,hired,standby |
| sort_by | string | in:newest,match_score,credit_score |
| page | integer | Trang |
| per_page | integer | So luong/trang |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "worker": {
          "id": "uuid",
          "full_name": "Nguyen Van A",
          "gender": "male",
          "date_of_birth": "1998-05-15",
          "avatar_url": "...",
          "credit_score": 150,
          "skills": ["Phuc vu", "Kho bai"],
          "experience_years": 2.0,
          "distance_km": 3.5
        },
        "status": "new",
        "match_score": 82.5,
        "cover_letter": "...",
        "applied_at": "2026-04-07T10:00:00Z"
      }
    ],
    "pagination": { "..." },
    "stats": {
      "total": 85,
      "new": 30,
      "reviewing": 20,
      "interview_invited": 15,
      "interviewed": 10,
      "passed": 5,
      "rejected": 3,
      "hired": 2
    }
  }
}
```

---

#### `PATCH /api/v1/applications/{id}/status` - Doi trang thai ung vien

**Middleware:** `auth:sanctum, role:employer,coordinator`

**Request Body:**
```json
{
  "status": "interview_invited",
  "notes": "Ung vien co kinh nghiem tot, moi phong van"
}
```

| Field | Type | Validation |
|-------|------|------------|
| status | string | required, in:reviewing,interview_invited,interviewed,passed,rejected,hired,standby |
| notes | string | nullable, max:1000 |

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat trang thai ung vien thanh cong."
}
```

---

#### `POST /api/v1/applications/bulk-status` - Doi trang thai hang loat

**Middleware:** `auth:sanctum, role:employer,coordinator`

**Request Body:**
```json
{
  "application_ids": ["uuid1", "uuid2", "uuid3"],
  "status": "rejected",
  "notes": "Khong phu hop yeu cau"
}
```

| Field | Type | Validation |
|-------|------|------------|
| application_ids | array | required, min:1, max:50 |
| application_ids.* | uuid | required, exists:applications,id |
| status | string | required, in:reviewing,rejected,standby |
| notes | string | nullable, max:1000 |

**Response 200:**
```json
{
  "success": true,
  "message": "Da cap nhat 3 ung vien thanh cong."
}
```

---

#### `POST /api/v1/applications/{id}/withdraw` - Rut don ung tuyen (NVTV)

**Middleware:** `auth:sanctum, role:worker`

**Response 200:**
```json
{
  "success": true,
  "message": "Rut don ung tuyen thanh cong."
}
```

---

### 1.5 Interviews Module

#### `POST /api/v1/interviews` - Tao lich phong van

**Middleware:** `auth:sanctum, role:employer,coordinator`

**Request Body:**
```json
{
  "application_id": "uuid",
  "interview_type": "in_person",
  "scheduled_at": "2026-04-10T09:00:00Z",
  "location": "Van phong Cong ty ABC, Tang 3",
  "meeting_link": null
}
```

| Field | Type | Validation |
|-------|------|------------|
| application_id | uuid | required, exists:applications,id |
| interview_type | string | required, in:in_person,video,phone |
| scheduled_at | datetime | required, after:now |
| location | string | nullable, required_if:interview_type,in_person, max:500 |
| meeting_link | string | nullable, required_if:interview_type,video, url, max:500 |

**Response 201:**
```json
{
  "success": true,
  "message": "Tao lich phong van thanh cong.",
  "data": {
    "id": "uuid",
    "application_id": "uuid",
    "interview_type": "in_person",
    "scheduled_at": "2026-04-10T09:00:00Z",
    "location": "Van phong Cong ty ABC, Tang 3",
    "status": "scheduled"
  }
}
```

---

#### `GET /api/v1/interviews` - Danh sach lich phong van

**Middleware:** `auth:sanctum`

**Query Parameters:** `status`, `from_date`, `to_date`, `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "application": {
          "id": "uuid",
          "worker": { "full_name": "Nguyen Van A", "phone": "0901234567" },
          "job_post": { "title": "Tuyen 50 cong nhan dong goi" }
        },
        "interview_type": "in_person",
        "scheduled_at": "2026-04-10T09:00:00Z",
        "location": "Van phong Cong ty ABC",
        "status": "scheduled"
      }
    ],
    "pagination": { "..." }
  }
}
```

---

#### `PUT /api/v1/interviews/{id}` - Cap nhat lich phong van

**Middleware:** `auth:sanctum, role:employer,coordinator`

**Request Body:**
```json
{
  "scheduled_at": "2026-04-11T14:00:00Z",
  "location": "Phong hop B2"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat lich phong van thanh cong."
}
```

---

#### `PATCH /api/v1/interviews/{id}/confirm` - NVTV xac nhan lich

**Middleware:** `auth:sanctum, role:worker`

**Response 200:**
```json
{
  "success": true,
  "message": "Xac nhan lich phong van thanh cong."
}
```

---

#### `PATCH /api/v1/interviews/{id}/cancel` - Huy phong van

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "reason": "NVTV khong phan hoi"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Huy lich phong van thanh cong."
}
```

---

#### `POST /api/v1/interviews/{id}/result` - Ghi ket qua phong van

**Middleware:** `auth:sanctum, role:employer,coordinator`

**Request Body:**
```json
{
  "rating_attitude": 4,
  "rating_communication": 5,
  "rating_fit": 4,
  "feedback": "Ung vien co thai do tot, ky nang giao tiep kha.",
  "result": "passed"
}
```

| Field | Type | Validation |
|-------|------|------------|
| rating_attitude | integer | required, between:1,5 |
| rating_communication | integer | required, between:1,5 |
| rating_fit | integer | required, between:1,5 |
| feedback | string | nullable, max:2000 |
| result | string | required, in:passed,failed,no_show |

**Response 200:**
```json
{
  "success": true,
  "message": "Ghi ket qua phong van thanh cong."
}
```

---

### 1.6 Labor Contracts Module

#### `POST /api/v1/labor-contracts` - Tao hop dong lao dong

**Middleware:** `auth:sanctum, role:employer,coordinator`

**Request Body:**
```json
{
  "application_id": "uuid",
  "position": "Cong nhan dong goi",
  "start_date": "2026-04-15",
  "end_date": "2026-07-15",
  "salary_type": "shift",
  "salary_amount": 200000,
  "shift_type": "morning",
  "work_address": "KCN Bac Thang Long, Ha Noi",
  "has_housing": true,
  "terms": {
    "probation_days": 0,
    "notice_days": 3,
    "ot_rate_weekday": 1.5,
    "ot_rate_weekend": 2.0,
    "ot_rate_holiday": 3.0,
    "night_allowance_rate": 0.3,
    "meal_allowance": 30000,
    "transport_allowance": 0,
    "insurance": false,
    "penalty_early_termination": 500000,
    "rules": "Noi quy lam viec..."
  }
}
```

| Field | Type | Validation |
|-------|------|------------|
| application_id | uuid | required, exists:applications,id |
| position | string | required, max:200 |
| start_date | date | required, after_or_equal:today |
| end_date | date | required, after:start_date, before:start_date + 12 months |
| salary_type | string | required, in:hourly,daily,shift,monthly |
| salary_amount | integer | required, min:10000 |
| shift_type | string | nullable |
| work_address | string | required, max:500 |
| has_housing | boolean | nullable |
| terms | object | required |
| terms.probation_days | integer | nullable, min:0, max:30 |
| terms.notice_days | integer | required, min:1, max:30 |
| terms.ot_rate_weekday | decimal | required, min:1.0, max:2.0 |
| terms.ot_rate_weekend | decimal | required, min:1.5, max:3.0 |
| terms.ot_rate_holiday | decimal | required, min:2.0, max:4.0 |
| terms.night_allowance_rate | decimal | nullable, min:0, max:1.0 |
| terms.meal_allowance | integer | nullable, min:0 |
| terms.transport_allowance | integer | nullable, min:0 |

**Response 201:**
```json
{
  "success": true,
  "message": "Tao hop dong thanh cong. Dang cho NVTV ky.",
  "data": {
    "id": "uuid",
    "contract_number": "LD-2026-00001",
    "status": "pending_worker",
    "pdf_url": "https://storage.example.com/contracts/LD-2026-00001.pdf"
  }
}
```

---

#### `GET /api/v1/labor-contracts` - Danh sach hop dong lao dong

**Middleware:** `auth:sanctum`

**Query Parameters:** `status`, `worker_id`, `employer_id`, `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "contract_number": "LD-2026-00001",
        "worker": { "id": "uuid", "full_name": "Nguyen Van A" },
        "employer": { "id": "uuid", "company_name": "Cong ty ABC" },
        "position": "Cong nhan dong goi",
        "start_date": "2026-04-15",
        "end_date": "2026-07-15",
        "salary_amount": 200000,
        "salary_type": "shift",
        "status": "active",
        "has_housing": true
      }
    ],
    "pagination": { "..." }
  }
}
```

---

#### `GET /api/v1/labor-contracts/{id}` - Chi tiet hop dong

**Middleware:** `auth:sanctum`

**Response 200:** Full contract object bao gom terms, signatures, linked room_contract.

---

#### `POST /api/v1/labor-contracts/{id}/sign` - Ky hop dong

**Middleware:** `auth:sanctum, role:worker,employer`

**Request Body:**
```json
{
  "signature_data": "base64-signature-image",
  "otp": "123456",
  "agreed": true
}
```

| Field | Type | Validation |
|-------|------|------------|
| signature_data | string | nullable, max:100000 (base64 image) |
| otp | string | required, digits:6 |
| agreed | boolean | required, accepted |

**Response 200:**
```json
{
  "success": true,
  "message": "Ky hop dong thanh cong.",
  "data": {
    "status": "active",
    "signed_at": "2026-04-08T10:00:00Z",
    "pdf_url": "https://storage.example.com/contracts/LD-2026-00001-signed.pdf",
    "housing_recommendation": {
      "available": true,
      "message": "He thong da goi y 5 khu tro phu hop. Xem ngay!"
    }
  }
}
```

---

#### `POST /api/v1/labor-contracts/{id}/terminate` - Cham dut hop dong som

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "reason": "Ly do ca nhan",
  "termination_date": "2026-05-15",
  "initiated_by": "worker"
}
```

| Field | Type | Validation |
|-------|------|------------|
| reason | string | required, max:1000 |
| termination_date | date | required, after_or_equal:today |
| initiated_by | string | required, in:worker,employer |

**Response 200:**
```json
{
  "success": true,
  "message": "Yeu cau cham dut hop dong da duoc gui.",
  "data": {
    "status": "terminated_early",
    "settlement": {
      "remaining_salary": 1200000,
      "penalty": 500000,
      "housing_settlement": 200000,
      "net_amount": 500000
    }
  }
}
```

---

### 1.7 Attendance Module

#### `POST /api/v1/attendances/check-in` - Cham cong vao

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "contract_id": "uuid",
  "method": "qr",
  "qr_code": "dynamic-qr-data-here",
  "latitude": 21.0735,
  "longitude": 105.7676,
  "photo": "base64-selfie-data"
}
```

| Field | Type | Validation |
|-------|------|------------|
| contract_id | uuid | required, exists:labor_contracts,id |
| method | string | required, in:qr,gps,face,manual |
| qr_code | string | nullable, required_if:method,qr |
| latitude | decimal | required, between:-90,90 |
| longitude | decimal | required, between:-180,180 |
| photo | string | nullable, max:500000 (base64) |

**Response 200:**
```json
{
  "success": true,
  "message": "Check-in thanh cong.",
  "data": {
    "id": "uuid",
    "work_date": "2026-04-07",
    "check_in_at": "2026-04-07T07:55:00Z",
    "method": "qr",
    "status": "present",
    "is_late": false
  }
}
```

**Response 422:**
```json
{
  "success": false,
  "message": "Vi tri check-in cach noi lam viec 350m, vuot qua gioi han 200m."
}
```

---

#### `POST /api/v1/attendances/check-out` - Cham cong ra

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "attendance_id": "uuid",
  "latitude": 21.0735,
  "longitude": 105.7676
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Check-out thanh cong.",
  "data": {
    "id": "uuid",
    "check_in_at": "2026-04-07T07:55:00Z",
    "check_out_at": "2026-04-07T16:05:00Z",
    "total_hours": 8.0,
    "ot_hours": 0
  }
}
```

---

#### `GET /api/v1/attendances` - Lich su cham cong

**Middleware:** `auth:sanctum`

**Query Parameters:**

| Param | Type | Mo ta |
|-------|------|-------|
| contract_id | uuid | Loc theo hop dong |
| worker_id | uuid | Loc theo NVTV (cho NTD/admin) |
| from_date | date | Ngay bat dau |
| to_date | date | Ngay ket thuc |
| status | string | present,absent_excused,absent_unexcused,late,leave |
| page | integer | Trang |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "work_date": "2026-04-07",
        "check_in_at": "2026-04-07T07:55:00Z",
        "check_out_at": "2026-04-07T16:05:00Z",
        "check_in_method": "qr",
        "total_hours": 8.0,
        "ot_hours": 0,
        "status": "present",
        "is_approved": true,
        "notes": null
      }
    ],
    "summary": {
      "total_days": 25,
      "present_days": 22,
      "absent_days": 1,
      "late_days": 2,
      "total_hours": 176.0,
      "total_ot_hours": 8.0
    },
    "pagination": { "..." }
  }
}
```

---

#### `POST /api/v1/attendances/{id}/approve` - Duyet cham cong

**Middleware:** `auth:sanctum, role:employer,coordinator`

**Request Body:**
```json
{
  "is_approved": true,
  "ot_hours": 2.0,
  "notes": "Da xac nhan OT"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Duyet cham cong thanh cong."
}
```

---

#### `POST /api/v1/attendances/manual` - Cham cong thu cong (giam sat)

**Middleware:** `auth:sanctum, role:employer,coordinator`

**Request Body:**
```json
{
  "contract_id": "uuid",
  "worker_id": "uuid",
  "work_date": "2026-04-07",
  "check_in_at": "2026-04-07T08:00:00Z",
  "check_out_at": "2026-04-07T17:00:00Z",
  "status": "present",
  "notes": "NVTV quen check-in, giam sat bo sung"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Cham cong thu cong thanh cong."
}
```

---

#### `GET /api/v1/attendances/report` - Bao cao cham cong

**Middleware:** `auth:sanctum, role:employer,coordinator,admin`

**Query Parameters:** `contract_id`, `period_start`, `period_end`, `format` (json/excel)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "period": { "start": "2026-04-01", "end": "2026-04-30" },
    "workers": [
      {
        "worker_id": "uuid",
        "full_name": "Nguyen Van A",
        "total_days": 26,
        "present_days": 24,
        "absent_excused": 1,
        "absent_unexcused": 1,
        "late_count": 2,
        "total_hours": 192.0,
        "ot_hours": 16.0
      }
    ]
  }
}
```

---

### 1.8 Payroll Module

#### `POST /api/v1/payrolls/calculate` - Tinh luong

**Middleware:** `auth:sanctum, role:employer,coordinator,admin`

**Request Body:**
```json
{
  "contract_id": "uuid",
  "period_start": "2026-04-01",
  "period_end": "2026-04-30"
}
```

| Field | Type | Validation |
|-------|------|------------|
| contract_id | uuid | required, exists:labor_contracts,id |
| period_start | date | required |
| period_end | date | required, after:period_start |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "contract_id": "uuid",
    "worker": { "id": "uuid", "full_name": "Nguyen Van A" },
    "period_start": "2026-04-01",
    "period_end": "2026-04-30",
    "total_shifts": 24,
    "total_hours": 192.0,
    "ot_hours": 16.0,
    "base_salary": 4800000,
    "ot_salary": 480000,
    "allowances": 720000,
    "gross_salary": 6000000,
    "deductions": {
      "housing": 1030000,
      "advance": 500000,
      "penalty": 0,
      "insurance": 0
    },
    "total_deductions": 1530000,
    "net_salary": 4470000,
    "status": "draft"
  }
}
```

---

#### `POST /api/v1/payrolls/bulk-calculate` - Tinh luong hang loat

**Middleware:** `auth:sanctum, role:employer,admin`

**Request Body:**
```json
{
  "employer_id": "uuid",
  "period_start": "2026-04-01",
  "period_end": "2026-04-30"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Dang tinh luong cho 45 nhan vien. Ban se nhan thong bao khi hoan thanh.",
  "data": {
    "job_id": "uuid",
    "total_workers": 45
  }
}
```

---

#### `GET /api/v1/payrolls` - Danh sach bang luong

**Middleware:** `auth:sanctum`

**Query Parameters:** `contract_id`, `worker_id`, `period_start`, `period_end`, `status`, `page`, `per_page`

**Response 200:** Danh sach payroll objects voi pagination.

---

#### `GET /api/v1/payrolls/{id}` - Chi tiet bang luong

**Middleware:** `auth:sanctum`

**Response 200:** Full payroll detail bao gom breakdown.

---

#### `PATCH /api/v1/payrolls/{id}/approve` - Phe duyet bang luong

**Middleware:** `auth:sanctum, role:employer,admin`

**Request Body:**
```json
{
  "adjustments": {
    "allowances": 750000,
    "penalty_deduct": 50000,
    "notes": "Dieu chinh phu cap an"
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Phe duyet bang luong thanh cong.",
  "data": { "status": "approved" }
}
```

---

#### `POST /api/v1/payrolls/{id}/pay` - Thanh toan luong

**Middleware:** `auth:sanctum, role:employer,admin`

**Request Body:**
```json
{
  "payment_method": "bank_transfer",
  "payment_ref": "VCB-TXN-123456"
}
```

| Field | Type | Validation |
|-------|------|------------|
| payment_method | string | required, in:bank_transfer,ewallet,cash |
| payment_ref | string | nullable, max:100 |

**Response 200:**
```json
{
  "success": true,
  "message": "Thanh toan luong thanh cong. Phieu luong da gui cho NVTV.",
  "data": {
    "status": "paid",
    "paid_at": "2026-05-05T10:00:00Z",
    "pdf_url": "https://storage.example.com/payslips/uuid.pdf"
  }
}
```

---

#### `POST /api/v1/payrolls/{id}/dispute` - Khieu nai luong (NVTV)

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "reason": "Thieu 2 ca OT ngay 15/04 va 20/04",
  "expected_amount": 4950000
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Khieu nai da duoc gui. Ke toan se xem xet trong 48h."
}
```

---

#### `POST /api/v1/salary-advances` - Tam ung luong

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "contract_id": "uuid",
  "amount": 1000000,
  "reason": "Can gap viec gia dinh"
}
```

| Field | Type | Validation |
|-------|------|------------|
| contract_id | uuid | required, exists:labor_contracts,id |
| amount | integer | required, min:100000 |
| reason | string | required, max:500 |

**Response 201:**
```json
{
  "success": true,
  "message": "Yeu cau tam ung da duoc gui. Cho NTD phe duyet."
}
```

---

#### `PATCH /api/v1/salary-advances/{id}/approve` - Duyet tam ung

**Middleware:** `auth:sanctum, role:employer`

**Request Body:**
```json
{
  "approved": true
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Da duyet yeu cau tam ung."
}
```

---

### 1.9 Dormitories Module

#### `POST /api/v1/dormitories` - Dang ky khu tro

**Middleware:** `auth:sanctum, role:landlord`

**Request Body:**
```json
{
  "name": "Tro Hoang Anh",
  "address": "123 Nguyen Van Cu, Thu Duc, TP.HCM",
  "latitude": 10.8516,
  "longitude": 106.7720,
  "region_id": "uuid",
  "has_wifi": true,
  "has_ac": false,
  "has_hot_water": true,
  "has_kitchen": true,
  "has_parking": true,
  "has_laundry": false,
  "has_security": true,
  "has_camera": true,
  "curfew_time": "23:00",
  "electricity_rate": 3500,
  "water_rate": 15000,
  "deposit_amount": 1000000,
  "rules": "Noi quy khu tro...",
  "cancellation_policy": "Bao truoc 7 ngay",
  "quality_tier": "standard"
}
```

| Field | Type | Validation |
|-------|------|------------|
| name | string | required, max:200 |
| address | string | required, max:500 |
| latitude | decimal | required, between:-90,90 |
| longitude | decimal | required, between:-180,180 |
| region_id | uuid | nullable, exists:regions,id |
| has_wifi | boolean | nullable |
| has_ac | boolean | nullable |
| has_hot_water | boolean | nullable |
| has_kitchen | boolean | nullable |
| has_parking | boolean | nullable |
| has_laundry | boolean | nullable |
| has_security | boolean | nullable |
| has_camera | boolean | nullable |
| curfew_time | time | nullable |
| electricity_rate | integer | required, min:0 |
| water_rate | integer | required, min:0 |
| deposit_amount | integer | required, min:0 |
| rules | string | nullable, max:5000 |
| cancellation_policy | string | nullable, max:2000 |
| quality_tier | string | nullable, in:basic,standard,premium |

**Response 201:**
```json
{
  "success": true,
  "message": "Dang ky khu tro thanh cong. Dang cho admin xac minh.",
  "data": {
    "id": "uuid",
    "name": "Tro Hoang Anh",
    "status": "pending"
  }
}
```

---

#### `GET /api/v1/dormitories` - Danh sach khu tro

**Middleware:** `throttle:60,1`

**Query Parameters:**

| Param | Type | Mo ta |
|-------|------|-------|
| region_id | uuid | Loc theo khu vuc |
| lat | decimal | Vi do |
| lng | decimal | Kinh do |
| radius | integer | Ban kinh (km) |
| price_min | integer | Gia toi thieu |
| price_max | integer | Gia toi da |
| has_wifi | boolean | Co wifi |
| has_ac | boolean | Co dieu hoa |
| quality_tier | string | Tier chat luong |
| has_vacancy | boolean | Con cho trong |
| sort_by | string | in:distance,price_low,price_high,rating |
| page | integer | Trang |
| per_page | integer | So luong/trang |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Tro Hoang Anh",
        "address": "123 Nguyen Van Cu, Thu Duc",
        "latitude": 10.8516,
        "longitude": 106.7720,
        "distance_km": 1.2,
        "total_rooms": 20,
        "available_beds": 15,
        "price_from": 800000,
        "rating": 4.2,
        "review_count": 45,
        "quality_tier": "standard",
        "amenities": {
          "wifi": true,
          "ac": false,
          "hot_water": true,
          "parking": true,
          "security": true
        },
        "photos": ["url1", "url2"],
        "status": "active"
      }
    ],
    "pagination": { "..." }
  }
}
```

---

#### `GET /api/v1/dormitories/{id}` - Chi tiet khu tro

**Middleware:** `throttle:60,1`

**Response 200:** Full dormitory object + danh sach rooms + reviews.

---

#### `PUT /api/v1/dormitories/{id}` - Cap nhat khu tro

**Middleware:** `auth:sanctum, role:landlord`

**Request Body:** Giong POST, tat ca nullable.

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat khu tro thanh cong."
}
```

---

#### `POST /api/v1/dormitories/{id}/photos` - Upload anh khu tro

**Middleware:** `auth:sanctum, role:landlord`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| photos[] | file | required, array, min:1, max:10 |
| photos.* | file | image, mimes:jpg,jpeg,png, max:5120 |

**Response 200:**
```json
{
  "success": true,
  "message": "Upload anh thanh cong.",
  "data": { "photos": ["url1", "url2", "url3"] }
}
```

---

#### `PATCH /api/v1/dormitories/{id}/verify` - Admin xac minh khu tro

**Middleware:** `auth:sanctum, role:admin,coordinator`

**Request Body:**
```json
{
  "status": "active",
  "notes": "Da kiem tra thuc te, dat chuan"
}
```

| Field | Type | Validation |
|-------|------|------------|
| status | string | required, in:active,suspended,removed |
| notes | string | nullable, max:1000 |

**Response 200:**
```json
{
  "success": true,
  "message": "Xac minh khu tro thanh cong."
}
```

---

### 1.10 Rooms & Beds Module

#### `POST /api/v1/dormitories/{dormId}/rooms` - Them phong

**Middleware:** `auth:sanctum, role:landlord`

**Request Body:**
```json
{
  "room_number": "P101",
  "floor": 1,
  "room_type": "dorm",
  "area_sqm": 25.0,
  "capacity": 4,
  "price": 800000,
  "amenities": { "fan": true, "closet": true, "desk": true },
  "status": "available"
}
```

| Field | Type | Validation |
|-------|------|------------|
| room_number | string | required, max:20, unique per dormitory |
| floor | integer | nullable, min:0, max:50 |
| room_type | string | required, in:single,double,dorm |
| area_sqm | decimal | nullable, min:5, max:100 |
| capacity | integer | required, min:1, max:20 |
| price | integer | required, min:0 |
| amenities | object | nullable |
| status | string | nullable, in:available,maintenance |

**Response 201:**
```json
{
  "success": true,
  "message": "Them phong thanh cong.",
  "data": { "...room object..." }
}
```

---

#### `GET /api/v1/dormitories/{dormId}/rooms` - Danh sach phong

**Middleware:** `auth:sanctum`

**Query Parameters:** `status`, `room_type`, `floor`, `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "room_number": "P101",
        "floor": 1,
        "room_type": "dorm",
        "area_sqm": 25.0,
        "capacity": 4,
        "current_occupancy": 2,
        "price": 800000,
        "status": "available",
        "beds": [
          { "id": "uuid", "bed_number": "G1", "bed_position": "lower", "status": "occupied", "occupant": "Nguyen Van A" },
          { "id": "uuid", "bed_number": "G2", "bed_position": "upper", "status": "available", "occupant": null },
          { "id": "uuid", "bed_number": "G3", "bed_position": "lower", "status": "occupied", "occupant": "Tran Van B" },
          { "id": "uuid", "bed_number": "G4", "bed_position": "upper", "status": "available", "occupant": null }
        ]
      }
    ],
    "summary": {
      "total_rooms": 20,
      "available": 8,
      "occupied": 10,
      "maintenance": 2,
      "occupancy_rate": 65.5
    },
    "pagination": { "..." }
  }
}
```

---

#### `PUT /api/v1/rooms/{id}` - Cap nhat phong

**Middleware:** `auth:sanctum, role:landlord`

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat phong thanh cong."
}
```

---

#### `PATCH /api/v1/rooms/{id}/status` - Doi trang thai phong

**Middleware:** `auth:sanctum, role:landlord`

**Request Body:**
```json
{
  "status": "maintenance",
  "reason": "Sua ong nuoc"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat trang thai phong thanh cong."
}
```

---

#### `POST /api/v1/rooms/{roomId}/beds` - Them giuong

**Middleware:** `auth:sanctum, role:landlord`

**Request Body:**
```json
{
  "bed_number": "G1",
  "bed_position": "lower",
  "price": 800000
}
```

| Field | Type | Validation |
|-------|------|------------|
| bed_number | string | required, max:10, unique per room |
| bed_position | string | required, in:upper,lower,single |
| price | integer | nullable, min:0 |

**Response 201:**
```json
{
  "success": true,
  "data": { "...bed object..." }
}
```

---

#### `PUT /api/v1/beds/{id}` - Cap nhat giuong

**Middleware:** `auth:sanctum, role:landlord`

**Response 200:** Updated bed object.

---

#### `PATCH /api/v1/beds/{id}/status` - Doi trang thai giuong

**Middleware:** `auth:sanctum, role:landlord`

**Request Body:**
```json
{
  "status": "maintenance"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat trang thai giuong thanh cong."
}
```

---

### 1.11 Room Contracts Module

#### `POST /api/v1/room-contracts` - Tao hop dong thue tro

**Middleware:** `auth:sanctum, role:landlord,coordinator`

**Request Body:**
```json
{
  "worker_id": "uuid",
  "dormitory_id": "uuid",
  "room_id": "uuid",
  "bed_id": "uuid",
  "labor_contract_id": "uuid",
  "start_date": "2026-04-15",
  "end_date": "2026-07-15",
  "monthly_rent": 800000,
  "deposit_amount": 1000000,
  "payment_method": "salary_deduct"
}
```

| Field | Type | Validation |
|-------|------|------------|
| worker_id | uuid | required, exists:worker_profiles,id |
| dormitory_id | uuid | required, exists:dormitories,id |
| room_id | uuid | required, exists:rooms,id |
| bed_id | uuid | nullable, exists:beds,id |
| labor_contract_id | uuid | nullable, exists:labor_contracts,id |
| start_date | date | required, after_or_equal:today |
| end_date | date | required, after:start_date |
| monthly_rent | integer | required, min:0 |
| deposit_amount | integer | required, min:0 |
| payment_method | string | required, in:salary_deduct,self_pay |

**Response 201:**
```json
{
  "success": true,
  "message": "Tao hop dong thue tro thanh cong.",
  "data": {
    "id": "uuid",
    "contract_number": "TR-2026-00001",
    "status": "draft"
  }
}
```

---

#### `GET /api/v1/room-contracts` - Danh sach hop dong thue tro

**Middleware:** `auth:sanctum`

**Query Parameters:** `dormitory_id`, `worker_id`, `status`, `page`, `per_page`

**Response 200:** Danh sach room contract objects.

---

#### `GET /api/v1/room-contracts/{id}` - Chi tiet hop dong thue tro

**Middleware:** `auth:sanctum`

**Response 200:** Full room contract detail.

---

#### `POST /api/v1/room-contracts/{id}/sign` - Ky hop dong thue tro

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "agreed": true,
  "otp": "123456"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Ky hop dong thue tro thanh cong.",
  "data": {
    "status": "active",
    "room_info": {
      "room_number": "P101",
      "bed_number": "G2",
      "wifi_password": "tro123456",
      "rules": "Noi quy..."
    }
  }
}
```

---

#### `POST /api/v1/room-contracts/{id}/terminate` - Cham dut hop dong tro

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "reason": "Het hop dong lao dong",
  "checkout_date": "2026-07-20"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Yeu cau tra phong da duoc ghi nhan.",
  "data": {
    "checkout_date": "2026-07-20",
    "deposit_refund": {
      "deposit": 1000000,
      "deductions": 200000,
      "refund_amount": 800000
    }
  }
}
```

---

### 1.12 Utility Readings Module

#### `POST /api/v1/utility-readings` - Ghi chi so dien nuoc

**Middleware:** `auth:sanctum, role:landlord`

**Request Body:**
```json
{
  "room_id": "uuid",
  "reading_date": "2026-04-30",
  "electricity_curr": 1250.0,
  "water_curr": 85.5
}
```

| Field | Type | Validation |
|-------|------|------------|
| room_id | uuid | required, exists:rooms,id |
| reading_date | date | required |
| electricity_curr | decimal | required, min:0 |
| water_curr | decimal | required, min:0 |

**Response 201:**
```json
{
  "success": true,
  "message": "Ghi chi so thanh cong.",
  "data": {
    "id": "uuid",
    "room_id": "uuid",
    "electricity_prev": 1100.0,
    "electricity_curr": 1250.0,
    "electricity_used": 150.0,
    "electricity_cost": 525000,
    "water_prev": 78.0,
    "water_curr": 85.5,
    "water_used": 7.5,
    "water_cost": 112500
  }
}
```

**Response 422:**
```json
{
  "success": false,
  "message": "Chi so dien moi phai lon hon chi so cu (1100.0).",
  "errors": {
    "electricity_curr": ["Chi so bat thuong: tang 150 KWh (> 100 KWh trung binh). Vui long kiem tra lai."]
  }
}
```

---

#### `POST /api/v1/utility-readings/bulk` - Ghi chi so hang loat

**Middleware:** `auth:sanctum, role:landlord`

**Request Body:**
```json
{
  "dormitory_id": "uuid",
  "reading_date": "2026-04-30",
  "readings": [
    { "room_id": "uuid1", "electricity_curr": 1250.0, "water_curr": 85.5 },
    { "room_id": "uuid2", "electricity_curr": 980.0, "water_curr": 62.0 }
  ]
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Ghi chi so 2 phong thanh cong.",
  "data": {
    "total": 2,
    "success": 2,
    "warnings": []
  }
}
```

---

#### `GET /api/v1/utility-readings` - Lich su chi so

**Middleware:** `auth:sanctum`

**Query Parameters:** `room_id`, `dormitory_id`, `from_date`, `to_date`, `page`

**Response 200:** Danh sach readings voi pagination.

---

#### `POST /api/v1/utility-readings/{id}/photo` - Upload anh dong ho

**Middleware:** `auth:sanctum, role:landlord`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| photo_electricity | file | nullable, image, max:5120 |
| photo_water | file | nullable, image, max:5120 |

**Response 200:**
```json
{
  "success": true,
  "message": "Upload anh dong ho thanh cong."
}
```

---

### 1.13 Room Invoices Module

#### `POST /api/v1/room-invoices/generate` - Tao hoa don tro

**Middleware:** `auth:sanctum, role:landlord,admin`

**Request Body:**
```json
{
  "dormitory_id": "uuid",
  "billing_month": "2026-04-01"
}
```

| Field | Type | Validation |
|-------|------|------------|
| dormitory_id | uuid | required, exists:dormitories,id |
| billing_month | date | required, date_format:Y-m-d |

**Response 200:**
```json
{
  "success": true,
  "message": "Da tao 18 hoa don cho thang 04/2026.",
  "data": {
    "total_invoices": 18,
    "total_amount": 25400000,
    "invoices_preview": [
      {
        "id": "uuid",
        "invoice_number": "INV-2026-04-001",
        "worker_name": "Nguyen Van A",
        "room_number": "P101",
        "rent": 800000,
        "electricity": 525000,
        "water": 112500,
        "internet": 30000,
        "total": 1467500
      }
    ]
  }
}
```

---

#### `GET /api/v1/room-invoices` - Danh sach hoa don

**Middleware:** `auth:sanctum`

**Query Parameters:** `dormitory_id`, `worker_id`, `billing_month`, `status`, `page`, `per_page`

**Response 200:** Danh sach invoices voi pagination va tong hop.

---

#### `GET /api/v1/room-invoices/{id}` - Chi tiet hoa don

**Middleware:** `auth:sanctum`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoice_number": "INV-2026-04-001",
    "worker": { "id": "uuid", "full_name": "Nguyen Van A" },
    "room": { "room_number": "P101", "dormitory_name": "Tro Hoang Anh" },
    "billing_month": "2026-04-01",
    "rent_amount": 800000,
    "electricity_amount": 525000,
    "water_amount": 112500,
    "internet_amount": 30000,
    "trash_amount": 20000,
    "other_amount": 0,
    "late_fee": 0,
    "total_amount": 1487500,
    "paid_amount": 0,
    "remaining": 1487500,
    "status": "unpaid",
    "due_date": "2026-05-05",
    "is_salary_deducted": true,
    "utility_reading": {
      "electricity_used": 150.0,
      "electricity_rate": 3500,
      "water_used": 7.5,
      "water_rate": 15000
    }
  }
}
```

---

#### `POST /api/v1/room-invoices/{id}/pay` - Thanh toan hoa don tro

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "amount": 1487500,
  "payment_method": "bank_transfer",
  "payment_ref": "VCB-123456"
}
```

| Field | Type | Validation |
|-------|------|------------|
| amount | integer | required, min:1 |
| payment_method | string | required, in:bank_transfer,ewallet,cash,salary_deduct |
| payment_ref | string | nullable, max:100 |

**Response 200:**
```json
{
  "success": true,
  "message": "Thanh toan thanh cong.",
  "data": {
    "status": "paid",
    "paid_amount": 1487500,
    "remaining": 0,
    "paid_at": "2026-05-03T10:00:00Z"
  }
}
```

---

### 1.14 Maintenance Module

#### `POST /api/v1/maintenance-requests` - Tao yeu cau bao tri

**Middleware:** `auth:sanctum, role:worker,landlord`

**Request Body:**
```json
{
  "dormitory_id": "uuid",
  "room_id": "uuid",
  "category": "plumbing",
  "description": "Ong nuoc bi ro ri trong nha ve sinh",
  "urgency": "high"
}
```

| Field | Type | Validation |
|-------|------|------------|
| dormitory_id | uuid | required, exists:dormitories,id |
| room_id | uuid | required, exists:rooms,id |
| category | string | required, in:electrical,plumbing,furniture,other |
| description | string | required, max:2000 |
| urgency | string | required, in:low,medium,high,emergency |

**Response 201:**
```json
{
  "success": true,
  "message": "Yeu cau bao tri da duoc gui.",
  "data": {
    "id": "uuid",
    "status": "new",
    "estimated_response": "Trong 4 gio"
  }
}
```

---

#### `POST /api/v1/maintenance-requests/{id}/photos` - Upload anh su co

**Middleware:** `auth:sanctum`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| photos[] | file | required, array, min:1, max:5 |
| photos.* | file | image, mimes:jpg,jpeg,png, max:5120 |

**Response 200:**
```json
{
  "success": true,
  "message": "Upload anh thanh cong."
}
```

---

#### `GET /api/v1/maintenance-requests` - Danh sach yeu cau bao tri

**Middleware:** `auth:sanctum`

**Query Parameters:** `dormitory_id`, `room_id`, `status`, `urgency`, `category`, `page`

**Response 200:** Danh sach maintenance requests voi pagination.

---

#### `PATCH /api/v1/maintenance-requests/{id}/status` - Cap nhat trang thai bao tri

**Middleware:** `auth:sanctum, role:landlord,coordinator`

**Request Body:**
```json
{
  "status": "in_progress",
  "cost": 500000,
  "cost_bearer": "landlord",
  "notes": "Da goi tho sua, du kien xong trong 2h"
}
```

| Field | Type | Validation |
|-------|------|------------|
| status | string | required, in:acknowledged,in_progress,completed |
| cost | integer | nullable, min:0 |
| cost_bearer | string | nullable, in:landlord,worker,shared |
| notes | string | nullable, max:1000 |

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat trang thai thanh cong."
}
```

---

#### `POST /api/v1/maintenance-requests/{id}/confirm` - NVTV xac nhan hoan thanh

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "satisfied": true,
  "comment": "Da sua xong tot"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Xac nhan hoan thanh bao tri."
}
```

---

### 1.15 Violations Module

#### `POST /api/v1/violations` - Tao vi pham

**Middleware:** `auth:sanctum, role:landlord,coordinator`

**Request Body:**
```json
{
  "dormitory_id": "uuid",
  "worker_id": "uuid",
  "room_id": "uuid",
  "violation_type": "noise_after_curfew",
  "description": "Gay on ao sau 23h00",
  "severity": "minor",
  "action_taken": "warning",
  "fine_amount": 0
}
```

| Field | Type | Validation |
|-------|------|------------|
| dormitory_id | uuid | required, exists:dormitories,id |
| worker_id | uuid | required, exists:worker_profiles,id |
| room_id | uuid | required, exists:rooms,id |
| violation_type | string | required, max:100 |
| description | string | required, max:2000 |
| severity | string | required, in:minor,moderate,severe |
| action_taken | string | required, in:warning,fine,final_warning,termination |
| fine_amount | integer | nullable, min:0, required_if:action_taken,fine |

**Response 201:**
```json
{
  "success": true,
  "message": "Ghi nhan vi pham thanh cong.",
  "data": {
    "id": "uuid",
    "violation_count": 1,
    "action_taken": "warning"
  }
}
```

---

#### `POST /api/v1/violations/{id}/evidence` - Upload bang chung

**Middleware:** `auth:sanctum, role:landlord`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| files[] | file | required, array, min:1, max:5 |
| files.* | file | mimes:jpg,jpeg,png,mp4, max:20480 |

**Response 200:**
```json
{
  "success": true,
  "message": "Upload bang chung thanh cong."
}
```

---

#### `GET /api/v1/violations` - Danh sach vi pham

**Middleware:** `auth:sanctum`

**Query Parameters:** `dormitory_id`, `worker_id`, `severity`, `page`

**Response 200:** Danh sach violations voi pagination.

---

#### `POST /api/v1/violations/{id}/respond` - NVTV phan hoi vi pham

**Middleware:** `auth:sanctum, role:worker`

**Request Body:**
```json
{
  "response": "Toi xin loi, se khong tai pham"
}
```

| Field | Type | Validation |
|-------|------|------------|
| response | string | required, max:2000 |

**Response 200:**
```json
{
  "success": true,
  "message": "Phan hoi da duoc ghi nhan."
}
```

---

### 1.16 Reviews Module

#### `POST /api/v1/reviews` - Tao danh gia

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "reviewee_id": "uuid",
  "review_type": "employer_to_worker",
  "contract_id": "uuid",
  "rating": 4.5,
  "rating_detail": {
    "attendance": 5,
    "attitude": 4,
    "skill": 4
  },
  "comment": "Nhan vien cham chi, lam viec tot.",
  "would_rehire": true
}
```

| Field | Type | Validation |
|-------|------|------------|
| reviewee_id | uuid | required, exists:users,id |
| review_type | string | required, in:employer_to_worker,worker_to_employer,worker_to_dorm,dorm_to_worker |
| contract_id | uuid | required |
| rating | decimal | required, between:1,5 |
| rating_detail | object | required |
| comment | string | nullable, max:2000 |
| would_rehire | boolean | nullable |

**Response 201:**
```json
{
  "success": true,
  "message": "Danh gia thanh cong.",
  "data": { "...review object..." }
}
```

---

#### `GET /api/v1/reviews` - Danh sach danh gia

**Middleware:** `throttle:60,1`

**Query Parameters:** `reviewee_id`, `review_type`, `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "reviewer": { "id": "uuid", "name": "Cong ty ABC", "role": "employer" },
        "rating": 4.5,
        "rating_detail": { "attendance": 5, "attitude": 4, "skill": 4 },
        "comment": "Nhan vien cham chi",
        "would_rehire": true,
        "created_at": "2026-04-07T10:00:00Z"
      }
    ],
    "summary": {
      "average_rating": 4.3,
      "total_reviews": 15,
      "rating_distribution": { "5": 6, "4": 5, "3": 3, "2": 1, "1": 0 }
    },
    "pagination": { "..." }
  }
}
```

---

### 1.17 Regions Module

#### `POST /api/v1/regions` - Tao khu vuc

**Middleware:** `auth:sanctum, role:admin`

**Request Body:**
```json
{
  "name": "KCN Bac Thang Long",
  "description": "Khu cong nghiep Bac Thang Long, Dong Anh, Ha Noi",
  "boundary": {
    "type": "Polygon",
    "coordinates": [[[105.74, 21.10], [105.78, 21.10], [105.78, 21.07], [105.74, 21.07], [105.74, 21.10]]]
  },
  "radius_km": 5.0,
  "province": "Ha Noi",
  "district": "Dong Anh"
}
```

| Field | Type | Validation |
|-------|------|------------|
| name | string | required, max:200 |
| description | string | nullable, max:1000 |
| boundary | object | nullable (GeoJSON Polygon) |
| radius_km | decimal | nullable, min:0.5, max:50 |
| province | string | nullable, max:100 |
| district | string | nullable, max:100 |

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "KCN Bac Thang Long", "status": "active" }
}
```

---

#### `GET /api/v1/regions` - Danh sach khu vuc

**Middleware:** `throttle:60,1`

**Query Parameters:** `province`, `status`, `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "KCN Bac Thang Long",
        "province": "Ha Noi",
        "district": "Dong Anh",
        "radius_km": 5.0,
        "stats": {
          "total_dormitories": 15,
          "total_beds": 450,
          "available_beds": 120,
          "active_jobs": 8,
          "total_positions_needed": 200,
          "active_workers": 180
        },
        "status": "active"
      }
    ],
    "pagination": { "..." }
  }
}
```

---

#### `PUT /api/v1/regions/{id}` - Cap nhat khu vuc

**Middleware:** `auth:sanctum, role:admin`

**Response 200:** Updated region object.

---

#### `DELETE /api/v1/regions/{id}` - Xoa khu vuc

**Middleware:** `auth:sanctum, role:admin`

**Response 200:**
```json
{
  "success": true,
  "message": "Xoa khu vuc thanh cong."
}
```

---

#### `POST /api/v1/regions/{id}/link-dormitory` - Lien ket khu tro vao khu vuc

**Middleware:** `auth:sanctum, role:admin,coordinator`

**Request Body:**
```json
{
  "dormitory_id": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Lien ket khu tro thanh cong."
}
```

---

#### `GET /api/v1/regions/{id}/stats` - Thong ke khu vuc

**Middleware:** `auth:sanctum, role:admin,coordinator`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "region": { "id": "uuid", "name": "KCN Bac Thang Long" },
    "recruitment": {
      "total_active_jobs": 8,
      "total_positions_needed": 200,
      "total_filled": 150,
      "fill_rate": 75.0
    },
    "housing": {
      "total_dormitories": 15,
      "total_capacity": 450,
      "current_occupancy": 330,
      "occupancy_rate": 73.3,
      "average_rent": 850000,
      "average_distance_to_work_km": 1.8
    },
    "workers": {
      "total_active": 180,
      "using_linked_housing": 140,
      "linked_housing_rate": 77.8
    },
    "revenue": {
      "monthly_housing_revenue": 297500000,
      "monthly_salary_total": 1080000000
    }
  }
}
```

---

### 1.18 Notifications Module

#### `GET /api/v1/notifications` - Danh sach thong bao

**Middleware:** `auth:sanctum`

**Query Parameters:** `type`, `is_read`, `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Ban da duoc moi phong van",
        "body": "Cong ty ABC moi ban phong van vao 10/04/2026 luc 9h00.",
        "type": "interview",
        "reference_type": "interviews",
        "reference_id": "uuid",
        "is_read": false,
        "sent_at": "2026-04-08T10:00:00Z"
      }
    ],
    "unread_count": 5,
    "pagination": { "..." }
  }
}
```

---

#### `PATCH /api/v1/notifications/{id}/read` - Danh dau da doc

**Middleware:** `auth:sanctum`

**Response 200:**
```json
{
  "success": true,
  "message": "Da danh dau da doc."
}
```

---

#### `POST /api/v1/notifications/read-all` - Danh dau tat ca da doc

**Middleware:** `auth:sanctum`

**Response 200:**
```json
{
  "success": true,
  "message": "Da danh dau tat ca da doc."
}
```

---

#### `GET /api/v1/notifications/settings` - Cai dat thong bao

**Middleware:** `auth:sanctum`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "channels": {
      "push": true,
      "sms": true,
      "email": true,
      "zalo": false
    },
    "preferences": {
      "job_match": { "push": true, "sms": false, "email": false },
      "interview": { "push": true, "sms": true, "email": true },
      "contract": { "push": true, "sms": true, "email": true },
      "payment": { "push": true, "sms": false, "email": true },
      "maintenance": { "push": true, "sms": false, "email": false },
      "promotion": { "push": false, "sms": false, "email": false }
    },
    "quiet_hours": {
      "enabled": true,
      "from": "22:00",
      "to": "07:00"
    }
  }
}
```

---

#### `PUT /api/v1/notifications/settings` - Cap nhat cai dat thong bao

**Middleware:** `auth:sanctum`

**Request Body:** Giong response cua GET settings.

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat cai dat thong bao thanh cong."
}
```

---

### 1.19 Chat/Messages Module

#### `GET /api/v1/conversations` - Danh sach hoi thoai

**Middleware:** `auth:sanctum`

**Query Parameters:** `type` (direct/group), `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "type": "direct",
        "participant": {
          "id": "uuid",
          "name": "Cong ty ABC",
          "avatar_url": "...",
          "role": "employer",
          "is_online": true
        },
        "last_message": {
          "content": "Ban co the di lam ngay mai khong?",
          "sender_id": "uuid",
          "created_at": "2026-04-07T15:30:00Z"
        },
        "unread_count": 2,
        "updated_at": "2026-04-07T15:30:00Z"
      }
    ],
    "pagination": { "..." }
  }
}
```

---

#### `POST /api/v1/conversations` - Tao hoi thoai moi

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "type": "direct",
  "participant_id": "uuid"
}
```

Hoac nhom:
```json
{
  "type": "group",
  "name": "Nhom NVTV - Du an X",
  "participant_ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "type": "direct" }
}
```

---

#### `GET /api/v1/conversations/{id}/messages` - Danh sach tin nhan

**Middleware:** `auth:sanctum`

**Query Parameters:** `before` (cursor), `limit` (default 50)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "sender": { "id": "uuid", "name": "Nguyen Van A", "avatar_url": "..." },
        "content": "Chao anh, toi muon hoi ve cong viec",
        "message_type": "text",
        "file_url": null,
        "is_read": true,
        "created_at": "2026-04-07T15:00:00Z"
      }
    ],
    "has_more": true,
    "next_cursor": "uuid-of-last-message"
  }
}
```

---

#### `POST /api/v1/conversations/{id}/messages` - Gui tin nhan

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "content": "Chao anh, toi muon hoi ve cong viec",
  "message_type": "text"
}
```

Hoac gui file:
```json
{
  "message_type": "image",
  "file_url": "https://storage.example.com/chat/image.jpg"
}
```

| Field | Type | Validation |
|-------|------|------------|
| content | string | nullable, max:5000, required_if:message_type,text |
| message_type | string | required, in:text,image,file,location,voice |
| file_url | string | nullable, url, required_unless:message_type,text |

**Response 201:**
```json
{
  "success": true,
  "data": { "...message object..." }
}
```

---

#### `POST /api/v1/conversations/{id}/messages/upload` - Upload file chat

**Middleware:** `auth:sanctum`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| file | file | required, max:10240, mimes:jpg,jpeg,png,pdf,doc,docx,mp3,mp4 |

**Response 200:**
```json
{
  "success": true,
  "data": { "file_url": "https://storage.example.com/chat/uuid.jpg" }
}
```

---

### 1.20 Support Tickets Module

#### `POST /api/v1/support-tickets` - Tao ticket ho tro

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "category": "payment",
  "subject": "Thieu luong OT thang 04",
  "description": "Toi lam 8 gio OT nhung chi duoc tinh 6 gio.",
  "priority": "medium"
}
```

| Field | Type | Validation |
|-------|------|------------|
| category | string | required, in:recruitment,housing,payment,account,other |
| subject | string | required, max:200 |
| description | string | required, max:5000 |
| priority | string | required, in:low,medium,high |

**Response 201:**
```json
{
  "success": true,
  "message": "Ticket ho tro da duoc tao.",
  "data": {
    "id": "uuid",
    "ticket_number": "TK-2026-00123",
    "status": "new",
    "estimated_response": "Trong 4 gio"
  }
}
```

---

#### `POST /api/v1/support-tickets/{id}/attachments` - Dinh kem file

**Middleware:** `auth:sanctum`

**Request:** `multipart/form-data`

| Field | Type | Validation |
|-------|------|------------|
| files[] | file | required, array, max:5 |
| files.* | file | max:10240, mimes:jpg,jpeg,png,pdf,doc |

**Response 200:**
```json
{
  "success": true,
  "message": "Dinh kem thanh cong."
}
```

---

#### `GET /api/v1/support-tickets` - Danh sach ticket

**Middleware:** `auth:sanctum`

**Query Parameters:** `status`, `category`, `priority`, `page`, `per_page`

**Response 200:** Danh sach tickets voi pagination.

---

#### `GET /api/v1/support-tickets/{id}` - Chi tiet ticket

**Middleware:** `auth:sanctum`

**Response 200:** Full ticket voi lich su trao doi.

---

#### `PATCH /api/v1/support-tickets/{id}/status` - Cap nhat trang thai ticket

**Middleware:** `auth:sanctum, role:admin,coordinator`

**Request Body:**
```json
{
  "status": "in_progress",
  "response": "Dang kiem tra du lieu cham cong cua ban."
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat ticket thanh cong."
}
```

---

#### `POST /api/v1/support-tickets/{id}/rate` - Danh gia ho tro

**Middleware:** `auth:sanctum`

**Request Body:**
```json
{
  "satisfaction": 5,
  "comment": "Ho tro rat nhanh va hieu qua"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cam on ban da danh gia."
}
```

---

### 1.21 Admin Module

#### `GET /api/v1/admin/users` - Quan ly nguoi dung

**Middleware:** `auth:sanctum, role:admin`

**Query Parameters:** `role`, `status`, `keyword`, `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "phone": "0901234567",
        "email": "user@example.com",
        "role": "worker",
        "status": "active",
        "credit_score": 150,
        "created_at": "2026-01-15T10:00:00Z",
        "profile": { "full_name": "Nguyen Van A" }
      }
    ],
    "stats": {
      "total": 5000,
      "active": 4200,
      "pending": 500,
      "suspended": 200,
      "banned": 100,
      "by_role": {
        "worker": 4000,
        "employer": 500,
        "landlord": 300,
        "coordinator": 50,
        "admin": 5
      }
    },
    "pagination": { "..." }
  }
}
```

---

#### `PATCH /api/v1/admin/users/{id}/status` - Doi trang thai nguoi dung

**Middleware:** `auth:sanctum, role:admin`

**Request Body:**
```json
{
  "status": "active",
  "reason": "Da xac minh thong tin"
}
```

| Field | Type | Validation |
|-------|------|------------|
| status | string | required, in:active,suspended,banned |
| reason | string | nullable, max:500 |

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat trang thai nguoi dung thanh cong."
}
```

---

#### `GET /api/v1/admin/approvals` - Danh sach cho duyet

**Middleware:** `auth:sanctum, role:admin,coordinator`

**Query Parameters:** `type` (employer,landlord,job_post), `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "type": "employer",
        "name": "Cong ty TNHH XYZ",
        "submitted_at": "2026-04-06T10:00:00Z",
        "details": { "..." }
      }
    ],
    "stats": {
      "pending_employers": 5,
      "pending_landlords": 3,
      "pending_job_posts": 12
    },
    "pagination": { "..." }
  }
}
```

---

#### `POST /api/v1/admin/approvals/{id}/approve` - Phe duyet

**Middleware:** `auth:sanctum, role:admin,coordinator`

**Request Body:**
```json
{
  "approved": true,
  "notes": "Da kiem tra giay phep kinh doanh"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Phe duyet thanh cong."
}
```

---

#### `GET /api/v1/admin/dashboard` - Dashboard tong quan

**Middleware:** `auth:sanctum, role:admin,coordinator`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_users": 5000,
      "total_active_jobs": 120,
      "total_active_contracts": 800,
      "total_dormitories": 45,
      "total_revenue_month": 2500000000
    },
    "recruitment": {
      "new_applications_today": 45,
      "interviews_today": 12,
      "contracts_signed_week": 35,
      "average_fill_time_days": 2.8,
      "fill_rate": 85.5
    },
    "housing": {
      "occupancy_rate": 78.3,
      "total_available_beds": 450,
      "overdue_invoices": 23,
      "pending_maintenance": 8
    },
    "alerts": [
      { "type": "overdue_payment", "count": 5, "message": "5 NVTV qua han thanh toan tien tro" },
      { "type": "expiring_contracts", "count": 12, "message": "12 hop dong sap het han trong 7 ngay" }
    ]
  }
}
```

---

#### `GET /api/v1/admin/config` - Cau hinh he thong

**Middleware:** `auth:sanctum, role:admin`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "attendance": {
      "gps_radius_meters": 200,
      "early_checkin_minutes": 30,
      "late_checkin_minutes": 15,
      "auto_checkout_enabled": true
    },
    "payroll": {
      "ot_rate_weekday": 1.5,
      "ot_rate_weekend": 2.0,
      "ot_rate_holiday": 3.0,
      "night_allowance_rate": 0.3,
      "pay_period": "monthly"
    },
    "housing": {
      "payment_due_day": 5,
      "late_fee_rate": 0.05,
      "late_fee_max_rate": 0.20,
      "grace_period_days": 30
    },
    "credit_score": {
      "complete_contract": 10,
      "proper_resign": -5,
      "no_notice_quit": -50,
      "initial_score": 100
    },
    "notification": {
      "sms_enabled": true,
      "email_enabled": true,
      "push_enabled": true,
      "zalo_enabled": false
    }
  }
}
```

---

#### `PUT /api/v1/admin/config` - Cap nhat cau hinh

**Middleware:** `auth:sanctum, role:admin`

**Request Body:** Giong response cua GET config.

**Response 200:**
```json
{
  "success": true,
  "message": "Cap nhat cau hinh thanh cong."
}
```

---

#### `GET /api/v1/admin/audit-logs` - Nhat ky he thong

**Middleware:** `auth:sanctum, role:admin`

**Query Parameters:** `user_id`, `action`, `entity_type`, `from_date`, `to_date`, `page`, `per_page`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "user": { "id": "uuid", "name": "Admin A" },
        "action": "update",
        "entity_type": "users",
        "entity_id": "uuid",
        "old_data": { "status": "pending" },
        "new_data": { "status": "active" },
        "ip_address": "192.168.1.1",
        "created_at": "2026-04-07T10:00:00Z"
      }
    ],
    "pagination": { "..." }
  }
}
```

---

### 1.22 Reports & Analytics Module

#### `GET /api/v1/reports/recruitment` - Bao cao tuyen dung

**Middleware:** `auth:sanctum, role:admin,coordinator,employer`

**Query Parameters:** `region_id`, `employer_id`, `from_date`, `to_date`, `format` (json/excel)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "period": { "from": "2026-01-01", "to": "2026-04-07" },
    "summary": {
      "total_job_posts": 250,
      "total_applications": 3500,
      "total_hired": 800,
      "average_fill_time_days": 2.8,
      "fill_rate": 85.5,
      "retention_rate": 72.3,
      "cost_per_hire": 150000
    },
    "by_month": [
      { "month": "2026-01", "jobs": 60, "applications": 850, "hired": 190 },
      { "month": "2026-02", "jobs": 55, "applications": 780, "hired": 175 },
      { "month": "2026-03", "jobs": 70, "applications": 950, "hired": 220 },
      { "month": "2026-04", "jobs": 65, "applications": 920, "hired": 215 }
    ],
    "by_region": [
      { "region": "KCN Bac Thang Long", "jobs": 80, "hired": 250, "fill_rate": 88.0 }
    ],
    "top_employers": [
      { "name": "Cong ty ABC", "hired": 120, "rating": 4.5 }
    ],
    "top_workers": [
      { "name": "Nguyen Van A", "credit_score": 250, "contracts_completed": 8 }
    ]
  }
}
```

---

#### `GET /api/v1/reports/housing` - Bao cao nha tro

**Middleware:** `auth:sanctum, role:admin,coordinator,landlord`

**Query Parameters:** `region_id`, `dormitory_id`, `from_date`, `to_date`, `format`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_dormitories": 45,
      "total_capacity": 1500,
      "current_occupancy": 1170,
      "occupancy_rate": 78.0,
      "total_revenue": 1170000000,
      "overdue_amount": 35000000,
      "avg_maintenance_time_hours": 18.5
    },
    "by_dormitory": [
      {
        "name": "Tro Hoang Anh",
        "capacity": 80,
        "occupancy": 65,
        "rate": 81.3,
        "revenue": 58500000,
        "rating": 4.2,
        "maintenance_requests": 3
      }
    ],
    "revenue_trend": [
      { "month": "2026-01", "revenue": 980000000, "occupancy_rate": 72.0 },
      { "month": "2026-02", "revenue": 1050000000, "occupancy_rate": 75.0 },
      { "month": "2026-03", "revenue": 1120000000, "occupancy_rate": 77.0 },
      { "month": "2026-04", "revenue": 1170000000, "occupancy_rate": 78.0 }
    ]
  }
}
```

---

#### `GET /api/v1/reports/financial` - Bao cao tai chinh tong hop

**Middleware:** `auth:sanctum, role:admin`

**Query Parameters:** `from_date`, `to_date`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "salary": {
      "total_paid": 5400000000,
      "total_deducted_housing": 810000000,
      "total_advances": 120000000
    },
    "housing": {
      "total_invoiced": 1170000000,
      "total_collected": 1100000000,
      "total_overdue": 70000000,
      "collection_rate": 94.0
    },
    "platform": {
      "commission_earned": 175000000,
      "operating_cost": 50000000,
      "net_profit": 125000000
    }
  }
}
```

---

#### `GET /api/v1/reports/region-demand` - Bao cao cung-cau khu vuc

**Middleware:** `auth:sanctum, role:admin,coordinator`

**Query Parameters:** `region_id`, `period`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "regions": [
      {
        "name": "KCN Bac Thang Long",
        "demand": { "positions_needed": 200, "filled": 150 },
        "supply": { "available_workers": 300, "in_region": 180 },
        "housing": { "capacity": 450, "occupied": 330, "available": 120 },
        "balance": "undersupplied",
        "recommendation": "Can them 50 NVTV tu khu vuc khac"
      }
    ],
    "forecast": {
      "next_month_demand_change": "+15%",
      "seasonal_trend": "rising"
    }
  }
}
```

---

## 2. Laravel Models & Relationships

### 2.1 User Model

```php
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'phone', 'email', 'password', 'role', 'status',
        'credit_score', 'avatar_url', 'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'last_login_at' => 'datetime',
        'credit_score'  => 'integer',
    ];

    // Relationships
    public function workerProfile(): HasOne
    {
        return $this->hasOne(WorkerProfile::class);
    }

    public function employer(): HasOne
    {
        return $this->hasOne(Employer::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function reviewsGiven(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewee_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Accessors
    public function getMaskedPhoneAttribute(): string
    {
        return substr($this->phone, 0, 4) . ' xxx ' . substr($this->phone, -2);
    }

    // Mutators
    public function setPasswordAttribute($value): void
    {
        $this->attributes['password'] = Hash::make($value);
    }
}
```

### 2.2 WorkerProfile Model

```php
class WorkerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'full_name', 'date_of_birth', 'gender',
        'id_card_number', 'id_card_front', 'id_card_back', 'selfie_url',
        'permanent_address', 'current_address',
        'emergency_contact_name', 'emergency_contact_phone',
        'bank_name', 'bank_account', 'bank_holder',
        'health_status', 'vehicle', 'needs_housing',
        'ekyc_status', 'ekyc_verified_at',
    ];

    protected $casts = [
        'date_of_birth'    => 'date',
        'needs_housing'    => 'boolean',
        'ekyc_verified_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(WorkerSkill::class, 'worker_id');
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(WorkerExperience::class, 'worker_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'worker_id');
    }

    public function laborContracts(): HasMany
    {
        return $this->hasMany(LaborContract::class, 'worker_id');
    }

    public function roomContracts(): HasMany
    {
        return $this->hasMany(RoomContract::class, 'worker_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'worker_id');
    }

    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class, 'worker_id');
    }

    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class, 'worker_id');
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->where('ekyc_status', 'verified');
    }

    public function scopeNeedsHousing($query)
    {
        return $query->where('needs_housing', true);
    }

    // Accessors
    public function getMaskedIdCardAttribute(): string
    {
        return '****' . substr($this->id_card_number, -4);
    }

    public function getAgeAttribute(): int
    {
        return $this->date_of_birth->age;
    }

    // Mutators
    public function setIdCardNumberAttribute($value): void
    {
        $this->attributes['id_card_number'] = Crypt::encryptString($value);
    }

    public function setBankAccountAttribute($value): void
    {
        $this->attributes['bank_account'] = Crypt::encryptString($value);
    }
}
```

### 2.3 Employer Model

```php
class Employer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'company_name', 'business_license', 'license_image_url',
        'industry', 'company_size', 'address', 'latitude', 'longitude',
        'contact_name', 'contact_phone', 'description',
        'verified', 'verified_at',
    ];

    protected $casts = [
        'latitude'    => 'decimal:8',
        'longitude'   => 'decimal:8',
        'verified'    => 'boolean',
        'verified_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobPosts(): HasMany
    {
        return $this->hasMany(JobPost::class);
    }

    public function laborContracts(): HasMany
    {
        return $this->hasMany(LaborContract::class);
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }
}
```

### 2.4 JobPost Model

```php
class JobPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id', 'title', 'description', 'requirements', 'benefits',
        'job_type', 'positions_count', 'filled_count',
        'salary_type', 'salary_amount', 'salary_ot_rate',
        'shift_type', 'work_start_date', 'work_end_date',
        'work_address', 'latitude', 'longitude', 'region_id',
        'has_housing', 'preferred_dorm_id',
        'min_age', 'max_age', 'gender_req',
        'deadline', 'status', 'view_count',
    ];

    protected $casts = [
        'salary_amount'   => 'integer',
        'salary_ot_rate'  => 'decimal:2',
        'positions_count' => 'integer',
        'filled_count'    => 'integer',
        'has_housing'     => 'boolean',
        'work_start_date' => 'date',
        'work_end_date'   => 'date',
        'deadline'        => 'date',
        'latitude'        => 'decimal:8',
        'longitude'       => 'decimal:8',
        'view_count'      => 'integer',
    ];

    // Relationships
    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function preferredDormitory(): BelongsTo
    {
        return $this->belongsTo(Dormitory::class, 'preferred_dorm_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByRegion($query, $regionId)
    {
        return $query->where('region_id', $regionId);
    }

    public function scopeHasVacancy($query)
    {
        return $query->whereColumn('filled_count', '<', 'positions_count');
    }

    public function scopeNotExpired($query)
    {
        return $query->where('deadline', '>=', now());
    }

    public function scopeWithHousing($query)
    {
        return $query->where('has_housing', true);
    }

    public function scopeNearby($query, float $lat, float $lng, int $radiusKm)
    {
        $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(latitude))
            * cos(radians(longitude) - radians(?)) + sin(radians(?))
            * sin(radians(latitude))))";

        return $query->selectRaw("*, {$haversine} AS distance_km", [$lat, $lng, $lat])
                     ->havingRaw("distance_km <= ?", [$radiusKm])
                     ->orderBy('distance_km');
    }

    // Accessors
    public function getRemainingPositionsAttribute(): int
    {
        return $this->positions_count - $this->filled_count;
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->deadline && $this->deadline->isPast();
    }
}
```

### 2.5 Application Model

```php
class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_post_id', 'worker_id', 'cover_letter',
        'status', 'match_score', 'notes', 'applied_at',
    ];

    protected $casts = [
        'match_score' => 'decimal:2',
        'applied_at'  => 'datetime',
    ];

    // Relationships
    public function jobPost(): BelongsTo
    {
        return $this->belongsTo(JobPost::class);
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(WorkerProfile::class, 'worker_id');
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }

    public function laborContract(): HasOne
    {
        return $this->hasOne(LaborContract::class);
    }

    // Scopes
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeForJob($query, $jobId)
    {
        return $query->where('job_post_id', $jobId);
    }
}
```

### 2.6 Interview Model

```php
class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id', 'interview_type', 'scheduled_at',
        'location', 'meeting_link', 'status',
        'rating_attitude', 'rating_communication', 'rating_fit',
        'feedback',
    ];

    protected $casts = [
        'scheduled_at'         => 'datetime',
        'rating_attitude'      => 'integer',
        'rating_communication' => 'integer',
        'rating_fit'           => 'integer',
    ];

    // Relationships
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    // Scopes
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now())
                     ->whereIn('status', ['scheduled', 'confirmed']);
    }

    // Accessors
    public function getAverageRatingAttribute(): ?float
    {
        if (!$this->rating_attitude) return null;
        return round(($this->rating_attitude + $this->rating_communication + $this->rating_fit) / 3, 1);
    }
}
```

### 2.7 LaborContract Model

```php
class LaborContract extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_number', 'application_id', 'employer_id', 'worker_id',
        'position', 'start_date', 'end_date',
        'salary_type', 'salary_amount', 'shift_type', 'work_address',
        'terms', 'has_housing', 'status',
        'worker_signed_at', 'employer_signed_at',
        'terminated_at', 'termination_reason', 'pdf_url',
    ];

    protected $casts = [
        'start_date'         => 'date',
        'end_date'           => 'date',
        'salary_amount'      => 'integer',
        'terms'              => 'array',
        'has_housing'        => 'boolean',
        'worker_signed_at'   => 'datetime',
        'employer_signed_at' => 'datetime',
        'terminated_at'      => 'datetime',
    ];

    // Relationships
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class);
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(WorkerProfile::class, 'worker_id');
    }

    public function roomContract(): HasOne
    {
        return $this->hasOne(RoomContract::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'contract_id');
    }

    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class, 'contract_id');
    }

    public function salaryAdvances(): HasMany
    {
        return $this->hasMany(SalaryAdvance::class, 'contract_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpiringSoon($query, int $days = 7)
    {
        return $query->where('status', 'active')
                     ->whereBetween('end_date', [now(), now()->addDays($days)]);
    }

    // Accessors
    public function getDurationDaysAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date);
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active'
            && $this->start_date <= now()
            && $this->end_date >= now();
    }
}
```

### 2.8 Attendance Model

```php
class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id', 'worker_id', 'work_date',
        'check_in_at', 'check_out_at',
        'check_in_method', 'check_in_lat', 'check_in_lng', 'check_in_photo',
        'check_out_method', 'total_hours', 'ot_hours',
        'is_approved', 'approved_by', 'status', 'notes',
    ];

    protected $casts = [
        'work_date'      => 'date',
        'check_in_at'    => 'datetime',
        'check_out_at'   => 'datetime',
        'total_hours'    => 'decimal:1',
        'ot_hours'       => 'decimal:1',
        'is_approved'    => 'boolean',
        'check_in_lat'   => 'decimal:8',
        'check_in_lng'   => 'decimal:8',
    ];

    // Relationships
    public function contract(): BelongsTo
    {
        return $this->belongsTo(LaborContract::class, 'contract_id');
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(WorkerProfile::class, 'worker_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopeForPeriod($query, $start, $end)
    {
        return $query->whereBetween('work_date', [$start, $end]);
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }
}
```

### 2.9 Payroll Model

```php
class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id', 'worker_id', 'period_start', 'period_end',
        'total_shifts', 'total_hours', 'ot_hours',
        'base_salary', 'ot_salary', 'allowances', 'gross_salary',
        'housing_deduct', 'advance_deduct', 'penalty_deduct',
        'insurance_deduct', 'total_deductions', 'net_salary',
        'status', 'paid_at', 'payment_method', 'payment_ref', 'pdf_url',
    ];

    protected $casts = [
        'period_start'     => 'date',
        'period_end'       => 'date',
        'total_hours'      => 'decimal:1',
        'ot_hours'         => 'decimal:1',
        'base_salary'      => 'integer',
        'ot_salary'        => 'integer',
        'allowances'       => 'integer',
        'gross_salary'     => 'integer',
        'housing_deduct'   => 'integer',
        'advance_deduct'   => 'integer',
        'penalty_deduct'   => 'integer',
        'insurance_deduct' => 'integer',
        'total_deductions' => 'integer',
        'net_salary'       => 'integer',
        'paid_at'          => 'datetime',
    ];

    // Relationships
    public function contract(): BelongsTo
    {
        return $this->belongsTo(LaborContract::class, 'contract_id');
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(WorkerProfile::class, 'worker_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending_approval');
    }

    public function scopeByPeriod($query, $start, $end)
    {
        return $query->where('period_start', $start)->where('period_end', $end);
    }
}
```

### 2.10 Dormitory Model

```php
class Dormitory extends Model
{
    use HasFactory;

    protected $fillable = [
        'landlord_id', 'region_id', 'name', 'address',
        'latitude', 'longitude', 'total_rooms', 'total_beds',
        'has_wifi', 'has_ac', 'has_hot_water', 'has_kitchen',
        'has_parking', 'has_laundry', 'has_security', 'has_camera',
        'curfew_time', 'electricity_rate', 'water_rate', 'deposit_amount',
        'rules', 'cancellation_policy', 'photos',
        'rating', 'review_count', 'quality_tier',
        'status', 'verified_at',
    ];

    protected $casts = [
        'latitude'         => 'decimal:8',
        'longitude'        => 'decimal:8',
        'has_wifi'         => 'boolean',
        'has_ac'           => 'boolean',
        'has_hot_water'    => 'boolean',
        'has_kitchen'      => 'boolean',
        'has_parking'      => 'boolean',
        'has_laundry'      => 'boolean',
        'has_security'     => 'boolean',
        'has_camera'       => 'boolean',
        'curfew_time'      => 'datetime:H:i',
        'electricity_rate' => 'integer',
        'water_rate'       => 'integer',
        'deposit_amount'   => 'integer',
        'photos'           => 'array',
        'rating'           => 'decimal:1',
        'review_count'     => 'integer',
        'verified_at'      => 'datetime',
    ];

    // Relationships
    public function landlord(): BelongsTo
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function roomContracts(): HasMany
    {
        return $this->hasMany(RoomContract::class);
    }

    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByRegion($query, $regionId)
    {
        return $query->where('region_id', $regionId);
    }

    public function scopeHasVacancy($query)
    {
        return $query->whereHas('rooms', function ($q) {
            $q->where('status', 'available')
              ->whereColumn('current_occupancy', '<', 'capacity');
        });
    }

    // Accessors
    public function getOccupancyRateAttribute(): float
    {
        if ($this->total_beds === 0) return 0;
        $occupied = $this->rooms->sum('current_occupancy');
        return round(($occupied / $this->total_beds) * 100, 1);
    }

    public function getAvailableBedsAttribute(): int
    {
        return $this->rooms->sum(fn ($room) => $room->capacity - $room->current_occupancy);
    }
}
```

### 2.11 Room Model

```php
class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'dormitory_id', 'room_number', 'floor', 'room_type',
        'area_sqm', 'capacity', 'current_occupancy', 'price',
        'amenities', 'photos', 'status',
    ];

    protected $casts = [
        'area_sqm'          => 'decimal:1',
        'capacity'          => 'integer',
        'current_occupancy' => 'integer',
        'price'             => 'integer',
        'amenities'         => 'array',
        'photos'            => 'array',
    ];

    // Relationships
    public function dormitory(): BelongsTo
    {
        return $this->belongsTo(Dormitory::class);
    }

    public function beds(): HasMany
    {
        return $this->hasMany(Bed::class);
    }

    public function roomContracts(): HasMany
    {
        return $this->hasMany(RoomContract::class);
    }

    public function utilityReadings(): HasMany
    {
        return $this->hasMany(UtilityReading::class);
    }

    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available')
                     ->whereColumn('current_occupancy', '<', 'capacity');
    }

    // Accessors
    public function getIsFullAttribute(): bool
    {
        return $this->current_occupancy >= $this->capacity;
    }
}
```

### 2.12 - 2.20 Remaining Models

Cac model con lai (Bed, RoomContract, UtilityReading, RoomInvoice, MaintenanceRequest, Violation, Review, Region, Notification, Message, Conversation, SupportTicket, SalaryAdvance, AuditLog) deu tuong tu voi cau truc:

- **Bed:** belongsTo Room, belongsTo WorkerProfile (occupant)
- **RoomContract:** belongsTo WorkerProfile, belongsTo Dormitory, belongsTo Room, belongsTo Bed, belongsTo LaborContract
- **UtilityReading:** belongsTo Room, belongsTo User (recorded_by)
- **RoomInvoice:** belongsTo RoomContract, belongsTo WorkerProfile
- **MaintenanceRequest:** belongsTo Dormitory, belongsTo Room, belongsTo User (reported_by)
- **Violation:** belongsTo Dormitory, belongsTo WorkerProfile, belongsTo Room
- **Review:** belongsTo User (reviewer), belongsTo User (reviewee)
- **Region:** hasMany Dormitory, hasMany JobPost
- **Notification:** belongsTo User
- **Message:** belongsTo User (sender), belongsTo Conversation
- **Conversation:** hasMany Message
- **SupportTicket:** belongsTo User, belongsTo User (assigned_to)
- **SalaryAdvance:** belongsTo LaborContract, belongsTo WorkerProfile, belongsTo User (approved_by)
- **AuditLog:** belongsTo User

---

## 3. Form Request Validation

### 3.1 Auth Requests

```php
class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'phone'    => ['required', 'regex:/^0[0-9]{9}$/', 'unique:users,phone'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:8', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'role'     => ['required', 'in:worker,employer,landlord'],
            'full_name'=> ['required', 'string', 'max:100'],
        ];
    }
}

class LoginRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'login'       => ['required', 'string'],
            'password'    => ['required', 'string'],
            'device_name' => ['required', 'string', 'max:100'],
            'fcm_token'   => ['nullable', 'string'],
        ];
    }
}

class SendOtpRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'phone' => ['required', 'regex:/^0[0-9]{9}$/'],
            'type'  => ['required', 'in:registration,login,password_reset'],
        ];
    }
}

class VerifyOtpRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'phone' => ['required', 'string'],
            'otp'   => ['required', 'digits:6'],
            'type'  => ['required', 'in:registration,login,password_reset'],
        ];
    }
}

class ResetPasswordRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'phone'    => ['required', 'string'],
            'otp'      => ['required', 'digits:6'],
            'password' => ['required', 'min:8', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ];
    }
}
```

### 3.2 Profile Requests

```php
class UpdateWorkerProfileRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'full_name'               => ['required', 'string', 'max:100'],
            'date_of_birth'           => ['required', 'date', 'before:today', 'after:1950-01-01'],
            'gender'                  => ['required', 'in:male,female,other'],
            'permanent_address'       => ['nullable', 'string', 'max:500'],
            'current_address'         => ['nullable', 'string', 'max:500'],
            'emergency_contact_name'  => ['nullable', 'string', 'max:100'],
            'emergency_contact_phone' => ['nullable', 'regex:/^0[0-9]{9}$/'],
            'bank_name'               => ['nullable', 'string', 'max:100'],
            'bank_account'            => ['nullable', 'string', 'max:50'],
            'bank_holder'             => ['nullable', 'string', 'max:100'],
            'health_status'           => ['nullable', 'in:good,fair,poor'],
            'vehicle'                 => ['nullable', 'in:motorbike,bicycle,walking,car,none'],
            'needs_housing'           => ['nullable', 'boolean'],
        ];
    }
}

class EkycRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id_card_front' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'id_card_back'  => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'selfie'        => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }
}

class UpdateEmployerRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'company_name'     => ['required', 'string', 'max:200'],
            'business_license' => ['nullable', 'string', 'max:50'],
            'industry'         => ['nullable', 'string', 'max:100'],
            'company_size'     => ['nullable', 'in:1-10,11-50,51-100,100-500,500+'],
            'address'          => ['required', 'string', 'max:500'],
            'latitude'         => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'        => ['nullable', 'numeric', 'between:-180,180'],
            'contact_name'     => ['required', 'string', 'max:100'],
            'contact_phone'    => ['required', 'regex:/^0[0-9]{9}$/'],
            'description'      => ['nullable', 'string', 'max:2000'],
        ];
    }
}

class UpdateSkillsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'skills'              => ['required', 'array', 'min:1'],
            'skills.*.skill_name' => ['required', 'string', 'max:100'],
            'skills.*.level'      => ['required', 'in:beginner,intermediate,advanced'],
            'skills.*.years'      => ['nullable', 'numeric', 'min:0', 'max:50'],
        ];
    }
}
```

### 3.3 Job Post Requests

```php
class StoreJobPostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:200'],
            'description'      => ['required', 'string', 'max:5000'],
            'requirements'     => ['nullable', 'string', 'max:2000'],
            'benefits'         => ['nullable', 'string', 'max:2000'],
            'job_type'         => ['required', 'string', 'max:50'],
            'positions_count'  => ['required', 'integer', 'min:1', 'max:1000'],
            'salary_type'      => ['required', 'in:hourly,daily,shift,monthly'],
            'salary_amount'    => ['required', 'integer', 'min:10000'],
            'salary_ot_rate'   => ['nullable', 'numeric', 'min:1.0', 'max:3.0'],
            'shift_type'       => ['nullable', 'in:morning,afternoon,evening,night,flexible'],
            'work_start_date'  => ['required', 'date', 'after_or_equal:today'],
            'work_end_date'    => ['required', 'date', 'after:work_start_date'],
            'work_address'     => ['required', 'string', 'max:500'],
            'latitude'         => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'        => ['nullable', 'numeric', 'between:-180,180'],
            'region_id'        => ['nullable', 'uuid', 'exists:regions,id'],
            'has_housing'      => ['nullable', 'boolean'],
            'preferred_dorm_id'=> ['nullable', 'uuid', 'exists:dormitories,id'],
            'min_age'          => ['nullable', 'integer', 'min:15', 'max:65'],
            'max_age'          => ['nullable', 'integer', 'min:15', 'max:65', 'gte:min_age'],
            'gender_req'       => ['nullable', 'in:male,female,any'],
            'deadline'         => ['nullable', 'date', 'after:today'],
            'status'           => ['nullable', 'in:draft,pending'],
        ];
    }
}
```

### 3.4 Application Requests

```php
class ApplyJobRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'cover_letter' => ['nullable', 'string', 'max:2000'],
        ];
    }
}

class UpdateApplicationStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', 'in:reviewing,interview_invited,interviewed,passed,rejected,hired,standby'],
            'notes'  => ['nullable', 'string', 'max:1000'],
        ];
    }
}

class BulkUpdateStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'application_ids'   => ['required', 'array', 'min:1', 'max:50'],
            'application_ids.*' => ['required', 'uuid', 'exists:applications,id'],
            'status'            => ['required', 'in:reviewing,rejected,standby'],
            'notes'             => ['nullable', 'string', 'max:1000'],
        ];
    }
}
```

### 3.5 Contract Requests

```php
class StoreLaborContractRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'application_id'            => ['required', 'uuid', 'exists:applications,id'],
            'position'                  => ['required', 'string', 'max:200'],
            'start_date'                => ['required', 'date', 'after_or_equal:today'],
            'end_date'                  => ['required', 'date', 'after:start_date', 'before_or_equal:' . now()->addMonths(12)->toDateString()],
            'salary_type'               => ['required', 'in:hourly,daily,shift,monthly'],
            'salary_amount'             => ['required', 'integer', 'min:10000'],
            'shift_type'                => ['nullable', 'string'],
            'work_address'              => ['required', 'string', 'max:500'],
            'has_housing'               => ['nullable', 'boolean'],
            'terms'                     => ['required', 'array'],
            'terms.notice_days'         => ['required', 'integer', 'min:1', 'max:30'],
            'terms.ot_rate_weekday'     => ['required', 'numeric', 'min:1.0', 'max:2.0'],
            'terms.ot_rate_weekend'     => ['required', 'numeric', 'min:1.5', 'max:3.0'],
            'terms.ot_rate_holiday'     => ['required', 'numeric', 'min:2.0', 'max:4.0'],
            'terms.night_allowance_rate'=> ['nullable', 'numeric', 'min:0', 'max:1.0'],
            'terms.meal_allowance'      => ['nullable', 'integer', 'min:0'],
            'terms.transport_allowance' => ['nullable', 'integer', 'min:0'],
        ];
    }
}

class SignContractRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'signature_data' => ['nullable', 'string', 'max:100000'],
            'otp'            => ['required', 'digits:6'],
            'agreed'         => ['required', 'accepted'],
        ];
    }
}

class TerminateContractRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'reason'           => ['required', 'string', 'max:1000'],
            'termination_date' => ['required', 'date', 'after_or_equal:today'],
            'initiated_by'     => ['required', 'in:worker,employer'],
        ];
    }
}
```

### 3.6 Attendance & Payroll Requests

```php
class CheckInRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'contract_id' => ['required', 'uuid', 'exists:labor_contracts,id'],
            'method'      => ['required', 'in:qr,gps,face,manual'],
            'qr_code'     => ['nullable', 'required_if:method,qr', 'string'],
            'latitude'    => ['required', 'numeric', 'between:-90,90'],
            'longitude'   => ['required', 'numeric', 'between:-180,180'],
            'photo'       => ['nullable', 'string', 'max:500000'],
        ];
    }
}

class CalculatePayrollRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'contract_id'  => ['required', 'uuid', 'exists:labor_contracts,id'],
            'period_start' => ['required', 'date'],
            'period_end'   => ['required', 'date', 'after:period_start'],
        ];
    }
}
```

### 3.7 Housing Requests

```php
class StoreDormitoryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'                => ['required', 'string', 'max:200'],
            'address'             => ['required', 'string', 'max:500'],
            'latitude'            => ['required', 'numeric', 'between:-90,90'],
            'longitude'           => ['required', 'numeric', 'between:-180,180'],
            'region_id'           => ['nullable', 'uuid', 'exists:regions,id'],
            'has_wifi'            => ['nullable', 'boolean'],
            'has_ac'              => ['nullable', 'boolean'],
            'has_hot_water'       => ['nullable', 'boolean'],
            'has_kitchen'         => ['nullable', 'boolean'],
            'has_parking'         => ['nullable', 'boolean'],
            'has_laundry'         => ['nullable', 'boolean'],
            'has_security'        => ['nullable', 'boolean'],
            'has_camera'          => ['nullable', 'boolean'],
            'curfew_time'         => ['nullable', 'date_format:H:i'],
            'electricity_rate'    => ['required', 'integer', 'min:0'],
            'water_rate'          => ['required', 'integer', 'min:0'],
            'deposit_amount'      => ['required', 'integer', 'min:0'],
            'rules'               => ['nullable', 'string', 'max:5000'],
            'cancellation_policy' => ['nullable', 'string', 'max:2000'],
            'quality_tier'        => ['nullable', 'in:basic,standard,premium'],
        ];
    }
}

class StoreRoomRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'room_number' => ['required', 'string', 'max:20'],
            'floor'       => ['nullable', 'integer', 'min:0', 'max:50'],
            'room_type'   => ['required', 'in:single,double,dorm'],
            'area_sqm'    => ['nullable', 'numeric', 'min:5', 'max:100'],
            'capacity'    => ['required', 'integer', 'min:1', 'max:20'],
            'price'       => ['required', 'integer', 'min:0'],
            'amenities'   => ['nullable', 'array'],
            'status'      => ['nullable', 'in:available,maintenance'],
        ];
    }
}

class StoreRoomContractRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'worker_id'         => ['required', 'uuid', 'exists:worker_profiles,id'],
            'dormitory_id'      => ['required', 'uuid', 'exists:dormitories,id'],
            'room_id'           => ['required', 'uuid', 'exists:rooms,id'],
            'bed_id'            => ['nullable', 'uuid', 'exists:beds,id'],
            'labor_contract_id' => ['nullable', 'uuid', 'exists:labor_contracts,id'],
            'start_date'        => ['required', 'date', 'after_or_equal:today'],
            'end_date'          => ['required', 'date', 'after:start_date'],
            'monthly_rent'      => ['required', 'integer', 'min:0'],
            'deposit_amount'    => ['required', 'integer', 'min:0'],
            'payment_method'    => ['required', 'in:salary_deduct,self_pay'],
        ];
    }
}

class StoreUtilityReadingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'room_id'          => ['required', 'uuid', 'exists:rooms,id'],
            'reading_date'     => ['required', 'date'],
            'electricity_curr' => ['required', 'numeric', 'min:0'],
            'water_curr'       => ['required', 'numeric', 'min:0'],
        ];
    }
}

class StoreMaintenanceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'dormitory_id' => ['required', 'uuid', 'exists:dormitories,id'],
            'room_id'      => ['required', 'uuid', 'exists:rooms,id'],
            'category'     => ['required', 'in:electrical,plumbing,furniture,other'],
            'description'  => ['required', 'string', 'max:2000'],
            'urgency'      => ['required', 'in:low,medium,high,emergency'],
        ];
    }
}

class StoreViolationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'dormitory_id'   => ['required', 'uuid', 'exists:dormitories,id'],
            'worker_id'      => ['required', 'uuid', 'exists:worker_profiles,id'],
            'room_id'        => ['required', 'uuid', 'exists:rooms,id'],
            'violation_type' => ['required', 'string', 'max:100'],
            'description'    => ['required', 'string', 'max:2000'],
            'severity'       => ['required', 'in:minor,moderate,severe'],
            'action_taken'   => ['required', 'in:warning,fine,final_warning,termination'],
            'fine_amount'    => ['nullable', 'integer', 'min:0', 'required_if:action_taken,fine'],
        ];
    }
}
```

---

## 4. API Resources (Response Transformers)

### 4.1 UserResource

```php
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->id,
            'phone'        => $this->masked_phone,
            'email'        => $this->email,
            'role'         => $this->role,
            'status'       => $this->status,
            'credit_score' => $this->credit_score,
            'avatar_url'   => $this->avatar_url,
            'last_login_at'=> $this->last_login_at?->toIso8601String(),
            'profile'      => $this->when($this->role === 'worker', fn () => new WorkerProfileResource($this->workerProfile)),
            'employer'     => $this->when($this->role === 'employer', fn () => new EmployerResource($this->employer)),
            'created_at'   => $this->created_at->toIso8601String(),
        ];
    }
}
```

### 4.2 WorkerProfileResource

```php
class WorkerProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                     => $this->id,
            'full_name'              => $this->full_name,
            'date_of_birth'          => $this->date_of_birth->toDateString(),
            'age'                    => $this->age,
            'gender'                 => $this->gender,
            'id_card_number'         => $this->masked_id_card,
            'permanent_address'      => $this->permanent_address,
            'current_address'        => $this->current_address,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone'=> $this->emergency_contact_phone,
            'bank_name'              => $this->bank_name,
            'bank_account'           => '****' . substr($this->bank_account, -4),
            'bank_holder'            => $this->bank_holder,
            'health_status'          => $this->health_status,
            'vehicle'                => $this->vehicle,
            'needs_housing'          => $this->needs_housing,
            'ekyc_status'            => $this->ekyc_status,
            'skills'                 => WorkerSkillResource::collection($this->whenLoaded('skills')),
            'experiences'            => WorkerExperienceResource::collection($this->whenLoaded('experiences')),
        ];
    }
}
```

### 4.3 JobPostResource

```php
class JobPostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'description'       => $this->when($request->routeIs('jobs.show'), $this->description),
            'requirements'      => $this->when($request->routeIs('jobs.show'), $this->requirements),
            'benefits'          => $this->when($request->routeIs('jobs.show'), $this->benefits),
            'employer'          => new EmployerSummaryResource($this->employer),
            'job_type'          => $this->job_type,
            'positions_count'   => $this->positions_count,
            'filled_count'      => $this->filled_count,
            'remaining'         => $this->remaining_positions,
            'salary_type'       => $this->salary_type,
            'salary_amount'     => $this->salary_amount,
            'salary_ot_rate'    => $this->salary_ot_rate,
            'shift_type'        => $this->shift_type,
            'work_start_date'   => $this->work_start_date->toDateString(),
            'work_end_date'     => $this->work_end_date->toDateString(),
            'work_address'      => $this->work_address,
            'latitude'          => $this->latitude,
            'longitude'         => $this->longitude,
            'region'            => new RegionSummaryResource($this->whenLoaded('region')),
            'has_housing'       => $this->has_housing,
            'preferred_dormitory' => new DormitorySummaryResource($this->whenLoaded('preferredDormitory')),
            'min_age'           => $this->min_age,
            'max_age'           => $this->max_age,
            'gender_req'        => $this->gender_req,
            'deadline'          => $this->deadline?->toDateString(),
            'status'            => $this->status,
            'view_count'        => $this->view_count,
            'distance_km'       => $this->when(isset($this->distance_km), round($this->distance_km, 1)),
            'match_score'       => $this->when(isset($this->match_score), $this->match_score),
            'has_applied'       => $this->when(auth()->check(), fn () => $this->hasApplied(auth()->id())),
            'created_at'        => $this->created_at->toIso8601String(),
        ];
    }
}
```

### 4.4 ApplicationResource

```php
class ApplicationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->id,
            'job_post'     => new JobPostSummaryResource($this->whenLoaded('jobPost')),
            'worker'       => new WorkerSummaryResource($this->whenLoaded('worker')),
            'cover_letter' => $this->cover_letter,
            'status'       => $this->status,
            'match_score'  => $this->match_score,
            'notes'        => $this->when(auth()->user()?->role !== 'worker', $this->notes),
            'applied_at'   => $this->applied_at->toIso8601String(),
            'updated_at'   => $this->updated_at->toIso8601String(),
        ];
    }
}
```

### 4.5 LaborContractResource

```php
class LaborContractResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                => $this->id,
            'contract_number'   => $this->contract_number,
            'worker'            => new WorkerSummaryResource($this->whenLoaded('worker')),
            'employer'          => new EmployerSummaryResource($this->whenLoaded('employer')),
            'position'          => $this->position,
            'start_date'        => $this->start_date->toDateString(),
            'end_date'          => $this->end_date->toDateString(),
            'duration_days'     => $this->duration_days,
            'salary_type'       => $this->salary_type,
            'salary_amount'     => $this->salary_amount,
            'shift_type'        => $this->shift_type,
            'work_address'      => $this->work_address,
            'terms'             => $this->terms,
            'has_housing'       => $this->has_housing,
            'status'            => $this->status,
            'worker_signed_at'  => $this->worker_signed_at?->toIso8601String(),
            'employer_signed_at'=> $this->employer_signed_at?->toIso8601String(),
            'terminated_at'     => $this->terminated_at?->toIso8601String(),
            'termination_reason'=> $this->termination_reason,
            'pdf_url'           => $this->pdf_url,
            'room_contract'     => new RoomContractSummaryResource($this->whenLoaded('roomContract')),
            'created_at'        => $this->created_at->toIso8601String(),
        ];
    }
}
```

### 4.6 PayrollResource

```php
class PayrollResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'               => $this->id,
            'contract'         => new LaborContractSummaryResource($this->whenLoaded('contract')),
            'worker'           => new WorkerSummaryResource($this->whenLoaded('worker')),
            'period_start'     => $this->period_start->toDateString(),
            'period_end'       => $this->period_end->toDateString(),
            'total_shifts'     => $this->total_shifts,
            'total_hours'      => $this->total_hours,
            'ot_hours'         => $this->ot_hours,
            'base_salary'      => $this->base_salary,
            'ot_salary'        => $this->ot_salary,
            'allowances'       => $this->allowances,
            'gross_salary'     => $this->gross_salary,
            'deductions'       => [
                'housing'   => $this->housing_deduct,
                'advance'   => $this->advance_deduct,
                'penalty'   => $this->penalty_deduct,
                'insurance' => $this->insurance_deduct,
            ],
            'total_deductions' => $this->total_deductions,
            'net_salary'       => $this->net_salary,
            'status'           => $this->status,
            'paid_at'          => $this->paid_at?->toIso8601String(),
            'payment_method'   => $this->payment_method,
            'pdf_url'          => $this->pdf_url,
            'created_at'       => $this->created_at->toIso8601String(),
        ];
    }
}
```

### 4.7 DormitoryResource

```php
class DormitoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'address'          => $this->address,
            'latitude'         => $this->latitude,
            'longitude'        => $this->longitude,
            'region'           => new RegionSummaryResource($this->whenLoaded('region')),
            'total_rooms'      => $this->total_rooms,
            'total_beds'       => $this->total_beds,
            'available_beds'   => $this->available_beds,
            'occupancy_rate'   => $this->occupancy_rate,
            'price_from'       => $this->rooms->min('price'),
            'amenities'        => [
                'wifi'      => $this->has_wifi,
                'ac'        => $this->has_ac,
                'hot_water' => $this->has_hot_water,
                'kitchen'   => $this->has_kitchen,
                'parking'   => $this->has_parking,
                'laundry'   => $this->has_laundry,
                'security'  => $this->has_security,
                'camera'    => $this->has_camera,
            ],
            'curfew_time'      => $this->curfew_time,
            'electricity_rate' => $this->electricity_rate,
            'water_rate'       => $this->water_rate,
            'deposit_amount'   => $this->deposit_amount,
            'photos'           => $this->photos,
            'rating'           => $this->rating,
            'review_count'     => $this->review_count,
            'quality_tier'     => $this->quality_tier,
            'status'           => $this->status,
            'rooms'            => RoomResource::collection($this->whenLoaded('rooms')),
            'distance_km'      => $this->when(isset($this->distance_km), round($this->distance_km, 1)),
            'created_at'       => $this->created_at->toIso8601String(),
        ];
    }
}
```

### 4.8 RoomInvoiceResource

```php
class RoomInvoiceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                  => $this->id,
            'invoice_number'      => $this->invoice_number,
            'worker'              => new WorkerSummaryResource($this->whenLoaded('worker')),
            'room_contract'       => new RoomContractSummaryResource($this->whenLoaded('roomContract')),
            'billing_month'       => $this->billing_month->format('Y-m'),
            'rent_amount'         => $this->rent_amount,
            'electricity_amount'  => $this->electricity_amount,
            'water_amount'        => $this->water_amount,
            'internet_amount'     => $this->internet_amount,
            'trash_amount'        => $this->trash_amount,
            'other_amount'        => $this->other_amount,
            'other_description'   => $this->other_description,
            'late_fee'            => $this->late_fee,
            'total_amount'        => $this->total_amount,
            'paid_amount'         => $this->paid_amount,
            'remaining'           => $this->total_amount - $this->paid_amount,
            'status'              => $this->status,
            'due_date'            => $this->due_date,
            'paid_at'             => $this->paid_at?->toIso8601String(),
            'is_salary_deducted'  => $this->is_salary_deducted,
            'created_at'          => $this->created_at->toIso8601String(),
        ];
    }
}
```

---

## 5. Service Layer

### 5.1 JobMatchingService

```php
/**
 * Thuat toan matching NVTV voi tin tuyen dung.
 *
 * Tinh diem phu hop dua tren nhieu yeu to:
 * - Ky nang (30%): So khop ky nang yeu cau voi ky nang NVTV
 * - Khoang cach (25%): Khoang cach tu noi o den noi lam viec
 * - Kinh nghiem (20%): So nam kinh nghiem tuong tu
 * - Diem uy tin (15%): Credit score cua NVTV
 * - Muc luong (10%): Muc luong phu hop voi mong muon NVTV
 *
 * Methods:
 * - calculateMatchScore(WorkerProfile $worker, JobPost $job): float
 * - findTopCandidates(JobPost $job, int $limit = 10): Collection
 * - findMatchingJobs(WorkerProfile $worker, array $filters): Collection
 * - getAutoSuggestions(WorkerProfile $worker): Collection
 *
 * Su dung: Redis cache de luu ket qua matching, cap nhat khi co thay doi.
 */
class JobMatchingService
{
    private const WEIGHT_SKILLS     = 0.30;
    private const WEIGHT_DISTANCE   = 0.25;
    private const WEIGHT_EXPERIENCE = 0.20;
    private const WEIGHT_CREDIT     = 0.15;
    private const WEIGHT_SALARY     = 0.10;

    public function calculateMatchScore(WorkerProfile $worker, JobPost $job): float;
    public function findTopCandidates(JobPost $job, int $limit = 10): Collection;
    public function findMatchingJobs(WorkerProfile $worker, array $filters = []): Collection;
    public function getAutoSuggestions(WorkerProfile $worker): Collection;
}
```

### 5.2 HousingRecommendationService

```php
/**
 * Goi y khu tro phu hop khi NVTV duoc nhan viec.
 *
 * Thuat toan scoring:
 * Score = 0.4 * (1 - distance/max_distance)    // Khoang cach
 *       + 0.3 * (1 - price/budget)             // Gia ca
 *       + 0.2 * (rating/5)                      // Danh gia
 *       + 0.1 * (amenity_match/total_amenities) // Tien ich
 *
 * Methods:
 * - recommend(WorkerProfile $worker, LaborContract $contract): Collection
 * - filterByConstraints(Collection $dormitories, array $constraints): Collection
 * - calculateHousingScore(Dormitory $dorm, array $criteria): float
 * - suggestAfterContractChange(LaborContract $contract): Collection
 */
class HousingRecommendationService
{
    private const WEIGHT_DISTANCE = 0.4;
    private const WEIGHT_PRICE    = 0.3;
    private const WEIGHT_RATING   = 0.2;
    private const WEIGHT_AMENITY  = 0.1;

    public function recommend(WorkerProfile $worker, LaborContract $contract): Collection;
    public function calculateHousingScore(Dormitory $dorm, array $criteria): float;
}
```

### 5.3 PayrollCalculationService

```php
/**
 * Tinh luong tu dong dua tren du lieu cham cong.
 *
 * Cong thuc:
 * - Luong co ban = So ca/gio x Don gia
 * - Luong OT ngay thuong = Gio OT x Don gia x 1.5
 * - Luong OT ngay nghi = Gio OT x Don gia x 2.0
 * - Luong OT ngay le = Gio OT x Don gia x 3.0
 * - Phu cap ca dem (22h-6h) = Don gia x 0.3
 * - Phu cap an, di lai (theo hop dong)
 * - Khau tru: Tien tro + Tam ung + Phat + BHXH
 *
 * Methods:
 * - calculate(LaborContract $contract, Carbon $periodStart, Carbon $periodEnd): Payroll
 * - calculateBulk(Employer $employer, Carbon $periodStart, Carbon $periodEnd): Collection
 * - getAttendanceSummary(LaborContract $contract, Carbon $start, Carbon $end): array
 * - calculateOvertimePay(float $hours, string $otType, int $baseSalary): int
 * - calculateDeductions(LaborContract $contract, Carbon $billingMonth): array
 * - generatePayslipPdf(Payroll $payroll): string
 */
class PayrollCalculationService
{
    public function calculate(LaborContract $contract, Carbon $periodStart, Carbon $periodEnd): Payroll;
    public function calculateBulk(Employer $employer, Carbon $periodStart, Carbon $periodEnd): Collection;
    public function calculateDeductions(LaborContract $contract, Carbon $billingMonth): array;
    public function generatePayslipPdf(Payroll $payroll): string;
}
```

### 5.4 AttendanceService

```php
/**
 * Xu ly cham cong voi nhieu hinh thuc va chong gian lan.
 *
 * Methods:
 * - checkIn(LaborContract $contract, CheckInRequest $request): Attendance
 * - checkOut(Attendance $attendance, array $data): Attendance
 * - validateGpsLocation(float $lat, float $lng, LaborContract $contract): bool
 * - validateQrCode(string $qrData, LaborContract $contract): bool
 * - autoCheckout(): void  // Chay cuoi ca, tu dong checkout neu NVTV quen
 * - markAbsent(): void    // Chay cuoi ngay, danh dau vang mat
 * - generateReport(LaborContract $contract, Carbon $start, Carbon $end): array
 *
 * Quy tac:
 * - GPS phai trong ban kinh 200m (cau hinh duoc)
 * - QR code thay doi moi 30 giay
 * - Check-in truoc gio lam toi da 30 phut
 * - Check-in sau gio lam toi da 15 phut -> danh dau "late"
 */
class AttendanceService
{
    public function checkIn(LaborContract $contract, array $data): Attendance;
    public function checkOut(Attendance $attendance, array $data): Attendance;
    public function validateGpsLocation(float $lat, float $lng, LaborContract $contract): bool;
    public function validateQrCode(string $qrData, LaborContract $contract): bool;
    public function autoCheckout(): void;
    public function markAbsent(): void;
}
```

### 5.5 ContractSyncService

```php
/**
 * Dong bo trang thai giua Hop dong lao dong va Hop dong tro.
 *
 * Ma tran lien ket:
 * - Ky moi HD LD -> Goi y dang ky tro
 * - Gia han HD LD -> Gia han HD tro
 * - Cham dut HD LD -> Tao yeu cau tra phong (sau 7 ngay)
 * - NVTV chuyen noi lam viec -> Goi y chuyen tro
 *
 * Methods:
 * - onContractSigned(LaborContract $contract): void
 * - onContractExtended(LaborContract $contract): void
 * - onContractTerminated(LaborContract $contract): void
 * - onWorkLocationChanged(LaborContract $contract): void
 * - syncStatuses(): void  // Scheduled job chay hang ngay
 */
class ContractSyncService
{
    public function onContractSigned(LaborContract $contract): void;
    public function onContractExtended(LaborContract $contract): void;
    public function onContractTerminated(LaborContract $contract): void;
    public function syncStatuses(): void;
}
```

### 5.6 NotificationService

```php
/**
 * Gui thong bao da kenh: Push, SMS, Email, Zalo OA.
 *
 * Methods:
 * - send(User $user, string $type, array $data): void
 * - sendBulk(Collection $users, string $type, array $data): void
 * - sendViaPush(User $user, string $title, string $body, array $data): void
 * - sendViaSms(string $phone, string $message): void
 * - sendViaEmail(string $email, Mailable $mailable): void
 * - sendViaZalo(string $phone, string $templateId, array $data): void
 * - getUserPreferences(User $user, string $type): array
 * - shouldSend(User $user, string $channel, string $type): bool
 *
 * Fallback: Push -> SMS -> Email
 * Quiet hours: 22:00 - 07:00 (cau hinh duoc)
 */
class NotificationService
{
    public function send(User $user, string $type, array $data): void;
    public function sendBulk(Collection $users, string $type, array $data): void;
}
```

### 5.7 InvoiceGenerationService

```php
/**
 * Tao hoa don tro tu dong hang thang.
 *
 * Methods:
 * - generateMonthlyInvoices(Dormitory $dormitory, Carbon $billingMonth): Collection
 * - generateInvoice(RoomContract $contract, Carbon $billingMonth): RoomInvoice
 * - calculateElectricity(Room $room, Carbon $month): int
 * - calculateWater(Room $room, Carbon $month): int
 * - applyLateFee(RoomInvoice $invoice): void  // 5%/tuan, toi da 20%
 * - generateInvoicePdf(RoomInvoice $invoice): string
 *
 * Scheduled: Chay ngay 1 hang thang
 * Late fee: Chay ngay 5, 10, 15 hang thang
 */
class InvoiceGenerationService
{
    public function generateMonthlyInvoices(Dormitory $dormitory, Carbon $billingMonth): Collection;
    public function generateInvoice(RoomContract $contract, Carbon $billingMonth): RoomInvoice;
    public function applyLateFee(RoomInvoice $invoice): void;
}
```

### 5.8 CreditScoreService

```php
/**
 * Tinh diem uy tin cho NVTV va NTD.
 *
 * Quy tac NVTV:
 * - Hoan thanh hop dong: +10
 * - Nghi dung quy trinh: -5
 * - Bo viec khong bao: -50
 * - Cham cong dung gio lien tuc 1 thang: +5
 * - Di muon > 3 lan/thang: -3
 * - Bi vi pham noi quy tro: -10 den -30
 * - Duoc NTD danh gia tot (>=4 sao): +5
 *
 * Methods:
 * - adjustScore(User $user, string $event, int $points): void
 * - calculateScore(User $user): int
 * - getScoreHistory(User $user): Collection
 * - getScoreTier(int $score): string  // 'bronze', 'silver', 'gold', 'platinum'
 */
class CreditScoreService
{
    public function adjustScore(User $user, string $event, int $points): void;
    public function calculateScore(User $user): int;
    public function getScoreTier(int $score): string;
}
```

### 5.9 EkycService

```php
/**
 * Xac minh danh tinh NVTV qua eKYC.
 *
 * Luong:
 * 1. Upload CCCD mat truoc + sau
 * 2. OCR doc thong tin (ho ten, ngay sinh, so CCCD)
 * 3. Chup selfie (liveness detection)
 * 4. So khop khuon mat selfie vs CCCD (face matching)
 * 5. Kiem tra CCCD hop le (format, checksum)
 * 6. Ket qua: Pass / Fail / Manual Review
 *
 * Methods:
 * - processEkyc(WorkerProfile $worker, array $files): EkycResult
 * - extractIdCardInfo(string $imagePath): array (OCR)
 * - matchFace(string $selfiePath, string $idCardPath): float (confidence)
 * - validateIdCardNumber(string $idNumber): bool
 * - requestManualReview(WorkerProfile $worker, string $reason): void
 *
 * Tich hop: FPT.AI hoac Google Vision API
 */
class EkycService
{
    public function processEkyc(WorkerProfile $worker, array $files): EkycResult;
    public function extractIdCardInfo(string $imagePath): array;
    public function matchFace(string $selfiePath, string $idCardPath): float;
}
```

---

## 6. Events & Listeners

### 6.1 Danh sach Events

```php
// Auth & User
UserRegistered::class
UserVerified::class
UserStatusChanged::class
EkycCompleted::class

// Tuyen dung
JobPostCreated::class
JobPostApproved::class
JobPostExpired::class
ApplicationSubmitted::class
ApplicationStatusChanged::class
InterviewScheduled::class
InterviewCompleted::class

// Hop dong
LaborContractCreated::class
LaborContractSigned::class
LaborContractExpiringSoon::class
LaborContractTerminated::class
LaborContractCompleted::class

// Cham cong & Luong
AttendanceCheckedIn::class
AttendanceCheckedOut::class
AttendanceAbsentMarked::class
PayrollCalculated::class
PayrollApproved::class
PayrollPaid::class
SalaryAdvanceRequested::class
SalaryAdvanceApproved::class

// Nha tro
DormitoryRegistered::class
DormitoryVerified::class
RoomContractCreated::class
RoomContractSigned::class
RoomContractTerminated::class
RoomInvoiceGenerated::class
RoomInvoicePaid::class
RoomInvoiceOverdue::class
MaintenanceRequestCreated::class
MaintenanceRequestCompleted::class
ViolationRecorded::class
UtilityReadingRecorded::class

// Danh gia
ReviewCreated::class
CreditScoreChanged::class
```

### 6.2 Mapping Events -> Listeners

```php
// --- Auth ---
UserRegistered::class => [
    SendWelcomeNotification::class,
    CreateDefaultProfile::class,
],

UserVerified::class => [
    SendVerificationConfirmation::class,
    LogAuditEvent::class,
],

EkycCompleted::class => [
    UpdateWorkerEkycStatus::class,
    SendEkycResultNotification::class,
],

// --- Tuyen dung ---
JobPostCreated::class => [
    NotifyAdminForApproval::class,
    LogAuditEvent::class,
],

JobPostApproved::class => [
    NotifyMatchingWorkers::class,        // Tim NVTV phu hop va gui thong bao
    IndexJobForSearch::class,             // Cap nhat search index
],

ApplicationSubmitted::class => [
    CalculateMatchScore::class,           // Tinh diem phu hop
    NotifyEmployerNewApplication::class,
    LogAuditEvent::class,
],

ApplicationStatusChanged::class => [
    NotifyWorkerStatusChange::class,
    UpdateApplicationStats::class,
],

InterviewScheduled::class => [
    SendInterviewInvitation::class,       // Gui thong bao NVTV qua Push + SMS + Email
    CreateCalendarEvent::class,
],

// --- Hop dong ---
LaborContractSigned::class => [
    ActivateContract::class,
    UpdateJobPostFilledCount::class,
    CreateHousingRecommendation::class,   // Goi y tro neu NVTV can cho o
    UpdateCreditScore::class,             // +0 (chua co diem, chi ghi nhan)
    SendContractConfirmation::class,
    GenerateContractPdf::class,
    LogAuditEvent::class,
],

LaborContractExpiringSoon::class => [
    NotifyContractExpiring::class,        // Nhac NTD va NVTV
    SuggestContractRenewal::class,
],

LaborContractTerminated::class => [
    InitiateCheckout::class,              // Tao yeu cau tra phong tro (sau 7 ngay)
    CalculateFinalPayroll::class,         // Tinh luong quyet toan
    UpdateCreditScore::class,             // +10 (hoan thanh) hoac -50 (bo viec)
    NotifyTermination::class,
    LogAuditEvent::class,
],

// --- Cham cong ---
AttendanceCheckedIn::class => [
    ValidateCheckInLocation::class,
    UpdateAttendanceLog::class,
    CheckLateStatus::class,               // Kiem tra di muon
],

AttendanceCheckedOut::class => [
    CalculateWorkHours::class,
    CalculateOvertimeHours::class,
],

// --- Luong ---
PayrollApproved::class => [
    ProcessPayment::class,                // Xu ly thanh toan
    DeductHousingFromSalary::class,       // Khau tru tien tro tu luong
    GeneratePayslipPdf::class,
    SendPayslipNotification::class,
],

PayrollPaid::class => [
    TransferHousingPayment::class,        // Chuyen tien tro cho chu tro
    SendPaymentConfirmation::class,
    LogAuditEvent::class,
],

// --- Nha tro ---
RoomContractSigned::class => [
    AssignRoomBed::class,                 // Phan bo phong/giuong
    UpdateRoomOccupancy::class,
    SendRoomInfo::class,                  // Gui thong tin phong cho NVTV
    LogAuditEvent::class,
],

RoomContractTerminated::class => [
    InitiateRoomCheckout::class,
    CalculateDepositRefund::class,
    UpdateRoomAvailability::class,
],

RoomInvoiceGenerated::class => [
    SendInvoiceNotification::class,       // Gui hoa don qua Push + SMS
],

RoomInvoiceOverdue::class => [
    SendOverdueReminder::class,           // Nhac thanh toan
    ApplyLateFee::class,                  // Tinh phi cham tra
    NotifyCoordinatorOverdue::class,      // Bao dieu phoi vien neu qua 15 ngay
],

MaintenanceRequestCreated::class => [
    NotifyLandlordMaintenance::class,
    EscalateIfEmergency::class,           // Bao khan cap neu urgency = emergency
],

ViolationRecorded::class => [
    NotifyWorkerViolation::class,
    UpdateCreditScore::class,             // Tru diem uy tin
    CheckViolationThreshold::class,       // Kiem tra lan vi pham thu may -> xu ly
],

// --- Danh gia ---
ReviewCreated::class => [
    UpdateEntityRating::class,            // Cap nhat rating trung binh
    UpdateCreditScore::class,
    NotifyReviewee::class,
],

CreditScoreChanged::class => [
    CheckCreditScoreTier::class,          // Kiem tra tier moi
    LogCreditScoreHistory::class,
],
```

---

## 7. Jobs & Queues

### 7.1 Scheduled Jobs (Cron)

```php
// app/Console/Kernel.php

protected function schedule(Schedule $schedule): void
{
    // === HANG NGAY ===

    // 00:01 - Danh dau hop dong het han
    $schedule->job(new ExpireContracts)->dailyAt('00:01')
             ->description('Danh dau hop dong lao dong va hop dong tro het han');

    // 00:30 - Tu dong checkout cho NVTV quen
    $schedule->job(new AutoCheckout)->dailyAt('00:30')
             ->description('Tu dong checkout ca dem neu NVTV quen');

    // 06:00 - Nhac NVTV cham cong
    $schedule->job(new SendAttendanceReminder)->dailyAt('06:00')
             ->description('Gui push notification nhac cham cong');

    // 08:00 - Danh dau vang mat ngay hom truoc
    $schedule->job(new MarkAbsentWorkers)->dailyAt('08:00')
             ->description('Danh dau NVTV vang mat hom truoc');

    // 09:00 - Nhac hop dong sap het han (truoc 7 ngay)
    $schedule->job(new NotifyExpiringContracts)->dailyAt('09:00')
             ->description('Nhac NTD va NVTV hop dong sap het han');

    // 10:00 - Dong tin tuyen dung het han
    $schedule->job(new CloseExpiredJobPosts)->dailyAt('10:00')
             ->description('Tu dong dong tin tuyen dung qua deadline');

    // 23:00 - Dong bo trang thai HD LD va HD tro
    $schedule->job(new SyncContractStatuses)->dailyAt('23:00')
             ->description('Dong bo trang thai giua hop dong lao dong va hop dong tro');

    // === HANG THANG ===

    // Ngay 1 - Tao hoa don tro tu dong
    $schedule->job(new GenerateMonthlyInvoices)->monthlyOn(1, '01:00')
             ->description('Tao hoa don tien tro cho tat ca phong');

    // Ngay 5 - Nhac thanh toan tien tro (lan 1)
    $schedule->job(new SendInvoiceReminder('first'))->monthlyOn(5, '09:00')
             ->description('Nhac thanh toan tien tro lan 1');

    // Ngay 10 - Nhac thanh toan tien tro (lan 2) + Tinh phi cham tra
    $schedule->job(new SendInvoiceReminder('second'))->monthlyOn(10, '09:00');
    $schedule->job(new ApplyLateFees)->monthlyOn(10, '01:00')
             ->description('Ap dung phi cham tra 5%');

    // Ngay 15 - Nhac thanh toan tien tro (lan 3) + Bao dieu phoi vien
    $schedule->job(new SendInvoiceReminder('final'))->monthlyOn(15, '09:00');
    $schedule->job(new EscalateOverdueInvoices)->monthlyOn(15, '10:00')
             ->description('Bao dieu phoi vien hoa don qua han 15 ngay');

    // Ngay cuoi thang - Tong hop bao cao
    $schedule->job(new GenerateMonthlyReports)->lastDayOfMonth('23:00')
             ->description('Tao bao cao tuyen dung va nha tro hang thang');

    // === HANG TUAN ===

    // Thu 2 - Bao cao tuan
    $schedule->job(new GenerateWeeklyDigest)->weeklyOn(1, '08:00')
             ->description('Gui bao cao tuan cho admin va NTD');

    // === MOI 5 PHUT ===

    // Kiem tra va gui match notification cho NVTV
    $schedule->job(new ProcessJobMatching)->everyFiveMinutes()
             ->description('Tim NVTV phu hop voi tin tuyen dung moi');

    // === MOI 15 PHUT ===

    // Kiem tra phong van khong phan hoi
    $schedule->job(new CheckUnresponsiveInterviews)->everyFifteenMinutes()
             ->description('Nhac NVTV chua phan hoi lich phong van');
}
```

### 7.2 Queued Jobs

```php
// === THONG BAO ===

// Queue: notifications (high priority)
SendPushNotification::class       // Gui push notification qua FCM/APNs
SendSmsNotification::class        // Gui SMS qua gateway (Twilio, SpeedSMS)
SendEmailNotification::class      // Gui email
SendZaloNotification::class       // Gui thong bao Zalo OA

// === XU LY NANG ===

// Queue: processing (default priority)
CalculateMatchScore::class        // Tinh diem matching NVTV - Job
GenerateContractPdf::class        // Tao file PDF hop dong
GeneratePayslipPdf::class         // Tao file PDF phieu luong
GenerateInvoicePdf::class         // Tao file PDF hoa don
ProcessEkyc::class                // Xu ly eKYC (OCR + Face matching)
ProcessBulkPayroll::class         // Tinh luong hang loat
ProcessPayment::class             // Xu ly thanh toan qua cong thanh toan

// Queue: reports (low priority)
GenerateRecruitmentReport::class  // Tao bao cao tuyen dung
GenerateHousingReport::class      // Tao bao cao nha tro
GenerateFinancialReport::class    // Tao bao cao tai chinh
ExportDataToExcel::class          // Xuat du lieu ra Excel

// Queue: media (low priority)
ProcessUploadedImage::class       // Resize, compress anh upload
ProcessOcrReading::class          // OCR doc chi so dong ho dien nuoc
```

### 7.3 Cau hinh Queue

```php
// config/queue.php - Redis driver

'connections' => [
    'redis' => [
        'driver'     => 'redis',
        'connection' => 'queue',
        'queue'      => 'default',
        'retry_after'=> 90,
        'block_for'  => 5,
    ],
],

// Chay workers:
// php artisan queue:work redis --queue=notifications --tries=3 --backoff=30
// php artisan queue:work redis --queue=processing --tries=3 --backoff=60
// php artisan queue:work redis --queue=reports --tries=2 --backoff=120
// php artisan queue:work redis --queue=media --tries=2 --backoff=60
```

---

## 8. Middleware

### 8.1 Custom Middleware

```php
// 1. CheckRole - Kiem tra vai tro nguoi dung
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!in_array($request->user()->role, $roles)) {
            abort(403, 'Ban khong co quyen thuc hien thao tac nay.');
        }
        return $next($request);
    }
}
// Dang ky: 'role' => CheckRole::class
// Su dung: middleware('role:admin,coordinator')

// 2. CheckAccountStatus - Kiem tra trang thai tai khoan
class CheckAccountStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user->status === 'suspended') {
            abort(403, 'Tai khoan cua ban da bi tam khoa.');
        }
        if ($user->status === 'banned') {
            abort(403, 'Tai khoan cua ban da bi cam.');
        }
        return $next($request);
    }
}
// Dang ky: 'account.active' => CheckAccountStatus::class

// 3. CheckEmployerVerified - Kiem tra NTD da xac minh
class CheckEmployerVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()->role === 'employer') {
            $employer = $request->user()->employer;
            if (!$employer || !$employer->verified) {
                abort(403, 'Tai khoan doanh nghiep chua duoc xac minh.');
            }
        }
        return $next($request);
    }
}
// Dang ky: 'employer.verified' => CheckEmployerVerified::class

// 4. CheckResourceOwnership - Kiem tra quyen so huu tai nguyen
class CheckResourceOwnership
{
    public function handle(Request $request, Closure $next, string $model, string $ownerField = 'user_id'): Response
    {
        $resource = $request->route($model);
        if ($resource && $resource->{$ownerField} !== $request->user()->id) {
            if (!in_array($request->user()->role, ['admin', 'coordinator'])) {
                abort(403, 'Ban khong co quyen truy cap tai nguyen nay.');
            }
        }
        return $next($request);
    }
}
// Dang ky: 'owns' => CheckResourceOwnership::class

// 5. LogApiRequest - Ghi log API request
class LogApiRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($request->user()) {
            AuditLog::create([
                'user_id'     => $request->user()->id,
                'action'      => $request->method() . ' ' . $request->path(),
                'entity_type' => $this->extractEntityType($request),
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);
        }

        return $response;
    }
}
// Dang ky: 'log.api' => LogApiRequest::class

// 6. ForceJson - Bat buoc response JSON
class ForceJson
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');
        return $next($request);
    }
}
// Dang ky: 'json' => ForceJson::class
```

### 8.2 Auth Guards Configuration

```php
// config/auth.php

'defaults' => [
    'guard' => 'api',
],

'guards' => [
    'api' => [
        'driver'   => 'sanctum',
        'provider' => 'users',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model'  => App\Models\User::class,
    ],
],

// Sanctum config (config/sanctum.php)
'expiration' => 60 * 24 * 30,  // Token het han sau 30 ngay
'token_prefix' => '',
```

### 8.3 Rate Limiting Rules

```php
// app/Providers/RouteServiceProvider.php (hoac bootstrap/app.php cho Laravel 11)

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('auth', function (Request $request) {
    return Limit::perMinute(10)->by($request->ip());
});

RateLimiter::for('otp', function (Request $request) {
    return [
        Limit::perMinute(3)->by($request->ip()),             // 3 lan/phut theo IP
        Limit::perMinute(5)->by($request->input('phone')),   // 5 lan/phut theo SĐT
    ];
});

RateLimiter::for('upload', function (Request $request) {
    return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('report', function (Request $request) {
    return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('search', function (Request $request) {
    return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
});
```

### 8.4 Middleware Groups (routes)

```php
// bootstrap/app.php (Laravel 11)

->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role'              => CheckRole::class,
        'account.active'    => CheckAccountStatus::class,
        'employer.verified' => CheckEmployerVerified::class,
        'owns'              => CheckResourceOwnership::class,
        'log.api'           => LogApiRequest::class,
        'json'              => ForceJson::class,
    ]);

    $middleware->api(prepend: [
        ForceJson::class,
    ]);
})

// Route groups

// Public routes (khong can auth)
Route::middleware(['throttle:api'])->group(function () {
    Route::prefix('auth')->group(/* auth routes */);
    Route::get('jobs', [JobPostController::class, 'index']);
    Route::get('jobs/{id}', [JobPostController::class, 'show']);
    Route::get('dormitories', [DormitoryController::class, 'index']);
    Route::get('dormitories/{id}', [DormitoryController::class, 'show']);
    Route::get('regions', [RegionController::class, 'index']);
});

// Authenticated routes
Route::middleware(['auth:sanctum', 'account.active', 'log.api'])->group(function () {
    // Profile
    Route::prefix('profile')->group(/* profile routes */);

    // Worker routes
    Route::middleware(['role:worker'])->group(/* worker routes */);

    // Employer routes
    Route::middleware(['role:employer', 'employer.verified'])->group(/* employer routes */);

    // Landlord routes
    Route::middleware(['role:landlord'])->group(/* landlord routes */);

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->group(/* admin routes */);

    // Coordinator routes
    Route::middleware(['role:admin,coordinator'])->group(/* coordinator routes */);
});
```

---

> **Ghi chu:** Document nay la ban thiet ke chi tiet, code-ready. Tat ca cac endpoint, model, validation, service deu duoc thiet ke dua tren cac use cases va database schema da duoc phan tich trong tai lieu du an. Khi implement, can bo sung unit tests, integration tests, va API documentation tu dong (Swagger/OpenAPI).
