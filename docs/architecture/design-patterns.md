# Design Patterns - He Thong Cung Ung Nhan Su Thoi Vu

> **Phien ban:** 2.0
> **Ngay cap nhat:** 2026-04-08
> **Tac gia:** System Architect

---

## 1. Tong Quan Architecture

### 1.1 Layered Architecture

He thong su dung kien truc phan tang (layered architecture) voi cac tang ro rang:

```
+--------------------------------------------------+
|                   HTTP Layer                      |
|  Routes -> Middleware -> Controllers -> Resources |
+--------------------------------------------------+
|                  Validation Layer                 |
|              Form Requests (Zod-like)             |
+--------------------------------------------------+
|               Business Logic Layer                |
|          Services -> Actions -> Events            |
+--------------------------------------------------+
|                Data Access Layer                  |
|          Repositories -> Models (Eloquent)        |
+--------------------------------------------------+
|              Infrastructure Layer                 |
|   Database (PostgreSQL) | Cache (Redis) | Queue  |
+--------------------------------------------------+
```

### 1.2 Folder Structure

```
app/
├── Actions/                    # Single-responsibility actions
│   ├── StaffingOrder/
│   │   ├── CreateOrderAction.php
│   │   ├── ApproveOrderAction.php
│   │   ├── RejectOrderAction.php
│   │   ├── AssignRecruiterAction.php
│   │   ├── CancelOrderAction.php
│   │   ├── CompleteOrderAction.php
│   │   └── UpdateOrderStatusAction.php
│   ├── Worker/
│   │   ├── CreateWorkerAction.php
│   │   ├── UpdateWorkerAction.php
│   │   ├── ChangeWorkerStatusAction.php
│   │   └── SuggestWorkersAction.php
│   ├── Assignment/
│   │   ├── CreateAssignmentAction.php
│   │   ├── BulkAssignAction.php
│   │   ├── ConfirmAssignmentAction.php
│   │   ├── RejectAssignmentAction.php
│   │   ├── ReplaceWorkerAction.php
│   │   └── ReconfirmAssignmentAction.php
│   ├── Attendance/
│   │   ├── CheckInAction.php
│   │   ├── CheckOutAction.php
│   │   ├── BulkCheckInAction.php
│   │   ├── BulkCheckOutAction.php
│   │   ├── ApproveAttendanceAction.php
│   │   └── BatchApproveAction.php
│   ├── Payroll/
│   │   ├── CalculatePayrollAction.php
│   │   ├── ApprovePayrollAction.php
│   │   ├── MarkPaidAction.php
│   │   └── ExportPayrollAction.php
│   ├── Invoice/
│   │   ├── CreateInvoiceAction.php
│   │   ├── ApproveInvoiceAction.php
│   │   ├── RecordPaymentAction.php
│   │   └── GeneratePdfAction.php
│   └── Client/
│       ├── CreateClientAction.php
│       ├── UpdateClientAction.php
│       └── ApproveContractAction.php
│
├── Enums/
│   ├── OrderStatus.php
│   ├── OrderUrgency.php
│   ├── ServiceType.php
│   ├── WorkerStatus.php
│   ├── AssignmentStatus.php
│   ├── AttendanceStatus.php
│   ├── PayrollStatus.php
│   ├── InvoiceStatus.php
│   ├── ClientStatus.php
│   ├── ContractStatus.php
│   ├── PaymentMethod.php
│   ├── RateType.php
│   └── Gender.php
│
├── Events/
│   ├── Order/
│   │   ├── OrderCreated.php
│   │   ├── OrderApproved.php
│   │   ├── OrderRejected.php
│   │   ├── OrderAssigned.php
│   │   ├── OrderFilled.php
│   │   ├── OrderCompleted.php
│   │   └── OrderCancelled.php
│   ├── Assignment/
│   │   ├── WorkerAssigned.php
│   │   ├── AssignmentConfirmed.php
│   │   ├── AssignmentRejected.php
│   │   ├── WorkerReplaced.php
│   │   └── AssignmentCompleted.php
│   ├── Attendance/
│   │   ├── WorkerCheckedIn.php
│   │   ├── WorkerCheckedOut.php
│   │   ├── AttendanceApproved.php
│   │   └── NoShowDetected.php
│   ├── Payroll/
│   │   ├── PayrollCalculated.php
│   │   ├── PayrollApproved.php
│   │   └── PayrollPaid.php
│   └── Invoice/
│       ├── InvoiceCreated.php
│       ├── InvoiceSent.php
│       ├── PaymentReceived.php
│       └── InvoiceOverdue.php
│
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       └── V1/
│   │           ├── AuthController.php
│   │           ├── ClientController.php
│   │           ├── ClientContactController.php
│   │           ├── ClientContractController.php
│   │           ├── StaffingOrderController.php
│   │           ├── WorkerController.php
│   │           ├── AssignmentController.php
│   │           ├── AttendanceController.php
│   │           ├── PayrollController.php
│   │           ├── InvoiceController.php
│   │           ├── PaymentController.php
│   │           ├── DashboardController.php
│   │           ├── StaffController.php
│   │           ├── RoleController.php
│   │           ├── UserController.php
│   │           ├── SkillController.php
│   │           ├── CategoryController.php
│   │           ├── ActivityLogController.php
│   │           ├── NotificationController.php
│   │           └── ReportController.php
│   │
│   ├── Middleware/
│   │   ├── CheckPermission.php
│   │   ├── CheckRole.php
│   │   └── RateLimitByRole.php
│   │
│   ├── Requests/
│   │   ├── Client/
│   │   │   ├── StoreClientRequest.php
│   │   │   ├── UpdateClientRequest.php
│   │   │   ├── StoreContactRequest.php
│   │   │   └── StoreContractRequest.php
│   │   ├── Order/
│   │   │   ├── StoreOrderRequest.php
│   │   │   ├── UpdateOrderRequest.php
│   │   │   ├── ApproveOrderRequest.php
│   │   │   ├── RejectOrderRequest.php
│   │   │   └── AssignRecruiterRequest.php
│   │   ├── Worker/
│   │   │   ├── StoreWorkerRequest.php
│   │   │   ├── UpdateWorkerRequest.php
│   │   │   └── ChangeStatusRequest.php
│   │   ├── Assignment/
│   │   │   ├── StoreAssignmentRequest.php
│   │   │   ├── BulkAssignRequest.php
│   │   │   └── ReplaceWorkerRequest.php
│   │   ├── Attendance/
│   │   │   ├── CheckInRequest.php
│   │   │   ├── CheckOutRequest.php
│   │   │   ├── BulkCheckInRequest.php
│   │   │   └── UpdateAttendanceRequest.php
│   │   ├── Payroll/
│   │   │   ├── CalculatePayrollRequest.php
│   │   │   └── MarkPaidRequest.php
│   │   └── Invoice/
│   │       ├── StoreInvoiceRequest.php
│   │       └── RecordPaymentRequest.php
│   │
│   └── Resources/
│       ├── ClientResource.php
│       ├── ClientContactResource.php
│       ├── ClientContractResource.php
│       ├── StaffingOrderResource.php
│       ├── StaffingOrderDetailResource.php
│       ├── WorkerResource.php
│       ├── WorkerDetailResource.php
│       ├── WorkerSuggestResource.php
│       ├── AssignmentResource.php
│       ├── AttendanceResource.php
│       ├── PayrollResource.php
│       ├── InvoiceResource.php
│       ├── InvoiceItemResource.php
│       ├── PaymentResource.php
│       ├── WorkerRatingResource.php
│       ├── SkillResource.php
│       ├── DashboardResource.php
│       ├── UserResource.php
│       ├── RoleResource.php
│       └── ActivityLogResource.php
│
├── Listeners/
│   ├── Order/
│   │   ├── NotifyManagerOnOrderCreated.php
│   │   ├── NotifyRecruiterOnOrderAssigned.php
│   │   ├── NotifySalesOnOrderApproved.php
│   │   ├── NotifySalesOnOrderRejected.php
│   │   └── NotifyOnOrderCompleted.php
│   ├── Assignment/
│   │   ├── UpdateOrderFillCount.php
│   │   ├── NotifyRecruiterOnConfirmation.php
│   │   ├── UpdateWorkerStatusOnAssignment.php
│   │   └── AutoUpdateOrderStatus.php
│   ├── Attendance/
│   │   ├── UpdateWorkerStats.php
│   │   ├── DetectNoShow.php
│   │   └── NotifyManagerForApproval.php
│   ├── Payroll/
│   │   ├── NotifyAccountantOnApproval.php
│   │   └── UpdateWorkerPaymentHistory.php
│   └── Invoice/
│       ├── NotifyOnOverdue.php
│       ├── UpdateClientReceivables.php
│       └── AutoReconcile.php
│
├── Models/
│   ├── User.php
│   ├── Role.php
│   ├── Permission.php
│   ├── Client.php
│   ├── ClientContact.php
│   ├── ClientContract.php
│   ├── StaffingOrder.php
│   ├── Worker.php
│   ├── Skill.php
│   ├── Assignment.php
│   ├── Attendance.php
│   ├── Payroll.php
│   ├── Invoice.php
│   ├── InvoiceItem.php
│   ├── Payment.php
│   ├── WorkerRating.php
│   ├── Category.php
│   ├── Department.php
│   ├── Team.php
│   ├── ActivityLog.php
│   └── Notification.php
│
├── Observers/
│   ├── StaffingOrderObserver.php
│   ├── AssignmentObserver.php
│   ├── AttendanceObserver.php
│   └── WorkerObserver.php
│
├── Policies/
│   ├── ClientPolicy.php
│   ├── ClientContractPolicy.php
│   ├── StaffingOrderPolicy.php
│   ├── WorkerPolicy.php
│   ├── AssignmentPolicy.php
│   ├── AttendancePolicy.php
│   ├── PayrollPolicy.php
│   ├── InvoicePolicy.php
│   ├── UserPolicy.php
│   └── RolePolicy.php
│
├── Repositories/
│   ├── Contracts/
│   │   ├── ClientRepositoryInterface.php
│   │   ├── StaffingOrderRepositoryInterface.php
│   │   ├── WorkerRepositoryInterface.php
│   │   ├── AssignmentRepositoryInterface.php
│   │   ├── AttendanceRepositoryInterface.php
│   │   ├── PayrollRepositoryInterface.php
│   │   └── InvoiceRepositoryInterface.php
│   └── Eloquent/
│       ├── ClientRepository.php
│       ├── StaffingOrderRepository.php
│       ├── WorkerRepository.php
│       ├── AssignmentRepository.php
│       ├── AttendanceRepository.php
│       ├── PayrollRepository.php
│       └── InvoiceRepository.php
│
├── Services/
│   ├── ClientService.php
│   ├── StaffingOrderService.php
│   ├── WorkerService.php
│   ├── AssignmentService.php
│   ├── AttendanceService.php
│   ├── PayrollService.php
│   ├── InvoiceService.php
│   ├── DashboardService.php
│   ├── ReportService.php
│   ├── WorkerSuggestService.php
│   ├── NotificationService.php
│   └── CodeGeneratorService.php
│
└── Providers/
    ├── AppServiceProvider.php
    ├── AuthServiceProvider.php
    ├── EventServiceProvider.php
    └── RepositoryServiceProvider.php
```

