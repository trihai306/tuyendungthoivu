# Tài Liệu Dự Án: Tuyển Dụng NVTV & Quản Lý Trọ Liên Kết

> **Tech Stack:** React 18 + TypeScript + Tailwind CSS | Laravel 11 + PHP 8.3 | PostgreSQL + Redis

---

## Mục lục tài liệu

### Phần 1: Phân tích nghiệp vụ (BA)

| # | Tài liệu | Nội dung |
|---|----------|----------|
| 1 | [Tổng quan dự án](01-tong-quan-du-an.md) | Giới thiệu, mục tiêu, 5 actors, phạm vi 4 modules, kiến trúc tổng quan, rủi ro |
| 2 | [Use Cases - Tuyển dụng](02-use-cases-tuyen-dung.md) | 10 use cases: đăng tin, ứng tuyển, sàng lọc, phỏng vấn, hợp đồng, chấm công, lương, đánh giá |
| 3 | [Use Cases - Quản lý trọ](03-use-cases-quan-ly-tro.md) | 9 use cases: đăng ký trọ, phòng/giường, đăng ký chỗ ở, thu tiền, điện nước, bảo trì, trả phòng |
| 4 | [Use Cases - Liên kết & Hệ thống](04-use-cases-lien-ket-he-thong.md) | 10 use cases: gợi ý trọ, thanh toán tích hợp, thông báo, chat, phân quyền, báo cáo |
| 5 | [Phân tích vấn đề](05-van-de-phan-tich.md) | 15+ vấn đề nghiệp vụ/kỹ thuật/UX/vận hành + giải pháp chi tiết, KPI hệ thống |
| 6 | [BA Feature Flows](ba-feature-flows.md) | 38 User Stories, 5 Flow Diagrams (Mermaid), 21 Epics (353 SP), 40+ Business Rules, MoSCoW Matrix |

### Phần 2: Kiến trúc & Thiết kế

| # | Tài liệu | Nội dung |
|---|----------|----------|
| 7 | [Database Schema](06-database-schema.md) | 20+ bảng PostgreSQL, quan hệ, indexes |
| 8 | [Architecture Design](architecture-design.md) | Kiến trúc React+Laravel, folder structure, 100+ routes, Docker 9 services, CI/CD |
| 9 | [Frontend Specs](frontend-specs.md) | 40+ pages, 30+ shared components, Tailwind design system, Zustand + React Query |
| 10 | [Backend API Specs](backend-api-specs.md) | 22 modules API endpoints, 10 Models, 9 Services, Events/Listeners, Jobs/Queues |

### Phần 3: Kế hoạch triển khai & QA

| # | Tài liệu | Nội dung |
|---|----------|----------|
| 11 | [Lộ trình phát triển](07-lo-trinh-phat-trien.md) | 4 phases (~26-32 tuần), ưu tiên tính năng, nguồn lực, chi phí, nghiệm thu |
| 12 | [QA Test Plan](qa-test-plan.md) | 323 test cases, 90 API tests, Security checklist, Performance scenarios |

---

## Tổng quan nhanh

| Chỉ số | Số lượng |
|--------|----------|
| Use Cases | 29 |
| User Stories | 38 |
| Epics | 21 |
| Story Points | 353 |
| API Endpoints | 80+ |
| Frontend Pages | 40+ |
| Shared Components | 30+ |
| Database Tables | 20+ |
| Test Cases | 323 |
| Service Classes | 9 |
| Events/Listeners | 25+ |

## Team phát triển đề xuất

| Vai trò | Công cụ/Trách nhiệm |
|---------|---------------------|
| **BA** | User Stories, Feature Flows, Business Rules, Priority Matrix |
| **Architect** | Kiến trúc, Tech decisions, API Design, Database Design |
| **Frontend Dev (x2)** | React + TypeScript + Tailwind CSS, 40+ pages, 30+ components |
| **Backend Dev (x2)** | Laravel 11, 80+ APIs, Services, Events, Queue Jobs |
| **QA** | 323 test cases, API testing, Performance, Security |
| **DevOps** | Docker, CI/CD, Deployment, Monitoring |

## Quick Start

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && composer install && php artisan serve

# Docker (full stack)
docker-compose up -d
```
