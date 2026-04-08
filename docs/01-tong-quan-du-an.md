# Tong Quan Du An: He Thong Quan Ly Cung Ung Nhan Su Thoi Vu

> **Phien ban:** 2.0  
> **Ngay cap nhat:** 2026-04-08  
> **Tac gia:** BA Team  
> **Trang thai:** Draft

---

## 1. Gioi thieu

### 1.1 Boi canh

Cong ty chuyen cung ung nhan su thoi vu (Temporary Staffing Agency) hoat dong theo mo hinh **tiep nhan don hang nhan su** tu cac doanh nghiep khach hang (nha may, su kien, kho bai, nha hang, sieu thi, cong trinh...) va **dieu phoi lao dong thoi vu** (workers) tu pool nhan su san co de dap ung don hang.

Day la he thong **quan ly van hanh noi bo** cua cong ty cung ung, **KHONG PHAI** la san tuyen dung (job board) cong khai. He thong phuc vu viec quan ly toan bo quy trinh tu khi nhan don hang, tuyen chon va dieu phoi workers, cham cong, cho den thanh toan va doi soat.

### 1.2 Van de can giai quyet (Pain Points)

| # | Van de | Mo ta |
|---|--------|-------|
| 1 | Quan ly don hang thu cong | Don hang nhan su den qua nhieu kenh (dien thoai, Zalo, email), de bi sot, trung lap |
| 2 | Dieu phoi workers khong hieu qua | Khong biet worker nao dang ranh, ai phu hop, o dau - dan den dieu phoi sai, thieu nguoi |
| 3 | Cham cong khong chinh xac | Cham cong bang giay, de gian lan, mat thoi gian tong hop |
| 4 | Doi soat tai chinh kho khan | Khong theo doi duoc cong no voi khach hang va luong workers mot cach chinh xac |
| 5 | Khong danh gia duoc chat luong workers | Khong co lich su lam viec, danh gia, de phan cong sai nguoi |
| 6 | Mat thoi gian bao cao | Bao cao thang, tuan phai lam thu cong, ton nhieu cong suc |
| 7 | Thieu minh bach voi khach hang | Khach hang khong biet trang thai don hang, ai duoc phan cong |

### 1.3 Muc tieu he thong

| # | Muc tieu | Chi tieu |
|---|----------|----------|
| 1 | So hoa toan bo quy trinh van hanh | 100% don hang duoc quan ly tren he thong |
| 2 | Tang hieu qua dieu phoi | Giam 50% thoi gian tim va phan cong workers |
| 3 | Cham cong chinh xac | GPS check-in/out, giam 90% gian lan cham cong |
| 4 | Tu dong hoa tai chinh | Tu dong tinh luong, xuat hoa don, doi soat |
| 5 | Nang cao chat luong dich vu | Danh gia workers, theo doi KPI nhan vien noi bo |
| 6 | Bao cao real-time | Dashboard truc quan, bao cao tu dong |

---

## 2. Mo Hinh Kinh Doanh

### 2.1 Cac ben lien quan

```
+------------------+          +------------------------+          +----------------+
|   KHACH HANG     |  Don     |   CONG TY CUNG UNG    |  Dieu    |    WORKERS     |
|   (Clients)      |  hang    |   (Staffing Agency)    |  phoi    |  (Lao dong     |
|                  | -------> |                        | -------> |   thoi vu)     |
| - Nha may        |          | - Nhan don hang        |          |                |
| - Su kien        | <------- | - Tuyen chon workers   | <------- | - Dang ky      |
| - Kho bai        |  Cung    | - Dieu phoi            |  Cham    | - Nhan viec    |
| - Nha hang       |  ung     | - Cham cong            |  cong    | - Di lam       |
| - Sieu thi       |  nhan    | - Thanh toan           |          | - Nhan luong   |
| - Cong trinh     |  su      | - Bao cao              |          |                |
+------------------+          +------------------------+          +----------------+
```

### 2.2 Luong doanh thu

1. **Khach hang** ky hop dong dich vu cung ung nhan su voi **cong ty**
2. **Cong ty** tinh phi dich vu = luong worker + % markup (thuong 15-30%)
3. **Cong ty** tra luong cho **workers** theo cong thuc da
4. **Loi nhuan** = Phi dich vu thu tu khach hang - Luong tra workers - Chi phi van hanh

### 2.3 Cac loai dich vu cung ung

