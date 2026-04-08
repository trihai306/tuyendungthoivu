# API Design - He Thong Cung Ung Nhan Su Thoi Vu

> **Phien ban:** 2.0
> **Ngay cap nhat:** 2026-04-08
> **Tac gia:** System Architect
> **Base URL:** `/api/v1`
> **Authentication:** Laravel Sanctum (SPA cookie-based)

---

## 1. Nguyen Tac Chung

### 1.1 Versioning

Tat ca API endpoints su dung prefix `/api/v1/`. Khi co breaking changes, tao version moi `/api/v2/` va duy tri version cu trong thoi gian chuyen doi.

### 1.2 Authentication

- **Method:** Laravel Sanctum (cookie-based SPA authentication)
- **Login flow:** POST `/api/v1/auth/login` -> set session cookie
- **CSRF:** Lay CSRF token qua `GET /sanctum/csrf-cookie` truoc moi request POST/PUT/DELETE
- **Guard:** Moi request can authenticated phai gui cookie `laravel_session`

### 1.3 Authorization

- **RBAC:** Role-based access control (roles: admin, manager, recruiter, sales, accountant, worker)
- **Permissions:** Permission-based (VD: `orders.create`, `workers.view`, `payroll.approve`)
- **Policies:** Laravel Policies kiem tra quyen tai controller level
- **Middleware:** `auth:sanctum` + custom middleware kiem tra role/permission

### 1.4 Response Format Chuan

#### Thanh cong (Single resource)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "staffing_order",
    "attributes": { ... }
  },
  "message": "Tao don hang thanh cong"
}
```

#### Thanh cong (Collection with pagination)
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "type": "worker", "attributes": { ... } },
    { "id": "uuid", "type": "worker", "attributes": { ... } }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8,
    "from": 1,
    "to": 20
  },
  "links": {
    "first": "/api/v1/workers?page=1",
    "last": "/api/v1/workers?page=8",
    "prev": null,
    "next": "/api/v1/workers?page=2"
  }
}
```

#### Loi validation (422)
```json
{
  "success": false,
  "message": "Du lieu khong hop le",
  "errors": {
    "company_name": ["Truong ten cong ty la bat buoc"],
    "phone": ["So dien thoai da ton tai"]
  }
}
```

#### Loi authorization (403)
```json
{
  "success": false,
  "message": "Ban khong co quyen thuc hien hanh dong nay"
}
```

#### Loi not found (404)
```json
{
  "success": false,
  "message": "Khong tim thay don hang"
}
```

#### Loi server (500)
```json
{
  "success": false,
  "message": "Loi he thong, vui long thu lai"
}
```

### 1.5 Pagination

- **Default:** `per_page=20`, `page=1`
- **Max per_page:** 100
- **Query params:** `?page=2&per_page=50`

### 1.6 Filtering

Su dung query parameter voi prefix `filter`:

```
GET /api/v1/orders?filter[status]=recruiting&filter[urgency]=urgent&filter[client_id]=uuid
GET /api/v1/workers?filter[status]=available&filter[city]=Ho Chi Minh&filter[skill_id]=uuid
```

**Date range filtering:**
```
GET /api/v1/orders?filter[start_date_from]=2026-01-01&filter[start_date_to]=2026-03-31
```

### 1.7 Sorting

Su dung query parameter `sort`. Prefix `-` cho descending:

```
GET /api/v1/orders?sort=-created_at          # Moi nhat truoc
GET /api/v1/workers?sort=full_name           # A-Z theo ten
GET /api/v1/orders?sort=-urgency,-created_at # Uu tien gap truoc
```

### 1.8 Including Relations (Eager Loading)

```
GET /api/v1/orders?include=client,recruiter,assignments
GET /api/v1/workers?include=skills,latestRating
```

### 1.9 Searching

Full-text search su dung param `search`:

```
GET /api/v1/workers?search=Nguyen Van
GET /api/v1/clients?search=Cong ty ABC
```

### 1.10 Rate Limiting

| Role | Rate limit |
|------|-----------|
| Admin | 120 requests/minute |
| Manager | 100 requests/minute |
| Staff (Recruiter, Sales, Accountant) | 80 requests/minute |
| Worker | 30 requests/minute |

---

## 2. API Endpoints Chi Tiet

### 2.1 Authentication (MOD-SYS)