---

## 2. Chi Tiet Tung Pattern

### 2.1 Action Pattern (Single Responsibility)

**Muc dich:** Moi class chi lam 1 viec duy nhat, de test, de doc, de maintain.

**Khi nao dung:** Cho cac nghiep vu phuc tap can nhieu buoc xu ly (VD: duyet don hang can kiem tra dieu kien, cap nhat status, gui thong bao, ghi log).

**Cau truc chung:**

```php
// app/Actions/StaffingOrder/ApproveOrderAction.php

namespace App\Actions\StaffingOrder;

use App\Enums\OrderStatus;
use App\Events\Order\OrderApproved;
use App\Models\StaffingOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ApproveOrderAction
{
    /**
     * Duyet don hang nhan su.
     *
     * @throws \InvalidArgumentException Khi don hang khong o trang thai cho duyet
     */
    public function execute(StaffingOrder $order, User $approver, ?string $notes = null): StaffingOrder
    {
        // 1. Validate business rules
        if ($order->status !== OrderStatus::Pending) {
            throw new \InvalidArgumentException(
                "Chi co the duyet don hang o trang thai 'Cho duyet'. Trang thai hien tai: {$order->status->value}"
            );
        }

        // 2. Execute in transaction
        return DB::transaction(function () use ($order, $approver, $notes) {
            // 3. Update order
            $order->update([
                'status' => OrderStatus::Approved,
                'approved_by' => $approver->id,
                'approved_at' => now(),
                'notes' => $notes ? $order->notes . "\n[Duyet] " . $notes : $order->notes,
            ]);

            // 4. Dispatch event (notifications, logging happen via listeners)
            event(new OrderApproved($order, $approver));

            return $order->fresh();
        });
    }
}
```

