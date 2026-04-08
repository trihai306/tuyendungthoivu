# Danh Sach Modules - He Thong Cung Ung Nhan Su Thoi Vu

> **Phien ban:** 2.0  
> **Ngay cap nhat:** 2026-04-08  
> **Tac gia:** BA Team  
> **Trang thai:** Draft

---

## Tong Quan Modules

He thong gom 9 modules chinh, moi module phuc vu mot mang nghiep vu rieng biet nhung lien ket chat che voi nhau.

| # | Module | Ma | Do uu tien (MVP) |
|---|--------|----|------------------|
| 1 | Dashboard | MOD-DASH | P0 - Core |
| 2 | Quan ly Khach hang | MOD-CLI | P0 - Core |
| 3 | Quan ly Don hang nhan su | MOD-ORD | P0 - Core |
| 4 | Quan ly Pool Lao dong | MOD-WRK | P0 - Core |
| 5 | Phan cong & Dieu phoi | MOD-ASG | P0 - Core |
| 6 | Cham cong & Bao cao | MOD-ATT | P0 - Core |
| 7 | Quan ly Nhan vien noi bo | MOD-STF | P1 - Important |
| 8 | Tai chinh & Thanh toan | MOD-FIN | P1 - Important |
| 9 | Cai dat & Phan quyen | MOD-SYS | P0 - Core |

---

## Module 1: Dashboard (MOD-DASH)

### Muc dich
Cung cap cai nhin tong quan ve tinh hinh hoat dong, giup Manager va Admin ra quyet dinh nhanh.

### Thanh phan chinh

#### 1.1 Dashboard Manager/Admin
| Thanh phan | Mo ta | Kieu hien thi |
|------------|-------|---------------|
| Don hang hom nay | So don hang moi, dang xu ly, can xu ly gap | Card + so |
| Workers dang lam viec | So workers dang check-in hom nay | Card + so |
| Fill rate | Ty le dap ung don hang (tuan/thang) | Gauge chart |
| Doanh thu | Doanh thu thang, so sanh thang truoc | Line chart |
| Don hang can chu y | Don hang gap chua du nguoi, sap den han | Table canh bao |
| Hoat dong gan day | Timeline cac hanh dong moi nhat | Activity feed |
| Top workers | Workers co danh gia cao nhat | Leaderboard |
| Cong no | Tong cong no chua thu | Card + so |

#### 1.2 Dashboard Recruiter
| Thanh phan | Mo ta |
|------------|-------|
| Don hang cua toi | Danh sach don hang duoc phan cong, trang thai |
| Viec can lam hom nay | Check-in workers, re-confirm ngay mai |
| Workers cua toi | So workers dang quan ly, trang thai |
| Thong bao | Canh bao va nhac nho |

#### 1.3 Dashboard Sales
| Thanh phan | Mo ta |
|------------|-------|
| Khach hang cua toi | Danh sach khach hang, don hang gan day |
| Don hang da tao | Trang thai cac don hang da tao |
| Chi tieu thang | Doanh thu vs target |

### API Endpoints
```
GET /api/v1/dashboard/overview          # Tong quan cho Admin/Manager
GET /api/v1/dashboard/recruiter         # Dashboard Recruiter
GET /api/v1/dashboard/sales             # Dashboard Sales
GET /api/v1/dashboard/stats             # Thong ke chi tiet (co filter)
```

---

## Module 2: Quan Ly Khach Hang (MOD-CLI)

### Muc dich
Quan ly thong tin khach hang (doanh nghiep) su dung dich vu cung ung nhan su.

### Chuc nang

| # | Chuc nang | Mo ta | Actor |
|---|-----------|-------|-------|
| 2.1 | Danh sach khach hang | Xem, tim kiem, loc danh sach | Sales, Manager, Admin |
| 2.2 | Tao khach hang moi | Nhap thong tin doanh nghiep | Sales, Manager, Admin |
| 2.3 | Chi tiet khach hang | Xem/sua thong tin, lich su don hang | Sales, Manager, Admin |
| 2.4 | Quan ly hop dong | Tao, sua, duyet hop dong khung | Sales, Manager, Admin |
| 2.5 | Quan ly lien he | Nhieu nguoi lien he / khach hang | Sales, Manager |
| 2.6 | Ghi chu noi bo | Notes ve khach hang | Sales, Manager |

