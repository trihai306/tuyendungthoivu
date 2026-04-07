# Use Cases - Module Tuyển Dụng Nhân Viên Thời Vụ

---

## UC-TD-01: Đăng tin tuyển dụng

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Nhà tuyển dụng (NTD) |
| **Mô tả** | NTD tạo và đăng tin tuyển dụng NVTV lên hệ thống |
| **Tiền điều kiện** | NTD đã đăng ký tài khoản và được xác minh |
| **Hậu điều kiện** | Tin tuyển dụng hiển thị trên hệ thống, NVTV có thể xem và ứng tuyển |

### Luồng chính
1. NTD đăng nhập hệ thống
2. Chọn "Tạo tin tuyển dụng mới"
3. Điền thông tin:
   - Tiêu đề công việc
   - Mô tả công việc chi tiết
   - Yêu cầu ứng viên (tuổi, giới tính, sức khỏe, kinh nghiệm...)
   - Số lượng cần tuyển
   - Mức lương/ca/giờ
   - Thời gian làm việc (ngày bắt đầu - kết thúc)
   - Ca làm việc (sáng/chiều/tối/đêm)
   - Địa điểm làm việc (chọn trên bản đồ hoặc nhập địa chỉ)
   - Có hỗ trợ chỗ ở hay không (liên kết module trọ)
   - Phúc lợi khác (ăn trưa, xe đưa đón, bảo hiểm...)
   - Hạn nộp hồ sơ
4. Xem trước tin tuyển dụng
5. Gửi duyệt (hoặc đăng trực tiếp nếu NTD đã được trust)
6. Hệ thống gửi thông báo cho NVTV phù hợp trong khu vực

### Luồng phụ
- **3a.** NTD chọn "Có hỗ trợ chỗ ở" → Hệ thống hiển thị danh sách khu trọ liên kết gần địa điểm làm việc → NTD chọn khu trọ ưu tiên
- **5a.** Tin cần duyệt → Admin/Điều phối viên duyệt → Nếu từ chối, gửi lý do cho NTD
- **5b.** NTD lưu nháp để chỉnh sửa sau

### Ngoại lệ
- NTD chưa xác minh giấy phép kinh doanh → Yêu cầu bổ sung hồ sơ
- Thông tin tin tuyển dụng vi phạm quy định (lương dưới mức tối thiểu, phân biệt đối xử) → Từ chối và thông báo lý do

---

## UC-TD-02: Tìm kiếm và ứng tuyển việc làm

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Nhân viên thời vụ (NVTV) |
| **Mô tả** | NVTV tìm kiếm việc phù hợp và gửi hồ sơ ứng tuyển |
| **Tiền điều kiện** | NVTV đã có tài khoản và hoàn thiện hồ sơ cá nhân |
| **Hậu điều kiện** | Hồ sơ ứng tuyển được gửi đến NTD |

### Luồng chính
1. NVTV đăng nhập hệ thống
2. Tìm kiếm việc theo bộ lọc:
   - Khu vực / Bán kính (km)
   - Loại công việc (phục vụ, kho bãi, sản xuất, bán hàng, sự kiện...)
   - Mức lương mong muốn
   - Ca làm việc
   - Thời gian (ngắn hạn / dài hạn)
   - Có chỗ ở kèm theo
3. Xem danh sách kết quả (sắp xếp theo phù hợp, khoảng cách, lương)
4. Xem chi tiết tin tuyển dụng
5. Nhấn "Ứng tuyển"
6. Chọn hồ sơ gửi (hồ sơ mặc định hoặc tùy chỉnh cho vị trí này)
7. Thêm lời nhắn cho NTD (tùy chọn)
8. Xác nhận gửi
9. Hệ thống thông báo cho NTD có ứng viên mới

### Luồng phụ
- **4a.** Tin có hỗ trợ chỗ ở → NVTV xem thông tin khu trọ liên kết (ảnh, giá, tiện ích)
- **5a.** NVTV chưa hoàn thiện hồ sơ → Hệ thống yêu cầu bổ sung trước khi ứng tuyển
- **8a.** NVTV đánh dấu "Quan tâm" để xem xét sau

### Ngoại lệ
- Tin tuyển dụng đã hết hạn hoặc đủ người → Thông báo, gợi ý tin tương tự
- NVTV đã ứng tuyển vị trí này rồi → Thông báo, cho phép cập nhật hồ sơ

---