**Su dung trong Controller:**

```php
// app/Http/Controllers/Api/V1/StaffingOrderController.php

public function approve(
    ApproveOrderRequest $request,
    StaffingOrder $order,
    ApproveOrderAction $action
): JsonResponse {
    $order = $action->execute($order, $request->user(), $request->notes);

    return response()->json([
        'success' => true,
        'data' => new StaffingOrderResource($order),
        'message' => 'Duyet don hang thanh cong',
    ]);
}
```

**Danh sach Actions quan trong:**

| Module | Action | Mo ta |
|--------|--------|-------|
| StaffingOrder | CreateOrderAction | Tao don hang, generate order_code |
| StaffingOrder | ApproveOrderAction | Duyet don hang, notify |
| StaffingOrder | RejectOrderAction | Tu choi, ghi ly do |
| StaffingOrder | AssignRecruiterAction | Phan cong Recruiter |
| StaffingOrder | CancelOrderAction | Huy don hang, huy assignments |
| Worker | CreateWorkerAction | Them worker, generate worker_code |
| Worker | SuggestWorkersAction | Goi y workers phu hop cho don hang |
| Worker | ChangeWorkerStatusAction | Doi trang thai, xu ly side effects |
| Assignment | CreateAssignmentAction | Phan cong 1 worker, update fill count |
| Assignment | BulkAssignAction | Phan cong nhieu workers 1 luc |
| Assignment | ReplaceWorkerAction | Thay the worker, tao assignment moi |
| Attendance | CheckInAction | Check-in, tu dong tinh status (tre/dung gio) |
| Attendance | BulkCheckInAction | Check-in nhieu workers |
| Attendance | BatchApproveAction | Duyet nhieu records cham cong |
| Payroll | CalculatePayrollAction | Tinh luong tu du lieu cham cong |
| Invoice | CreateInvoiceAction | Tao hoa don tu cac don hang |
| Invoice | RecordPaymentAction | Ghi nhan thanh toan, update trang thai |

---

### 2.2 Service Pattern (Business Logic Layer)

**Muc dich:** Tap trung business logic, dieu phoi nhieu actions va repositories. Controllers chi goi service, khong chua logic.

**Khi nao dung:** Khi can dieu phoi nhieu operations hoac cung cap logic phuc tap hon 1 action don le.

```php
// app/Services/StaffingOrderService.php

namespace App\Services;

use App\Models\StaffingOrder;
use App\Repositories\Contracts\StaffingOrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StaffingOrderService
{
    public function __construct(
        private StaffingOrderRepositoryInterface $orderRepo,
    ) {}

    /**
     * Lay danh sach don hang voi filters.
     */
    public function list(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        return $this->orderRepo->getFiltered($filters, $perPage);
    }

    /**
     * Lay chi tiet don hang voi relations.
     */
    public function getDetail(string $id): StaffingOrder
    {
        return $this->orderRepo->findWithRelations($id, [
            'client',
            'clientContact',
            'contract',
            'recruiter',
            'assignments.worker',
            'creator',
            'approver',
        ]);
    }

    /**
     * Thong ke don hang cho dashboard.
     */
    public function getStats(array $filters): array
    {
        return [
            'total' => $this->orderRepo->countByStatus($filters),
            'by_urgency' => $this->orderRepo->countByUrgency($filters),
            'fill_rate' => $this->orderRepo->calculateFillRate($filters),
            'by_month' => $this->orderRepo->countByMonth($filters),
        ];
    }
}
```

**Danh sach Services:**