### Du lieu khach hang

```
Client {
  id                  // PK
  company_name        // Ten cong ty (bat buoc)
  tax_code            // Ma so thue (unique)
  address             // Dia chi
  district            // Quan/Huyen
  city                // Tinh/Thanh pho
  industry            // Nganh nghe
  company_size        // Quy mo (nho/vua/lon)
  status              // Active / Inactive / Prospect
  notes               // Ghi chu
  created_by          // User tao
  created_at
  updated_at
}

ClientContact {
  id
  client_id           // FK -> Client
  name                // Ten nguoi lien he
  position            // Chuc vu
  phone               // SDT
  email               // Email
  is_primary          // La lien he chinh?
  notes
}

ClientContract {
  id
  client_id           // FK -> Client
  contract_number     // So hop dong
  type                // Khung / Theo don hang
  start_date          // Ngay bat dau
  end_date            // Ngay ket thuc
  markup_percentage   // % markup
  payment_terms       // Dieu khoan thanh toan (7/15/30 ngay)
  status              // Draft / Active / Expired / Terminated
  file_url            // File hop dong scan
  notes
  approved_by         // Manager duyet
  approved_at
}
```

### API Endpoints
```
GET    /api/v1/clients                  # Danh sach (co pagination, filter)
POST   /api/v1/clients                  # Tao moi
GET    /api/v1/clients/{id}             # Chi tiet
PUT    /api/v1/clients/{id}             # Cap nhat
DELETE /api/v1/clients/{id}             # Xoa mem

GET    /api/v1/clients/{id}/contacts    # Danh sach lien he
POST   /api/v1/clients/{id}/contacts    # Them lien he
PUT    /api/v1/clients/{id}/contacts/{contactId}  # Sua lien he

GET    /api/v1/clients/{id}/contracts   # Danh sach hop dong
POST   /api/v1/clients/{id}/contracts   # Tao hop dong
PUT    /api/v1/clients/{id}/contracts/{contractId}  # Sua hop dong
PATCH  /api/v1/clients/{id}/contracts/{contractId}/approve  # Duyet hop dong

GET    /api/v1/clients/{id}/orders      # Lich su don hang cua khach hang
GET    /api/v1/clients/{id}/stats       # Thong ke khach hang
```

### UI Screens
1. **ClientList** - Danh sach khach hang voi bo loc (trang thai, nganh nghe, khu vuc), tim kiem, pagination
2. **ClientCreate** - Form tao khach hang moi
3. **ClientDetail** - Tab view: Thong tin | Lien he | Hop dong | Don hang | Ghi chu
4. **ContractCreate** - Form tao/sua hop dong

---

## Module 3: Quan Ly Don Hang Nhan Su (MOD-ORD)

### Muc dich
Quan ly toan bo vong doi cua don hang nhan su, tu khi tiep nhan yeu cau den khi hoan thanh.

### Chuc nang

| # | Chuc nang | Mo ta | Actor |
|---|-----------|-------|-------|
| 3.1 | Danh sach don hang | Xem, loc, tim kiem don hang | All (theo quyen) |
| 3.2 | Tao don hang | Nhap don hang nhan su moi | Sales, Manager |
| 3.3 | Duyet don hang | Phe duyet hoac tu choi | Manager, Admin |
| 3.4 | Phan cong Recruiter | Chi dinh Recruiter xu ly | Manager |
| 3.5 | Chi tiet don hang | Xem tien do, danh sach workers | All (theo quyen) |
| 3.6 | Cap nhat trang thai | Chuyen trang thai don hang | Manager, Recruiter |
| 3.7 | Huy don hang | Huy voi ly do | Manager, Admin |

### Trang thai don hang (Order Status)

```
                                 +---> [Tu choi]
                                 |
[Nhap] ---> [Cho duyet] ---> [Da duyet] ---> [Dang tuyen] ---> [Da du nguoi]
                                                                      |
                                                                      v
                                                               [Dang thuc hien]
                                                                      |
                                                                      v
                                                               [Hoan thanh]

  * Bat ky trang thai nao (tru Hoan thanh) co the chuyen sang [Huy bo]
```

### Du lieu don hang