| Loai dich vu | Mo ta | Vi du |
|--------------|-------|-------|
| **Thoi vu ngan han** | 1-30 ngay, viec cu the | Su kien, khuyen mai, kho hang Tet |
| **Thoi vu dai han** | 1-6 thang, co the gia han | Cong nhan san xuat theo mua vu |
| **Theo ca/shift** | Theo ca lam viec, linh hoat | Phu ban tiec, boc xep hang |
| **Theo du an** | Theo thoi gian du an | Cong trinh xay dung, lap dat |

---

## 3. Cac Vai Tro Trong He Thong (Actors)

### 3.1 Bang tong hop vai tro

| Vai tro | Ma | Mo ta | Pham vi truy cap |
|---------|----|-------|------------------|
| **Giam doc / Admin** | ADMIN | Quan tri toan bo he thong | Toan bo he thong |
| **Quan ly / Manager** | MANAGER | Quan ly van hanh, duyet don hang, phan cong | Don hang, Staff, Workers, Bao cao |
| **Nhan vien tuyen dung / Recruiter** | RECRUITER | Tuyen chon, dieu phoi workers | Workers, don hang duoc phan cong |
| **Nhan vien kinh doanh / Sales** | SALES | Quan ly khach hang, tiep nhan don hang | Khach hang, Don hang |
| **Ke toan / Accountant** | ACCOUNTANT | Quan ly tai chinh, doi soat | Tai chinh, Luong, Hoa don |
| **Lao dong thoi vu / Worker** | WORKER | Nhan viec, cham cong (qua app/web) | Thong tin ca nhan, lich lam viec |

### 3.2 Chi tiet tung vai tro

#### Admin (Giam doc / Quan tri vien)
- Cau hinh he thong, quan ly phan quyen
- Xem toan bo bao cao, thong ke
- Quan ly nguoi dung noi bo
- Duyet cac quyet dinh quan trong (hop dong lon, chinh sach gia)

#### Manager (Quan ly van hanh)
- Nhan va duyet don hang tu khach hang
- Phan cong don hang cho Recruiters
- Giam sat tien do dap ung don hang
- Xu ly su co, khieu nai
- Xem bao cao hieu suat nhan vien va workers

#### Recruiter (Nhan vien tuyen dung / Dieu phoi)
- Tiep nhan don hang duoc phan cong
- Tim kiem, chon loc workers phu hop tu pool
- Lien he, xac nhan workers
- Theo doi workers di lam dung hen
- Xu ly thay the khi worker huy

#### Sales (Nhan vien kinh doanh)
- Tim kiem, cham soc khach hang
- Tiep nhan yeu cau/don hang tu khach hang
- Bao gia, thuong thao hop dong
- Theo doi muc do hai long khach hang

#### Accountant (Ke toan)
- Tinh luong workers theo cong thuc cham duoc
- Xuat hoa don cho khach hang
- Doi soat cong no
- Bao cao tai chinh

#### Worker (Lao dong thoi vu)
- Dang ky thong tin ca nhan, ky nang
- Nhan thong bao viec lam
- Xac nhan tham gia ca lam
- Check-in/check-out (cham cong)
- Xem lich su lam viec va thu nhap

---

## 4. Quy Trinh Van Hanh Chinh

### 4.1 Tong quan luong chinh

```
[Khach hang]          [Sales/Manager]         [Recruiter]            [Worker]
    |                      |                      |                     |
    | 1. Gui yeu cau       |                      |                     |
    | -------------------> |                      |                     |
    |                      | 2. Tao don hang       |                     |
    |                      | -------------------> |                     |
    |                      |                      | 3. Tim workers      |
    |                      |                      | -------------------> |
    |                      |                      |                     |
    |                      |                      | 4. Xac nhan workers |
    |                      |                      | <------------------ |
    |                      | 5. Cap nhat trang thai|                     |
    | <------------------- | <------------------- |                     |
    |                      |                      |                     |
    |                      |                      | 6. Dieu phoi di lam |
    |                      |                      | -------------------> |
    |                      |                      |                     | 7. Check-in/out
    |                      |                      |                     | (Cham cong)
    |                      |                      | 8. Xac nhan cong    |
    |                      |                      | <------------------ |
    |                      | 9. Bao cao            |                     |
    | <------------------- | <------------------- |                     |
    |                      |                      |                     |
    | 10. Thanh toan       |                      |                     |
    | -------------------> |                      |                     |
    |                      | 11. Tra luong workers |                     |
    |                      | --------------------------------------- -> |
```