| Method | Endpoint | Mo ta | Auth | Role |
|--------|----------|-------|------|------|
| GET | `/sanctum/csrf-cookie` | Lay CSRF token | No | All |
| POST | `/api/v1/auth/login` | Dang nhap | No | All |
| POST | `/api/v1/auth/logout` | Dang xuat | Yes | All |
| GET | `/api/v1/auth/me` | Thong tin user hien tai | Yes | All |
| PUT | `/api/v1/auth/profile` | Cap nhat ho so ca nhan | Yes | All |
| PUT | `/api/v1/auth/change-password` | Doi mat khau | Yes | All |
| POST | `/api/v1/auth/forgot-password` | Gui email reset password | No | All |
| POST | `/api/v1/auth/reset-password` | Dat lai mat khau | No | All |

#### POST /api/v1/auth/login
```
Request:
{
  "email": "admin@company.com",
  "password": "password",
  "remember": true
}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nguyen Van A",
    "email": "admin@company.com",
    "roles": ["admin"],
    "permissions": ["orders.create", "orders.approve", ...]
  },
  "message": "Dang nhap thanh cong"
}
```

---

### 2.2 Quan Ly Khach Hang - Clients (MOD-CLI)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/clients` | Danh sach khach hang | Sales, Manager, Admin |
| POST | `/api/v1/clients` | Tao khach hang moi | Sales, Manager, Admin |
| GET | `/api/v1/clients/{id}` | Chi tiet khach hang | Sales, Manager, Admin |
| PUT | `/api/v1/clients/{id}` | Cap nhat khach hang | Sales, Manager, Admin |
| DELETE | `/api/v1/clients/{id}` | Xoa mem khach hang | Manager, Admin |
| GET | `/api/v1/clients/{id}/stats` | Thong ke khach hang | Sales, Manager, Admin |

#### Contacts

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/clients/{id}/contacts` | Danh sach lien he | Sales, Manager |
| POST | `/api/v1/clients/{id}/contacts` | Them lien he | Sales, Manager |
| PUT | `/api/v1/clients/{clientId}/contacts/{contactId}` | Sua lien he | Sales, Manager |
| DELETE | `/api/v1/clients/{clientId}/contacts/{contactId}` | Xoa lien he | Sales, Manager |

#### Contracts (Hop dong)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/clients/{id}/contracts` | Danh sach hop dong | Sales, Manager, Admin |
| POST | `/api/v1/clients/{id}/contracts` | Tao hop dong | Sales, Manager |
| PUT | `/api/v1/clients/{clientId}/contracts/{contractId}` | Sua hop dong | Sales, Manager |
| PATCH | `/api/v1/clients/{clientId}/contracts/{contractId}/approve` | Duyet hop dong | Manager, Admin |
| GET | `/api/v1/clients/{id}/orders` | Don hang cua khach hang | Sales, Manager, Admin |

#### POST /api/v1/clients
```
Request:
{
  "company_name": "Cong ty TNHH ABC",
  "tax_code": "0123456789",
  "industry": "san_xuat",
  "company_size": "medium",
  "address": "123 Nguyen Hue, Q1",
  "district": "Quan 1",
  "city": "Ho Chi Minh",
  "contact_name": "Tran Van B",
  "contact_phone": "0901234567",
  "contact_email": "b@abc.com",
  "notes": "Khach hang VIP, uu tien"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_name": "Cong ty TNHH ABC",
    "tax_code": "0123456789",
    "status": "prospect",
    ...
  },
  "message": "Tao khach hang thanh cong"
}
```

#### Filters
```
GET /api/v1/clients?filter[status]=active&filter[city]=Ho Chi Minh&filter[industry]=san_xuat&search=ABC
```

---

### 2.3 Quan Ly Don Hang Nhan Su - Staffing Orders (MOD-ORD)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/orders` | Danh sach don hang | All (theo quyen) |
| POST | `/api/v1/orders` | Tao don hang moi | Sales, Manager, Admin |
| GET | `/api/v1/orders/{id}` | Chi tiet don hang | All (theo quyen) |
| PUT | `/api/v1/orders/{id}` | Cap nhat don hang | Sales, Manager (khi draft/pending) |
| DELETE | `/api/v1/orders/{id}` | Xoa mem (chi draft) | Sales, Manager |

#### Workflow Actions

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| PATCH | `/api/v1/orders/{id}/submit` | Gui duyet (draft -> pending) | Sales, Manager |
| PATCH | `/api/v1/orders/{id}/approve` | Duyet don hang (pending -> approved) | Manager, Admin |
| PATCH | `/api/v1/orders/{id}/reject` | Tu choi (pending -> rejected) | Manager, Admin |
| PATCH | `/api/v1/orders/{id}/assign-recruiter` | Phan cong Recruiter | Manager |
| PATCH | `/api/v1/orders/{id}/start-recruiting` | Bat dau tuyen (approved -> recruiting) | Recruiter, Manager |
| PATCH | `/api/v1/orders/{id}/mark-filled` | Da du nguoi (recruiting -> filled) | Recruiter, Manager |
| PATCH | `/api/v1/orders/{id}/start-work` | Bat dau lam viec (filled -> in_progress) | Recruiter, Manager |
| PATCH | `/api/v1/orders/{id}/complete` | Hoan thanh (in_progress -> completed) | Manager |
| PATCH | `/api/v1/orders/{id}/cancel` | Huy don hang | Manager, Admin |