```
StaffingOrder {
  id
  order_code          // Ma don hang (auto: DH-YYYYMMDD-XXX)
  client_id           // FK -> Client
  client_contact_id   // FK -> ClientContact (nguoi yeu cau)
  contract_id         // FK -> ClientContract (nullable)

  // Thong tin cong viec
  position_name       // Ten vi tri (VD: "Cong nhan boc xep")
  job_description     // Mo ta cong viec chi tiet
  work_address        // Dia chi lam viec cu the
  work_district       // Quan/Huyen
  work_city           // Tinh/Thanh pho

  // So luong & yeu cau
  quantity_needed     // So luong workers can
  quantity_filled     // So luong da dap ung (auto update)
  required_skills[]   // Ky nang yeu cau (FK -> Skill)
  gender_requirement  // Nam / Nu / Khong yeu cau
  age_min             // Do tuoi toi thieu
  age_max             // Do tuoi toi da
  other_requirements  // Yeu cau khac (text)

  // Thoi gian
  start_date          // Ngay bat dau
  end_date            // Ngay ket thuc
  shift_type          // Sang / Chieu / Toi / Ca kep / Lien tuc
  start_time          // Gio bat dau ca
  end_time            // Gio ket thuc ca
  break_minutes       // Thoi gian nghi (phut)

  // Tai chinh
  worker_rate         // Don gia tra worker (VND/gio hoac VND/ca)
  rate_type           // hourly / daily / shift
  service_fee         // Phi dich vu (VND hoac %)
  overtime_rate       // Don gia tang ca

  // Quan ly
  urgency             // normal / urgent / critical
  status              // draft / pending / approved / rejected / recruiting / filled / in_progress / completed / cancelled
  assigned_recruiter_id  // FK -> User (Recruiter duoc phan cong)
  created_by          // FK -> User (Sales tao)
  approved_by         // FK -> User (Manager duyet)
  approved_at
  rejection_reason    // Ly do tu choi
  cancellation_reason // Ly do huy
  notes               // Ghi chu noi bo
  created_at
  updated_at
}
```

### API Endpoints
```
GET    /api/v1/orders                           # Danh sach (pagination, filter)
POST   /api/v1/orders                           # Tao moi
GET    /api/v1/orders/{id}                      # Chi tiet
PUT    /api/v1/orders/{id}                      # Cap nhat
PATCH  /api/v1/orders/{id}/approve              # Duyet
PATCH  /api/v1/orders/{id}/reject               # Tu choi
PATCH  /api/v1/orders/{id}/assign-recruiter     # Phan cong Recruiter
PATCH  /api/v1/orders/{id}/cancel               # Huy
PATCH  /api/v1/orders/{id}/status               # Chuyen trang thai

GET    /api/v1/orders/{id}/assignments          # Danh sach workers da phan cong
GET    /api/v1/orders/{id}/attendance            # Cham cong don hang
GET    /api/v1/orders/{id}/timeline              # Lich su hanh dong (audit)
```

### UI Screens
1. **OrderList** - Danh sach don hang, filter (trang thai, khach hang, Recruiter, do khan cap, khoang thoi gian)
2. **OrderCreate** - Form tao don hang (wizard multi-step)
3. **OrderDetail** - Tab view: Thong tin | Workers (phan cong) | Cham cong | Timeline | Tai chinh
4. **OrderApproval** - Giao dien duyet don hang cho Manager

---

## Module 4: Quan Ly Pool Lao Dong (MOD-WRK)

### Muc dich
Quan ly thong tin, ky nang, trang thai va lich su lam viec cua toan bo workers.

### Chuc nang

| # | Chuc nang | Mo ta | Actor |
|---|-----------|-------|-------|
| 4.1 | Danh sach workers | Xem, loc, tim kiem | Recruiter, Manager |
| 4.2 | Them worker moi | Nhap thong tin worker | Recruiter |
| 4.3 | Chi tiet worker | Xem/sua thong tin, lich su | Recruiter, Manager |
| 4.4 | Quan ly ky nang | Gan/go ky nang cho worker | Recruiter |
| 4.5 | Danh gia worker | Cham diem sau moi don hang | Recruiter |
| 4.6 | Quan ly trang thai | Kha dung/Tam nghi/Blacklist | Recruiter, Manager |
| 4.7 | Lich su lam viec | Xem lich su don hang da tham gia | Recruiter, Manager |
| 4.8 | Danh muc ky nang | Quan ly danh sach ky nang | Admin, Manager |

