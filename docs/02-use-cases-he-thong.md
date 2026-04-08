# Use Cases He Thong Quan Ly Cung Ung Nhan Su Thoi Vu

> **Phien ban:** 2.0  
> **Ngay cap nhat:** 2026-04-08  
> **Tac gia:** BA Team  
> **Trang thai:** Draft

---

## Muc luc

1. [Module Quan ly Khach hang](#1-module-quan-ly-khach-hang)
2. [Module Quan ly Don hang](#2-module-quan-ly-don-hang)
3. [Module Quan ly Pool Workers](#3-module-quan-ly-pool-workers)
4. [Module Phan cong & Dieu phoi](#4-module-phan-cong--dieu-phoi)
5. [Module Cham cong & Bao cao](#5-module-cham-cong--bao-cao)
6. [Module Nhan vien noi bo](#6-module-nhan-vien-noi-bo)
7. [Module Tai chinh & Thanh toan](#7-module-tai-chinh--thanh-toan)
8. [Module Cai dat & Phan quyen](#8-module-cai-dat--phan-quyen)

---

## 1. Module Quan ly Khach hang

### UC-CLI-01: Tao ho so khach hang moi

**Actor:** Sales, Manager, Admin  
**Muc dich:** Dang ky thong tin khach hang (doanh nghiep) moi vao he thong  
**Dieu kien tien quyet:** Nguoi dung da dang nhap va co quyen tao khach hang

**Luong chinh (Main Flow):**
1. Actor chon "Tao khach hang moi"
2. He thong hien thi form thong tin khach hang
3. Actor nhap thong tin:
   - Ten cong ty (bat buoc)
   - Ma so thue (bat buoc, unique)
   - Dia chi (bat buoc)
   - Nganh nghe
   - Nguoi lien he chinh (ten, SDT, email)
   - Nguoi lien he phu
   - Ghi chu
4. Actor bam "Luu"
5. He thong validate du lieu
6. He thong tao ho so khach hang voi trang thai "Active"
7. He thong hien thi thong bao thanh cong

**Luong phu (Alternative Flow):**
- 5a. Ma so thue da ton tai: He thong bao loi, hien thi thong tin khach hang da co
- 5b. Thieu thong tin bat buoc: He thong highlight cac truong can nhap

**Dieu kien sau (Postcondition):** Ho so khach hang moi duoc tao trong he thong

**Acceptance Criteria:**
```gherkin
Feature: Tao ho so khach hang moi

Scenario: Tao thanh cong khach hang moi
  Given nguoi dung la Sales da dang nhap
  When nhap day du thong tin khach hang hop le
  And bam "Luu"
  Then he thong tao ho so khach hang voi trang thai "Active"
  And hien thi thong bao "Tao khach hang thanh cong"

Scenario: Ma so thue da ton tai
  Given nguoi dung la Sales da dang nhap
  When nhap ma so thue da co trong he thong
  And bam "Luu"
  Then he thong hien thi loi "Ma so thue da ton tai"
  And khong tao ban ghi moi
```

---

### UC-CLI-02: Xem va cap nhat thong tin khach hang

**Actor:** Sales, Manager, Admin  
**Muc dich:** Xem chi tiet va chinh sua thong tin khach hang

**Luong chinh:**
1. Actor tim kiem hoac chon khach hang tu danh sach
2. He thong hien thi thong tin chi tiet khach hang bao gom:
   - Thong tin co ban
   - Danh sach don hang (lich su + dang xu ly)
   - Thong tin lien he
   - Ghi chu noi bo
   - Thong ke: tong don hang, tong doanh thu, ty le hai long
3. Actor chinh sua thong tin can thay doi
4. Actor bam "Cap nhat"
5. He thong validate va luu thay doi

**Luong phu:**
- 2a. Khach hang co don hang dang xu ly: Hien thi canh bao khi thay doi trang thai sang "Inactive"

---

### UC-CLI-03: Quan ly hop dong khung voi khach hang

**Actor:** Sales, Manager, Admin  
**Muc dich:** Tao va quan ly hop dong dich vu cung ung nhan su voi khach hang

**Luong chinh:**
1. Actor chon khach hang va chon "Tao hop dong"
2. He thong hien thi form hop dong:
   - Loai hop dong (khung / theo don hang)
   - Thoi han (tu ngay - den ngay)
   - Dieu khoan gia (muc luong, markup %)
   - Dieu khoan thanh toan (ky thanh toan, phuong thuc)
   - Cac dieu khoan khac
3. Actor nhap thong tin va bam "Luu"
4. He thong tao hop dong voi trang thai "Draft"
5. Manager duyet hop dong -> trang thai "Active"

**Trang thai hop dong:** Draft -> Active -> Expired / Terminated

---

## 2. Module Quan ly Don hang

### UC-ORD-01: Tao don hang nhan su moi

**Actor:** Sales, Manager  
**Muc dich:** Nhap don hang nhan su tu khach hang vao he thong  
**Dieu kien tien quyet:** Khach hang da co ho so trong he thong

**Luong chinh (Main Flow):**
1. Actor chon "Tao don hang moi"
2. Actor chon khach hang tu danh sach
3. He thong hien thi form don hang:
   - Khach hang (da chon)
   - Vi tri can tuyen (ten vi tri, mo ta cong viec)
   - So luong workers can
   - Yeu cau ky nang (chon tu danh muc)
   - Yeu cau khac (gioi tinh, do tuoi, kinh nghiem...)
   - Dia diem lam viec (dia chi cu the)
   - Thoi gian (ngay bat dau - ngay ket thuc)
   - Ca lam viec (sang/chieu/toi/ca kep)
   - Gio lam cu the
   - Muc luong cho worker (theo gio/ngay/ca)
   - Phi dich vu / markup
   - Do khan cap (Binh thuong / Gap / Rat gap)
   - Ghi chu dac biet
4. Actor bam "Gui don hang"
5. He thong validate du lieu
6. He thong tao don hang voi trang thai "Cho duyet"
7. He thong gui thong bao cho Manager

**Luong phu:**
- 3a. Khach hang chua co hop dong: He thong canh bao, cho phep tao don hang nhung danh dau "Chua co hop dong"
- 6a. Don hang gap: Tu dong chuyen len dau hang doi uu tien

**Luong ngoai le:**
- 5a. Trung thoi gian voi don hang khac cua cung khach hang: He thong canh bao nhung van cho phep tao

**Acceptance Criteria:**
```gherkin
Feature: Tao don hang nhan su

Scenario: Tao don hang thanh cong
  Given nguoi dung la Sales da dang nhap
  And khach hang "Cong ty ABC" da co ho so
  When tao don hang moi voi du thong tin hop le
  Then he thong tao don hang voi trang thai "Cho duyet"
  And gui thong bao cho Manager
  And don hang xuat hien trong danh sach "Cho duyet"

Scenario: Tao don hang gap
  Given nguoi dung la Sales da dang nhap
  When tao don hang moi voi do khan cap "Rat gap"
  Then don hang duoc danh dau uu tien cao
  And thong bao gui ngay lap tuc cho tat ca Managers
```

---

### UC-ORD-02: Duyet don hang

**Actor:** Manager, Admin  
**Muc dich:** Xem xet va phe duyet don hang nhan su

**Luong chinh:**
1. Manager xem danh sach don hang "Cho duyet" (sap xep theo do khan cap)
2. Manager chon don hang de xem chi tiet
3. He thong hien thi:
   - Thong tin don hang
   - Thong tin khach hang
   - Lich su don hang tuong tu (de tham khao)
   - So workers kha dung trong pool (du kien)
4. Manager thuc hien 1 trong cac hanh dong:
   - **Duyet**: Chuyen trang thai sang "Da duyet"
   - **Tu choi**: Nhap ly do, chuyen trang thai sang "Tu choi"
   - **Yeu cau bo sung**: Gui lai cho Sales de bo sung thong tin
5. Neu duyet: He thong cho phep phan cong Recruiter ngay

**Trang thai don hang:**
```
Cho duyet -> Da duyet -> Dang tuyen -> Da du nguoi -> Dang thuc hien -> Hoan thanh
                |                         |
                v                         v
            Tu choi                   Huy bo
```

**Acceptance Criteria:**
```gherkin
Feature: Duyet don hang

Scenario: Duyet don hang thanh cong
  Given Manager xem don hang trang thai "Cho duyet"
  When bam "Duyet"
  Then don hang chuyen sang trang thai "Da duyet"
  And gui thong bao cho Sales tao don hang
  And don hang san sang de phan cong Recruiter

Scenario: Tu choi don hang
  Given Manager xem don hang trang thai "Cho duyet"
  When bam "Tu choi" va nhap ly do "Khong du ngan sach"
  Then don hang chuyen sang trang thai "Tu choi"
  And gui thong bao cho Sales kem ly do tu choi
```

---

### UC-ORD-03: Phan cong Recruiter cho don hang

**Actor:** Manager  
**Muc dich:** Chi dinh Recruiter chiu trach nhiem xu ly don hang

**Luong chinh:**
1. Manager xem don hang da duyet
2. Manager chon "Phan cong Recruiter"
3. He thong hien thi danh sach Recruiters voi:
   - Ten Recruiter
   - So don hang dang xu ly
   - Ty le hoan thanh (fill rate) lich su
   - Khu vuc chuyen trach
4. Manager chon Recruiter phu hop
5. He thong phan cong va gui thong bao cho Recruiter
6. Don hang chuyen sang trang thai "Dang tuyen"

**Luong phu:**
- 4a. Phan cong nhieu Recruiters cho 1 don hang lon (moi nguoi chiu trach nhiem 1 phan so luong)

---

### UC-ORD-04: Theo doi trang thai don hang

**Actor:** Sales, Manager, Admin  
**Muc dich:** Xem tien do xu ly don hang

**Luong chinh:**
1. Actor truy cap danh sach don hang
2. He thong hien thi danh sach voi bo loc:
   - Trang thai
   - Khach hang
   - Thoi gian
   - Recruiter phu trach
   - Do khan cap
3. Actor chon don hang de xem chi tiet:
   - Thong tin don hang
   - Tien do: X/Y workers da xac nhan
   - Danh sach workers da phan cong
   - Timeline cac hanh dong (audit log)
   - Ghi chu noi bo

---

## 3. Module Quan ly Pool Workers

### UC-WRK-01: Dang ky worker moi

**Actor:** Recruiter, Manager, Admin  
**Muc dich:** Them worker moi vao pool lao dong  
**Ghi chu:** Workers duoc Recruiter nhap vao he thong (khong tu dang ky)

**Luong chinh:**
1. Recruiter chon "Them worker moi"
2. He thong hien thi form dang ky:
   - **Thong tin ca nhan:** Ho ten, ngay sinh, gioi tinh, CCCD/CMND, dia chi, SDT, anh chan dung
   - **Thong tin lao dong:** Ky nang (chon tu danh muc), kinh nghiem, khu vuc lam viec mong muon
   - **Thong tin tai khoan:** So tai khoan ngan hang, ngan hang, ten chu TK
   - **Ghi chu:** Dac diem, luu y dac biet
3. Recruiter nhap thong tin va upload anh CCCD
4. He thong validate (CCCD unique, SDT unique)
5. He thong tao ho so worker voi trang thai "Kha dung"

**Luong phu:**
- 4a. CCCD da ton tai: He thong bao loi, hien thi worker da co
- 4b. SDT da ton tai: He thong bao loi

**Acceptance Criteria:**
```gherkin
Feature: Dang ky worker moi

Scenario: Dang ky thanh cong
  Given Recruiter da dang nhap
  When nhap day du thong tin worker hop le
  And bam "Luu"
  Then he thong tao ho so worker trang thai "Kha dung"
  And worker xuat hien trong pool tim kiem

Scenario: CCCD trung
  Given Recruiter da dang nhap
  When nhap CCCD da co trong he thong
  Then he thong bao loi "CCCD da ton tai"
  And hien thi link den worker da co
```

---

### UC-WRK-02: Tim kiem va loc workers

**Actor:** Recruiter, Manager  
**Muc dich:** Tim workers phu hop cho don hang

**Luong chinh:**
1. Actor truy cap "Pool Workers"
2. He thong hien thi danh sach workers voi cac bo loc:
   - **Trang thai:** Kha dung / Dang lam viec / Tam nghi / Blacklist
   - **Ky nang:** Chon tu danh muc (boc xep, phu ban, san xuat, su kien...)
   - **Khu vuc:** Tinh/Thanh, Quan/Huyen
   - **Gioi tinh**
   - **Do tuoi**
   - **Danh gia:** 1-5 sao
   - **Kinh nghiem:** So ngay/ca da lam
3. He thong tra ve danh sach workers phu hop, sap xep theo:
   - Danh gia cao nhat
   - Gan nhat (theo khu vuc)
   - Nhieu kinh nghiem nhat
4. Actor xem chi tiet tung worker: lich su lam viec, danh gia, lich ranh

---

### UC-WRK-03: Quan ly trang thai worker

**Actor:** Recruiter, Manager  
**Muc dich:** Cap nhat trang thai worker trong pool

**Cac trang thai worker:**
```
Moi dang ky -> Kha dung -> Dang lam viec -> Kha dung (khi xong don hang)
                  |              |
                  v              v
              Tam nghi      Blacklist
                  |
                  v
              Kha dung (khi het nghi)
```

**Luong chinh:**
1. Actor chon worker tu danh sach
2. Actor thay doi trang thai voi ly do:
   - **Tam nghi:** Worker bao nghi (ly do ca nhan, benh...)
   - **Blacklist:** Worker vi pham nghiem trong (khong den lam, trom cap, mat trat tu)
   - **Kha dung:** Worker san sang nhan viec lai
3. He thong cap nhat trang thai va ghi nhan ly do trong lich su

---

### UC-WRK-04: Danh gia worker

**Actor:** Recruiter, Manager  
**Muc dich:** Danh gia chat luong lam viec cua worker sau moi don hang

**Luong chinh:**
1. Khi don hang ket thuc, he thong nhac Recruiter danh gia workers
2. Recruiter danh gia tung worker:
   - Diem danh gia tong the (1-5 sao)
   - Cham chi
   - Ky nang
   - Thai do
   - Dung gio
   - Ghi chu
3. He thong cap nhat diem danh gia trung binh cua worker
4. Danh gia anh huong den thu tu uu tien khi tim kiem

---

## 4. Module Phan cong & Dieu phoi

### UC-ASG-01: Phan cong workers vao don hang

**Actor:** Recruiter  
**Muc dich:** Chon va phan cong workers phu hop cho don hang  
**Dieu kien tien quyet:** Don hang da duoc duyet va phan cong cho Recruiter nay

**Luong chinh:**
1. Recruiter mo don hang duoc phan cong
2. He thong hien thi:
   - Thong tin don hang (yeu cau, so luong, ky nang can, dia diem)
   - So workers da phan cong / tong can
   - Danh sach workers phu hop (tu dong loc theo ky nang + khu vuc + trang thai "Kha dung")
3. Recruiter chon workers tu danh sach goi y
4. Voi moi worker duoc chon:
   - He thong kiem tra lich lam viec (co trung don hang khac khong?)
   - Hien thi thong tin worker: danh gia, lich su, khoang cach
5. Recruiter xac nhan phan cong
6. He thong:
   - Tao ban ghi assignment
   - Cap nhat trang thai worker sang "Da phan cong" (cho don hang nay)
   - Gui thong bao cho worker (neu co app/SDT)
7. Cap nhat tien do don hang (X/Y workers)

**Luong phu:**
- 3a. Khong du workers phu hop: He thong goi y mo rong khu vuc tim kiem hoac ha bot yeu cau
- 4a. Worker trung lich: He thong canh bao, Recruiter quyet dinh

**Luong ngoai le:**
- Worker tu choi sau khi duoc phan cong: Recruiter huy phan cong, tim worker thay the

**Acceptance Criteria:**
```gherkin
Feature: Phan cong workers vao don hang

Scenario: Phan cong thanh cong
  Given don hang "DH-001" can 5 workers ky nang "boc xep"
  And co 8 workers kha dung co ky nang "boc xep" trong pool
  When Recruiter chon 5 workers va bam "Phan cong"
  Then he thong tao 5 ban ghi assignment
  And cap nhat don hang: 5/5 workers
  And don hang chuyen trang thai "Da du nguoi"

Scenario: Worker trung lich
  Given worker "Nguyen Van A" dang lam don hang khac
  When Recruiter chon worker nay cho don hang moi
  Then he thong hien thi canh bao "Worker dang co lich lam viec trung"
  And hien thi chi tiet don hang bi trung
```

---

### UC-ASG-02: Xac nhan worker tham gia

**Actor:** Recruiter  
**Muc dich:** Xac nhan worker da dong y va san sang lam viec

**Luong chinh:**
1. Recruiter lien he worker (goi dien / nhan tin)
2. Recruiter cap nhat trang thai assignment:
   - **Da xac nhan:** Worker dong y
   - **Tu choi:** Worker khong tham gia (chon ly do)
   - **Khong lien lac duoc:** Khong goi duoc
3. Neu tu choi hoac khong lien lac duoc: Recruiter tim worker thay the
4. He thong cap nhat lai tien do don hang

---

### UC-ASG-03: Xu ly thay the worker

**Actor:** Recruiter  
**Muc dich:** Tim nguoi thay the khi worker huy hoac no-show

**Luong chinh:**
1. Recruiter bao cao worker can thay the (chon ly do: huy, no-show, khong dat yeu cau)
2. He thong huy assignment cu
3. He thong cap nhat trang thai worker cu (Kha dung hoac Blacklist tuy truong hop)
4. He thong goi y workers thay the tu pool
5. Recruiter chon worker moi va tao assignment moi
6. He thong cap nhat tien do don hang

---

### UC-ASG-04: Dieu phoi truoc ngay lam viec

**Actor:** Recruiter  
**Muc dich:** Dam bao workers biet thong tin va san sang truoc ngay lam viec

**Luong chinh:**
1. He thong tu dong nhac Recruiter truoc 1 ngay ve cac don hang ngay mai
2. Recruiter xem danh sach workers da phan cong
3. Recruiter gui thong tin cho workers:
   - Dia diem lam viec (dia chi cu the, huong dan duong di)
   - Gio tap trung
   - Lien he tai cho (ten nguoi huong dan phia khach hang)
   - Yeu cau trang phuc / dung cu
   - Luu y dac biet
4. Recruiter xac nhan lai tung worker se den (re-confirm)
5. He thong ghi nhan trang thai re-confirm

---

## 5. Module Cham cong & Bao cao

### UC-ATT-01: Worker check-in

**Actor:** Worker (qua Recruiter hoac tu lam tren app)  
**Muc dich:** Ghi nhan thoi gian bat dau lam viec

**Luong chinh (Recruiter nhap):**
1. Recruiter co mat tai dia diem hoac nhan bao cao tu khach hang
2. Recruiter mo danh sach workers cua don hang hom nay
3. Recruiter tick "Check-in" cho tung worker co mat
4. He thong ghi nhan: thoi gian check-in, nguoi xac nhan
5. Workers khong check-in sau 30 phut: He thong danh dau "Tre" hoac "Vang mat"

**Luong chinh (Worker tu check-in - Phase 2):**
1. Worker mo app tai dia diem lam viec
2. Worker bam "Check-in"
3. He thong ghi nhan: thoi gian, toa do GPS, anh selfie
4. He thong kiem tra toa do co dung dia diem khong
5. Neu hop le: Check-in thanh cong

**Acceptance Criteria:**
```gherkin
Feature: Check-in cham cong

Scenario: Check-in thanh cong boi Recruiter
  Given don hang "DH-001" co 5 workers phan cong hom nay
  When Recruiter tick check-in cho 4 workers
  Then 4 workers duoc ghi nhan "Da check-in" voi thoi gian hien tai
  And 1 worker duoc danh dau "Chua check-in"

Scenario: Worker vang mat
  Given don hang bat dau luc 8:00
  And worker "Nguyen Van A" chua check-in
  When qua 8:30 (30 phut sau gio bat dau)
  Then he thong tu dong danh dau "Vang mat"
  And gui canh bao cho Recruiter
```

---

### UC-ATT-02: Worker check-out

**Actor:** Worker (qua Recruiter)  
**Muc dich:** Ghi nhan thoi gian ket thuc lam viec

**Luong chinh:**
1. Cuoi ca lam, Recruiter mo danh sach workers dang lam hom nay
2. Recruiter tick "Check-out" cho tung worker
3. He thong tinh:
   - Tong gio lam viec = Check-out - Check-in - Thoi gian nghi
   - Tang ca (neu co)
   - So gio thuc te
4. He thong ghi nhan bang cham cong

---

### UC-ATT-03: Tong hop cham cong theo don hang

**Actor:** Recruiter, Manager  
**Muc dich:** Xem tong hop cham cong cua don hang

**Luong chinh:**
1. Actor chon don hang
2. He thong hien thi bang cham cong:
   - Cot: Ngay lam viec
   - Dong: Tung worker
   - O: Trang thai (Du / Tre / Vang / Nghi phep) + So gio
   - Tong: Tong cong moi worker, tong cong moi ngay
3. Actor co the chinh sua cong (voi ly do)
4. Manager duyet bang cham cong cuoi ky

**Acceptance Criteria:**
```gherkin
Feature: Tong hop cham cong

Scenario: Xem bang cham cong don hang
  Given don hang "DH-001" da chay 5 ngay voi 3 workers
  When Recruiter xem tong hop cham cong
  Then he thong hien thi bang 3 dong x 5 cot
  And moi o hien thi trang thai va so gio
  And dong cuoi hien thi tong cong moi worker
```

---

### UC-ATT-04: Bao cao cho khach hang

**Actor:** Recruiter, Manager  
**Muc dich:** Xuat bao cao cham cong gui khach hang

**Luong chinh:**
1. Actor chon don hang va ky bao cao (tuan/thang)
2. He thong tao bao cao bao gom:
   - Thong tin don hang
   - Danh sach workers
   - Bang cham cong chi tiet
   - Tong gio lam, gio tang ca
   - Thanh tien (neu can)
3. Actor xuat bao cao (PDF / Excel)
4. Actor gui cho khach hang (qua email hoac tai xuong)

---

## 6. Module Nhan vien noi bo

### UC-STF-01: Quan ly nhan vien noi bo

**Actor:** Manager, Admin  
**Muc dich:** Quan ly thong tin nhan vien cong ty (Sales, Recruiter, Accountant)

**Luong chinh:**
1. Admin tao tai khoan nhan vien moi:
   - Thong tin ca nhan
   - Vai tro (Sales / Recruiter / Accountant / Manager)
   - Phong ban / Nhom
   - Khu vuc phu trach (doi voi Recruiter)
2. He thong tao tai khoan va gui thong tin dang nhap
3. Nhan vien co the cap nhat thong tin ca nhan

---

### UC-STF-02: Theo doi KPI nhan vien

**Actor:** Manager, Admin  
**Muc dich:** Danh gia hieu suat lam viec cua nhan vien

**Chi tieu KPI theo vai tro:**

| Vai tro | KPI | Don vi |
|---------|-----|--------|
| Sales | So khach hang moi | So luong / thang |
| Sales | So don hang tao | So luong / thang |
| Sales | Doanh thu don hang | VND / thang |
| Recruiter | Fill rate (ty le dap ung) | % |
| Recruiter | Thoi gian dap ung trung binh | Gio |
| Recruiter | So workers quan ly | So luong |
| Recruiter | Ty le no-show cua workers | % |
| Recruiter | Danh gia tu khach hang | 1-5 sao |

---

## 7. Module Tai chinh & Thanh toan

### UC-FIN-01: Tinh luong workers

**Actor:** Accountant, Manager  
**Muc dich:** Tinh luong cho workers dua tren cham cong

**Luong chinh:**
1. Accountant chon ky tinh luong (2 tuan / thang)
2. He thong tu dong tinh:
   - Lay du lieu cham cong da duyet
   - Tinh cong: So gio x Don gia (theo don hang)
   - Cong tang ca: So gio tang ca x Don gia tang ca
   - Khau tru (neu co): tam ung, phat
   - Thuc lanh = Tong cong - Khau tru
3. He thong hien thi bang luong de Accountant review
4. Manager duyet bang luong
5. He thong xuat danh sach chuyen khoan

**Acceptance Criteria:**
```gherkin
Feature: Tinh luong workers

Scenario: Tinh luong tu dong
  Given worker "Nguyen Van A" da lam 10 ngay, 80 gio trong ky
  And don gia 25,000 VND/gio
  And tang ca 5 gio voi he so 1.5
  When he thong tinh luong
  Then luong co ban = 80 x 25,000 = 2,000,000 VND
  And luong tang ca = 5 x 25,000 x 1.5 = 187,500 VND
  And tong luong = 2,187,500 VND
```

---

### UC-FIN-02: Xuat hoa don cho khach hang

**Actor:** Accountant  
**Muc dich:** Tao hoa don dich vu cho khach hang dua tren don hang da hoan thanh

**Luong chinh:**
1. Accountant chon khach hang va ky thanh toan
2. He thong tong hop:
   - Cac don hang trong ky
   - Tong gio lam cua workers
   - Don gia dich vu (luong worker + markup)
   - Tong tien dich vu
3. Accountant tao hoa don
4. Manager duyet hoa don
5. He thong xuat hoa don (PDF)
6. Gui cho khach hang

---

### UC-FIN-03: Theo doi cong no

**Actor:** Accountant, Manager  
**Muc dich:** Theo doi tinh hinh thanh toan cua khach hang

**Luong chinh:**
1. He thong hien thi danh sach cong no:
   - Khach hang
   - Hoa don
   - So tien
   - Han thanh toan
   - Trang thai (Chua thanh toan / Da thanh toan 1 phan / Da thanh toan / Qua han)
2. Accountant ghi nhan thanh toan khi khach hang chuyen tien
3. He thong tu dong canh bao hoa don qua han
4. He thong tinh lai cham tra (neu co trong hop dong)

---

## 8. Module Cai dat & Phan quyen

### UC-SYS-01: Quan ly vai tro va quyen han

**Actor:** Admin  
**Muc dich:** Cau hinh vai tro va quyen truy cap he thong

**Luong chinh:**
1. Admin truy cap "Cai dat > Phan quyen"
2. He thong hien thi danh sach vai tro va permission matrix
3. Admin co the:
   - Tao vai tro moi
   - Chinh sua quyen cua vai tro
   - Gan vai tro cho user
4. He thong ap dung quyen ngay lap tuc

**Ma tran quyen co ban:**

| Chuc nang | Admin | Manager | Recruiter | Sales | Accountant |
|-----------|-------|---------|-----------|-------|------------|
| Quan ly khach hang | Full | Full | Xem | Full | Xem |
| Quan ly don hang | Full | Full | Xem (assigned) | Tao/Sua | Xem |
| Duyet don hang | Co | Co | Khong | Khong | Khong |
| Quan ly workers | Full | Full | Full | Xem | Xem |
| Phan cong | Full | Full | Co (assigned) | Khong | Khong |
| Cham cong | Full | Full | Co (assigned) | Khong | Xem |
| Tai chinh | Full | Duyet | Khong | Khong | Full |
| Nhan vien | Full | Xem team | Khong | Khong | Khong |
| Cai dat | Full | Khong | Khong | Khong | Khong |
| Bao cao | Full | Full | Han che | Han che | Tai chinh |

---

### UC-SYS-02: Quan ly danh muc

**Actor:** Admin, Manager  
**Muc dich:** Cau hinh cac danh muc dung trong he thong

**Cac danh muc:**
- Ky nang lao dong (boc xep, phu ban, san xuat, bao ve, lai xe...)
- Nganh nghe khach hang
- Khu vuc dia ly
- Ca lam viec mac dinh
- Ly do huy/tu choi
- Mau danh gia

---

### UC-SYS-03: Cau hinh thong bao

**Actor:** Admin  
**Muc dich:** Cau hinh cac loai thong bao cua he thong

**Cac loai thong bao:**
- Don hang moi can duyet
- Don hang duoc phan cong
- Worker no-show
- Hoa don qua han
- Nhac truoc ngay lam viec
- Bao cao dinh ky

**Kenh thong bao:**
- In-app notification
- Email
- SMS (Phase 2)
- Zalo OA (Phase 2)