| Service | Trach nhiem |
|---------|-------------|
| ClientService | CRUD clients, contacts, contracts. Thong ke khach hang |
| StaffingOrderService | CRUD orders, filter, thong ke |
| WorkerService | CRUD workers, filter, thong ke, worker suggestion |
| AssignmentService | Dieu phoi assignments, calendar view |
| AttendanceService | Query cham cong, tong hop, attendance sheet |
| PayrollService | Query luong, export |
| InvoiceService | Query hoa don, generate items |
| DashboardService | Tong hop du lieu cho dashboard theo role |
| ReportService | Xuat bao cao Excel/PDF |
| WorkerSuggestService | Algorithm goi y workers phu hop |
| CodeGeneratorService | Generate order_code, worker_code, invoice_number |
| NotificationService | Gui thong bao theo kenh (database, email, ...) |

---

### 2.3 Repository Pattern (Data Access Layer)

**Muc dich:** Tach logic truy van du lieu khoi business logic. De thay doi data source, de mock khi test.

**Khi nao dung:** Cho cac queries phuc tap, filter nhieu dieu kien, queries dung nhieu noi.

```php
// app/Repositories/Contracts/StaffingOrderRepositoryInterface.php

namespace App\Repositories\Contracts;

use App\Models\StaffingOrder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StaffingOrderRepositoryInterface
{
    public function find(string $id): ?StaffingOrder;
    public function findWithRelations(string $id, array $relations): StaffingOrder;
    public function getFiltered(array $filters, int $perPage): LengthAwarePaginator;
    public function countByStatus(array $filters): array;
    public function countByUrgency(array $filters): array;
    public function calculateFillRate(array $filters): float;
    public function getByRecruiter(string $recruiterId, array $filters): LengthAwarePaginator;
    public function getByClient(string $clientId, array $filters): LengthAwarePaginator;
}
```

```php
// app/Repositories/Eloquent/StaffingOrderRepository.php

namespace App\Repositories\Eloquent;

use App\Models\StaffingOrder;
use App\Repositories\Contracts\StaffingOrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StaffingOrderRepository implements StaffingOrderRepositoryInterface
{
    public function __construct(
        private StaffingOrder $model,
    ) {}

    public function getFiltered(array $filters, int $perPage): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        // Apply filters
        if ($status = $filters['status'] ?? null) {
            $query->where('status', $status);
        }

        if ($urgency = $filters['urgency'] ?? null) {
            $query->where('urgency', $urgency);
        }

        if ($clientId = $filters['client_id'] ?? null) {
            $query->where('client_id', $clientId);
        }

        if ($recruiterId = $filters['assigned_recruiter_id'] ?? null) {
            $query->where('assigned_recruiter_id', $recruiterId);
        }

        if ($city = $filters['work_city'] ?? null) {
            $query->where('work_city', $city);
        }

        if ($dateFrom = $filters['start_date_from'] ?? null) {
            $query->where('start_date', '>=', $dateFrom);
        }

        if ($dateTo = $filters['start_date_to'] ?? null) {
            $query->where('start_date', '<=', $dateTo);
        }

        if ($search = $filters['search'] ?? null) {
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'ilike', "%{$search}%")
                  ->orWhere('position_name', 'ilike', "%{$search}%");
            });
        }

        // Apply includes
        if ($includes = $filters['include'] ?? null) {
            $query->with(explode(',', $includes));
        }

        // Apply sorting
        $sort = $filters['sort'] ?? '-created_at';
        foreach (explode(',', $sort) as $sortField) {
            $direction = str_starts_with($sortField, '-') ? 'desc' : 'asc';
            $field = ltrim($sortField, '-');
            $query->orderBy($field, $direction);
        }

        return $query->paginate($perPage);
    }

    public function calculateFillRate(array $filters): float
    {
        $query = $this->model->newQuery()
            ->whereNotIn('status', ['draft', 'cancelled', 'rejected']);

        // Apply date filters...

        $totalNeeded = $query->sum('quantity_needed');
        $totalFilled = $query->sum('quantity_filled');

        return $totalNeeded > 0
            ? round(($totalFilled / $totalNeeded) * 100, 1)
            : 0;
    }
}
```

**Dang ky trong ServiceProvider:**

```php
// app/Providers/RepositoryServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public array $bindings = [
        \App\Repositories\Contracts\ClientRepositoryInterface::class
            => \App\Repositories\Eloquent\ClientRepository::class,
        \App\Repositories\Contracts\StaffingOrderRepositoryInterface::class
            => \App\Repositories\Eloquent\StaffingOrderRepository::class,
        \App\Repositories\Contracts\WorkerRepositoryInterface::class
            => \App\Repositories\Eloquent\WorkerRepository::class,
        \App\Repositories\Contracts\AssignmentRepositoryInterface::class
            => \App\Repositories\Eloquent\AssignmentRepository::class,
        \App\Repositories\Contracts\AttendanceRepositoryInterface::class
            => \App\Repositories\Eloquent\AttendanceRepository::class,
        \App\Repositories\Contracts\PayrollRepositoryInterface::class
            => \App\Repositories\Eloquent\PayrollRepository::class,
        \App\Repositories\Contracts\InvoiceRepositoryInterface::class
            => \App\Repositories\Eloquent\InvoiceRepository::class,
    ];
}
```

---

### 2.4 Observer Pattern (Events & Listeners)

**Muc dich:** Tach cac side effects (notifications, logging, stats update) khoi business logic chinh. Code sach hon, de extend.

**Khi nao dung:** Khi 1 hanh dong can trigger nhieu side effects khac nhau (gui thong bao, ghi log, update thong ke, ...).

#### Model Observers

```php
// app/Observers/StaffingOrderObserver.php

namespace App\Observers;

use App\Models\StaffingOrder;
use App\Services\CodeGeneratorService;

class StaffingOrderObserver
{
    public function __construct(
        private CodeGeneratorService $codeGenerator,
    ) {}

    /**
     * Tu dong tao order_code khi tao don hang moi.
     */
    public function creating(StaffingOrder $order): void
    {
        if (empty($order->order_code)) {
            $order->order_code = $this->codeGenerator->generateOrderCode();
        }
    }
}
```

