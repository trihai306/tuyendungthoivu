# Use Cases - Module Liên Kết & Hệ Thống Hỗ Trợ

---

## PHẦN A: USE CASES LIÊN KẾT TUYỂN DỤNG - TRỌ

---

### UC-LK-01: Gợi ý trọ tự động khi nhận việc

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Hệ thống (tự động), NVTV |
| **Mô tả** | Khi NVTV được nhận việc, hệ thống tự động gợi ý khu trọ phù hợp |
| **Trigger** | Hợp đồng lao động được ký kết + NVTV đánh dấu "cần chỗ ở" |

### Luồng chính
1. NVTV ký hợp đồng lao động thành công
2. Hệ thống kiểm tra: NVTV có đăng ký "cần chỗ ở" không?
3. Nếu có → Chạy thuật toán gợi ý:
   - **Input:**
     - Địa điểm làm việc của NVTV
     - Giới tính NVTV
     - Ngân sách (mức lương × % chi trọ hợp lý ≤ 30%)
     - Ngày bắt đầu - kết thúc hợp đồng
     - Sở thích (phòng riêng/chung, tiện ích...)
   - **Xử lý:**
     - Lọc khu trọ trong cùng khu vực liên kết
     - Sắp xếp theo: Khoảng cách → Giá → Rating → Tiện ích
     - Loại bỏ khu trọ đầy hoặc không phù hợp giới tính
   - **Output:**
     - Top 5 khu trọ gợi ý kèm lý do
4. Push notification cho NVTV: "Bạn đã được nhận việc! Xem gợi ý chỗ ở tại đây"
5. NVTV chọn khu trọ → Chuyển sang UC-TR-03

### Thuật toán scoring
```
Score = w1 × (1 - distance/max_distance)     // Khoảng cách (40%)
      + w2 × (1 - price/budget)              // Giá cả (30%)
      + w3 × (rating/5)                       // Đánh giá (20%)
      + w4 × (amenity_match/total_amenities)  // Tiện ích (10%)

Trong đó: w1=0.4, w2=0.3, w3=0.2, w4=0.1
```

---

### UC-LK-02: Thanh toán tích hợp lương - tiền trọ

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Hệ thống, NTD, Quản lý trọ, NVTV |
| **Mô tả** | Tự động khấu trừ tiền trọ từ lương NVTV và chuyển cho chủ trọ |
| **Trigger** | Kỳ thanh toán lương |

### Luồng chính
1. Đến kỳ thanh toán lương:
2. Hệ thống kiểm tra NVTV có ở trọ liên kết không
3. Nếu có + NVTV đã đồng ý trừ lương:
   - Lấy hóa đơn trọ tháng này (tiền phòng + điện + nước + phát sinh)
   - Tính vào bảng khấu trừ lương
4. Luồng tiền:

```
┌─────────┐    Lương gộp     ┌──────────┐    Tiền trọ    ┌─────────────┐
│   NTD   │ ──────────────→  │ Hệ thống │ ────────────→  │ Chủ trọ     │
│         │                  │ (escrow) │                │             │
└─────────┘                  │          │    Lương ròng  └─────────────┘
                             │          │ ────────────→  ┌─────────────┐
                             └──────────┘                │   NVTV      │
                                                         └─────────────┘
```

5. Bảng tính mẫu:

| Khoản mục | Số tiền |
|-----------|---------|
| Lương cơ bản (26 công × 200.000đ/ca) | 5.200.000đ |
| Lương OT (8h × 37.500đ) | 300.000đ |
| Phụ cấp ăn | 600.000đ |
| **Tổng thu nhập** | **6.100.000đ** |
| --- | --- |
| Tiền phòng (giường KTX) | -800.000đ |
| Tiền điện | -150.000đ |
| Tiền nước | -50.000đ |
| Internet | -30.000đ |
| **Tổng khấu trừ trọ** | **-1.030.000đ** |
| --- | --- |
| **Lương thực nhận** | **5.070.000đ** |