## UC-TD-03: Sàng lọc và quản lý ứng viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | Nhà tuyển dụng (NTD), Điều phối viên |
| **Mô tả** | Xem, đánh giá, sàng lọc hồ sơ ứng viên và chuyển trạng thái |
| **Tiền điều kiện** | Có ứng viên đã ứng tuyển |
| **Hậu điều kiện** | Ứng viên được phân loại theo trạng thái pipeline |

### Luồng chính
1. NTD xem danh sách ứng viên theo tin tuyển dụng
2. Lọc ứng viên theo tiêu chí:
   - Điểm phù hợp (AI matching score)
   - Kinh nghiệm tương tự
   - Đánh giá từ NTD trước đó (rating/review)
   - Khoảng cách đến nơi làm việc
   - Khả năng nhận việc ngay
3. Xem hồ sơ chi tiết từng ứng viên
4. Chuyển trạng thái ứng viên trong pipeline:

```
[Mới nhận] → [Đang xem xét] → [Mời phỏng vấn] → [Đã phỏng vấn] → [Đạt] → [Nhận việc]
                                                                    → [Không đạt]
                              → [Từ chối]
```

5. Thêm ghi chú đánh giá cho từng ứng viên
6. Gửi thông báo kết quả cho ứng viên

### Luồng phụ
- **2a.** Hệ thống tự động xếp hạng ứng viên dựa trên mức độ phù hợp
- **4a.** Chuyển trạng thái hàng loạt (bulk action) cho nhiều ứng viên
- **6a.** Gửi tin nhắn tùy chỉnh kèm lý do từ chối/mời phỏng vấn

---

## UC-TD-04: Phỏng vấn ứng viên

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NTD, NVTV |
| **Mô tả** | Lên lịch và thực hiện phỏng vấn ứng viên |
| **Tiền điều kiện** | Ứng viên ở trạng thái "Mời phỏng vấn" |
| **Hậu điều kiện** | Ứng viên được đánh giá đạt/không đạt |

### Luồng chính
1. NTD chọn ứng viên cần phỏng vấn
2. Chọn hình thức phỏng vấn:
   - Trực tiếp tại địa điểm
   - Online (video call)
   - Phỏng vấn qua điện thoại
3. Chọn ngày/giờ phỏng vấn (hoặc gửi nhiều khung giờ để NVTV chọn)
4. Hệ thống gửi lịch hẹn cho NVTV
5. NVTV xác nhận/đề xuất đổi lịch
6. Sau phỏng vấn, NTD đánh giá:
   - Thái độ (1-5 sao)
   - Kỹ năng giao tiếp (1-5 sao)
   - Phù hợp công việc (1-5 sao)
   - Ghi chú bổ sung
7. Chuyển trạng thái: Đạt hoặc Không đạt

### Luồng phụ
- **3a.** Phỏng vấn nhóm: NTD mời nhiều ứng viên cùng khung giờ
- **5a.** NVTV không phản hồi trong 24h → Hệ thống nhắc nhở → Sau 48h đánh dấu "Không phản hồi"

---

## UC-TD-05: Ký hợp đồng thời vụ

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NTD, NVTV, Điều phối viên |
| **Mô tả** | Tạo và ký kết hợp đồng lao động thời vụ điện tử |
| **Tiền điều kiện** | NVTV đã phỏng vấn đạt |
| **Hậu điều kiện** | Hợp đồng có hiệu lực, NVTV chính thức đi làm |

### Luồng chính
1. NTD tạo hợp đồng từ mẫu (template):
   - Thông tin NTD & NVTV (tự động điền từ hồ sơ)
   - Vị trí công việc
   - Thời hạn hợp đồng (từ ngày - đến ngày)
   - Lương/ca, cách tính lương
   - Ca làm việc, ngày nghỉ
   - Quy định kỷ luật
   - Điều khoản chỗ ở (nếu có)
   - Điều khoản chấm dứt hợp đồng
2. Gửi hợp đồng cho NVTV xem xét
3. NVTV xem chi tiết hợp đồng
4. NVTV đồng ý và ký điện tử (chữ ký tay trên màn hình hoặc OTP xác nhận)
5. NTD xác nhận và ký điện tử
6. Hệ thống lưu hợp đồng, gửi bản PDF cho cả hai bên
7. **Kích hoạt liên kết**: Nếu có chỗ ở → Tạo yêu cầu phân bổ trọ