### Du lieu worker

```
Worker {
  id
  worker_code         // Ma worker (auto: WK-XXXXX)

  // Thong tin ca nhan
  full_name           // Ho ten
  date_of_birth       // Ngay sinh
  gender              // Nam / Nu
  id_number           // So CCCD/CMND (unique)
  id_card_front_url   // Anh CCCD mat truoc
  id_card_back_url    // Anh CCCD mat sau
  phone               // SDT (unique)
  email               // Email (nullable)
  address             // Dia chi
  district            // Quan/Huyen
  city                // Tinh/Thanh pho
  avatar_url          // Anh chan dung

  // Thong tin lao dong
  skills[]            // FK -> Skill (nhieu ky nang)
  experience_notes    // Mo ta kinh nghiem
  preferred_districts[] // Khu vuc muon lam viec
  availability        // full_time / part_time / weekends_only

  // Thong tin ngan hang
  bank_name           // Ten ngan hang
  bank_account        // So tai khoan
  bank_account_name   // Ten chu tai khoan

  // Thong ke (auto-calculated)
  total_orders        // Tong so don hang da tham gia
  total_days_worked   // Tong so ngay da lam
  average_rating      // Diem danh gia trung binh (1-5)
  no_show_count       // So lan no-show
  last_worked_date    // Ngay lam viec gan nhat

  // Trang thai
  status              // available / assigned / inactive / blacklisted
  blacklist_reason    // Ly do blacklist
  registered_by       // FK -> User (Recruiter dang ky)
  notes               // Ghi chu
  created_at
  updated_at
}

WorkerRating {
  id
  worker_id           // FK -> Worker
  order_id            // FK -> StaffingOrder
  rated_by            // FK -> User (Recruiter)
  overall_score       // 1-5
  punctuality         // 1-5 (Dung gio)
  skill_level         // 1-5 (Ky nang)
  attitude            // 1-5 (Thai do)
  diligence           // 1-5 (Cham chi)
  comment             // Nhan xet
  created_at
}

Skill {
  id
  name                // Ten ky nang (VD: "Boc xep", "Phu ban")
  category            // Nhom ky nang
  description
  is_active
}
```

### API Endpoints
```
GET    /api/v1/workers                          # Danh sach (pagination, filter phuc tap)
POST   /api/v1/workers                          # Them moi
GET    /api/v1/workers/{id}                     # Chi tiet
PUT    /api/v1/workers/{id}                     # Cap nhat
PATCH  /api/v1/workers/{id}/status              # Doi trang thai

GET    /api/v1/workers/{id}/assignments         # Lich su don hang
GET    /api/v1/workers/{id}/ratings             # Lich su danh gia
POST   /api/v1/workers/{id}/ratings             # Them danh gia
GET    /api/v1/workers/{id}/attendance          # Lich su cham cong

GET    /api/v1/workers/available                # Workers kha dung (cho phan cong)
GET    /api/v1/workers/suggest?order_id={id}    # Goi y workers cho don hang

GET    /api/v1/skills                           # Danh muc ky nang
POST   /api/v1/skills                           # Them ky nang
PUT    /api/v1/skills/{id}                      # Sua ky nang
```

### UI Screens
1. **WorkerList** - Danh sach workers, filter (trang thai, ky nang, khu vuc, danh gia, gioi tinh)
2. **WorkerCreate** - Form them worker (voi upload anh CCCD)
3. **WorkerDetail** - Tab view: Thong tin | Ky nang | Lich su lam viec | Danh gia | Cham cong
4. **WorkerSuggest** - Danh sach goi y workers cho don hang (dung trong Module 5)
5. **SkillManagement** - CRUD danh muc ky nang

---

## Module 5: Phan Cong & Dieu Phoi (MOD-ASG)

### Muc dich
Quan ly viec gan workers vao don hang, xac nhan, dieu phoi va xu ly thay the.

### Chuc nang

| # | Chuc nang | Mo ta | Actor |
|---|-----------|-------|-------|
| 5.1 | Phan cong workers | Chon va gan workers cho don hang | Recruiter |
| 5.2 | Xac nhan workers | Ghi nhan worker dong y/tu choi | Recruiter |
| 5.3 | Thay the workers | Tim va gan worker thay the | Recruiter |
| 5.4 | Dieu phoi truoc ca | Gui thong tin, re-confirm | Recruiter |
| 5.5 | Xem lich phan cong | Calendar view cac assignment | Recruiter, Manager |