```php
// app/Observers/AssignmentObserver.php

namespace App\Observers;

use App\Enums\AssignmentStatus;
use App\Models\Assignment;
use App\Models\StaffingOrder;

class AssignmentObserver
{
    /**
     * Khi assignment thay doi status, tu dong update quantity_filled cua order.
     */
    public function updated(Assignment $assignment): void
    {
        if ($assignment->isDirty('status')) {
            $this->syncOrderFillCount($assignment->order_id);
        }
    }

    public function created(Assignment $assignment): void
    {
        $this->syncOrderFillCount($assignment->order_id);
    }

    private function syncOrderFillCount(string $orderId): void
    {
        $activeCount = Assignment::where('order_id', $orderId)
            ->whereIn('status', [
                AssignmentStatus::Confirmed,
                AssignmentStatus::Working,
                AssignmentStatus::Completed,
            ])
            ->count();

        StaffingOrder::where('id', $orderId)
            ->update(['quantity_filled' => $activeCount]);
    }
}
```

#### Events & Listeners

```php
// app/Events/Order/OrderApproved.php

namespace App\Events\Order;

use App\Models\StaffingOrder;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderApproved
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public StaffingOrder $order,
        public User $approver,
    ) {}
}
```

```php
// app/Listeners/Order/NotifySalesOnOrderApproved.php

namespace App\Listeners\Order;

use App\Events\Order\OrderApproved;
use App\Models\Notification;

class NotifySalesOnOrderApproved
{
    public function handle(OrderApproved $event): void
    {
        // Gui thong bao cho Sales nguoi tao don hang
        Notification::create([
            'user_id' => $event->order->created_by,
            'title' => 'Don hang da duoc duyet',
            'body' => "Don hang {$event->order->order_code} da duoc {$event->approver->name} duyet.",
            'type' => 'order_approved',
            'reference_type' => 'staffing_order',
            'reference_id' => $event->order->id,
        ]);
    }
}
```

**Dang ky Event-Listener mapping:**

```php
// app/Providers/EventServiceProvider.php

protected $listen = [
    // Order events
    \App\Events\Order\OrderCreated::class => [
        \App\Listeners\Order\NotifyManagerOnOrderCreated::class,
        \App\Listeners\LogActivity::class,
    ],
    \App\Events\Order\OrderApproved::class => [
        \App\Listeners\Order\NotifySalesOnOrderApproved::class,
        \App\Listeners\LogActivity::class,
    ],
    \App\Events\Order\OrderRejected::class => [
        \App\Listeners\Order\NotifySalesOnOrderRejected::class,
        \App\Listeners\LogActivity::class,
    ],
    \App\Events\Order\OrderAssigned::class => [
        \App\Listeners\Order\NotifyRecruiterOnOrderAssigned::class,
        \App\Listeners\LogActivity::class,
    ],

    // Assignment events
    \App\Events\Assignment\WorkerAssigned::class => [
        \App\Listeners\Assignment\UpdateOrderFillCount::class,
        \App\Listeners\Assignment\UpdateWorkerStatusOnAssignment::class,
        \App\Listeners\LogActivity::class,
    ],
    \App\Events\Assignment\AssignmentConfirmed::class => [
        \App\Listeners\Assignment\UpdateOrderFillCount::class,
        \App\Listeners\Assignment\AutoUpdateOrderStatus::class,
        \App\Listeners\LogActivity::class,
    ],

    // Attendance events
    \App\Events\Attendance\WorkerCheckedIn::class => [
        \App\Listeners\Attendance\UpdateWorkerStats::class,
        \App\Listeners\LogActivity::class,
    ],
    \App\Events\Attendance\NoShowDetected::class => [
        \App\Listeners\Attendance\UpdateWorkerNoShowCount::class,
        \App\Listeners\Attendance\NotifyRecruiterNoShow::class,
    ],

    // Invoice events
    \App\Events\Invoice\PaymentReceived::class => [
        \App\Listeners\Invoice\UpdateInvoiceStatus::class,
        \App\Listeners\Invoice\UpdateClientReceivables::class,
        \App\Listeners\LogActivity::class,
    ],
];
```

---

### 2.5 Policy Pattern (Authorization)

**Muc dich:** Kiem tra quyen truy cap tai tang model. De bao tri hon la kiem tra quyen trong controller.

```php
// app/Policies/StaffingOrderPolicy.php

namespace App\Policies;

use App\Enums\OrderStatus;
use App\Models\StaffingOrder;
use App\Models\User;

class StaffingOrderPolicy
{
    /**
     * Xem danh sach don hang.
     * Recruiter chi xem don hang duoc phan cong.
     * Sales chi xem don hang minh tao.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('orders.view');
    }

    public function view(User $user, StaffingOrder $order): bool
    {
        if ($user->hasPermission('orders.view_all')) {
            return true;
        }

        // Recruiter chi xem don hang duoc phan cong
        if ($user->hasRole('recruiter')) {
            return $order->assigned_recruiter_id === $user->id;
        }

        // Sales chi xem don hang minh tao
        if ($user->hasRole('sales')) {
            return $order->created_by === $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('orders.create');
    }

    public function update(User $user, StaffingOrder $order): bool
    {
        if (!$user->hasPermission('orders.update')) {
            return false;
        }

        // Chi sua khi trang thai draft hoac pending
        return in_array($order->status, [OrderStatus::Draft, OrderStatus::Pending]);
    }

    public function approve(User $user, StaffingOrder $order): bool
    {
        return $user->hasPermission('orders.approve')
            && $order->status === OrderStatus::Pending;
    }

    public function assignRecruiter(User $user, StaffingOrder $order): bool
    {
        return $user->hasPermission('orders.assign_recruiter')
            && $order->status === OrderStatus::Approved;
    }

    public function cancel(User $user, StaffingOrder $order): bool
    {
        return $user->hasPermission('orders.cancel')
            && !in_array($order->status, [OrderStatus::Completed, OrderStatus::Cancelled]);
    }
}
```