#### Related Resources

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/orders/{id}/assignments` | Workers da phan cong | Recruiter, Manager |
| GET | `/api/v1/orders/{id}/attendance` | Cham cong don hang | Recruiter, Manager |
| GET | `/api/v1/orders/{id}/attendance/summary` | Tong hop cham cong | Recruiter, Manager |
| GET | `/api/v1/orders/{id}/timeline` | Lich su hanh dong (audit) | All |

#### POST /api/v1/orders
```
Request:
{
  "client_id": "uuid",
  "client_contact_id": "uuid",
  "contract_id": "uuid",

  "position_name": "Cong nhan boc xep",
  "job_description": "Boc xep hang hoa tai kho...",
  "work_address": "Kho Tan Cang, Q7",
  "work_district": "Quan 7",
  "work_city": "Ho Chi Minh",

  "quantity_needed": 10,
  "gender_requirement": "male",
  "age_min": 18,
  "age_max": 45,
  "required_skills": ["uuid-skill-1", "uuid-skill-2"],
  "other_requirements": "Suc khoe tot, co kinh nghiem boc xep",

  "start_date": "2026-04-15",
  "end_date": "2026-04-30",
  "shift_type": "morning",
  "start_time": "06:00",
  "end_time": "14:00",
  "break_minutes": 60,

  "worker_rate": 250000,
  "rate_type": "daily",
  "service_fee": 20,
  "service_fee_type": "percent",

  "urgency": "urgent",
  "service_type": "short_term",
  "notes": "Can gap, khach hang VIP"
}
```

#### PATCH /api/v1/orders/{id}/approve
```
Request:
{
  "notes": "Da kiem tra, dong y"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_code": "DH-20260415-001",
    "status": "approved",
    "approved_by": { "id": "uuid", "name": "Manager A" },
    "approved_at": "2026-04-10T10:30:00+07:00"
  },
  "message": "Duyet don hang thanh cong"
}
```

#### PATCH /api/v1/orders/{id}/assign-recruiter
```
Request:
{
  "recruiter_id": "uuid"
}
```

#### Filters
```
GET /api/v1/orders?filter[status]=recruiting&filter[urgency]=urgent&filter[client_id]=uuid&filter[assigned_recruiter_id]=uuid&filter[start_date_from]=2026-04-01&filter[start_date_to]=2026-04-30&sort=-urgency,-created_at
```

---

### 2.4 Quan Ly Pool Workers (MOD-WRK)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/workers` | Danh sach workers | Recruiter, Manager, Admin |
| POST | `/api/v1/workers` | Them worker moi | Recruiter, Manager |
| GET | `/api/v1/workers/{id}` | Chi tiet worker | Recruiter, Manager |
| PUT | `/api/v1/workers/{id}` | Cap nhat thong tin | Recruiter, Manager |
| PATCH | `/api/v1/workers/{id}/status` | Doi trang thai | Recruiter, Manager |
| DELETE | `/api/v1/workers/{id}` | Xoa mem | Manager, Admin |

#### Sub-resources

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/workers/{id}/assignments` | Lich su don hang | Recruiter, Manager |
| GET | `/api/v1/workers/{id}/ratings` | Lich su danh gia | Recruiter, Manager |
| POST | `/api/v1/workers/{id}/ratings` | Them danh gia | Recruiter |
| GET | `/api/v1/workers/{id}/attendance` | Lich su cham cong | Recruiter, Manager |
| GET | `/api/v1/workers/{id}/payroll` | Lich su luong | Accountant, Manager |

#### Special Queries

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/workers/available` | Workers kha dung (de phan cong) | Recruiter, Manager |
| GET | `/api/v1/workers/suggest` | Goi y workers cho don hang | Recruiter, Manager |

