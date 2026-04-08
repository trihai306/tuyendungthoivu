# Quy Trinh Van Hanh - He Thong Cung Ung Nhan Su Thoi Vu

> **Phien ban:** 2.0  
> **Ngay cap nhat:** 2026-04-08  
> **Tac gia:** BA Team  
> **Trang thai:** Draft

---

## Muc luc

1. [Quy trinh nhan & xu ly don hang](#1-quy-trinh-nhan--xu-ly-don-hang)
2. [Quy trinh tuyen chon & dieu phoi workers](#2-quy-trinh-tuyen-chon--dieu-phoi-workers)
3. [Quy trinh cham cong & bao cao](#3-quy-trinh-cham-cong--bao-cao)
4. [Quy trinh thanh toan & doi soat](#4-quy-trinh-thanh-toan--doi-soat)
5. [Quy trinh quan ly pool workers](#5-quy-trinh-quan-ly-pool-workers)
6. [Quy trinh xu ly su co](#6-quy-trinh-xu-ly-su-co)

---

## 1. Quy Trinh Nhan & Xu Ly Don Hang

### 1.1 So do quy trinh

```
+-------------------+     +-------------------+     +-------------------+
|   KHACH HANG      |     |   SALES           |     |   MANAGER         |
|   gui yeu cau     | --> |   Tiep nhan &     | --> |   Duyet don hang  |
|   (SDT/Zalo/      |     |   nhap he thong   |     |   & phan cong     |
|    Email/Truc tiep)|     |                   |     |   Recruiter       |
+-------------------+     +-------------------+     +-------------------+
```

### 1.2 Chi tiet tung buoc

#### Buoc 1: Tiep nhan yeu cau tu khach hang
- **Nguoi thuc hien:** Sales
- **Kenh tiep nhan:** Dien thoai, Zalo, Email, Truc tiep
- **Thong tin can thu thap:**
  - Ten cong ty / nguoi lien he
  - Vi tri can nguoi (cong viec cu the)
  - So luong workers
  - Thoi gian (ngay bat dau, thoi luong, ca lam)
  - Dia diem lam viec
  - Yeu cau dac biet (gioi tinh, do tuoi, ky nang, trang phuc)
  - Muc luong de xuat
  - Do khan cap

#### Buoc 2: Nhap don hang vao he thong
- **Nguoi thuc hien:** Sales
- **Hanh dong tren he thong:**
  1. Chon/tao khach hang
  2. Dien form don hang voi day du thong tin
  3. Chon do khan cap: Binh thuong (>3 ngay) / Gap (1-3 ngay) / Rat gap (<24h)
  4. Gui don hang de duyet
- **SLA nhap don hang:** Trong vong 1 gio sau khi tiep nhan

#### Buoc 3: Duyet don hang
- **Nguoi thuc hien:** Manager
- **Hanh dong:**
  1. Xem xet don hang (so luong, gia, tinh kha thi)
  2. Kiem tra xem pool co du workers khong (he thong goi y so luong kha dung)
  3. Quyet dinh: Duyet / Tu choi / Yeu cau bo sung
  4. Neu duyet: Chon Recruiter phu trach
- **SLA duyet:**
  - Don binh thuong: Trong 4 gio lam viec
  - Don gap: Trong 1 gio
  - Don rat gap: Trong 30 phut

#### Buoc 4: Phan cong Recruiter
- **Nguoi thuc hien:** Manager
- **Tieu chi chon Recruiter:**
  - Khu vuc phu trach phu hop
  - So don hang dang xu ly (can bang tai)
  - Lich su xu ly don tuong tu
  - Ty le hoan thanh (fill rate)
- **He thong:** Gui thong bao cho Recruiter duoc phan cong

### 1.3 Quy tac nghiep vu

| # | Quy tac | Mo ta |
|---|---------|-------|
| QT-01 | Don hang phai co du thong tin bat buoc | Vi tri, so luong, ngay bat dau, dia diem |
| QT-02 | Don hang gap phai duoc xu ly uu tien | Hien thi dau danh sach, thong bao dac biet |
| QT-03 | Moi don hang phai co Recruiter phu trach | Khong duoc de don hang "troi" khong ai xu ly |
| QT-04 | Don hang qua 72h khong du nguoi phai bao dong | Manager nhan canh bao de can thiep |
| QT-05 | Gia dich vu khong thap hon gia san | Markup toi thieu 15% so voi luong worker |

---

## 2. Quy Trinh Tuyen Chon & Dieu Phoi Workers

### 2.1 So do quy trinh

```
+------------------+     +------------------+     +------------------+
|   RECRUITER      |     |   RECRUITER      |     |   RECRUITER      |
|   Tim workers    | --> |   Lien he &      | --> |   Dieu phoi      |
|   phu hop        |     |   xac nhan       |     |   truoc ngay lam |
+------------------+     +------------------+     +------------------+
        |                         |                        |
        v                         v                        v
  - Loc tu pool            - Goi dien/nhan tin      - Gui thong tin
  - Xem ky nang           - Worker dong y?           dia diem
  - Xem danh gia          - Da -> Xac nhan          - Nhac gio
  - Xem lich ranh         - Khong -> Tim nguoi khac - Re-confirm
  - Chon ung vien         - KLL -> Danh dau         - Chuan bi du phong
```

### 2.2 Chi tiet tung buoc

#### Buoc 1: Tim kiem workers phu hop
- **Nguoi thuc hien:** Recruiter
- **Hanh dong tren he thong:**
  1. Mo don hang duoc phan cong
  2. He thong tu dong goi y workers dua tren:
     - Ky nang khop voi yeu cau
     - Trang thai "Kha dung"
     - Khu vuc lam viec phu hop
     - Khong bi trung lich
  3. Recruiter xem chi tiet tung worker: danh gia, lich su, ghi chu
  4. Recruiter chon danh sach workers uu tien (nhieu hon so luong can 20-30% de du phong)

#### Buoc 2: Lien he va xac nhan workers
- **Nguoi thuc hien:** Recruiter
- **Hanh dong:**
  1. Goi dien/nhan tin cho workers trong danh sach
  2. Thong bao: cong viec, dia diem, thoi gian, luong
  3. Ghi nhan phan hoi:
     - **Dong y:** Danh dau "Da xac nhan" tren he thong
     - **Tu choi:** Ghi ly do, chuyen sang worker tiep theo trong danh sach
     - **Khong lien lac duoc:** Ghi nhan, thu lai sau 2h, toi da 3 lan
  4. Lien he cho den khi du so luong workers can

- **SLA lien he:**
  - Don binh thuong: Hoan thanh trong 24h
  - Don gap: Hoan thanh trong 4h
  - Don rat gap: Hoan thanh trong 2h

#### Buoc 3: Dieu phoi truoc ngay lam viec
- **Nguoi thuc hien:** Recruiter
- **Thoi diem:** Chieu/toi truoc ngay lam viec
- **Hanh dong:**
  1. Gui thong tin chi tiet cho workers da xac nhan:
     - Dia chi cu the, huong dan duong di
     - Gio tap trung (som hon gio lam 15 phut)
     - Ten + SDT nguoi lien he tai cho
     - Trang phuc / dung cu can mang
     - Noi quy, luu y an toan
  2. Re-confirm: Xac nhan lai workers se den
  3. Chuan bi danh sach du phong (1-2 workers) phong truong hop no-show

### 2.3 Quy tac nghiep vu

| # | Quy tac | Mo ta |
|---|---------|-------|
| QT-06 | Chon worker danh gia cao truoc | Sap xep danh sach goi y theo danh gia giam dan |
| QT-07 | Khong phan cong worker trung lich | He thong chan viec phan cong trung thoi gian |
| QT-08 | Lien he toi da 3 lan | Sau 3 lan KLL, chuyen sang worker khac |
| QT-09 | Luon co du phong | Chuan bi them 10-20% workers so voi yeu cau |
| QT-10 | Re-confirm bat buoc | Phai xac nhan lai truoc 18:00 ngay hom truoc |
| QT-11 | Worker blacklist khong duoc goi y | He thong tu dong loai workers bi blacklist |

---

## 3. Quy Trinh Cham Cong & Bao Cao

### 3.1 So do quy trinh

```
+------------------+     +------------------+     +------------------+
|   WORKER         |     |   RECRUITER      |     |   MANAGER        |
|   Den noi lam    | --> |   Xac nhan       | --> |   Duyet bang     |
|   & check-in     |     |   cham cong      |     |   cham cong      |
+------------------+     +------------------+     +------------------+
                                  |
                                  v
                         +------------------+
                         |   HE THONG       |
                         |   Tong hop &     |
                         |   bao cao        |
                         +------------------+
```

### 3.2 Chi tiet tung buoc

#### Buoc 1: Check-in dau ca
- **Thoi diem:** Dau ca lam viec
- **Phuong thuc (Phase 1):** Recruiter tick check-in tren he thong
- **Phuong thuc (Phase 2):** Worker tu check-in qua app (GPS + selfie)
- **He thong ghi nhan:**
  - Thoi gian check-in
  - Nguoi xac nhan
  - Trang thai: Dung gio / Tre (tre <30 phut) / Vang mat (khong check-in)
- **Xu ly dac biet:**
  - Worker den tre > 30 phut: Canh bao Recruiter, co the tinh nua cong
  - Worker vang mat: Recruiter bao Manager, goi worker du phong

#### Buoc 2: Giam sat trong ca
- **Nguoi thuc hien:** Recruiter (gian tiep, qua khach hang)
- **Hanh dong:**
  - Lien he khach hang kiem tra tinh hinh
  - Xu ly phat sinh: worker lam khong dat, chan thuong, xin ve som
  - Ghi nhan su co vao he thong

#### Buoc 3: Check-out cuoi ca
- **Thoi diem:** Cuoi ca lam viec
- **Phuong thuc:** Recruiter tick check-out tren he thong
- **He thong tu dong tinh:**
  - Tong gio lam = Check-out - Check-in - Thoi gian nghi
  - Tang ca = Phan gio vuot qua ca tieu chuan
  - Ghi nhan: So gio thuc te, loai ca (binh thuong / tang ca / ca dem)

#### Buoc 4: Xac nhan cong hang ngay
- **Nguoi thuc hien:** Recruiter
- **Hanh dong:**
  - Xem lai bang cham cong trong ngay
  - Chinh sua neu co sai sot (kem ly do)
  - Xac nhan "Da kiem tra"
- **SLA:** Xac nhan cong trong ngay hoac sang ngay hom sau

#### Buoc 5: Tong hop va duyet cham cong
- **Chu ky:** Hang tuan hoac khi don hang ket thuc
- **Nguoi thuc hien:** Manager duyet
- **Hanh dong:**
  1. He thong tu dong tong hop bang cham cong theo don hang
  2. Manager review: so gio, tang ca, vang mat
  3. Manager duyet hoac yeu cau Recruiter chinh sua
  4. Khi da duyet: Du lieu san sang cho tinh luong va xuat bao cao

#### Buoc 6: Bao cao cho khach hang
- **Chu ky:** Theo thoa thuan (tuan/2 tuan/thang)
- **Noi dung bao cao:**
  - Danh sach workers da lam viec
  - Bang cham cong chi tiet (ngay, gio vao, gio ra, tong gio)
  - Tong hop: tong cong, tong gio, tang ca
  - Ghi chu su co (neu co)
- **Dinh dang:** PDF hoac Excel, xuat tu he thong

### 3.3 Quy tac nghiep vu

| # | Quy tac | Mo ta |
|---|---------|-------|
| QT-12 | Check-in tre > 30 phut = nua cong | Hoac theo thoa thuan voi khach hang |
| QT-13 | Vang mat khong bao truoc = tru diem uy tin | Worker bi giam danh gia |
| QT-14 | Tang ca phai duoc phe duyet truoc | Recruiter xac nhan truoc khi worker lam them |
| QT-15 | Cham cong phai duoc duyet truoc khi tinh luong | Manager duyet la dieu kien bat buoc |
| QT-16 | Chinh sua cham cong phai co ly do | Ghi nhan ai sua, ly do gi, thoi gian nao |

---

## 4. Quy Trinh Thanh Toan & Doi Soat

### 4.1 So do quy trinh

```
+------------------+     +------------------+     +------------------+
|   HE THONG       |     |   ACCOUNTANT     |     |   MANAGER        |
|   Tinh luong     | --> |   Review &       | --> |   Duyet          |
|   tu dong        |     |   dieu chinh     |     |   bang luong     |
+------------------+     +------------------+     +------------------+
        |                                                  |
        v                                                  v
+------------------+                              +------------------+
|   ACCOUNTANT     |                              |   ACCOUNTANT     |
|   Xuat hoa don   |                              |   Chi tra luong  |
|   cho khach hang |                              |   cho workers    |
+------------------+                              +------------------+
        |
        v
+------------------+
|   ACCOUNTANT     |
|   Theo doi       |
|   cong no        |
+------------------+
```

### 4.2 Chi tiet tung buoc

#### Buoc 1: Tinh luong workers
- **Chu ky:** 2 lan/thang (ngay 1 va ngay 16) hoac theo don hang
- **He thong tu dong tinh:**
  - Luong co ban = So gio lam x Don gia (theo don hang)
  - Luong tang ca = So gio tang ca x Don gia x He so (1.5 ngay thuong, 2.0 cuoi tuan, 3.0 le)
  - Phu cap (neu co): di lai, an trua, ca dem
  - Khau tru: tam ung, phat (vang khong phep, vi pham)
  - **Thuc lanh = Luong co ban + Tang ca + Phu cap - Khau tru**
- **Accountant:** Review, dieu chinh truong hop dac biet
- **Manager:** Duyet bang luong

#### Buoc 2: Chi tra luong cho workers
- **Phuong thuc:** Chuyen khoan ngan hang
- **Hanh dong:**
  1. He thong xuat danh sach chi tra (ten, STK, ngan hang, so tien)
  2. Accountant tao lenh chuyen khoan (hoac upload file batch)
  3. Sau khi chuyen xong: Ghi nhan trang thai "Da tra"
  4. He thong cap nhat lich su thu nhap cua worker

#### Buoc 3: Xuat hoa don cho khach hang
- **Chu ky:** Theo thoa thuan trong hop dong (tuan/2 tuan/thang)
- **Tinh toan:**
  - Tong phi dich vu = Tong luong workers + Markup %
  - Chi tiet theo tung vi tri, tung don hang
  - Thue VAT (neu co)
- **Hanh dong:**
  1. He thong tu dong tao draft hoa don tu du lieu cham cong
  2. Accountant review va dieu chinh
  3. Manager duyet
  4. Xuat hoa don PDF va gui cho khach hang

#### Buoc 4: Theo doi cong no
- **Hanh dong thuong xuyen:**
  1. Ghi nhan thanh toan khi khach hang chuyen tien
  2. Doi chieu: so tien nhan vs so tien hoa don
  3. Canh bao hoa don qua han (5 ngay / 15 ngay / 30 ngay)
  4. Bao cao cong no dinh ky cho Manager

#### Buoc 5: Doi soat cuoi ky
- **Chu ky:** Hang thang
- **Noi dung doi soat:**
  - Tong thu tu khach hang vs Tong chi cho workers = Lai gop
  - Kiem tra cham cong vs hoa don vs thanh toan
  - Phat hien chenh lech va xu ly
  - Bao cao lai lo theo khach hang, theo don hang

### 4.3 Quy tac nghiep vu

| # | Quy tac | Mo ta |
|---|---------|-------|
| QT-17 | Luong phai tra dung han | Toi da 5 ngay lam viec sau ky tinh luong |
| QT-18 | Hoa don phai duyet truoc khi gui | Manager duyet la bat buoc |
| QT-19 | Qua han 30 ngay phai bao cao Manager | De quyet dinh hanh dong (nhac, cat dich vu) |
| QT-20 | Doi soat thang phai hoan thanh truoc ngay 10 | Cua thang tiep theo |

---

## 5. Quy Trinh Quan Ly Pool Workers

### 5.1 So do quy trinh

```
                    +------------------+
                    |   RECRUITER      |
                    |   Tuyen moi      |
                    |   workers        |
                    +--------+---------+
                             |
                             v
+------------------+  +------+----------+  +------------------+
|   Phong van /    |  |   NHAP VAO      |  |   DAU VIEN       |
|   Danh gia       |->|   POOL          |->|   DU PHONG       |
|   so bo          |  |   (Kha dung)    |  |   (Standby)      |
+------------------+  +--------+--------+  +------------------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
     +--------+----+  +-------+-----+  +-------+------+
     |  PHAN CONG  |  |  TAM NGHI   |  |  BLACKLIST   |
     |  (Assigned) |  |  (Inactive) |  |  (Banned)    |
     +--------+----+  +-------+-----+  +--------------+
              |                |
              v                v
     +--------+----+  +-------+-----+
     |  TRA VE     |  |  KICH HOAT  |
     |  POOL       |  |  LAI        |
     +-------------+  +-------------+
```

### 5.2 Tuyen moi workers vao pool

**Nguon tuyen:**
- Gioi thieu tu workers hien tai (referral)
- Mang xa hoi (Facebook groups, Zalo groups)
- Hop tac voi truong nghe, trung tam dao tao
- Workers tu lien he

**Quy trinh tuyen:**
1. Recruiter tiep nhan thong tin ung vien
2. Phong van/danh gia so bo (truc tiep hoac qua dien thoai):
   - Xac minh CCCD
   - Danh gia ky nang co ban
   - Xac nhan khu vuc lam viec
   - Lay thong tin tai khoan ngan hang
3. Neu dat: Nhap vao he thong, trang thai "Kha dung"
4. Neu khong dat: Ghi nhan ly do, luu lai de lien he sau (neu can)

### 5.3 Duy tri va phat trien pool

**Hoat dong dinh ky:**

| Hoat dong | Tan suat | Nguoi thuc hien |
|-----------|----------|-----------------|
| Lien he workers khong hoat dong > 30 ngay | 2 tuan/lan | Recruiter |
| Cap nhat thong tin lien lac | Hang thang | Recruiter |
| Danh gia lai workers yeu | Khi can | Recruiter + Manager |
| Tuyen moi de bo sung pool | Lien tuc | Recruiter |
| Phan tich ty le pool vs nhu cau | Hang thang | Manager |

**Chi tieu quan ly pool:**
- Ty le workers kha dung >= 60% tong pool
- Ty le no-show < 5%
- Thoi gian dap ung don hang trung binh < 24h
- Moi ky nang phai co it nhat 20 workers kha dung

### 5.4 Quy tac nghiep vu

| # | Quy tac | Mo ta |
|---|---------|-------|
| QT-21 | Worker moi phai co CCCD hop le | Xac minh truoc khi nhap pool |
| QT-22 | Worker 3 lan no-show -> Blacklist | Tu dong chuyen trang thai |
| QT-23 | Worker tam nghi > 90 ngay -> Lien he | Xac nhan con muon lam khong |
| QT-24 | Thong tin worker phai cap nhat hang quy | SDT, dia chi, tai khoan ngan hang |

---

## 6. Quy Trinh Xu Ly Su Co

### 6.1 Cac loai su co va cach xu ly

#### Su co 1: Worker No-show (khong den lam)
```
Phat hien -> Recruiter bao Manager -> Goi worker du phong -> Cap nhat he thong
   |                                                              |
   v                                                              v
Worker bi ghi nhan                                          Don hang van
no-show (tru diem)                                          duoc dap ung
```

**Xu ly chi tiet:**
1. Khi worker khong check-in sau 30 phut: He thong canh bao Recruiter
2. Recruiter goi worker de xac nhan
3. Neu khong den duoc: Recruiter goi worker du phong
4. Cap nhat he thong: Huy assignment cu, tao assignment moi
5. Ghi nhan no-show cho worker (anh huong danh gia)
6. No-show lan 1: Canh bao. Lan 2: Tam khoa 1 tuan. Lan 3: Blacklist

#### Su co 2: Worker lam khong dat yeu cau
1. Khach hang phan hoi -> Recruiter tiep nhan
2. Recruiter lien he worker de nhac nho/huong dan
3. Neu khong cai thien: Tim nguoi thay the
4. Ghi nhan danh gia thap cho worker
5. Bao cao Manager neu nghiem trong

#### Su co 3: Worker bi tai nan lao dong
1. Bao cho Recruiter va Manager ngay lap tuc
2. Ho tro so cuu va dua di benh vien
3. Lien he bao hiem (neu co)
4. Lap bien ban su co
5. Tim worker thay the cho don hang
6. Theo doi tinh trang worker

#### Su co 4: Khach hang huy don hang dot xuat
1. Sales/Manager tiep nhan thong bao huy
2. Cap nhat trang thai don hang -> "Huy bo" (kem ly do)
3. Thong bao cho Recruiter va workers da phan cong
4. Tinh phi huy (neu co trong hop dong)
5. Tra workers ve pool (trang thai "Kha dung")

#### Su co 5: Thieu workers cho don hang gap
1. Manager nhan canh bao tu he thong
2. Hanh dong khan cap:
   - Mo rong khu vuc tim kiem workers
   - Lien he workers tam nghi
   - Nho Recruiters khac ho tro
   - Thuong thao voi khach hang giam so luong/doi ngay
3. Ghi nhan de cai thien pool cho lan sau

### 6.2 Ma tran phan cap su co

| Muc do | Mo ta | Thoi gian xu ly | Nguoi xu ly |
|--------|-------|-----------------|-------------|
| **P1 - Khẩn cap** | Tai nan lao dong, mat an ninh | Ngay lap tuc | Manager + Admin |
| **P2 - Cao** | No-show nhieu nguoi, khach hang khieu nai gay gat | Trong 1 gio | Manager + Recruiter |
| **P3 - Trung binh** | No-show 1 nguoi, worker lam chua tot | Trong 4 gio | Recruiter |
| **P4 - Thap** | Hoi ve thong tin, yeu cau thay doi nho | Trong 24 gio | Recruiter / Sales |
