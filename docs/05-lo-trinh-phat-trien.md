# Lo Trinh Phat Trien - He Thong Cung Ung Nhan Su Thoi Vu

> **Phien ban:** 2.0  
> **Ngay cap nhat:** 2026-04-08  
> **Tac gia:** BA Team  
> **Trang thai:** Draft

---

## Tong Quan Lo Trinh

He thong duoc phat trien theo 4 phase, moi phase keo dai 4-6 tuan. Uu tien xay dung luong van hanh cot loi truoc (don hang -> phan cong -> cham cong), sau do bo sung cac module ho tro.

```
Phase 1 (MVP)          Phase 2                Phase 3               Phase 4
Nen tang &             Don hang &             Tai chinh &           Nang cao &
Quan ly co ban         Dieu phoi              Bao cao               Toi uu
[6 tuan]               [6 tuan]               [4 tuan]              [4 tuan]
```

---

## Phase 1: Nen Tang & Quan Ly Co Ban (6 tuan)

### Muc tieu
Xay dung nen tang he thong, authentication, va cac module quan ly co ban (khach hang, workers, nhan vien).

### Sprint 1 (Tuan 1-2): Setup & Authentication

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 1.1 | Setup project (Laravel + React + DB) | Infra | P0 |
| 1.2 | Database schema & migrations (User, Role, Permission) | MOD-SYS | P0 |
| 1.3 | Authentication (Login/Logout/ForgotPassword) | MOD-SYS | P0 |
| 1.4 | RBAC: Roles & Permissions | MOD-SYS | P0 |
| 1.5 | Layout co ban (Sidebar, Header, Breadcrumb) | UI | P0 |
| 1.6 | API base setup (error handling, pagination, validation) | Backend | P0 |

**Output:** User co the dang nhap, phan quyen hoat dong, layout san sang.

### Sprint 2 (Tuan 3-4): Quan Ly Khach Hang & Workers

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 2.1 | DB schema: Client, ClientContact, ClientContract | MOD-CLI | P0 |
| 2.2 | API CRUD Khach hang | MOD-CLI | P0 |
| 2.3 | UI: ClientList, ClientCreate, ClientDetail | MOD-CLI | P0 |
| 2.4 | DB schema: Worker, Skill, WorkerSkill | MOD-WRK | P0 |
| 2.5 | API CRUD Workers | MOD-WRK | P0 |
| 2.6 | UI: WorkerList, WorkerCreate, WorkerDetail | MOD-WRK | P0 |
| 2.7 | Danh muc ky nang (Skill CRUD) | MOD-WRK | P0 |

**Output:** Quan ly duoc khach hang va pool workers tren he thong.

### Sprint 3 (Tuan 5-6): Nhan Vien & Dashboard Co Ban

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 3.1 | DB schema: Staff (extend User) | MOD-STF | P1 |
| 3.2 | API CRUD Nhan vien noi bo | MOD-STF | P1 |
| 3.3 | UI: StaffList, StaffCreate, StaffDetail | MOD-STF | P1 |
| 3.4 | Dashboard co ban (so khach hang, so workers, thong ke don gian) | MOD-DASH | P1 |
| 3.5 | Notification system (in-app) | MOD-SYS | P1 |
| 3.6 | Activity log | MOD-SYS | P1 |
| 3.7 | Ho so ca nhan & doi mat khau | MOD-SYS | P1 |

**Output:** Quan ly nhan vien, dashboard co ban, notification hoat dong.

### Milestone Phase 1
- [x] Dang nhap/phan quyen hoat dong
- [x] CRUD Khach hang (co lien he, hop dong)
- [x] CRUD Workers (co ky nang, trang thai)
- [x] CRUD Nhan vien noi bo
- [x] Dashboard co ban
- [x] Thong bao in-app

---

## Phase 2: Don Hang & Dieu Phoi (6 tuan)

### Muc tieu
Xay dung luong nghiep vu cot loi: don hang -> phan cong -> cham cong.

### Sprint 4 (Tuan 7-8): Quan Ly Don Hang

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 4.1 | DB schema: StaffingOrder | MOD-ORD | P0 |
| 4.2 | API CRUD Don hang | MOD-ORD | P0 |
| 4.3 | UI: OrderList (voi filter trang thai, khach hang, do khan cap) | MOD-ORD | P0 |
| 4.4 | UI: OrderCreate (wizard form) | MOD-ORD | P0 |
| 4.5 | UI: OrderDetail (thong tin + timeline) | MOD-ORD | P0 |
| 4.6 | Workflow duyet don hang (pending -> approved -> rejected) | MOD-ORD | P0 |
| 4.7 | Phan cong Recruiter cho don hang | MOD-ORD | P0 |

