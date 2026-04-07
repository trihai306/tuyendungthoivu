# Lộ Trình Phát Triển & Ưu Tiên

---

## Tổng quan các Phase

```
Phase 1 (MVP)          Phase 2               Phase 3              Phase 4
8-10 tuần              6-8 tuần              6-8 tuần             4-6 tuần
───────────────────── ──────────────────── ──────────────────── ────────────────
Core tuyển dụng       Chấm công & Lương    Liên kết thông minh  Mở rộng & Tối ưu
Core quản lý trọ      Thanh toán tích hợp  AI matching          Mobile app
Đăng ký / Xác minh    Hợp đồng điện tử     Dashboard analytics  API đối tác
```

---

## Phase 1: MVP (Minimum Viable Product) — 8-10 tuần

### Mục tiêu
Xây dựng hệ thống cơ bản cho phép NTD đăng tin, NVTV ứng tuyển, và quản lý trọ cơ bản.

### Tính năng

| # | Tính năng | Ưu tiên | Sprint |
|---|-----------|---------|--------|
| 1 | Đăng ký & Đăng nhập (SĐT/Email + OTP) | P0 | 1 |
| 2 | Hồ sơ NVTV cơ bản | P0 | 1 |
| 3 | Hồ sơ NTD/Doanh nghiệp | P0 | 1 |
| 4 | Admin duyệt tài khoản | P0 | 1-2 |
| 5 | NTD đăng tin tuyển dụng | P0 | 2 |
| 6 | NVTV tìm kiếm & xem tin | P0 | 2 |
| 7 | NVTV ứng tuyển | P0 | 2-3 |
| 8 | NTD xem & duyệt ứng viên | P0 | 3 |
| 9 | Đăng ký khu trọ liên kết | P0 | 3-4 |
| 10 | Quản lý phòng/giường cơ bản | P0 | 4 |
| 11 | NVTV xem & đăng ký trọ | P1 | 4-5 |
| 12 | Hệ thống thông báo cơ bản (Push) | P1 | 5 |
| 13 | Chat cơ bản (NTD ↔ NVTV) | P1 | 5 |
| 14 | Admin dashboard cơ bản | P1 | 5 |

### Deliverables
- Web app (responsive) cho tất cả vai trò
- Admin panel
- API backend
- Database & Infrastructure

---

## Phase 2: Nghiệp vụ chính — 6-8 tuần

### Mục tiêu
Hoàn thiện luồng nghiệp vụ từ tuyển dụng đến thanh toán.

### Tính năng

| # | Tính năng | Ưu tiên | Sprint |
|---|-----------|---------|--------|
| 1 | Phỏng vấn & lịch hẹn | P0 | 6 |
| 2 | Hợp đồng lao động điện tử | P0 | 6-7 |
| 3 | Chấm công (QR + GPS) | P0 | 7-8 |
| 4 | Tính lương tự động | P0 | 8 |
| 5 | Hợp đồng thuê trọ | P0 | 7 |
| 6 | Ghi chỉ số điện nước | P0 | 7 |
| 7 | Hóa đơn trọ tự động | P0 | 8 |
| 8 | Thanh toán tích hợp (lương - trọ) | P0 | 8-9 |
| 9 | Đánh giá hai chiều | P1 | 9 |
| 10 | Hệ thống uy tín (credit score) | P1 | 9 |
| 11 | Bảo trì & sửa chữa | P1 | 9 |
| 12 | Vi phạm nội quy | P1 | 10 |
| 13 | Tạm ứng lương | P1 | 10 |
| 14 | Chấm dứt HĐ sớm & quyết toán | P1 | 10 |

### Deliverables
- Luồng tuyển dụng đầy đủ
- Hệ thống chấm công & lương
- Quản lý trọ đầy đủ
- Tích hợp thanh toán (VNPay/MoMo)

---

## Phase 3: Liên kết thông minh — 6-8 tuần

### Mục tiêu
Tối ưu hóa liên kết giữa tuyển dụng và trọ, thêm AI/Analytics.

### Tính năng