#### POST /api/v1/workers
```
Request:
{
  "full_name": "Le Van C",
  "date_of_birth": "1995-03-15",
  "gender": "male",
  "id_number": "079095001234",
  "phone": "0912345678",
  "email": "c@email.com",
  "address": "456 Le Loi, Q5",
  "district": "Quan 5",
  "city": "Ho Chi Minh",
  "skill_ids": ["uuid-1", "uuid-2"],
  "experience_notes": "3 nam boc xep tai kho Tan Cang",
  "preferred_districts": ["Quan 7", "Quan 4", "Quan 8"],
  "availability": "full_time",
  "bank_name": "Vietcombank",
  "bank_account": "1234567890",
  "bank_account_name": "LE VAN C",
  "emergency_contact_name": "Le Thi D",
  "emergency_contact_phone": "0987654321"
}
```

#### GET /api/v1/workers/suggest
```
Query params:
  order_id=uuid          # Don hang can match
  
Response: Danh sach workers sap xep theo muc do phu hop (dua tren ky nang, khu vuc, danh gia, lich ranh)
```

#### PATCH /api/v1/workers/{id}/status
```
Request:
{
  "status": "blacklisted",
  "reason": "No-show 3 lan lien tiep"
}
```

#### Filters
```
GET /api/v1/workers?filter[status]=available&filter[city]=Ho Chi Minh&filter[district]=Quan 7&filter[skill_id]=uuid&filter[gender]=male&filter[rating_min]=3&search=Le Van&sort=-average_rating
```

---

### 2.5 Phan Cong & Dieu Phoi - Assignments (MOD-ASG)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/assignments` | Tat ca assignments | Recruiter, Manager |
| POST | `/api/v1/orders/{orderId}/assignments` | Phan cong 1 worker | Recruiter |
| POST | `/api/v1/orders/{orderId}/assignments/bulk` | Phan cong nhieu workers | Recruiter |
| PUT | `/api/v1/assignments/{id}` | Cap nhat assignment | Recruiter |

#### Workflow Actions

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| PATCH | `/api/v1/assignments/{id}/contact` | Danh dau da lien he | Recruiter |
| PATCH | `/api/v1/assignments/{id}/confirm` | Worker xac nhan dong y | Recruiter |
| PATCH | `/api/v1/assignments/{id}/reject` | Worker tu choi | Recruiter |
| PATCH | `/api/v1/assignments/{id}/cancel` | Huy assignment | Recruiter |
| PATCH | `/api/v1/assignments/{id}/replace` | Thay the worker | Recruiter |
| PATCH | `/api/v1/assignments/{id}/dispatch` | Cap nhat thong tin dieu phoi | Recruiter |
| PATCH | `/api/v1/assignments/{id}/reconfirm` | Re-confirm truoc ngay lam | Recruiter |
| PATCH | `/api/v1/assignments/{id}/start` | Bat dau lam viec | Recruiter |
| PATCH | `/api/v1/assignments/{id}/complete` | Hoan thanh | Recruiter |

#### Special Views

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/assignments/calendar` | Lich phan cong (calendar view) | Recruiter, Manager |
| GET | `/api/v1/assignments/today` | Assignments hom nay | Recruiter |
| GET | `/api/v1/assignments/need-reconfirm` | Can re-confirm cho ngay mai | Recruiter |

#### POST /api/v1/orders/{orderId}/assignments
```
Request:
{
  "worker_id": "uuid",
  "dispatch_info": "Den kho Tan Cang, cong 3, gap anh Tuan (0901...)"
}
```

#### POST /api/v1/orders/{orderId}/assignments/bulk
```
Request:
{
  "worker_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "dispatch_info": "Den kho Tan Cang, cong 3, gap anh Tuan (0901...)"
}

Response (201):
{
  "success": true,
  "data": {
    "created": 3,
    "failed": 0,
    "assignments": [...]
  },
  "message": "Phan cong 3 workers thanh cong"
}
```

#### PATCH /api/v1/assignments/{id}/replace
```
Request:
{
  "replacement_worker_id": "uuid",
  "reason": "Worker goc bi om"
}

Response: Tao assignment moi cho worker thay the, chuyen assignment cu sang status "replaced"
```

---

### 2.6 Cham Cong & Bao Cao - Attendance (MOD-ATT)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| POST | `/api/v1/attendance/check-in` | Check-in 1 worker | Recruiter |
| POST | `/api/v1/attendance/check-out` | Check-out 1 worker | Recruiter |
| POST | `/api/v1/attendance/bulk-check-in` | Check-in nhieu workers | Recruiter |
| POST | `/api/v1/attendance/bulk-check-out` | Check-out nhieu workers | Recruiter |
| PUT | `/api/v1/attendance/{id}` | Chinh sua record cham cong | Recruiter, Manager |
| PATCH | `/api/v1/attendance/{id}/approve` | Duyet 1 record | Manager |
| POST | `/api/v1/attendance/approve-batch` | Duyet hang loat | Manager |

#### By Order

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/orders/{orderId}/attendance` | Cham cong theo don hang | Recruiter, Manager |
| GET | `/api/v1/orders/{orderId}/attendance/summary` | Tong hop cham cong | Recruiter, Manager |
| GET | `/api/v1/orders/{orderId}/attendance/sheet` | Bang cham cong (worker x ngay) | Recruiter, Manager |

