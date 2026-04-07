# Tổng Quan Dự Án: Tuyển Dụng Nhân Viên Thời Vụ & Quản Lý Trọ Liên Kết

## 1. Giới thiệu

Dự án xây dựng hệ thống **kết hợp hai nghiệp vụ chính**:

- **Tuyển dụng nhân viên thời vụ (NVTV)**: Quản lý toàn bộ quy trình từ đăng tin, tiếp nhận ứng viên, phỏng vấn, ký hợp đồng thời vụ, chấm công, thanh toán lương.
- **Quản lý nhà trọ liên kết**: Quản lý các khu trọ theo vùng/khu vực, phân bổ chỗ ở cho NVTV, thu tiền trọ, theo dõi hợp đồng thuê trọ.

Hai nghiệp vụ này **liên kết chặt chẽ** vì nhân viên thời vụ thường đến từ các tỉnh khác, cần chỗ ở tạm thời gần nơi làm việc.

## 2. Mục tiêu dự án

| # | Mục tiêu | Mô tả |
|---|----------|-------|
| 1 | Số hóa quy trình tuyển dụng | Thay thế quy trình giấy tờ bằng hệ thống online |
| 2 | Quản lý trọ tập trung | Quản lý nhiều khu trọ liên kết trên một hệ thống |
| 3 | Liên kết tuyển dụng - trọ | Tự động gợi ý/phân bổ chỗ trọ khi NVTV được nhận việc |
| 4 | Theo dõi tài chính | Quản lý lương NVTV, chi phí trọ, công nợ |
| 5 | Báo cáo & thống kê | Dashboard tổng hợp cho quản lý |

## 3. Đối tượng sử dụng (Actors)

| Actor | Vai trò | Mô tả |
|-------|---------|-------|
| **Admin hệ thống** | Quản trị | Quản lý toàn bộ hệ thống, phân quyền |
| **Nhà tuyển dụng (NTD)** | Doanh nghiệp | Đăng tin, tuyển dụng, quản lý NVTV |
| **Quản lý khu trọ** | Chủ trọ/Quản lý | Quản lý phòng, giường, thu tiền trọ |
| **Nhân viên thời vụ (NVTV)** | Ứng viên/Người lao động | Tìm việc, ứng tuyển, đăng ký trọ |
| **Nhân viên điều phối** | Trung gian | Kết nối NTD với NVTV, phân bổ trọ |

## 4. Phạm vi hệ thống

### 4.1 Module Tuyển dụng
- Quản lý tin tuyển dụng
- Quản lý hồ sơ ứng viên
- Quy trình phỏng vấn & đánh giá
- Hợp đồng thời vụ
- Chấm công & tính lương
- Đánh giá hiệu suất NVTV

### 4.2 Module Quản lý trọ
- Quản lý khu vực / khu trọ
- Quản lý phòng & giường
- Hợp đồng thuê trọ
- Thu tiền trọ & tiện ích
- Bảo trì & sửa chữa

### 4.3 Module Liên kết
- Gợi ý trọ theo vị trí làm việc
- Phân bổ trọ tự động/thủ công
- Thanh toán tích hợp (lương - tiền trọ)
- Theo dõi trạng thái NVTV + trọ

### 4.4 Module Hỗ trợ
- Quản lý người dùng & phân quyền
- Thông báo (SMS, Email, Push)
- Báo cáo & thống kê
- Tích hợp bản đồ khu vực

## 5. Công nghệ đề xuất

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | React/Next.js hoặc Vue.js |
| Backend | Node.js (NestJS) hoặc Laravel |
| Database | PostgreSQL |
| Cache | Redis |
| File Storage | MinIO / S3 |
| Realtime | WebSocket (Socket.io) |
| Map | Leaflet / Google Maps API |
| Mobile | React Native / Flutter |
| CI/CD | GitHub Actions / GitLab CI |

## 6. Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Web App  │  │ Mobile   │  │ Admin Dashboard  │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
└───────┼──────────────┼─────────────────┼────────────┘
        │              │                 │
┌───────┼──────────────┼─────────────────┼────────────┐
│       ▼              ▼                 ▼            │
│                  API GATEWAY                         │
│              (Authentication/Rate Limit)             │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│              SERVICE LAYER                           │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │  Tuyển dụng  │ │  Quản lý trọ │ │  Liên kết   │ │
│  │   Service    │ │   Service    │ │   Service   │ │
│  └──────┬───────┘ └──────┬───────┘ └──────┬──────┘ │
└─────────┼────────────────┼────────────────┼─────────┘
          │                │                │
┌─────────┼────────────────┼────────────────┼─────────┐
│         ▼                ▼                ▼         │
│                   DATA LAYER                         │
│  ┌────────────┐  ┌───────┐  ┌──────────────────┐   │
│  │ PostgreSQL │  │ Redis │  │ File Storage     │   │
│  └────────────┘  └───────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 7. Rủi ro & Giải pháp

| Rủi ro | Mức độ | Giải pháp |
|--------|--------|-----------|
| Dữ liệu cá nhân NVTV bị lộ | Cao | Mã hóa dữ liệu, phân quyền chặt, tuân thủ PDPA |
| NVTV bỏ việc giữa chừng | Trung bình | Cơ chế đánh giá uy tín, đặt cọc |
| Tranh chấp tiền trọ | Trung bình | Hợp đồng điện tử rõ ràng, lịch sử thanh toán minh bạch |
| Quá tải mùa cao điểm | Cao | Auto-scaling, caching, queue hệ thống |
| Chủ trọ không hợp tác | Thấp | Chính sách ưu đãi, hợp đồng cam kết |