### 4.2 Chi tiet cac buoc

| Buoc | Hanh dong | Nguoi thuc hien | He thong ho tro |
|------|-----------|-----------------|-----------------|
| 1 | Khach hang gui yeu cau nhan su | Khach hang (qua SDT/Zalo/Email) | Sales nhap vao he thong |
| 2 | Tao don hang nhan su | Sales / Manager | Form tao don hang chi tiet |
| 3 | Duyet va phan cong don hang | Manager | Workflow duyet, phan cong Recruiter |
| 4 | Tim kiem workers phu hop | Recruiter | Bo loc worker theo ky nang, khu vuc, lich ranh |
| 5 | Lien he va xac nhan workers | Recruiter | Gui thong bao, xac nhan qua app |
| 6 | Dieu phoi workers den noi lam viec | Recruiter | Lich trinh, huong dan dia diem |
| 7 | Workers check-in tai noi lam viec | Worker | GPS check-in, selfie xac nhan |
| 8 | Cham cong cuoi ca / cuoi ngay | Worker + Recruiter | Check-out, Recruiter xac nhan |
| 9 | Tong hop cong va bao cao | He thong + Recruiter | Tu dong tinh cong, bao cao |
| 10 | Xuat hoa don cho khach hang | Accountant | Tu dong tu du lieu cham cong |
| 11 | Chi tra luong cho workers | Accountant | Tinh luong tu dong, chuyen khoan |

---

## 5. Cac Module Chinh Cua He Thong

### 5.1 Tong quan modules

```
+-------------------------------------------------------------------+
|                        HE THONG QUAN LY                            |
|                   CUNG UNG NHAN SU THOI VU                         |
+-------------------------------------------------------------------+
|                                                                    |
|  +------------------+  +------------------+  +------------------+  |
|  |    DASHBOARD     |  |   QUAN LY        |  |   QUAN LY        |  |
|  |    Tong quan     |  |   KHACH HANG     |  |   DON HANG       |  |
|  |    & Thong ke    |  |   (Clients)      |  |   (Orders)       |  |
|  +------------------+  +------------------+  +------------------+  |
|                                                                    |
|  +------------------+  +------------------+  +------------------+  |
|  |   QUAN LY        |  |   PHAN CONG      |  |   CHAM CONG      |  |
|  |   POOL WORKERS   |  |   & DIEU PHOI    |  |   & BAO CAO      |  |
|  |   (Worker Pool)  |  |   (Assignments)  |  |   (Attendance)   |  |
|  +------------------+  +------------------+  +------------------+  |
|                                                                    |
|  +------------------+  +------------------+  +------------------+  |
|  |   NHAN VIEN      |  |   TAI CHINH      |  |   CAI DAT        |  |
|  |   NOI BO         |  |   & THANH TOAN   |  |   & PHAN QUYEN   |  |
|  |   (Staff)        |  |   (Finance)      |  |   (Settings)     |  |
|  +------------------+  +------------------+  +------------------+  |
|                                                                    |
+-------------------------------------------------------------------+
```

### 5.2 Mo ta ngan gon tung module

| # | Module | Mo ta chinh |
|---|--------|-------------|
| 1 | **Dashboard** | Tong quan so lieu, don hang moi, workers dang lam viec, doanh thu, canh bao |
| 2 | **Quan ly Khach hang** | Ho so khach hang, hop dong khung, lich su don hang, muc phi, lien he |
| 3 | **Quan ly Don hang** | Tao/sua/huy don hang nhan su, trang thai, deadline, so luong can, yeu cau |
| 4 | **Quan ly Pool Workers** | Ho so worker, ky nang, khu vuc, lich ranh, lich su lam viec, danh gia |
| 5 | **Phan cong & Dieu phoi** | Match workers vao don hang, xac nhan, dieu phoi, xu ly thay the |
| 6 | **Cham cong & Bao cao** | Check-in/out, xac nhan cong, tong hop gio lam, bao cao cho khach hang |
| 7 | **Nhan vien noi bo** | Quan ly staff cong ty (recruiters, sales, accountants), KPI, phan cong |
| 8 | **Tai chinh & Thanh toan** | Tinh luong workers, xuat hoa don khach hang, doi soat, cong no |
| 9 | **Cai dat & Phan quyen** | Vai tro, quyen han, cau hinh he thong, thong bao |

---