#### By Worker

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/workers/{workerId}/attendance` | Cham cong cua worker | Recruiter, Manager |

#### Reports

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/reports/attendance/daily` | Bao cao ngay | Manager, Admin |
| GET | `/api/v1/reports/attendance/weekly` | Bao cao tuan | Manager, Admin |
| GET | `/api/v1/reports/attendance/monthly` | Bao cao thang | Manager, Admin |
| GET | `/api/v1/reports/attendance/export` | Xuat Excel/PDF | Manager, Admin |

#### POST /api/v1/attendance/check-in
```
Request:
{
  "assignment_id": "uuid",
  "check_in_time": "2026-04-15T06:05:00+07:00",
  "note": "Tre 5 phut do ket xe"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "assignment_id": "uuid",
    "worker": { "id": "uuid", "full_name": "Le Van C" },
    "work_date": "2026-04-15",
    "check_in_time": "2026-04-15T06:05:00+07:00",
    "status": "late"
  },
  "message": "Check-in thanh cong"
}
```

#### POST /api/v1/attendance/bulk-check-in
```
Request:
{
  "order_id": "uuid",
  "check_in_time": "2026-04-15T06:00:00+07:00",
  "assignment_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "note": ""
}
```

#### POST /api/v1/attendance/approve-batch
```
Request:
{
  "attendance_ids": ["uuid-1", "uuid-2", "uuid-3"]
}
```

#### GET /api/v1/orders/{orderId}/attendance/summary
```
Response:
{
  "success": true,
  "data": {
    "order_id": "uuid",
    "period": { "from": "2026-04-15", "to": "2026-04-30" },
    "summary": {
      "total_workers": 10,
      "total_work_days": 160,
      "total_present": 148,
      "total_absent": 8,
      "total_late": 4,
      "total_hours": 1280,
      "total_overtime_hours": 32,
      "attendance_rate": 92.5,
      "fill_rate": 100
    },
    "by_worker": [
      {
        "worker_id": "uuid",
        "full_name": "Le Van C",
        "days_worked": 16,
        "days_absent": 0,
        "total_hours": 128,
        "overtime_hours": 4
      }
    ]
  }
}
```

---

### 2.7 Tai Chinh & Thanh Toan - Finance (MOD-FIN)

#### Payroll (Luong)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/payroll` | Danh sach bang luong | Accountant, Manager, Admin |
| POST | `/api/v1/payroll/calculate` | Tinh luong cho ky | Accountant |
| GET | `/api/v1/payroll/{id}` | Chi tiet 1 record | Accountant, Manager |
| PUT | `/api/v1/payroll/{id}` | Chinh sua (khi draft) | Accountant |
| PATCH | `/api/v1/payroll/{id}/review` | Danh dau da review | Accountant |
| PATCH | `/api/v1/payroll/{id}/approve` | Duyet luong | Manager |
| PATCH | `/api/v1/payroll/{id}/mark-paid` | Danh dau da tra | Accountant |
| POST | `/api/v1/payroll/approve-batch` | Duyet hang loat | Manager |
| GET | `/api/v1/payroll/export` | Xuat file chuyen khoan | Accountant |

#### POST /api/v1/payroll/calculate
```
Request:
{
  "period_start": "2026-04-01",
  "period_end": "2026-04-15",
  "order_id": "uuid",                  // nullable - tinh cho 1 don hang
  "worker_ids": ["uuid-1", "uuid-2"]   // nullable - tinh cho tat ca
}

Response (201):
{
  "success": true,
  "data": {
    "created": 10,
    "total_net_amount": 25000000,
    "payrolls": [
      {
        "id": "uuid",
        "worker": { "id": "uuid", "full_name": "Le Van C" },
        "total_days": 15,
        "total_hours": 120,
        "base_amount": 3750000,
        "overtime_amount": 200000,
        "net_amount": 3900000,
        "status": "draft"
      }
    ]
  },
  "message": "Tinh luong thanh cong cho 10 workers"
}
```