**Output:** Tao, duyet, theo doi don hang hoan chinh.

### Sprint 5 (Tuan 9-10): Phan Cong & Dieu Phoi

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 5.1 | DB schema: Assignment | MOD-ASG | P0 |
| 5.2 | API phan cong workers (single + bulk) | MOD-ASG | P0 |
| 5.3 | API goi y workers (suggest) dua tren ky nang, khu vuc, danh gia | MOD-ASG | P0 |
| 5.4 | UI: AssignmentBoard (phan cong workers cho don hang) | MOD-ASG | P0 |
| 5.5 | Workflow assignment (confirm/reject/replace) | MOD-ASG | P0 |
| 5.6 | UI: TodayDispatch (dieu phoi hom nay) | MOD-ASG | P1 |
| 5.7 | Re-confirm truoc ngay lam | MOD-ASG | P1 |

**Output:** Phan cong, xac nhan, dieu phoi workers cho don hang.

### Sprint 6 (Tuan 11-12): Cham Cong

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 6.1 | DB schema: Attendance | MOD-ATT | P0 |
| 6.2 | API check-in / check-out (single + bulk) | MOD-ATT | P0 |
| 6.3 | UI: DailyAttendance (cham cong trong ngay) | MOD-ATT | P0 |
| 6.4 | UI: AttendanceSheet (bang cham cong don hang) | MOD-ATT | P0 |
| 6.5 | Duyet cham cong (Manager) | MOD-ATT | P0 |
| 6.6 | Tu dong tinh tong gio, tang ca | MOD-ATT | P0 |
| 6.7 | Danh gia worker sau don hang | MOD-WRK | P1 |

**Output:** Cham cong, tong hop, duyet cong hoat dong. Ket noi voi module phan cong.

### Milestone Phase 2
- [x] Tao/duyet/phan cong don hang
- [x] Phan cong workers vao don hang
- [x] Goi y workers phu hop
- [x] Cham cong check-in/out
- [x] Tong hop cham cong theo don hang
- [x] Duyet cham cong
- [x] Danh gia workers

---

## Phase 3: Tai Chinh & Bao Cao (4 tuan)

### Muc tieu
Xay dung module tai chinh (tinh luong, hoa don, cong no) va bao cao.

### Sprint 7 (Tuan 13-14): Tinh Luong & Hoa Don

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 7.1 | DB schema: Payroll, Invoice, InvoiceItem, Payment | MOD-FIN | P1 |
| 7.2 | API tinh luong tu dong tu cham cong | MOD-FIN | P1 |
| 7.3 | UI: PayrollList, PayrollCalculate, PayrollDetail | MOD-FIN | P1 |
| 7.4 | Duyet bang luong | MOD-FIN | P1 |
| 7.5 | API tao hoa don tu du lieu don hang | MOD-FIN | P1 |
| 7.6 | UI: InvoiceList, InvoiceCreate, InvoiceDetail | MOD-FIN | P1 |
| 7.7 | Xuat hoa don PDF | MOD-FIN | P1 |

**Output:** Tinh luong, tao hoa don, xuat PDF.

### Sprint 8 (Tuan 15-16): Cong No & Bao Cao

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 8.1 | API ghi nhan thanh toan | MOD-FIN | P1 |
| 8.2 | UI: Theo doi cong no (phai thu, phai tra) | MOD-FIN | P1 |
| 8.3 | Canh bao hoa don qua han | MOD-FIN | P1 |
| 8.4 | Bao cao cham cong xuat Excel/PDF | MOD-ATT | P1 |
| 8.5 | Dashboard nang cao (doanh thu, fill rate, KPI) | MOD-DASH | P1 |
| 8.6 | Bao cao tai chinh (doanh thu, lai lo, cong no) | MOD-FIN | P1 |
| 8.7 | KPI nhan vien | MOD-STF | P2 |

**Output:** Quan ly cong no, bao cao day du, dashboard nang cao.

### Milestone Phase 3
- [x] Tinh luong workers tu dong
- [x] Tao va xuat hoa don
- [x] Theo doi cong no
- [x] Bao cao cham cong xuat file
- [x] Dashboard nang cao voi bieu do
- [x] Bao cao tai chinh

---

## Phase 4: Nang Cao & Toi Uu (4 tuan)

### Muc tieu
Toi uu trai nghiem, bo sung tinh nang nang cao, chuan bi cho production.

### Sprint 9 (Tuan 17-18): UX & Tinh Nang Bo Sung

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 9.1 | Calendar view phan cong (theo tuan/thang) | MOD-ASG | P2 |
| 9.2 | Email notification (don hang moi, canh bao) | MOD-SYS | P2 |
| 9.3 | Xuat bao cao nang cao (nhieu dinh dang) | MOD-ATT/FIN | P2 |
| 9.4 | Tim kiem toan cuc (Global search) | MOD-SYS | P2 |
| 9.5 | Quan ly hop dong khach hang chi tiet | MOD-CLI | P2 |
| 9.6 | Doi soat cuoi ky | MOD-FIN | P2 |