### Trang thai assignment

```
[Tao moi] ---> [Da lien he] ---> [Da xac nhan] ---> [Dang lam viec] ---> [Hoan thanh]
                    |                   |
                    v                   v
              [Khong lien lac]    [Tu choi / Huy]
                    |                   |
                    v                   v
              [Thay the]          [Thay the]
```

### Du lieu assignment

```
Assignment {
  id
  order_id            // FK -> StaffingOrder
  worker_id           // FK -> Worker
  assigned_by         // FK -> User (Recruiter)

  status              // created / contacted / confirmed / working / completed / rejected / cancelled / no_contact / replaced
  confirmation_note   // Ghi chu khi xac nhan/tu choi
  rejection_reason    // Ly do tu choi

  // Thong tin dieu phoi
  dispatch_info       // Thong tin gui cho worker (dia diem, gio, lien he)
  re_confirmed        // Da re-confirm truoc ngay lam? (boolean)
  re_confirmed_at     // Thoi gian re-confirm

  // Thay the
  replaced_by         // FK -> Assignment (assignment moi thay the)
  replacement_reason  // Ly do thay the

  created_at
  updated_at
}
```

### API Endpoints
```
GET    /api/v1/assignments                              # Danh sach
POST   /api/v1/orders/{orderId}/assignments             # Tao assignment (phan cong)
PUT    /api/v1/assignments/{id}                         # Cap nhat
PATCH  /api/v1/assignments/{id}/confirm                 # Xac nhan worker dong y
PATCH  /api/v1/assignments/{id}/reject                  # Worker tu choi
PATCH  /api/v1/assignments/{id}/cancel                  # Huy assignment
PATCH  /api/v1/assignments/{id}/replace                 # Thay the worker
PATCH  /api/v1/assignments/{id}/dispatch                # Cap nhat thong tin dieu phoi
PATCH  /api/v1/assignments/{id}/reconfirm               # Re-confirm

POST   /api/v1/orders/{orderId}/assignments/bulk        # Phan cong nhieu workers 1 luc

GET    /api/v1/assignments/calendar                     # Calendar view
GET    /api/v1/assignments/today                        # Assignments hom nay
```

### UI Screens
1. **AssignmentBoard** - Giao dien phan cong workers cho don hang (2 panel: don hang | workers goi y)
2. **AssignmentCalendar** - Lich phan cong dang calendar (theo tuan/thang)
3. **TodayDispatch** - Danh sach assignments hom nay, check-list dieu phoi
4. **ReconfirmList** - Danh sach can re-confirm cho ngay mai

---

## Module 6: Cham Cong & Bao Cao (MOD-ATT)

### Muc dich
Ghi nhan thoi gian lam viec cua workers, tong hop va xuat bao cao.

### Chuc nang

| # | Chuc nang | Mo ta | Actor |
|---|-----------|-------|-------|
| 6.1 | Check-in | Ghi nhan worker bat dau lam | Recruiter |
| 6.2 | Check-out | Ghi nhan worker ket thuc lam | Recruiter |
| 6.3 | Bang cham cong | Xem/sua cham cong theo don hang | Recruiter, Manager |
| 6.4 | Duyet cham cong | Manager duyet cham cong da tong hop | Manager |
| 6.5 | Bao cao don hang | Xuat bao cao cham cong cho khach hang | Recruiter, Manager |
| 6.6 | Bao cao tong hop | Bao cao theo ky: tuan/thang | Manager, Admin |

### Du lieu cham cong

```
Attendance {
  id
  assignment_id       // FK -> Assignment
  worker_id           // FK -> Worker
  order_id            // FK -> StaffingOrder
  work_date           // Ngay lam viec

  check_in_time       // Gio check-in
  check_in_by         // FK -> User (Recruiter ghi nhan)
  check_in_note       // Ghi chu (tre, ...)

  check_out_time      // Gio check-out
  check_out_by        // FK -> User
  check_out_note      // Ghi chu

  break_minutes       // Thoi gian nghi (phut)
  total_hours         // Tong gio lam (auto: check_out - check_in - break)
  overtime_hours      // Gio tang ca (auto)
  status              // present / late / absent / half_day / excused
  
  // Duyet
  is_approved         // Da duyet?
  approved_by         // FK -> User (Manager)
  approved_at
  
  adjustment_reason   // Ly do chinh sua (neu co)
  created_at
  updated_at
}
```