#### Invoices (Hoa don)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/invoices` | Danh sach hoa don | Accountant, Manager, Admin |
| POST | `/api/v1/invoices` | Tao hoa don | Accountant |
| GET | `/api/v1/invoices/{id}` | Chi tiet hoa don | Accountant, Manager |
| PUT | `/api/v1/invoices/{id}` | Sua hoa don (khi draft) | Accountant |
| PATCH | `/api/v1/invoices/{id}/approve` | Duyet hoa don | Manager |
| PATCH | `/api/v1/invoices/{id}/send` | Danh dau da gui khach | Accountant |
| GET | `/api/v1/invoices/{id}/pdf` | Xuat PDF | Accountant, Manager |
| DELETE | `/api/v1/invoices/{id}` | Huy hoa don (chi draft) | Accountant |

#### POST /api/v1/invoices
```
Request:
{
  "client_id": "uuid",
  "period_start": "2026-04-01",
  "period_end": "2026-04-15",
  "order_ids": ["uuid-1", "uuid-2"],    // Don hang tinh vao hoa don
  "tax_rate": 10,
  "due_date": "2026-05-01",
  "notes": ""
}

Response: He thong tu dong tao invoice_items tu du lieu cham cong cua cac don hang
```

#### Payments (Thanh toan)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/invoices/{id}/payments` | Lich su thanh toan hoa don | Accountant, Manager |
| POST | `/api/v1/invoices/{id}/payments` | Ghi nhan thanh toan | Accountant |
| GET | `/api/v1/payroll/{id}/payments` | Lich su thanh toan luong | Accountant |
| POST | `/api/v1/payroll/{id}/payments` | Ghi nhan da tra luong | Accountant |

#### POST /api/v1/invoices/{id}/payments
```
Request:
{
  "amount": 15000000,
  "payment_method": "bank_transfer",
  "payment_date": "2026-04-20",
  "reference_number": "VCB-20260420-12345",
  "notes": "Thanh toan dot 1"
}
```

#### Finance Reports

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/finance/revenue` | Bao cao doanh thu | Manager, Admin |
| GET | `/api/v1/finance/receivables` | Cong no phai thu (khach hang) | Accountant, Manager |
| GET | `/api/v1/finance/payables` | Cong no phai tra (luong workers) | Accountant, Manager |
| GET | `/api/v1/finance/profit-loss` | Bao cao lai lo | Manager, Admin |
| GET | `/api/v1/finance/reconciliation` | Doi soat | Accountant, Manager |

#### GET /api/v1/finance/revenue
```
Query: ?period=monthly&year=2026&month=4
       ?period=yearly&year=2026

Response:
{
  "success": true,
  "data": {
    "period": "2026-04",
    "total_revenue": 500000000,
    "total_cost": 380000000,
    "gross_profit": 120000000,
    "margin_percent": 24,
    "by_client": [
      { "client_id": "uuid", "company_name": "ABC", "revenue": 200000000 }
    ],
    "by_service_type": [
      { "type": "short_term", "revenue": 300000000 },
      { "type": "long_term", "revenue": 200000000 }
    ],
    "trend": [
      { "month": "2026-01", "revenue": 400000000 },
      { "month": "2026-02", "revenue": 450000000 },
      { "month": "2026-03", "revenue": 480000000 },
      { "month": "2026-04", "revenue": 500000000 }
    ]
  }
}
```

---

### 2.8 Dashboard (MOD-DASH)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/dashboard/overview` | Tong quan cho Admin/Manager | Manager, Admin |
| GET | `/api/v1/dashboard/recruiter` | Dashboard Recruiter | Recruiter |
| GET | `/api/v1/dashboard/sales` | Dashboard Sales | Sales |
| GET | `/api/v1/dashboard/accountant` | Dashboard Accountant | Accountant |
| GET | `/api/v1/dashboard/stats` | Thong ke chi tiet (co filter) | Manager, Admin |

#### GET /api/v1/dashboard/overview
```
Response:
{
  "success": true,
  "data": {
    "today": {
      "new_orders": 5,
      "active_orders": 23,
      "workers_on_duty": 156,
      "check_in_rate": 94.5
    },
    "this_month": {
      "total_orders": 45,
      "completed_orders": 30,
      "fill_rate": 92.3,
      "revenue": 500000000,
      "revenue_vs_last_month": 4.2
    },
    "alerts": [
      { "type": "urgent_order", "message": "3 don hang gap chua du nguoi", "count": 3 },
      { "type": "overdue_invoice", "message": "2 hoa don qua han", "count": 2 },
      { "type": "no_show", "message": "1 worker no-show hom nay", "count": 1 }
    ],
    "recent_activity": [
      { "action": "order_created", "user": "Sales A", "description": "Tao don hang DH-20260408-001", "at": "2026-04-08T09:00:00" }
    ],
    "top_workers": [
      { "worker_id": "uuid", "full_name": "Le Van C", "average_rating": 4.8, "total_orders": 25 }
    ],
    "receivables": {
      "total": 50000000,
      "overdue": 10000000
    }
  }
}
```

