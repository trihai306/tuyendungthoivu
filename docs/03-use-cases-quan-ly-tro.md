# Use Cases - Module Quản Lý Nhà Trọ Liên Kết

---

## UC-TR-01: Đăng ký khu trọ liên kết

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Chủ trọ / Quản lý khu trọ |
| **Mô tả** | Chủ trọ đăng ký khu trọ vào hệ thống liên kết |
| **Tiền điều kiện** | Chủ trọ có giấy phép kinh doanh nhà trọ hợp lệ |
| **Hậu điều kiện** | Khu trọ xuất hiện trong hệ thống, sẵn sàng nhận NVTV |

### Luồng chính
1. Chủ trọ đăng ký tài khoản trên hệ thống
2. Cung cấp thông tin khu trọ:
   - **Thông tin cơ bản:**
     - Tên khu trọ
     - Địa chỉ (chọn trên bản đồ)
     - Khu vực / Quận / Huyện / Phường
     - Giấy phép kinh doanh (upload)
     - Ảnh tổng quan khu trọ (tối thiểu 5 ảnh)
   - **Thông tin phòng:**
     - Tổng số phòng
     - Loại phòng (đơn, đôi, ký túc xá/giường tầng)
     - Diện tích mỗi loại phòng
     - Sức chứa tối đa mỗi phòng
     - Giá phòng theo loại
   - **Tiện ích:**
     - WiFi (Có/Không, tốc độ)
     - Điều hòa / Quạt
     - Nóng lạnh
     - Nhà bếp chung / riêng
     - Chỗ để xe
     - Giặt giũ
     - Camera an ninh
     - Bảo vệ
   - **Chính sách:**
     - Giờ giới nghiêm (nếu có)
     - Quy định nội quy
     - Chính sách khách đến thăm
     - Chính sách hủy/trả phòng
     - Tiền đặt cọc
3. Admin xác minh thông tin và kiểm tra thực tế (nếu cần)
4. Phê duyệt khu trọ vào hệ thống liên kết
5. Ký hợp đồng liên kết với hệ thống (hoa hồng, cam kết chất lượng)

### Luồng phụ
- **3a.** Admin yêu cầu bổ sung thông tin hoặc chỉnh sửa
- **4a.** Từ chối nếu không đạt tiêu chuẩn → Gửi lý do và yêu cầu cải thiện
- **5a.** Chủ trọ đăng ký gói dịch vụ (cơ bản, nâng cao, premium) với các mức hoa hồng khác nhau

---

## UC-TR-02: Quản lý phòng và giường

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Quản lý khu trọ |
| **Mô tả** | Quản lý chi tiết từng phòng, giường trong khu trọ |
| **Tiền điều kiện** | Khu trọ đã được phê duyệt |
| **Hậu điều kiện** | Thông tin phòng/giường chính xác, cập nhật realtime |

### Luồng chính
1. Quản lý truy cập bảng điều khiển khu trọ
2. Xem sơ đồ tầng/phòng (floor plan) dạng visual
3. Quản lý từng phòng:
   - **Thêm phòng mới**: Số phòng, tầng, loại, diện tích, giá
   - **Cập nhật trạng thái phòng:**

```
[Trống] → [Đã đặt] → [Đang ở] → [Đang trả] → [Bảo trì] → [Trống]
```

   - **Quản lý giường** (phòng ký túc xá):
     - Số giường, vị trí (trên/dưới)
     - Trạng thái từng giường: Trống / Đã đặt / Đang ở / Bảo trì
     - Người ở hiện tại (liên kết hồ sơ NVTV)
4. Xem tổng quan:
   - Tỷ lệ lấp đầy (occupancy rate)
   - Số phòng/giường trống theo loại
   - Doanh thu trọ tháng này

### Sơ đồ phòng mẫu (Visual)
```
Tầng 1:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ P101 │ │ P102 │ │ P103 │ │ P104 │
│ 🟢   │ │ 🔴   │ │ 🟡   │ │ 🟢   │
│Trống │ │Đang ở│ │Bảo trì│ │Trống │
│ 2/4  │ │ 4/4  │ │ 0/4  │ │ 0/4  │
└──────┘ └──────┘ └──────┘ └──────┘

🟢 Còn chỗ   🔴 Đầy   🟡 Bảo trì   ⚪ Đã đặt
```