6. Gửi phiếu lương chi tiết cho NVTV
7. Chuyển tiền trọ cho chủ trọ
8. Chuyển lương ròng cho NVTV

### Luồng phụ
- **3a.** NVTV chọn tự thanh toán tiền trọ → Không khấu trừ, gửi nhắc nhở riêng
- **4a.** Lương không đủ trả tiền trọ → Thông báo NVTV + Quản lý trọ → Xử lý theo chính sách

---

### UC-LK-03: Đồng bộ trạng thái hợp đồng lao động - hợp đồng trọ

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Hệ thống (tự động) |
| **Mô tả** | Khi hợp đồng lao động thay đổi, tự động cập nhật trạng thái trọ |

### Ma trận liên kết trạng thái

| Sự kiện hợp đồng lao động | Hành động hệ thống với trọ |
|---------------------------|---------------------------|
| Ký mới hợp đồng LĐ | Gợi ý đăng ký trọ |
| Gia hạn hợp đồng LĐ | Gia hạn hợp đồng trọ (nếu có) |
| Chấm dứt hợp đồng LĐ | Tạo yêu cầu trả phòng (sau 7 ngày) |
| NVTV chuyển nơi làm việc | Gợi ý chuyển trọ gần nơi mới |
| NTD thay đổi địa điểm LV | Thông báo NVTV đang ở trọ liên kết |

### Luồng chính
1. Sự kiện xảy ra với hợp đồng lao động
2. Hệ thống tra bảng ma trận liên kết
3. Thực hiện hành động tương ứng
4. Gửi thông báo cho các bên liên quan
5. Ghi log sự kiện liên kết

---

### UC-LK-04: Dashboard liên kết khu vực

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Admin, Điều phối viên |
| **Mô tả** | Bảng tổng hợp tình hình cung-cầu lao động và trọ theo khu vực |

### Thông tin hiển thị

#### Bản đồ tương tác
- Vị trí các khu trọ liên kết (marker xanh/đỏ theo tỷ lệ lấp đầy)
- Vị trí các doanh nghiệp đang tuyển (marker theo số lượng cần)
- Đường nối khu trọ - doanh nghiệp gần nhau
- Heatmap nhu cầu theo khu vực

#### KPI theo khu vực
| Chỉ số | Mô tả |
|--------|-------|
| Tổng NVTV đang làm việc | Số NVTV có hợp đồng active |
| Tổng nhu cầu tuyển dụng | Số vị trí đang cần |
| Tỷ lệ đáp ứng | NVTV đang làm / Nhu cầu |
| Tổng chỗ trọ | Tổng capacity |
| Chỗ trọ đang sử dụng | Occupancy |
| Tỷ lệ lấp đầy trọ | Occupancy / Capacity |
| Khoảng cách TB trọ-việc | Km trung bình |
| Tỷ lệ NVTV ở trọ liên kết | NVTV ở trọ LK / Tổng NVTV |
| Doanh thu trọ tháng | Tổng tiền trọ thu được |

#### Biểu đồ
- Xu hướng cung-cầu lao động theo tháng
- Tỷ lệ lấp đầy trọ theo thời gian
- Top khu vực có nhu cầu cao nhất
- Phân bố NVTV theo khu vực

---

## PHẦN B: USE CASES HỆ THỐNG HỖ TRỢ

---

### UC-HT-01: Đăng ký và xác minh tài khoản

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Tất cả người dùng |
| **Mô tả** | Đăng ký tài khoản mới và xác minh danh tính |

### Quy trình đăng ký theo vai trò

#### NVTV
1. Đăng ký bằng SĐT hoặc email
2. Xác minh OTP qua SMS/email
3. Điền thông tin cá nhân cơ bản
4. Upload CCCD (mặt trước + sau)
5. Chụp ảnh selfie (đối chiếu với CCCD bằng AI)
6. Hệ thống xác minh tự động (eKYC):
   - OCR đọc thông tin CCCD
   - So khớp ảnh selfie với ảnh CCCD
   - Kiểm tra CCCD còn hiệu lực
7. Tài khoản được kích hoạt