---

### 2.9 Nhan Vien Noi Bo - Staff (MOD-STF)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/staff` | Danh sach nhan vien | Manager, Admin |
| POST | `/api/v1/staff` | Them nhan vien (tao user + role) | Admin |
| GET | `/api/v1/staff/{id}` | Chi tiet nhan vien | Manager, Admin |
| PUT | `/api/v1/staff/{id}` | Cap nhat nhan vien | Admin |
| PATCH | `/api/v1/staff/{id}/toggle-active` | Kich hoat/Khoa | Admin |
| GET | `/api/v1/staff/{id}/kpi` | KPI ca nhan | Manager, Admin |
| GET | `/api/v1/staff/kpi/overview` | KPI tong quan | Manager, Admin |
| GET | `/api/v1/staff/{id}/orders` | Don hang da xu ly | Manager, Admin |

#### GET /api/v1/staff/{id}/kpi
```
Query: ?period=monthly&year=2026&month=4

Response (Recruiter KPI):
{
  "success": true,
  "data": {
    "staff_id": "uuid",
    "name": "Recruiter A",
    "role": "recruiter",
    "period": "2026-04",
    "kpi": {
      "orders_handled": { "value": 12, "target": 15, "percent": 80 },
      "fill_rate": { "value": 94.5, "target": 90, "percent": 105 },
      "workers_dispatched": { "value": 85, "target": 100, "percent": 85 },
      "no_show_rate": { "value": 2.1, "target": 5, "percent": 100 },
      "avg_worker_rating": { "value": 4.2, "target": 4.0, "percent": 105 }
    }
  }
}
```

---

### 2.10 Cai Dat He Thong (MOD-SYS)

#### RBAC

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/roles` | Danh sach vai tro | Admin |
| POST | `/api/v1/roles` | Tao vai tro | Admin |
| PUT | `/api/v1/roles/{id}` | Sua vai tro (+ permissions) | Admin |
| DELETE | `/api/v1/roles/{id}` | Xoa vai tro | Admin |
| GET | `/api/v1/permissions` | Danh sach quyen | Admin |

#### Users

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/users` | Danh sach user | Admin |
| POST | `/api/v1/users` | Tao user | Admin |
| PUT | `/api/v1/users/{id}` | Sua user | Admin |
| PATCH | `/api/v1/users/{id}/toggle-active` | Kich hoat/Khoa | Admin |

#### Categories (Danh muc)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/categories` | Lay danh muc (filter by type) | All |
| POST | `/api/v1/categories` | Them danh muc | Admin, Manager |
| PUT | `/api/v1/categories/{id}` | Sua danh muc | Admin, Manager |
| DELETE | `/api/v1/categories/{id}` | Xoa danh muc | Admin |

#### Skills (Danh muc ky nang)

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/skills` | Danh sach ky nang | All |
| POST | `/api/v1/skills` | Them ky nang | Admin, Manager |
| PUT | `/api/v1/skills/{id}` | Sua ky nang | Admin, Manager |
| DELETE | `/api/v1/skills/{id}` | Xoa ky nang | Admin |

#### Activity Logs

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/activity-logs` | Nhat ky hoat dong | Admin |

#### Notifications

| Method | Endpoint | Mo ta | Role |
|--------|----------|-------|------|
| GET | `/api/v1/notifications` | Danh sach thong bao | All |
| PATCH | `/api/v1/notifications/{id}/read` | Danh dau da doc | All |
| PATCH | `/api/v1/notifications/read-all` | Doc tat ca | All |
| GET | `/api/v1/notifications/unread-count` | So chua doc | All |

---

## 3. Permission Matrix

### 3.1 Danh sach permissions

```
# Clients
clients.view
clients.create
clients.update
clients.delete

# Client Contracts
contracts.view
contracts.create
contracts.update
contracts.approve

# Orders
orders.view
orders.view_all          # Xem tat ca (admin/manager) vs chi cua minh
orders.create
orders.update
orders.approve
orders.reject
orders.assign_recruiter
orders.cancel

# Workers
workers.view
workers.create
workers.update
workers.delete
workers.change_status

# Assignments
assignments.view
assignments.create
assignments.update
assignments.manage_status

# Attendance
attendance.view
attendance.create
attendance.update
attendance.approve

# Payroll
payroll.view
payroll.calculate
payroll.update
payroll.approve
payroll.mark_paid

# Invoices
invoices.view
invoices.create
invoices.update
invoices.approve
invoices.send

# Payments
payments.view
payments.create

# Finance Reports
finance.view_reports

# Staff
staff.view
staff.create
staff.update
staff.manage

# System
system.manage_roles
system.manage_users
system.manage_categories
system.view_logs
system.manage_settings

# Dashboard
dashboard.view_overview
dashboard.view_recruiter
dashboard.view_sales
dashboard.view_accountant
```