### API Endpoints
```
POST   /api/v1/attendance/check-in                      # Check-in 1 worker
POST   /api/v1/attendance/check-out                     # Check-out 1 worker
POST   /api/v1/attendance/bulk-check-in                 # Check-in nhieu workers
POST   /api/v1/attendance/bulk-check-out                # Check-out nhieu workers
PUT    /api/v1/attendance/{id}                           # Chinh sua cham cong
PATCH  /api/v1/attendance/{id}/approve                   # Duyet

GET    /api/v1/orders/{orderId}/attendance               # Cham cong theo don hang
GET    /api/v1/orders/{orderId}/attendance/summary       # Tong hop cham cong don hang
GET    /api/v1/workers/{workerId}/attendance             # Cham cong theo worker

GET    /api/v1/reports/attendance/daily                  # Bao cao ngay
GET    /api/v1/reports/attendance/weekly                 # Bao cao tuan
GET    /api/v1/reports/attendance/monthly                # Bao cao thang
GET    /api/v1/reports/attendance/export                 # Xuat Excel/PDF

POST   /api/v1/attendance/approve-batch                  # Duyet hang loat
```

### UI Screens
1. **DailyAttendance** - Giao dien cham cong trong ngay (danh sach workers theo don hang, tick check-in/out)
2. **AttendanceSheet** - Bang cham cong don hang (dang bang: worker x ngay)
3. **AttendanceApproval** - Giao dien duyet cham cong cho Manager
4. **AttendanceReport** - Bao cao cham cong (filter theo don hang, worker, thoi gian)
5. **ExportReport** - Xuat bao cao PDF/Excel cho khach hang

---

## Module 7: Quan Ly Nhan Vien Noi Bo (MOD-STF)

### Muc dich
Quan ly thong tin va hieu suat lam viec cua nhan vien cong ty (Sales, Recruiter, Accountant).

### Chuc nang

| # | Chuc nang | Mo ta | Actor |
|---|-----------|-------|-------|
| 7.1 | Danh sach nhan vien | Xem, tim kiem nhan vien | Manager, Admin |
| 7.2 | Them nhan vien | Tao tai khoan nhan vien moi | Admin |
| 7.3 | Chi tiet nhan vien | Xem/sua thong tin, vai tro | Admin |
| 7.4 | KPI Dashboard | Xem KPI theo vai tro | Manager, Admin |
| 7.5 | Phan cong khu vuc | Gan khu vuc phu trach cho Recruiter | Manager |

### Du lieu nhan vien

```
Staff (ke thua User) {
  id
  user_id             // FK -> User
  employee_code       // Ma nhan vien
  department          // Phong ban
  position            // Chuc vu
  phone
  joined_date         // Ngay vao lam
  managed_districts[] // Khu vuc phu trach (Recruiter)
  is_active
  notes
}
```

### API Endpoints
```
GET    /api/v1/staff                            # Danh sach
POST   /api/v1/staff                            # Them moi
GET    /api/v1/staff/{id}                       # Chi tiet
PUT    /api/v1/staff/{id}                       # Cap nhat
GET    /api/v1/staff/{id}/kpi                   # KPI ca nhan
GET    /api/v1/staff/kpi/overview               # KPI tong quan
GET    /api/v1/staff/{id}/orders                # Don hang da xu ly
```

### UI Screens
1. **StaffList** - Danh sach nhan vien, filter theo vai tro, phong ban
2. **StaffCreate** - Form tao nhan vien moi (bao gom tao tai khoan)
3. **StaffDetail** - Thong tin nhan vien + KPI + lich su cong viec
4. **KPIDashboard** - Bieu do KPI cac nhan vien

---

## Module 8: Tai Chinh & Thanh Toan (MOD-FIN)

### Muc dich
Quan ly luong workers, hoa don khach hang, cong no va doi soat.

### Chuc nang