#### NTD (Nhà tuyển dụng)
1. Đăng ký bằng email doanh nghiệp
2. Xác minh email
3. Điền thông tin doanh nghiệp
4. Upload giấy phép kinh doanh
5. Admin xác minh thủ công (1-2 ngày làm việc)
6. Tài khoản được kích hoạt

#### Chủ trọ
1. Đăng ký bằng SĐT hoặc email
2. Xác minh OTP
3. Điền thông tin cá nhân + khu trọ
4. Upload giấy phép kinh doanh nhà trọ
5. Admin xác minh (có thể kèm kiểm tra thực tế)
6. Tài khoản được kích hoạt

---

### UC-HT-02: Hệ thống thông báo đa kênh

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Hệ thống |
| **Mô tả** | Gửi thông báo qua nhiều kênh cho các sự kiện quan trọng |

### Ma trận thông báo

| Sự kiện | Push App | SMS | Email | Zalo OA |
|---------|----------|-----|-------|---------|
| Có việc phù hợp (NVTV) | x | | | x |
| Có ứng viên mới (NTD) | x | | x | |
| Mời phỏng vấn | x | x | x | x |
| Kết quả tuyển dụng | x | x | | x |
| Hợp đồng cần ký | x | x | x | |
| Nhắc chấm công | x | | | |
| Phiếu lương | x | | x | |
| Hóa đơn trọ | x | x | | x |
| Nhắc thanh toán trọ | x | x | | x |
| Yêu cầu bảo trì cập nhật | x | | | |
| Hợp đồng sắp hết hạn | x | x | x | |
| Vi phạm nội quy | x | | x | |

### Cấu hình thông báo
- NVTV có thể tắt/bật từng loại thông báo
- Chọn kênh ưu tiên
- Cài đặt "không làm phiền" theo khung giờ

---

### UC-HT-03: Chat và nhắn tin trong hệ thống

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NTD, NVTV, Quản lý trọ, Điều phối viên |
| **Mô tả** | Giao tiếp trực tiếp giữa các bên trong hệ thống |

### Luồng chính
1. Các kênh chat:
   - **NTD ↔ NVTV**: Trao đổi về công việc, phỏng vấn
   - **NVTV ↔ Quản lý trọ**: Báo sự cố, hỏi đáp
   - **NTD ↔ Điều phối viên**: Yêu cầu hỗ trợ tuyển dụng
   - **Nhóm chat**: Nhóm NVTV cùng dự án, nhóm cùng khu trọ
2. Tính năng:
   - Nhắn tin text
   - Gửi ảnh/file
   - Gửi vị trí
   - Tin nhắn thoại
   - Trạng thái đã đọc
   - Tin nhắn mẫu (quick reply)
3. Lưu lịch sử chat
4. Báo cáo tin nhắn vi phạm

---

### UC-HT-04: Phân quyền và bảo mật

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Admin hệ thống |
| **Mô tả** | Quản lý phân quyền truy cập hệ thống |

### Ma trận phân quyền

| Chức năng | Admin | Điều phối | NTD | Quản lý trọ | NVTV |
|-----------|-------|-----------|-----|-------------|------|
| Quản lý người dùng | CRUD | R | - | - | - |
| Duyệt tài khoản | CRU | R | - | - | - |
| Quản lý khu vực | CRUD | RU | R | R | R |
| Đăng tin tuyển dụng | CRUD | RU | CRUD (own) | - | R |
| Duyệt tin tuyển dụng | CRU | CRU | R (own) | - | - |
| Xem hồ sơ NVTV | R | R | R (ứng viên) | - | CRUD (own) |
| Quản lý hợp đồng LĐ | CRUD | RU | CRU (own) | - | R (own) |
| Quản lý khu trọ | CRUD | RU | R | CRUD (own) | R |
| Quản lý phòng/giường | CRUD | R | - | CRUD (own) | R (own) |
| Hợp đồng thuê trọ | CRUD | RU | - | CRU (own) | R (own) |
| Thu tiền trọ | CRUD | R | - | CRU (own) | R (own) |
| Chấm công | CRUD | RU | CRU (own) | - | CR (own) |
| Tính lương | CRUD | RU | CRU (own) | - | R (own) |
| Báo cáo/Thống kê | CRUD | R | R (own) | R (own) | R (own) |
| Cấu hình hệ thống | CRUD | - | - | - | - |