### 3.2 Role - Permission mapping

| Permission | Admin | Manager | Recruiter | Sales | Accountant |
|-----------|-------|---------|-----------|-------|------------|
| clients.view | x | x | | x | x |
| clients.create | x | x | | x | |
| clients.update | x | x | | x | |
| clients.delete | x | x | | | |
| contracts.view | x | x | | x | x |
| contracts.create | x | x | | x | |
| contracts.approve | x | x | | | |
| orders.view | x | x | x | x | x |
| orders.view_all | x | x | | | |
| orders.create | x | x | | x | |
| orders.update | x | x | x | x | |
| orders.approve | x | x | | | |
| orders.assign_recruiter | x | x | | | |
| orders.cancel | x | x | | | |
| workers.view | x | x | x | | |
| workers.create | x | x | x | | |
| workers.update | x | x | x | | |
| workers.delete | x | x | | | |
| workers.change_status | x | x | x | | |
| assignments.view | x | x | x | | |
| assignments.create | x | x | x | | |
| assignments.manage_status | x | x | x | | |
| attendance.view | x | x | x | | x |
| attendance.create | x | x | x | | |
| attendance.update | x | x | x | | |
| attendance.approve | x | x | | | |
| payroll.view | x | x | | | x |
| payroll.calculate | x | | | | x |
| payroll.approve | x | x | | | |
| payroll.mark_paid | x | | | | x |
| invoices.view | x | x | | | x |
| invoices.create | x | | | | x |
| invoices.approve | x | x | | | |
| invoices.send | x | | | | x |
| payments.view | x | x | | | x |
| payments.create | x | | | | x |
| finance.view_reports | x | x | | | x |
| staff.view | x | x | | | |
| staff.manage | x | | | | |
| system.* | x | | | | |
| dashboard.view_overview | x | x | | | |
| dashboard.view_recruiter | x | x | x | | |
| dashboard.view_sales | x | x | | x | |
| dashboard.view_accountant | x | x | | | x |

---

## 4. Error Codes

| HTTP Code | Khi nao | Response |
|-----------|---------|----------|
| 200 | Thanh cong (GET, PUT, PATCH) | `{ success: true, data: ... }` |
| 201 | Tao moi thanh cong (POST) | `{ success: true, data: ... }` |
| 204 | Xoa thanh cong (DELETE) | No content |
| 400 | Bad request (input sai format) | `{ success: false, message: "..." }` |
| 401 | Chua dang nhap | `{ success: false, message: "Vui long dang nhap" }` |
| 403 | Khong co quyen | `{ success: false, message: "Khong co quyen" }` |
| 404 | Khong tim thay | `{ success: false, message: "Khong tim thay..." }` |
| 409 | Conflict (VD: trang thai khong hop le de chuyen) | `{ success: false, message: "Khong the duyet don hang o trang thai nay" }` |
| 422 | Validation failed | `{ success: false, message: "...", errors: { ... } }` |
| 429 | Rate limit | `{ success: false, message: "Qua nhieu request" }` |
| 500 | Server error | `{ success: false, message: "Loi he thong" }` |

---

## 5. Webhook / Event Notifications

Cac su kien quan trong se trigger notifications va co the tich hop webhook sau:

| Event | Mo ta | Thong bao cho |
|-------|-------|---------------|
| `order.created` | Don hang moi duoc tao | Manager |
| `order.approved` | Don hang duoc duyet | Sales (nguoi tao), Recruiter (duoc assign) |
| `order.rejected` | Don hang bi tu choi | Sales (nguoi tao) |
| `order.assigned` | Recruiter duoc phan cong | Recruiter |
| `order.filled` | Da du nguoi | Manager, Sales |
| `order.completed` | Don hang hoan thanh | Manager, Sales, Accountant |
| `assignment.confirmed` | Worker xac nhan | Recruiter |
| `assignment.rejected` | Worker tu choi | Recruiter |
| `assignment.no_show` | Worker khong den | Recruiter, Manager |
| `attendance.needs_approval` | Cham cong can duyet | Manager |
| `payroll.approved` | Luong duoc duyet | Accountant |
| `invoice.overdue` | Hoa don qua han | Accountant, Manager |
| `invoice.paid` | Hoa don da thanh toan | Accountant |