| # | Chuc nang | Mo ta | Actor |
|---|-----------|-------|-------|
| 8.1 | Tinh luong workers | Tu dong tu cham cong | Accountant |
| 8.2 | Duyet bang luong | Review va phe duyet | Manager |
| 8.3 | Chi tra luong | Xuat danh sach chuyen khoan | Accountant |
| 8.4 | Tao hoa don | Xuat hoa don cho khach hang | Accountant |
| 8.5 | Theo doi cong no | Ghi nhan thanh toan, canh bao | Accountant |
| 8.6 | Doi soat | Doi chieu thu chi hang thang | Accountant, Manager |
| 8.7 | Bao cao tai chinh | Doanh thu, loi nhuan, cong no | Manager, Admin |

### Du lieu tai chinh

```
Payroll {
  id
  period_start        // Ky tu ngay
  period_end          // Ky den ngay
  worker_id           // FK -> Worker
  
  total_hours         // Tong gio lam
  regular_hours       // Gio thuong
  overtime_hours      // Gio tang ca
  
  regular_amount      // Luong thuong
  overtime_amount     // Luong tang ca
  allowance_amount    // Phu cap
  deduction_amount    // Khau tru
  net_amount          // Thuc lanh
  
  status              // draft / reviewed / approved / paid
  approved_by
  paid_at
  payment_reference   // Ma giao dich chuyen khoan
  notes
}

Invoice {
  id
  invoice_number      // So hoa don (auto)
  client_id           // FK -> Client
  period_start
  period_end
  
  subtotal            // Tong truoc thue
  tax_amount          // Thue
  total_amount        // Tong sau thue
  
  status              // draft / approved / sent / partially_paid / paid / overdue
  due_date            // Han thanh toan
  paid_amount         // So da thanh toan
  
  approved_by
  sent_at
  notes
}

InvoiceItem {
  id
  invoice_id          // FK -> Invoice
  order_id            // FK -> StaffingOrder
  description         // Mo ta (ten don hang, vi tri)
  quantity            // So gio/cong
  unit_price          // Don gia
  amount              // Thanh tien
}

Payment {
  id
  invoice_id          // FK -> Invoice
  amount              // So tien thanh toan
  payment_date        // Ngay thanh toan
  payment_method      // Chuyen khoan / Tien mat
  reference           // Ma giao dich
  notes
  recorded_by         // FK -> User
}
```

### API Endpoints
```
# Payroll
GET    /api/v1/payroll                          # Danh sach bang luong
POST   /api/v1/payroll/calculate                # Tinh luong cho ky
GET    /api/v1/payroll/{id}                     # Chi tiet
PATCH  /api/v1/payroll/{id}/approve             # Duyet
PATCH  /api/v1/payroll/{id}/mark-paid           # Danh dau da tra
GET    /api/v1/payroll/export                   # Xuat file chuyen khoan

# Invoice
GET    /api/v1/invoices                         # Danh sach hoa don
POST   /api/v1/invoices                         # Tao hoa don
GET    /api/v1/invoices/{id}                    # Chi tiet
PATCH  /api/v1/invoices/{id}/approve            # Duyet
PATCH  /api/v1/invoices/{id}/send               # Danh dau da gui
GET    /api/v1/invoices/{id}/pdf                # Xuat PDF

# Payment
POST   /api/v1/invoices/{id}/payments           # Ghi nhan thanh toan
GET    /api/v1/invoices/{id}/payments           # Lich su thanh toan

# Reports
GET    /api/v1/finance/revenue                  # Bao cao doanh thu
GET    /api/v1/finance/receivables              # Cong no phai thu
GET    /api/v1/finance/payables                 # Cong no phai tra (luong workers)
GET    /api/v1/finance/profit-loss              # Lai lo
GET    /api/v1/finance/reconciliation           # Doi soat
```

### UI Screens
1. **PayrollList** - Danh sach bang luong theo ky, filter
2. **PayrollCalculate** - Giao dien tinh luong (chon ky, review, duyet)
3. **PayrollDetail** - Chi tiet luong tung worker
4. **InvoiceList** - Danh sach hoa don, filter (trang thai, khach hang)
5. **InvoiceCreate** - Tao hoa don (tu dong tu du lieu don hang)
6. **InvoiceDetail** - Chi tiet hoa don + lich su thanh toan
7. **ReceivablesReport** - Bao cao cong no phai thu
8. **FinanceDashboard** - Tong quan tai chinh (doanh thu, lai lo, cong no)