---

## UC-TR-03: Đăng ký chỗ trọ cho NVTV

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NVTV, Điều phối viên |
| **Mô tả** | NVTV đăng ký chỗ trọ khi được nhận việc |
| **Tiền điều kiện** | NVTV đã ký hợp đồng lao động, khu trọ còn chỗ |
| **Hậu điều kiện** | NVTV được phân bổ chỗ ở, hợp đồng trọ được tạo |

### Luồng chính
1. Sau khi ký hợp đồng lao động, hệ thống gợi ý khu trọ:
   - Gần nơi làm việc (sắp xếp theo khoảng cách)
   - Còn chỗ trống
   - Phù hợp ngân sách
   - Phù hợp giới tính (nếu có khu riêng)
2. NVTV xem danh sách khu trọ gợi ý:
   - Ảnh thực tế
   - Bản đồ vị trí + khoảng cách đến nơi làm việc
   - Giá phòng/giường
   - Tiện ích
   - Đánh giá từ NVTV khác
   - Số chỗ còn trống
3. NVTV chọn khu trọ và loại chỗ ở mong muốn
4. Gửi yêu cầu đặt chỗ
5. Quản lý trọ xác nhận và phân bổ phòng/giường cụ thể
6. Tạo hợp đồng thuê trọ:
   - Liên kết với hợp đồng lao động
   - Thời hạn thuê = Thời hạn hợp đồng lao động
   - Giá thuê, tiền cọc
   - Phương thức thanh toán (trừ lương / tự thanh toán)
   - Nội quy khu trọ
7. NVTV ký hợp đồng thuê trọ điện tử
8. NVTV nhận thông tin phòng (số phòng, mật khẩu WiFi, nội quy...)

### Luồng phụ
- **1a.** NVTV tự tìm trọ (không qua hệ thống gợi ý) → Chọn "Tự lo chỗ ở"
- **4a.** Không còn chỗ trống tại khu trọ mong muốn → Gợi ý khu trọ thay thế hoặc đặt trong danh sách chờ
- **6a.** NTD hỗ trợ trả tiền trọ (benefit) → Hệ thống tính vào chi phí NTD

---

## UC-TR-04: Thu tiền trọ và tiện ích

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Quản lý khu trọ, NVTV |
| **Mô tả** | Quản lý việc thu tiền trọ hàng tháng và các chi phí phát sinh |
| **Tiền điều kiện** | NVTV đang ở trọ, có hợp đồng thuê |
| **Hậu điều kiện** | Tiền trọ được thu đầy đủ, ghi nhận rõ ràng |

### Luồng chính
1. Đầu tháng (hoặc kỳ thanh toán), hệ thống tạo hóa đơn:
   - **Tiền phòng/giường**: Theo hợp đồng
   - **Điện**: Chỉ số đầu kỳ → cuối kỳ × đơn giá
   - **Nước**: Theo đầu người hoặc đồng hồ
   - **Internet**: Chia đều hoặc theo gói
   - **Rác vệ sinh**: Theo tháng
   - **Phí phát sinh**: Sửa chữa do NVTV gây ra, phạt vi phạm nội quy...
   - **Tổng cộng**
2. Gửi hóa đơn cho NVTV qua app/SMS
3. NVTV xem chi tiết hóa đơn
4. Thanh toán bằng một trong các hình thức:
   - **Trừ tự động vào lương** (nếu đã đăng ký)
   - Chuyển khoản
   - Ví điện tử
   - Tiền mặt (quản lý xác nhận)
5. Hệ thống ghi nhận thanh toán, cập nhật trạng thái hóa đơn:

```
[Chưa thanh toán] → [Đã thanh toán một phần] → [Đã thanh toán đủ]
                  → [Quá hạn] → [Nợ xấu]
```

6. Xuất phiếu thu/biên lai

### Luồng phụ
- **1a.** Quản lý nhập chỉ số điện/nước bằng chụp ảnh đồng hồ → OCR tự động đọc
- **4a.** NVTV không thanh toán đúng hạn → Nhắc nhở tự động (ngày 5, 10, 15) → Sau 15 ngày, thông báo điều phối viên
- **4b.** NVTV thanh toán từng phần → Ghi nhận số tiền đã trả, còn lại

