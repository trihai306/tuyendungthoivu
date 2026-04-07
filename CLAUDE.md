# Dự án: Tuyển Dụng NVTV & Quản Lý Trọ Liên Kết

## Tech Stack
- **Frontend**: React 18+ (Vite) + TypeScript + TailwindCSS 3+
- **Backend**: Laravel 11+ (PHP 8.2+) + PostgreSQL 15+ + Redis
- **Auth**: Laravel Sanctum (SPA authentication)
- **State**: TanStack Query (server) + Zustand (client)
- **Forms**: React Hook Form + Zod
- **Testing**: Pest (BE) + Vitest (FE) + Playwright (E2E)

## Team Agents

| Agent | File | Vai trò | Khi nào dùng |
|-------|------|---------|--------------|
| **Tech Lead** | `.claude/agents/tech-lead.md` | Điều phối, review, planning | Bắt đầu feature mới, review, sprint planning |
| **BA Analyst** | `.claude/agents/ba-analyst.md` | Phân tích nghiệp vụ | Phân tích requirements, viết user stories, acceptance criteria |
| **Architect** | `.claude/agents/architect.md` | Thiết kế kiến trúc | Database schema, API design, system design |
| **Backend Dev** | `.claude/agents/backend-dev.md` | Laravel API | Viết migrations, models, controllers, services, tests |
| **Frontend Dev** | `.claude/agents/frontend-dev.md` | React UI | Viết components, pages, hooks, API integration |
| **QA Tester** | `.claude/agents/qa-tester.md` | Testing | Viết test plans, test cases, thực thi tests |

## Workflow phát triển feature

```
1. BA phân tích → docs/features/[module]/[feature].md
2. Architect thiết kế → migration + API spec + component design
3. Backend implement → backend/app/...
4. Frontend implement → frontend/src/...
5. QA test → docs/testing/...
6. Tech Lead review → approve/reject
```

## Cách sử dụng team

### Phân tích feature mới:
```
Gọi agent ba-analyst: "Phân tích tính năng đăng ký tài khoản NVTV"
```

### Thiết kế kiến trúc:
```
Gọi agent architect: "Thiết kế database và API cho module tuyển dụng"
```

### Code backend:
```
Gọi agent backend-dev: "Implement API đăng tin tuyển dụng theo spec trong docs/features/tuyen-dung/dang-tin.md"
```

### Code frontend:
```
Gọi agent frontend-dev: "Implement trang danh sách tin tuyển dụng với filter và pagination"
```

### Testing:
```
Gọi agent qa-tester: "Viết test cases và tests cho API đăng tin tuyển dụng"
```

## Project Structure
```
tuyendungnvtv/
├── docs/                          # Tài liệu dự án
│   ├── 01-tong-quan-du-an.md
│   ├── 02-use-cases-tuyen-dung.md
│   ├── 03-use-cases-quan-ly-tro.md
│   ├── 04-use-cases-lien-ket-he-thong.md
│   ├── 05-van-de-phan-tich.md
│   ├── 06-database-schema.md
│   ├── 07-lo-trinh-phat-trien.md
│   ├── features/                  # Feature specs (BA output)
│   ├── architecture/              # Architecture docs
│   └── testing/                   # Test plans & reports
├── backend/                       # Laravel API
└── frontend/                      # React + TailwindCSS
```

## Conventions
- Code comments: English
- UI text: Vietnamese
- Git branch: `feature/[module]-[feature-name]`
- Git commit: Conventional Commits (feat:, fix:, docs:, test:)
- API versioning: `/api/v1/`
- File naming: kebab-case (files), PascalCase (components), camelCase (functions)