**Dang ky Policies:**

```php
// app/Providers/AuthServiceProvider.php

protected $policies = [
    \App\Models\Client::class => \App\Policies\ClientPolicy::class,
    \App\Models\ClientContract::class => \App\Policies\ClientContractPolicy::class,
    \App\Models\StaffingOrder::class => \App\Policies\StaffingOrderPolicy::class,
    \App\Models\Worker::class => \App\Policies\WorkerPolicy::class,
    \App\Models\Assignment::class => \App\Policies\AssignmentPolicy::class,
    \App\Models\Attendance::class => \App\Policies\AttendancePolicy::class,
    \App\Models\Payroll::class => \App\Policies\PayrollPolicy::class,
    \App\Models\Invoice::class => \App\Policies\InvoicePolicy::class,
];
```

**Su dung trong Controller:**

```php
public function approve(ApproveOrderRequest $request, StaffingOrder $order): JsonResponse
{
    $this->authorize('approve', $order);  // Kiem tra policy
    // ...
}
```

---

### 2.6 Resource Pattern (API Response Transformation)

**Muc dich:** Chuyen doi Model thanh JSON response theo format thong nhat. An cac truong nhay cam, format data.

```php
// app/Http/Resources/StaffingOrderResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffingOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,

            // Relations (conditional loading)
            'client' => new ClientResource($this->whenLoaded('client')),
            'client_contact' => new ClientContactResource($this->whenLoaded('clientContact')),
            'recruiter' => new UserResource($this->whenLoaded('recruiter')),

            // Job info
            'position_name' => $this->position_name,
            'job_description' => $this->job_description,
            'work_address' => $this->work_address,
            'work_district' => $this->work_district,
            'work_city' => $this->work_city,

            // Quantity
            'quantity_needed' => $this->quantity_needed,
            'quantity_filled' => $this->quantity_filled,
            'fill_rate' => $this->quantity_needed > 0
                ? round(($this->quantity_filled / $this->quantity_needed) * 100, 1)
                : 0,

            // Requirements
            'gender_requirement' => $this->gender_requirement,
            'age_min' => $this->age_min,
            'age_max' => $this->age_max,
            'required_skills' => $this->required_skills,

            // Schedule
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'shift_type' => $this->shift_type,
            'start_time' => $this->start_time?->format('H:i'),
            'end_time' => $this->end_time?->format('H:i'),

            // Finance
            'worker_rate' => $this->worker_rate,
            'rate_type' => $this->rate_type,
            'service_fee' => $this->service_fee,
            'service_fee_type' => $this->service_fee_type,

            // Status
            'urgency' => $this->urgency,
            'service_type' => $this->service_type,
            'status' => $this->status,

            // Audit
            'created_by' => new UserResource($this->whenLoaded('creator')),
            'approved_by' => new UserResource($this->whenLoaded('approver')),
            'approved_at' => $this->approved_at?->toISOString(),

            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```

---

### 2.7 Form Request Pattern (Validation)

**Muc dich:** Tach validation logic khoi controller. Moi request co class rieng voi rules cu the.

```php
// app/Http/Requests/Order/StoreOrderRequest.php

namespace App\Http\Requests\Order;

use App\Enums\Gender;
use App\Enums\OrderUrgency;
use App\Enums\RateType;
use App\Enums\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('orders.create');
    }

    public function rules(): array
    {
        return [
            'client_id' => ['required', 'uuid', 'exists:clients,id'],
            'client_contact_id' => ['nullable', 'uuid', 'exists:client_contacts,id'],
            'contract_id' => ['nullable', 'uuid', 'exists:client_contracts,id'],

            'position_name' => ['required', 'string', 'max:255'],
            'job_description' => ['nullable', 'string'],
            'work_address' => ['nullable', 'string'],
            'work_district' => ['nullable', 'string', 'max:100'],
            'work_city' => ['nullable', 'string', 'max:100'],

            'quantity_needed' => ['required', 'integer', 'min:1', 'max:999'],
            'gender_requirement' => ['nullable', Rule::enum(Gender::class)],
            'age_min' => ['nullable', 'integer', 'min:16', 'max:65'],
            'age_max' => ['nullable', 'integer', 'min:16', 'max:65', 'gte:age_min'],
            'required_skills' => ['nullable', 'array'],
            'required_skills.*' => ['uuid', 'exists:skills,id'],
            'other_requirements' => ['nullable', 'string'],

            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'shift_type' => ['nullable', 'string', 'in:morning,afternoon,evening,double,continuous'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'break_minutes' => ['nullable', 'integer', 'min:0', 'max:120'],

            'worker_rate' => ['nullable', 'numeric', 'min:0'],
            'rate_type' => ['nullable', Rule::enum(RateType::class)],
            'service_fee' => ['nullable', 'numeric', 'min:0'],
            'service_fee_type' => ['nullable', 'in:percent,fixed'],
            'overtime_rate' => ['nullable', 'numeric', 'min:0'],

            'urgency' => ['nullable', Rule::enum(OrderUrgency::class)],
            'service_type' => ['nullable', Rule::enum(ServiceType::class)],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'client_id.required' => 'Vui long chon khach hang',
            'client_id.exists' => 'Khach hang khong ton tai',
            'position_name.required' => 'Vui long nhap ten vi tri',
            'quantity_needed.required' => 'Vui long nhap so luong can',
            'quantity_needed.min' => 'So luong phai tu 1 tro len',
            'start_date.required' => 'Vui long chon ngay bat dau',
            'start_date.after_or_equal' => 'Ngay bat dau phai tu hom nay tro di',
            'end_date.after' => 'Ngay ket thuc phai sau ngay bat dau',
            'age_max.gte' => 'Tuoi toi da phai lon hon hoac bang tuoi toi thieu',
        ];
    }
}
```