### Quy tắc nghiệp vụ
- Hạn thanh toán: **Ngày 5 hàng tháng** (cấu hình được)
- Phạt trễ: **5% / tuần** trễ hạn (tối đa 20%)
- Quá 30 ngày không thanh toán → Thông báo và xem xét chấm dứt hợp đồng trọ

---

## UC-TR-05: Ghi nhận chỉ số điện nước

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Quản lý khu trọ |
| **Mô tả** | Ghi nhận chỉ số điện, nước hàng tháng cho từng phòng |
| **Tiền điều kiện** | Phòng đang có người ở |
| **Hậu điều kiện** | Chỉ số được cập nhật, sẵn sàng tính tiền |

### Luồng chính
1. Cuối tháng, quản lý ghi nhận chỉ số:
   - Chọn phòng
   - Nhập chỉ số điện mới (hoặc chụp ảnh đồng hồ)
   - Nhập chỉ số nước mới (hoặc chụp ảnh đồng hồ)
2. Hệ thống tự động tính:
   - Điện tiêu thụ = Chỉ số mới - Chỉ số cũ
   - Tiền điện = KWh × Đơn giá (theo bậc thang hoặc cố định)
   - Nước tiêu thụ = Chỉ số mới - Chỉ số cũ
   - Tiền nước = m3 × Đơn giá
3. Quản lý xác nhận
4. Tự động cập nhật vào hóa đơn tháng

### Luồng phụ
- **1a.** Ghi nhận hàng loạt: Quản lý nhập chỉ số nhiều phòng liên tục
- **2a.** Chỉ số bất thường (tăng đột biến) → Hệ thống cảnh báo để kiểm tra lại

---

## UC-TR-06: Bảo trì và sửa chữa

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NVTV (người ở), Quản lý khu trọ |
| **Mô tả** | Quản lý yêu cầu bảo trì, sửa chữa trong khu trọ |
| **Tiền điều kiện** | Có sự cố cần bảo trì |
| **Hậu điều kiện** | Sự cố được xử lý, chi phí được phân bổ đúng |

### Luồng chính
1. NVTV hoặc quản lý phát hiện sự cố
2. Tạo yêu cầu bảo trì:
   - Loại sự cố: Điện / Nước / Cơ sở vật chất / Khác
   - Mô tả chi tiết
   - Chụp ảnh/video sự cố
   - Mức độ khẩn cấp: Thấp / Trung bình / Cao / Khẩn cấp
   - Phòng/Vị trí
3. Quản lý tiếp nhận và phân loại:
   - Tự xử lý
   - Gọi thợ bên ngoài
4. Cập nhật tiến độ xử lý:

```
[Mới tạo] → [Đã tiếp nhận] → [Đang xử lý] → [Hoàn thành] → [NVTV xác nhận]
```

5. Ghi nhận chi phí sửa chữa:
   - Do hao mòn tự nhiên → Chủ trọ chịu
   - Do NVTV gây ra → NVTV chịu (cộng vào hóa đơn)
6. NVTV xác nhận hoàn thành

### Luồng phụ
- **2a.** Sự cố khẩn cấp (rò điện, ngập nước...) → Thông báo ngay quản lý + gọi điện trực tiếp
- **5a.** Tranh chấp trách nhiệm chi phí → Điều phối viên phân xử

---

## UC-TR-07: Trả phòng và hoàn cọc

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NVTV, Quản lý khu trọ |
| **Mô tả** | Xử lý khi NVTV rời khỏi phòng trọ |
| **Tiền điều kiện** | NVTV đang ở trọ |
| **Hậu điều kiện** | Phòng được giải phóng, tiền cọc hoàn trả (nếu đủ điều kiện) |

### Luồng chính
1. NVTV hoặc hệ thống (khi hợp đồng lao động kết thúc) gửi yêu cầu trả phòng
2. Quản lý kiểm tra:
   - Tình trạng phòng/giường
   - Tình trạng tài sản (có hư hỏng không)
   - Chỉ số điện nước cuối cùng
   - Công nợ còn lại
3. Tạo biên bản trả phòng:
   - Checklist tình trạng tài sản
   - Ảnh chụp phòng khi trả
   - Chi phí phát sinh (hư hỏng, vệ sinh...)