### Sprint 10 (Tuan 19-20): Testing & Production Ready

| # | Task | Module | Do uu tien |
|---|------|--------|------------|
| 10.1 | Integration testing toan bo luong | QA | P0 |
| 10.2 | Performance testing & optimization | QA | P1 |
| 10.3 | Security audit (XSS, CSRF, SQL Injection) | QA | P0 |
| 10.4 | Fix bugs tu testing | Dev | P0 |
| 10.5 | Seed data cho demo/production | Dev | P1 |
| 10.6 | Deploy len staging | DevOps | P0 |
| 10.7 | UAT (User Acceptance Testing) | QA | P0 |
| 10.8 | Deploy production | DevOps | P0 |

### Milestone Phase 4
- [x] Calendar view phan cong
- [x] Email notifications
- [x] Testing hoan tat
- [x] Deploy production

---

## Backlog (Cac Phase Tiep Theo)

Cac tinh nang se phat trien sau khi MVP on dinh:

### Phase 5: Mobile & Worker App
- App mobile cho Workers (React Native)
- GPS check-in voi selfie
- Worker xem lich lam viec, thu nhap tren app
- Push notification cho workers

### Phase 6: Tu Dong Hoa & AI
- Tu dong match workers cho don hang (AI-powered)
- Du doan nhu cau nhan su theo mua vu
- Chatbot ho tro workers
- Tu dong goi y markup toi uu

### Phase 7: Tich Hop
- Tich hop SMS/Zalo OA thong bao
- Tich hop ngan hang (tu dong doi soat chuyen khoan)
- API cho khach hang tu theo doi don hang
- Tich hop ke toan (MISA, Fast...)

### Phase 8: Data & Analytics
- Business Intelligence dashboard
- Bao cao tu dong dinh ky (email)
- Phan tich xu huong nhu cau
- Worker scoring model (du doan uy tin)

---

## Tong Hop Thoi Gian

| Phase | Noi dung | Thoi gian | Tuan |
|-------|----------|-----------|------|
| Phase 1 | Nen tang & Quan ly co ban | 6 tuan | 1-6 |
| Phase 2 | Don hang & Dieu phoi | 6 tuan | 7-12 |
| Phase 3 | Tai chinh & Bao cao | 4 tuan | 13-16 |
| Phase 4 | Nang cao & Toi uu | 4 tuan | 17-20 |
| **Tong** | **MVP hoan chinh** | **20 tuan (~5 thang)** | |

---

## Ma Tran Phu Thuoc Giua Cac Module

Cac module phai duoc phat trien theo thu tu phu thuoc:

```
MOD-SYS (Auth, RBAC) -----> Tat ca module khac
         |
         v
MOD-CLI (Khach hang) + MOD-WRK (Workers) + MOD-STF (Staff)
         |                    |
         v                    v
MOD-ORD (Don hang) ---------> MOD-ASG (Phan cong)
                                   |
                                   v
                              MOD-ATT (Cham cong)
                                   |
                                   v
                              MOD-FIN (Tai chinh)
                                   |
                                   v
                              MOD-DASH (Dashboard - tong hop tu tat ca)
```

**Ghi chu:** MOD-DASH duoc phat trien phien ban co ban som (Phase 1) va nang cap dan qua moi Phase khi co them du lieu tu cac module moi.

---

## Dieu Kien Nghiem Thu Tung Phase

### Phase 1 - Done when:
- Dang nhap thanh cong voi dung vai tro
- CRUD khach hang, workers, nhan vien hoat dong
- Phan quyen chinh xac (Recruiter khong truy cap duoc cai dat)
- Dashboard hien thi so lieu co ban

### Phase 2 - Done when:
- Tao don hang -> Duyet -> Phan cong Recruiter hoat dong
- Phan cong workers -> Xac nhan -> Cham cong hoat dong
- Full flow: don hang -> phan cong -> check-in/out -> tong hop cong
- Canh bao no-show hoat dong

### Phase 3 - Done when:
- Tinh luong tu dong tu cham cong da duyet
- Xuat hoa don PDF chinh xac
- Theo doi cong no: ghi nhan thanh toan, canh bao qua han
- Bao cao xuat duoc Excel/PDF

### Phase 4 - Done when:
- Tat ca test passed (unit + integration + E2E)
- Performance: page load < 2s, API response < 500ms
- Khong con bug P0/P1
- Deploy thanh cong len production
- UAT pass