*C: Create, R: Read, U: Update, D: Delete, own: chỉ dữ liệu của mình*

### Bảo mật
- Mã hóa dữ liệu nhạy cảm (CCCD, thông tin tài khoản ngân hàng)
- Two-factor authentication cho Admin, NTD
- Session timeout sau 30 phút không hoạt động
- Rate limiting API
- Audit log cho mọi thao tác quan trọng
- Backup dữ liệu hàng ngày
- Tuân thủ PDPA (bảo vệ dữ liệu cá nhân)

---

### UC-HT-05: Báo cáo và thống kê

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Admin, NTD, Quản lý trọ |
| **Mô tả** | Xem báo cáo và thống kê theo nhiều chiều |

### Báo cáo tuyển dụng
| Báo cáo | Chi tiết |
|---------|----------|
| Tổng quan tuyển dụng | Số tin đăng, ứng viên, tỷ lệ tuyển thành công |
| Hiệu quả tuyển dụng | Thời gian trung bình từ đăng tin → nhận việc |
| Phân tích ứng viên | Theo khu vực, độ tuổi, kỹ năng, nguồn |
| Tỷ lệ giữ chân | % NVTV hoàn thành hợp đồng |
| Chi phí tuyển dụng | Tổng chi phí / số NVTV tuyển được |
| Top NTD | NTD tuyển nhiều nhất, rating cao nhất |
| Top NVTV | NVTV uy tín cao, được tuyển lại nhiều |

### Báo cáo nhà trọ
| Báo cáo | Chi tiết |
|---------|----------|
| Tỷ lệ lấp đầy | Theo khu trọ, khu vực, thời gian |
| Doanh thu trọ | Theo tháng, khu trọ, khu vực |
| Công nợ | NVTV nợ tiền trọ, NTD nợ hoa hồng |
| Bảo trì | Số yêu cầu, thời gian xử lý TB, chi phí |
| Chất lượng trọ | Rating trung bình, phàn nàn, vi phạm |
| Biến động | Check-in / Check-out theo tháng |

### Báo cáo liên kết
| Báo cáo | Chi tiết |
|---------|----------|
| Cung-cầu khu vực | So sánh nhu cầu tuyển vs chỗ trọ khả dụng |
| Hiệu quả liên kết | % NVTV ở trọ LK vs tự lo chỗ ở |
| Tài chính tích hợp | Dòng tiền lương - trọ - hoa hồng |
| Dự báo | Dự đoán nhu cầu theo mùa vụ |

---

### UC-HT-06: Hỗ trợ và khiếu nại

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Tất cả người dùng |
| **Mô tả** | Hệ thống tiếp nhận và xử lý yêu cầu hỗ trợ, khiếu nại |

### Luồng chính
1. Người dùng tạo ticket hỗ trợ:
   - Chủ đề: Tuyển dụng / Trọ / Thanh toán / Tài khoản / Khác
   - Mô tả vấn đề
   - Đính kèm (ảnh, file)
   - Mức độ ưu tiên: Thấp / Trung bình / Cao
2. Hệ thống phân loại và gán cho nhân viên hỗ trợ
3. Nhân viên hỗ trợ xử lý:

```
[Mới] → [Đang xử lý] → [Chờ phản hồi] → [Đã giải quyết] → [Đóng]
```

4. Gửi kết quả cho người dùng
5. Người dùng đánh giá chất lượng hỗ trợ (1-5 sao)

### SLA (Service Level Agreement)
| Mức độ | Thời gian phản hồi | Thời gian giải quyết |
|--------|--------------------|--------------------|
| Cao | 1 giờ | 4 giờ |
| Trung bình | 4 giờ | 24 giờ |
| Thấp | 24 giờ | 72 giờ |