4. Tính toán hoàn cọc:
   - Tiền cọc ban đầu
   - Trừ: Công nợ + Chi phí sửa chữa/vệ sinh
   - **Số tiền hoàn lại = Cọc - Trừ**
5. Hoàn cọc cho NVTV
6. Cập nhật trạng thái phòng → "Đang dọn dẹp" → "Trống"
7. NVTV đánh giá khu trọ (tùy chọn)

### Luồng phụ
- **1a.** NVTV bỏ đi không báo trước → Quản lý báo cáo → Không hoàn cọc → Trừ điểm uy tín NVTV
- **4a.** Cọc không đủ bù chi phí → Ghi nhận công nợ, thông báo NVTV

---

## UC-TR-08: Quản lý nội quy và vi phạm

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Quản lý khu trọ |
| **Mô tả** | Thiết lập nội quy và xử lý vi phạm |
| **Tiền điều kiện** | Khu trọ đã hoạt động |
| **Hậu điều kiện** | Vi phạm được ghi nhận, xử lý theo quy định |

### Nội quy mẫu
- Giờ giới nghiêm: 23h00 (cấu hình được)
- Không mang chất cấm vào khu trọ
- Không gây mất trật tự
- Không tự ý sửa chữa điện nước
- Đăng ký khách qua đêm trước 20h00
- Phân loại rác đúng quy định
- Giữ gìn vệ sinh chung

### Xử lý vi phạm
```
Lần 1: Nhắc nhở bằng văn bản
Lần 2: Phạt tiền (50.000đ - 500.000đ tùy mức độ)
Lần 3: Cảnh cáo + Phạt tiền gấp đôi
Lần 4: Chấm dứt hợp đồng thuê trọ
```

### Luồng chính
1. Quản lý phát hiện vi phạm
2. Ghi nhận: Ngày giờ, phòng, người vi phạm, nội dung, bằng chứng (ảnh/video)
3. Phân loại mức độ vi phạm: Nhẹ / Trung bình / Nặng
4. Áp dụng hình thức xử lý theo bảng quy định
5. Thông báo cho NVTV
6. NVTV có quyền phản hồi/khiếu nại trong 48h
7. Cập nhật hồ sơ vi phạm của NVTV

---

## UC-TR-09: Quản lý khu vực liên kết

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Admin hệ thống, Điều phối viên |
| **Mô tả** | Quản lý các khu vực địa lý và liên kết giữa khu trọ - doanh nghiệp |
| **Tiền điều kiện** | Có khu trọ và NTD đã đăng ký |
| **Hậu điều kiện** | Bản đồ liên kết khu vực hoạt động hiệu quả |

### Luồng chính
1. Admin định nghĩa khu vực hoạt động:
   - Tên khu vực (VD: KCN Bắc Thăng Long, KCN Bình Dương...)
   - Ranh giới trên bản đồ (polygon)
   - Bán kính phục vụ (km)
2. Liên kết khu trọ vào khu vực:
   - Khu trọ nằm trong ranh giới → Tự động liên kết
   - Khu trọ ngoài ranh giới nhưng gần → Liên kết thủ công
3. Liên kết NTD/địa điểm làm việc vào khu vực
4. Hệ thống tạo bản đồ liên kết:

```
┌─────────── KHU VỰC: KCN Bắc Thăng Long ───────────┐
│                                                      │
│   🏭 Công ty A        🏠 Trọ Hoàng Anh             │
│   (cần 50 NVTV)       (30 chỗ trống)               │
│        │                    │                        │
│        └──── 1.2km ────────┘                        │
│                                                      │
│   🏭 Công ty B        🏠 Trọ Minh Phát             │
│   (cần 30 NVTV)       (20 chỗ trống)               │
│        │                    │                        │
│        └──── 0.8km ────────┘                        │
│                                                      │
│   🏭 Công ty C        🏠 Trọ Thành Đạt             │
│   (cần 20 NVTV)       (15 chỗ trống)               │
│        │                    │                        │
│        └──── 2.5km ────────┘                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

5. Thống kê theo khu vực:
   - Tổng nhu cầu tuyển dụng
   - Tổng chỗ trọ khả dụng
   - Cung/cầu lao động
   - Tỷ lệ lấp đầy trọ
   - Khoảng cách trung bình trọ - nơi làm việc