---

## Module 9: Cai Dat & Phan Quyen (MOD-SYS)

### Muc dich
Quan ly nguoi dung, vai tro, quyen han, va cau hinh he thong.

### Chuc nang

| # | Chuc nang | Mo ta | Actor |
|---|-----------|-------|-------|
| 9.1 | Dang nhap / Dang xuat | Authentication | All |
| 9.2 | Quan ly vai tro | CRUD vai tro va quyen | Admin |
| 9.3 | Quan ly nguoi dung | Tao/sua/khoa tai khoan | Admin |
| 9.4 | Danh muc he thong | Ky nang, khu vuc, ca lam... | Admin, Manager |
| 9.5 | Cau hinh thong bao | Cai dat loai thong bao va kenh | Admin |
| 9.6 | Nhat ky hoat dong | Xem audit log | Admin |
| 9.7 | Doi mat khau | Thay doi mat khau ca nhan | All |
| 9.8 | Ho so ca nhan | Cap nhat thong tin ca nhan | All |

### API Endpoints
```
# Auth
POST   /api/v1/auth/login                      # Dang nhap
POST   /api/v1/auth/logout                     # Dang xuat
POST   /api/v1/auth/forgot-password             # Quen mat khau
POST   /api/v1/auth/reset-password              # Dat lai mat khau
PUT    /api/v1/auth/change-password             # Doi mat khau
GET    /api/v1/auth/me                          # Thong tin user hien tai

# RBAC
GET    /api/v1/roles                            # Danh sach vai tro
POST   /api/v1/roles                            # Tao vai tro
PUT    /api/v1/roles/{id}                       # Sua vai tro
GET    /api/v1/permissions                      # Danh sach quyen

# Users
GET    /api/v1/users                            # Danh sach user
POST   /api/v1/users                            # Tao user
PUT    /api/v1/users/{id}                       # Sua user
PATCH  /api/v1/users/{id}/toggle-active         # Kich hoat/Khoa

# Categories
GET    /api/v1/categories/{type}                # Lay danh muc theo loai
POST   /api/v1/categories                       # Them danh muc
PUT    /api/v1/categories/{id}                  # Sua danh muc

# Activity Log
GET    /api/v1/activity-logs                    # Nhat ky hoat dong

# Notifications
GET    /api/v1/notifications                    # Danh sach thong bao
PATCH  /api/v1/notifications/{id}/read          # Danh dau da doc
PATCH  /api/v1/notifications/read-all           # Doc tat ca
GET    /api/v1/notifications/unread-count       # So thong bao chua doc
```

### UI Screens
1. **Login** - Trang dang nhap
2. **RoleList** - Danh sach vai tro + permission matrix
3. **UserList** - Danh sach nguoi dung, filter vai tro
4. **UserCreate** - Form tao nguoi dung
5. **CategoryManagement** - Quan ly danh muc (tabs: Ky nang | Khu vuc | Ca lam | ...)
6. **ActivityLog** - Bang nhat ky hoat dong (filter user, hanh dong, thoi gian)
7. **NotificationCenter** - Trung tam thong bao
8. **Profile** - Trang ho so ca nhan + doi mat khau
9. **Settings** - Cai dat chung he thong

---

## Lien Ket Giua Cac Modules

```
MOD-CLI (Khach hang) ---[co nhieu]--> MOD-ORD (Don hang)
MOD-ORD (Don hang) ---[phan cong]--> MOD-ASG (Assignment) ---[cho]--> MOD-WRK (Workers)
MOD-ASG (Assignment) ---[ghi nhan]--> MOD-ATT (Cham cong)
MOD-ATT (Cham cong) ---[du lieu cho]--> MOD-FIN (Tai chinh)
MOD-FIN (Tai chinh) ---[hoa don cho]--> MOD-CLI (Khach hang)
MOD-FIN (Tai chinh) ---[luong cho]--> MOD-WRK (Workers)
MOD-STF (Staff) ---[xu ly]--> MOD-ORD + MOD-ASG + MOD-ATT
MOD-SYS (Cai dat) ---[phan quyen]--> Tat ca modules
MOD-DASH (Dashboard) ---[tong hop]--> Tat ca modules
```