### Luồng phụ
- **3a.** NVTV yêu cầu chỉnh sửa điều khoản → NTD xem xét và cập nhật
- **4a.** NVTV từ chối ký → Ghi nhận lý do, NTD có thể liên hệ lại
- **7a.** Gia hạn hợp đồng: Tạo phụ lục hợp đồng mới dựa trên hợp đồng cũ

### Ngoại lệ
- NVTV dưới 15 tuổi → Từ chối, thông báo quy định pháp luật
- NVTV đang có hợp đồng trùng thời gian → Cảnh báo xung đột lịch

---

## UC-TD-06: Chấm công nhân viên thời vụ

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NVTV, NTD/Giám sát |
| **Mô tả** | Ghi nhận thời gian làm việc thực tế của NVTV |
| **Tiền điều kiện** | Hợp đồng đang có hiệu lực |
| **Hậu điều kiện** | Dữ liệu chấm công được ghi nhận chính xác |

### Luồng chính
1. NVTV đến nơi làm việc
2. Chấm công bằng một trong các hình thức:
   - **QR Code**: Quét mã QR tại điểm làm việc
   - **GPS Check-in**: Check-in kèm vị trí GPS (trong bán kính cho phép)
   - **Nhận diện khuôn mặt**: Chụp ảnh xác nhận (chống chấm hộ)
   - **NFC**: Chạm thẻ tại thiết bị
3. Hệ thống ghi nhận: Giờ vào - Giờ ra - Tổng giờ làm
4. Cuối ca, NVTV check-out
5. Giám sát xác nhận công của NVTV

### Luồng phụ
- **2a.** NVTV quên check-in → Giám sát bổ sung thủ công kèm ghi chú
- **3a.** NVTV làm thêm giờ (OT) → Giám sát phê duyệt OT
- **5a.** NVTV vắng không phép → Hệ thống đánh dấu, trừ điểm uy tín
- **5b.** NVTV nghỉ có phép → Gửi đơn xin nghỉ trước, giám sát duyệt

### Quy tắc nghiệp vụ
- Chấm công GPS phải trong bán kính **200m** từ địa điểm làm việc
- Check-in trước giờ làm tối đa **30 phút**, sau giờ làm tối đa **15 phút** (cấu hình được)
- Nếu không check-out → Tự động tính theo giờ kết thúc ca hoặc yêu cầu giám sát xác nhận

---

## UC-TD-07: Tính lương và thanh toán

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NTD, Kế toán, NVTV |
| **Mô tả** | Tính lương dựa trên chấm công và thanh toán cho NVTV |
| **Tiền điều kiện** | Có dữ liệu chấm công đã xác nhận |
| **Hậu điều kiện** | NVTV nhận được lương đúng, đủ |

### Luồng chính
1. Hệ thống tổng hợp chấm công theo kỳ lương (tuần/2 tuần/tháng)
2. Tính lương tự động:
   - Lương cơ bản = Số ca/giờ × Đơn giá
   - Lương OT = Giờ OT × Đơn giá OT (150% / 200% / 300%)
   - Phụ cấp (ăn, đi lại, ca đêm...)
   - Khấu trừ:
     - Tiền trọ (nếu ở trọ liên kết, **tự động trừ vào lương**)
     - Tiền tạm ứng (nếu có)
     - Vi phạm kỷ luật (nếu có)
   - **Lương thực nhận = Tổng thu nhập - Tổng khấu trừ**
3. NTD/Kế toán xem bảng lương, điều chỉnh nếu cần
4. Phê duyệt bảng lương
5. Thanh toán qua:
   - Chuyển khoản ngân hàng
   - Ví điện tử (MoMo, ZaloPay...)
   - Tiền mặt (ghi nhận biên lai)
6. Gửi phiếu lương điện tử cho NVTV
7. NVTV xem chi tiết và xác nhận/khiếu nại

### Luồng phụ
- **2a.** NVTV tạm ứng lương trước kỳ (tối đa % lương đã làm) → NTD duyệt
- **7a.** NVTV khiếu nại sai lương → Tạo ticket hỗ trợ → Kế toán xem xét

### Quy tắc nghiệp vụ
- Lương OT ngày thường: **150%**
- Lương OT ngày nghỉ: **200%**
- Lương OT ngày lễ: **300%**
- Ca đêm (22h-6h): Phụ cấp thêm **30%**
- Tiền trọ khấu trừ tự động nếu NVTV đăng ký trọ liên kết