## 6. Glossary - Thuat Ngu

| Thuat ngu | Tieng Anh | Mo ta |
|-----------|-----------|-------|
| **Don hang nhan su** | Staffing Order | Yeu cau cua khach hang can N nguoi cho vi tri X trong thoi gian Y |
| **Pool lao dong** | Worker Pool | Tap hop tat ca workers da dang ky va duoc quan ly boi cong ty |
| **Phan cong** | Assignment | Viec gan 1 worker vao 1 don hang cu the |
| **Dieu phoi** | Dispatch | Viec sap xep, thong bao va dam bao worker den lam viec dung hen |
| **Cham cong** | Attendance / Time Tracking | Ghi nhan gio vao/ra cua worker tai noi lam viec |
| **Ca lam** | Shift | Khung gio lam viec cu the (vi du: 6h-14h, 14h-22h) |
| **Markup** | Markup / Service Fee | Phan tram phu phi cong ty tinh tren luong worker |
| **Doi soat** | Reconciliation | Viec doi chieu giua cong thuc, hoa don va thanh toan |
| **Fill rate** | Fill Rate | Ty le dap ung don hang (so worker cung / so worker yeu cau) |
| **No-show** | No-show | Worker da xac nhan nhung khong den lam viec |
| **Khach hang** | Client | Doanh nghiep thue dich vu cung ung nhan su |
| **Worker** | Temporary Worker | Lao dong thoi vu, nguoi truc tiep di lam tai khach hang |
| **Recruiter** | Recruiter / Coordinator | Nhan vien tuyen dung va dieu phoi cua cong ty |
| **KPI** | Key Performance Indicator | Chi so danh gia hieu qua cong viec |

---

## 7. Cong Nghe Su Dung

| Thanh phan | Cong nghe | Ghi chu |
|------------|-----------|---------|
| **Frontend** | React 18+ (Vite) + TypeScript + TailwindCSS 3+ | SPA, responsive |
| **Backend** | Laravel 11+ (PHP 8.2+) | RESTful API |
| **Database** | PostgreSQL 15+ | RDBMS chinh |
| **Cache** | Redis | Session, cache, queue |
| **Authentication** | Laravel Sanctum | SPA authentication |
| **State Management** | TanStack Query (server) + Zustand (client) | Frontend state |
| **Forms** | React Hook Form + Zod | Validation |
| **Testing** | Pest (BE) + Vitest (FE) + Playwright (E2E) | Testing stack |
| **Deployment** | Single domain (Laravel serve React) | Monolith deploy |

---

## 8. Rui Ro & Giai Phap

| Rui ro | Muc do | Giai phap |
|--------|--------|-----------|
| Worker khong den lam (No-show) | Cao | He thong canh bao som, danh gia uy tin worker, pool du phong |
| Don hang gap, khong du worker | Cao | Duy tri pool du lon, phan loai worker san sang, thong bao nhanh |
| Gian lan cham cong | Trung binh | GPS check-in, selfie xac nhan, Recruiter duyet cong |
| Tranh chap luong/cong | Trung binh | Ghi nhan minh bach, worker xac nhan cong hang ngay |
| Du lieu ca nhan bi lo | Cao | Ma hoa du lieu, phan quyen chat, audit log |
| Khach hang no phi dich vu | Trung binh | Hop dong ro rang, theo doi cong no, canh bao |
| He thong qua tai mua cao diem | Thap | Auto-scaling, caching, queue xu ly |

---

## 9. Pham Vi Phien Ban 1.0 (MVP)

Phien ban dau tien tap trung vao **luong van hanh cot loi**:

### Bao gom:
- Dashboard tong quan
- Quan ly khach hang (CRUD co ban)
- Quan ly don hang nhan su (tao, duyet, theo doi trang thai)
- Quan ly pool workers (ho so, ky nang, trang thai)
- Phan cong workers vao don hang (thu cong)
- Cham cong co ban (check-in/out)
- Bao cao don gian (don hang, cham cong)
- Phan quyen co ban (Admin, Manager, Recruiter)
- Quan ly nhan vien noi bo

### Chua bao gom (Phase 2+):
- App mobile cho workers
- GPS check-in/selfie
- Tu dong matching workers
- Module tai chinh day du (tinh luong tu dong, hoa don)
- Tich hop thanh toan ngan hang
- Thong bao SMS/Push
- API cho khach hang tu theo doi don hang
- Bao cao nang cao va analytics