| # | Tính năng | Ưu tiên | Sprint |
|---|-----------|---------|--------|
| 1 | Gợi ý trọ tự động (thuật toán scoring) | P0 | 11 |
| 2 | Quản lý khu vực liên kết trên bản đồ | P0 | 11 |
| 3 | AI matching (NVTV ↔ Việc làm) | P1 | 12 |
| 4 | Đồng bộ trạng thái HĐ LĐ ↔ HĐ Trọ | P0 | 12 |
| 5 | Dashboard analytics (tuyển dụng) | P0 | 13 |
| 6 | Dashboard analytics (nhà trọ) | P0 | 13 |
| 7 | Dashboard liên kết khu vực | P1 | 14 |
| 8 | Báo cáo cung-cầu khu vực | P1 | 14 |
| 9 | eKYC (OCR + Face matching) | P1 | 15 |
| 10 | Chấm công Face Recognition | P2 | 15 |
| 11 | Dự báo nhu cầu theo mùa vụ | P2 | 16 |
| 12 | Tuyển dụng nhanh (Quick Hire) | P1 | 16 |

### Deliverables
- Hệ thống gợi ý thông minh
- Dashboard & Analytics đầy đủ
- eKYC
- Bản đồ liên kết khu vực

---

## Phase 4: Mở rộng & Tối ưu — 4-6 tuần

### Mục tiêu
Mobile app, tối ưu hiệu suất, mở rộng tính năng.

### Tính năng

| # | Tính năng | Ưu tiên | Sprint |
|---|-----------|---------|--------|
| 1 | Mobile app NVTV (React Native/Flutter) | P0 | 17-18 |
| 2 | Mobile app Quản lý trọ | P1 | 18-19 |
| 3 | OCR chỉ số điện nước | P2 | 19 |
| 4 | Thông báo Zalo OA | P1 | 19 |
| 5 | API cho đối tác | P2 | 20 |
| 6 | Pool ứng viên dự phòng | P2 | 20 |
| 7 | Cảnh báo sớm (AI) | P2 | 20 |
| 8 | Multi-language support | P2 | 21 |
| 9 | Performance optimization | P1 | 21 |
| 10 | Security audit & hardening | P0 | 21 |

---

## Ước tính nguồn lực

### Đội ngũ tối thiểu

| Vai trò | Số lượng | Ghi chú |
|---------|----------|---------|
| Project Manager | 1 | Quản lý dự án tổng thể |
| Business Analyst | 1 | Phân tích nghiệp vụ, viết spec |
| UI/UX Designer | 1 | Thiết kế giao diện |
| Frontend Developer | 2 | React/Next.js |
| Backend Developer | 2 | NestJS/Laravel |
| Mobile Developer | 1 | Từ Phase 4 |
| QA/Tester | 1 | Kiểm thử |
| DevOps | 0.5 | Part-time, setup CI/CD |

### Ước tính chi phí hạ tầng (tháng)

| Hạng mục | Chi phí/tháng |
|----------|--------------|
| Cloud Server (VPS/AWS) | 3-5 triệu VND |
| Database (managed) | 1-2 triệu VND |
| Storage (S3/MinIO) | 500K-1 triệu VND |
| SMS Gateway | 1-3 triệu VND (tùy lượng) |
| Email Service | 500K VND |
| Map API | 1-2 triệu VND |
| eKYC API | 2-5 triệu VND |
| **Tổng** | **~10-18 triệu VND** |

---

## Tiêu chí nghiệm thu từng Phase

### Phase 1 (MVP)
- [ ] NVTV đăng ký, tạo hồ sơ, tìm việc, ứng tuyển thành công
- [ ] NTD đăng tin, xem ứng viên, duyệt/từ chối
- [ ] Chủ trọ đăng ký khu trọ, quản lý phòng
- [ ] Admin duyệt tài khoản, quản lý hệ thống
- [ ] Thông báo push hoạt động
- [ ] Hệ thống chạy ổn định, không lỗi nghiêm trọng

### Phase 2
- [ ] Luồng phỏng vấn → Ký HĐ → Chấm công → Tính lương → Thanh toán hoàn chỉnh
- [ ] Hóa đơn trọ tự động, thanh toán tích hợp
- [ ] Đánh giá hai chiều hoạt động
- [ ] Hệ thống uy tín phản ánh đúng hành vi

### Phase 3
- [ ] Gợi ý trọ chính xác (>80% NVTV hài lòng với gợi ý top 3)
- [ ] Dashboard hiển thị đầy đủ KPI
- [ ] eKYC xác minh thành công >95% trường hợp
- [ ] Bản đồ liên kết khu vực hoạt động mượt mà

### Phase 4
- [ ] Mobile app hoạt động ổn định trên iOS + Android
- [ ] API response time < 200ms (95th percentile)
- [ ] Đạt security audit (không có lỗ hổng critical/high)
- [ ] Hệ thống xử lý được 1000+ concurrent users