---

### 2.8 Enum Pattern (Status Management)

**Muc dich:** Type-safe status management. Tranh magic strings, de refactor, co IDE support.

```php
// app/Enums/OrderStatus.php

namespace App\Enums;

enum OrderStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Recruiting = 'recruiting';
    case Filled = 'filled';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /**
     * Label hien thi cho UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Nhap',
            self::Pending => 'Cho duyet',
            self::Approved => 'Da duyet',
            self::Rejected => 'Tu choi',
            self::Recruiting => 'Dang tuyen',
            self::Filled => 'Da du nguoi',
            self::InProgress => 'Dang thuc hien',
            self::Completed => 'Hoan thanh',
            self::Cancelled => 'Da huy',
        };
    }

    /**
     * Mau hien thi cho UI (TailwindCSS color).
     */
    public function color(): string
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Pending => 'yellow',
            self::Approved => 'blue',
            self::Rejected => 'red',
            self::Recruiting => 'indigo',
            self::Filled => 'cyan',
            self::InProgress => 'violet',
            self::Completed => 'green',
            self::Cancelled => 'slate',
        };
    }

    /**
     * Cac trang thai co the chuyen tiep tu trang thai hien tai.
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Draft => [self::Pending, self::Cancelled],
            self::Pending => [self::Approved, self::Rejected, self::Cancelled],
            self::Approved => [self::Recruiting, self::Cancelled],
            self::Rejected => [self::Pending], // Cho phep gui lai
            self::Recruiting => [self::Filled, self::Cancelled],
            self::Filled => [self::InProgress, self::Cancelled],
            self::InProgress => [self::Completed, self::Cancelled],
            self::Completed => [],
            self::Cancelled => [],
        };
    }

    /**
     * Kiem tra xem co the chuyen sang trang thai moi khong.
     */
    public function canTransitionTo(self $newStatus): bool
    {
        return in_array($newStatus, $this->allowedTransitions());
    }
}
```

**Su dung trong Model:**

```php
// app/Models/StaffingOrder.php

use App\Enums\OrderStatus;

class StaffingOrder extends Model
{
    protected $casts = [
        'status' => OrderStatus::class,
        'urgency' => OrderUrgency::class,
        'service_type' => ServiceType::class,
        'rate_type' => RateType::class,
        'required_skills' => 'json',
        'start_date' => 'date',
        'end_date' => 'date',
        'approved_at' => 'datetime',
    ];
}
```

---

### 2.9 Middleware Pattern

#### CheckPermission Middleware

```php
// app/Http/Middleware/CheckPermission.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user() || !$request->user()->hasPermission($permission)) {
            return response()->json([
                'success' => false,
                'message' => 'Ban khong co quyen thuc hien hanh dong nay',
            ], 403);
        }

        return $next($request);
    }
}
```

#### RateLimitByRole Middleware

```php
// app/Http/Middleware/RateLimitByRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class RateLimitByRole
{
    private array $limits = [
        'admin' => 120,
        'manager' => 100,
        'recruiter' => 80,
        'sales' => 80,
        'accountant' => 80,
        'worker' => 30,
    ];

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $role = $user?->role ?? 'guest';
        $limit = $this->limits[$role] ?? 60;

        $key = "api:{$user?->id}";

        if (RateLimiter::tooManyAttempts($key, $limit)) {
            return response()->json([
                'success' => false,
                'message' => 'Qua nhieu request, vui long thu lai sau',
            ], 429);
        }

        RateLimiter::hit($key, 60);

        return $next($request);
    }
}
```

---

## 3. Code Generator Service

Dich vu sinh ma tu dong cho don hang, worker, hoa don:

```php
// app/Services/CodeGeneratorService.php

namespace App\Services;

use App\Models\StaffingOrder;
use App\Models\Worker;
use App\Models\Invoice;
use App\Models\Payroll;
use Illuminate\Support\Facades\DB;

class CodeGeneratorService
{
    /**
     * Generate order code: DH-YYYYMMDD-XXX
     */
    public function generateOrderCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = "DH-{$date}-";

        $lastCode = StaffingOrder::where('order_code', 'like', "{$prefix}%")
            ->orderBy('order_code', 'desc')
            ->value('order_code');

        $nextNumber = $lastCode
            ? ((int) substr($lastCode, -3)) + 1
            : 1;

        return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Generate worker code: WK-XXXXX
     */
    public function generateWorkerCode(): string
    {
        $lastCode = Worker::orderBy('worker_code', 'desc')
            ->value('worker_code');

        $nextNumber = $lastCode
            ? ((int) substr($lastCode, 3)) + 1
            : 1;

        return 'WK-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Generate invoice number: INV-YYYYMM-XXX
     */
    public function generateInvoiceNumber(): string
    {
        $month = now()->format('Ym');
        $prefix = "INV-{$month}-";

        $lastNumber = Invoice::where('invoice_number', 'like', "{$prefix}%")
            ->orderBy('invoice_number', 'desc')
            ->value('invoice_number');

        $nextNumber = $lastNumber
            ? ((int) substr($lastNumber, -3)) + 1
            : 1;

        return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Generate payroll code: PRL-YYYYMM-XXX
     */
    public function generatePayrollCode(): string
    {
        $month = now()->format('Ym');
        $prefix = "PRL-{$month}-";

        $lastCode = Payroll::where('payroll_code', 'like', "{$prefix}%")
            ->orderBy('payroll_code', 'desc')
            ->value('payroll_code');

        $nextNumber = $lastCode
            ? ((int) substr($lastCode, -3)) + 1
            : 1;

        return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
```