---

## UC-TD-08: Đánh giá và xếp hạng NVTV

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NTD, NVTV |
| **Mô tả** | Đánh giá hai chiều sau khi kết thúc hợp đồng |
| **Tiền điều kiện** | Hợp đồng đã kết thúc hoặc đang thực hiện |
| **Hậu điều kiện** | Điểm uy tín được cập nhật |

### Luồng chính
1. Kết thúc hợp đồng hoặc cuối kỳ đánh giá
2. **NTD đánh giá NVTV:**
   - Chuyên cần (1-5 sao)
   - Thái độ làm việc (1-5 sao)
   - Năng lực/Kỹ năng (1-5 sao)
   - Nhận xét bằng text
   - Có muốn tuyển lại? (Có / Không / Có thể)
3. **NVTV đánh giá NTD:**
   - Môi trường làm việc (1-5 sao)
   - Thanh toán đúng hạn (1-5 sao)
   - Đối xử với NVTV (1-5 sao)
   - Nhận xét bằng text
4. Hệ thống tính điểm uy tín tích lũy cho cả hai bên
5. Điểm uy tín ảnh hưởng đến:
   - NVTV: Ưu tiên gợi ý cho NTD, mức lương gợi ý cao hơn
   - NTD: Ưu tiên hiển thị tin tuyển dụng, NVTV tin tưởng hơn

---

## UC-TD-09: Quản lý hồ sơ NVTV

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NVTV |
| **Mô tả** | NVTV tạo và quản lý hồ sơ cá nhân trên hệ thống |
| **Tiền điều kiện** | NVTV đã đăng ký tài khoản |
| **Hậu điều kiện** | Hồ sơ đầy đủ, sẵn sàng ứng tuyển |

### Thông tin hồ sơ

#### Thông tin cá nhân
- Họ tên, ngày sinh, giới tính
- CCCD/CMND (chụp mặt trước/sau)
- Số điện thoại, email
- Địa chỉ thường trú & tạm trú
- Ảnh chân dung
- Tình trạng sức khỏe

#### Thông tin nghề nghiệp
- Kỹ năng (chọn từ danh sách + tự thêm)
- Kinh nghiệm làm việc thời vụ trước đó
- Bằng cấp/Chứng chỉ (nếu có)
- Loại công việc mong muốn
- Khu vực mong muốn làm việc
- Mức lương mong muốn
- Ca làm việc ưu tiên
- Khả năng bắt đầu ngay

#### Thông tin bổ sung
- Tài khoản ngân hàng (để nhận lương)
- Người liên hệ khẩn cấp
- Có cần chỗ ở không
- Phương tiện di chuyển (xe máy, xe đạp, đi bộ...)

---

## UC-TD-10: Chấm dứt hợp đồng sớm

| Thuộc tính | Mô tả |
|------------|-------|
| **Actor** | NTD, NVTV, Điều phối viên |
| **Mô tả** | Xử lý trường hợp chấm dứt hợp đồng trước thời hạn |
| **Tiền điều kiện** | Hợp đồng đang có hiệu lực |
| **Hậu điều kiện** | Hợp đồng chấm dứt, thanh toán quyết toán, trả phòng trọ |

### Luồng chính
1. NTD hoặc NVTV gửi yêu cầu chấm dứt hợp đồng sớm
2. Ghi nhận lý do:
   - NVTV: Lý do cá nhân, sức khỏe, tìm được việc khác...
   - NTD: Vi phạm kỷ luật, cắt giảm, không đạt yêu cầu...
3. Điều phối viên xem xét (nếu có tranh chấp)
4. Tính toán quyết toán:
   - Lương còn lại chưa thanh toán
   - Tiền phạt vi phạm hợp đồng (nếu có theo điều khoản)
   - Tiền trọ (tính đến ngày trả phòng)
5. Cả hai bên xác nhận quyết toán
6. **Kích hoạt liên kết**: Nếu NVTV ở trọ liên kết → Tạo yêu cầu trả phòng
7. Cập nhật trạng thái hợp đồng: "Đã chấm dứt sớm"
8. Cập nhật điểm uy tín tương ứng

### Quy tắc nghiệp vụ
- NVTV bỏ việc không báo trước: Trừ **50 điểm** uy tín
- NVTV báo trước 3 ngày: Không phạt
- NTD chấm dứt không lý do chính đáng: Bồi thường NVTV theo quy định
