# Du An: He Thong Quan Ly Cung Ung Nhan Su Thoi Vu

## Mo ta
He thong quan ly van hanh noi bo cho cong ty cung ung nhan su thoi vu (Temporary Staffing Agency).
Day la he thong noi bo, KHONG PHAI job board cong khai.

## Tech Stack
- **Frontend**: React 18+ (Vite) + TypeScript + TailwindCSS 3+
- **Backend**: Laravel 11+ (PHP 8.2+) + PostgreSQL 15+ + Redis
- **Auth**: Laravel Sanctum (SPA authentication)
- **State**: TanStack Query (server) + Zustand (client)
- **Forms**: React Hook Form + Zod
- **Testing**: Pest (BE) + Vitest (FE) + Playwright (E2E)

## Business Model
- Cong ty nhan don hang nhan su tu khach hang (nha may, su kien, kho bai, nha hang...)
- Khach hang can gap N nguoi cho vi tri X, thoi gian Y
- Cong ty quan ly mot pool lao dong thoi vu (workers)
- Manager phan cong cho Recruiter xu ly don hang
- Recruiter dieu phoi workers phu hop de dap ung don hang
- Theo doi cham cong, tinh luong, xuat hoa don

## Vai tro (Actors)
- **Admin**: Quan tri toan bo he thong
- **Manager**: Quan ly van hanh, duyet don hang, phan cong
- **Recruiter**: Tuyen chon, dieu phoi workers
- **Sales**: Quan ly khach hang, tiep nhan don hang
- **Accountant**: Quan ly tai chinh, doi soat
- **Worker**: Lao dong thoi vu (truy cap han che qua app)

## Team Agents

| Agent | File | Vai tro | Khi nao dung |
|-------|------|---------|--------------|
| **Tech Lead** | `.claude/agents/tech-lead.md` | Dieu phoi, review, planning | Bat dau feature moi, review, sprint planning |
| **BA Analyst** | `.claude/agents/ba-analyst.md` | Phan tich nghiep vu | Phan tich requirements, viet user stories |
| **Architect** | `.claude/agents/architect.md` | Thiet ke kien truc | Database schema, API design, system design |
| **Backend Dev** | `.claude/agents/backend-dev.md` | Laravel API | Viet migrations, models, controllers, services, tests |
| **Frontend Dev** | `.claude/agents/frontend-dev.md` | React UI | Viet components, pages, hooks, API integration |
| **QA Tester** | `.claude/agents/qa-tester.md` | Testing | Viet test plans, test cases, thuc thi tests |

## Workflow phat trien feature

```
1. BA phan tich -> docs/features/[module]/[feature].md
2. Architect thiet ke -> migration + API spec + component design
3. Backend implement -> backend/app/...
4. Frontend implement -> backend/resources/js/app/...
5. QA test -> docs/testing/...
6. Tech Lead review -> approve/reject
```

## Project Structure
```
tuyendungnvtv/
├── docs/                          # Tai lieu du an
│   ├── 01-tong-quan-du-an.md      # Tong quan du an & mo hinh kinh doanh
│   ├── 02-use-cases-he-thong.md   # Use cases toan bo he thong
│   ├── 03-quy-trinh-van-hanh.md   # Quy trinh van hanh chi tiet
│   ├── 04-danh-sach-modules.md    # Danh sach modules & API specs
│   ├── 05-lo-trinh-phat-trien.md  # Lo trinh phat trien (phases)
│   ├── features/                  # Feature specs (BA output)
│   ├── architecture/              # Architecture docs
│   └── testing/                   # Test plans & reports
├── backend/                       # Laravel API + React frontend
│   ├── app/                       # Laravel app (Models, Controllers, Services)
│   └── resources/js/app/          # React frontend (merged into Laravel)
```

## Modules Chinh
1. **Dashboard** (MOD-DASH) - Tong quan so lieu
2. **Quan ly Khach hang** (MOD-CLI) - Ho so, hop dong, lien he
3. **Quan ly Don hang** (MOD-ORD) - Don hang nhan su, duyet, phan cong
4. **Quan ly Pool Workers** (MOD-WRK) - Ho so, ky nang, trang thai, danh gia
5. **Phan cong & Dieu phoi** (MOD-ASG) - Match workers, xac nhan, dieu phoi
6. **Cham cong & Bao cao** (MOD-ATT) - Check-in/out, tong hop, xuat bao cao
7. **Nhan vien noi bo** (MOD-STF) - Staff, KPI
8. **Tai chinh & Thanh toan** (MOD-FIN) - Luong, hoa don, cong no
9. **Cai dat & Phan quyen** (MOD-SYS) - RBAC, danh muc, thong bao

## Conventions
- Code comments: English
- UI text: Vietnamese
- Git branch: `feature/[module]-[feature-name]`
- Git commit: Conventional Commits (feat:, fix:, docs:, test:)
- API versioning: `/api/v1/`
- File naming: kebab-case (files), PascalCase (components), camelCase (functions)