---

## 4. Data Flow Patterns

### 4.1 Request Lifecycle

```
Request
  |
  v
Route (api.php)
  |
  v
Middleware Stack
  ├── auth:sanctum
  ├── RateLimitByRole
  └── CheckPermission (optional per route)
  |
  v
FormRequest (validation)
  |
  v
Controller
  ├── $this->authorize() -- Policy check
  ├── Action::execute() -- Business logic (co the goi Service/Repository)
  └── return Resource -- Response transformation
  |
  v
Response (JSON)
```

### 4.2 Don Hang Lifecycle (Order Flow)

```
Sales tao don hang
  |
  v
CreateOrderAction
  ├── Validate data
  ├── Generate order_code
  ├── Save to DB
  └── Dispatch OrderCreated event
      ├── NotifyManagerOnOrderCreated (listener)
      └── LogActivity (listener)
  |
  v
Manager duyet
  |
  v
ApproveOrderAction
  ├── Check status = pending
  ├── Update status = approved
  └── Dispatch OrderApproved event
      ├── NotifySalesOnOrderApproved
      └── LogActivity
  |
  v
Manager phan cong Recruiter
  |
  v
AssignRecruiterAction
  ├── Update assigned_recruiter_id
  └── Dispatch OrderAssigned event
      └── NotifyRecruiterOnOrderAssigned
  |
  v
Recruiter phan cong workers
  |
  v
CreateAssignmentAction (repeated per worker)
  ├── Create assignment record
  ├── Update order quantity_filled
  └── Dispatch WorkerAssigned event
  |
  v
Workers check-in/check-out (daily)
  |
  v
CheckInAction / CheckOutAction
  ├── Create/update attendance record
  ├── Calculate hours
  └── Dispatch WorkerCheckedIn event
  |
  v
End of period
  |
  v
CalculatePayrollAction (workers)  +  CreateInvoiceAction (client)
```

---

## 5. Testing Strategy

### 5.1 Unit Tests

Test tung Action, Service, Repository doc lap:

```
tests/
├── Unit/
│   ├── Actions/
│   │   ├── StaffingOrder/
│   │   │   ├── CreateOrderActionTest.php
│   │   │   ├── ApproveOrderActionTest.php
│   │   │   └── ...
│   │   ├── Worker/
│   │   ├── Assignment/
│   │   ├── Attendance/
│   │   ├── Payroll/
│   │   └── Invoice/
│   ├── Services/
│   │   ├── CodeGeneratorServiceTest.php
│   │   ├── WorkerSuggestServiceTest.php
│   │   └── ...
│   └── Enums/
│       ├── OrderStatusTest.php
│       └── ...
```

### 5.2 Feature Tests

Test API endpoints end-to-end:

```
tests/
├── Feature/
│   ├── Api/
│   │   ├── Auth/
│   │   │   ├── LoginTest.php
│   │   │   └── ...
│   │   ├── Client/
│   │   │   ├── ClientCrudTest.php
│   │   │   └── ClientContractTest.php
│   │   ├── Order/
│   │   │   ├── OrderCrudTest.php
│   │   │   ├── OrderWorkflowTest.php
│   │   │   └── OrderFilterTest.php
│   │   ├── Worker/
│   │   │   ├── WorkerCrudTest.php
│   │   │   └── WorkerSuggestTest.php
│   │   ├── Assignment/
│   │   │   ├── AssignmentWorkflowTest.php
│   │   │   └── BulkAssignTest.php
│   │   ├── Attendance/
│   │   │   ├── CheckInOutTest.php
│   │   │   └── AttendanceApprovalTest.php
│   │   └── Finance/
│   │       ├── PayrollCalculateTest.php
│   │       └── InvoiceTest.php
│   └── Policy/
│       ├── OrderPolicyTest.php
│       ├── WorkerPolicyTest.php
│       └── ...
```

### 5.3 Test Example

```php
// tests/Feature/Api/Order/OrderWorkflowTest.php

use App\Enums\OrderStatus;
use App\Models\StaffingOrder;
use App\Models\User;

it('can approve a pending order as manager', function () {
    $manager = User::factory()->manager()->create();
    $order = StaffingOrder::factory()->pending()->create();

    $this->actingAs($manager)
        ->patchJson("/api/v1/orders/{$order->id}/approve", [
            'notes' => 'Da kiem tra OK',
        ])
        ->assertOk()
        ->assertJson([
            'success' => true,
            'data' => [
                'status' => 'approved',
            ],
        ]);

    $this->assertDatabaseHas('staffing_orders', [
        'id' => $order->id,
        'status' => OrderStatus::Approved->value,
        'approved_by' => $manager->id,
    ]);
});

it('cannot approve an order that is not pending', function () {
    $manager = User::factory()->manager()->create();
    $order = StaffingOrder::factory()->approved()->create();

    $this->actingAs($manager)
        ->patchJson("/api/v1/orders/{$order->id}/approve")
        ->assertStatus(409);
});

it('recruiter cannot approve orders', function () {
    $recruiter = User::factory()->recruiter()->create();
    $order = StaffingOrder::factory()->pending()->create();

    $this->actingAs($recruiter)
        ->patchJson("/api/v1/orders/{$order->id}/approve")
        ->assertForbidden();
});
```
