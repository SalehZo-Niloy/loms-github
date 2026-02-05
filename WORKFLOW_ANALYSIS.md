# Customer Request Processing Workflow Analysis

## 1. Request Creation Flow

### Overview
The request creation flow is the entry point for customers to initiate trade finance transactions. It involves data entry, validation, and submission to the bank.

### Workflow Steps
1.  **Draft Creation**:
    -   Customer fills out the form (e.g., LC Application, Export Bill Collection).
    -   Data is stored in `localStorage` with status `DRAFT` (if saved) or processed immediately.
    -   **Entry Points**:
        -   `/trade/dc-advising/customer/request`: Master LC Request.
        -   `/trade/export-bill/customer/create`: Export Bill Collection.
2.  **Submission**:
    -   Customer submits the form.
    -   Status transitions to `SUBMITTED`.
    -   Validation checks (required fields, attachments) are performed.
3.  **Routing**:
    -   Submitted requests are routed to the Trade Officer (TO) or Relationship Officer (RO) based on the transaction type.
    -   **Master LC**: Routes to RO for validation (`RO_VALIDATION`).
    -   **Export Bill**: Routes to Trade Officer (`SUBMITTED`).

### Data Structure
-   **Services**: `TradeRequestService`, `ExportBillService`.
-   **Interfaces**: `TradeRequest`, `ExportBill`.
-   **Key Fields**: `id`, `status`, `applicant`, `amount`, `currency`, `history`.

## 2. Export Bill Processing

### Overview
Export Bill processing runs in parallel with LC requests but follows a slightly different path involving document collection and courier management.

### Workflow Steps
1.  **Submission**: Customer submits Export Bill request (`SUBMITTED`).
2.  **Verification**: Trade Officer verifies documents (`VERIFIED` or `DISCREPANCY_RAISED`).
3.  **Approval**: Approver reviews the verified bill (`APPROVED` or `REJECTED`).
4.  **Courier/Dispatch**: Documents are sent to the importer's bank (`SENT_TO_IMPORTER`).
5.  **Realization**: Payment is received (`REALIZED`).

### Integration
-   Linked to `WorkflowService` for status transitions.
-   Shared `TradeStatus` enum ensures consistency.
-   Uses `ExportBillService` for data management.

## 3. Dashboard Implementation

### Overview
The `TradeDashboardPageComponent` provides a unified view of all trade finance transactions.

### Features
-   **Unified View**: Aggregates `TradeRequest`, `ExportBill`, and `ExportProceed` into a single `TransactionSummary` list.
-   **Real-time Updates**: Uses `combineLatest` with RxJS `BehaviorSubject` to reflect status changes immediately.
-   **Filtering & Sorting**: Transactions are sorted by date (newest first).
-   **Status Visualization**: Color-coded badges for different statuses (e.g., Green for `APPROVED`, Blue for `SUBMITTED`).
-   **History Timeline**: Expandable rows show the complete audit trail (`history` array) for each transaction, including actor, timestamp, and comments.

### Implementation Details
-   **File**: `src/app/pages/trade/dashboard/trade-dashboard.page.ts`
-   **Key Method**: `ngOnInit` subscribes to multiple service streams and maps them to `TransactionSummary`.

## 4. Status Management

### Overview
A centralized `WorkflowService` manages status transitions and validation to ensure process integrity.

### Components
-   **WorkflowService**: Defines allowed transitions per transaction type and role.
-   **TradeStatus Enum**: Standardized set of statuses (e.g., `DRAFT`, `SUBMITTED`, `APPROVED`).
-   **Validation**: `canTransition(type, currentStatus, newStatus, role)` checks if a user is allowed to perform an action.

### Transition Logic
-   **Role-Based**: Only specific roles (e.g., `RO`, `TO`, `APPROVER`) can perform certain transitions.
-   **Validation**: Prevents illegal jumps (e.g., skipping from `DRAFT` to `APPROVED`).

## 5. Data Persistence

### Overview
Data is persisted using `localStorage` to maintain state across browser sessions.

### Implementation
-   **Service-Level Persistence**: Each service (`TradeRequestService`, `ExportBillService`, etc.) implements `loadFromStorage()` and `saveToStorage()`.
-   **Storage Keys**:
    -   `trade_requests`
    -   `export_bills`
    -   `export_proceeds`
-   **Data Integrity**: JSON parsing with error handling (implicit in implementation) ensures data structure is maintained.

## 6. Testing Requirements

### Unit Tests
-   **Services**: Verify `add`, `update`, and status transition logic.
-   **WorkflowService**: Test `canTransition` with various combinations of roles and statuses.
-   **Dashboard**: Verify data aggregation and mapping logic.

### End-to-End (E2E) Tests
1.  **Request Flow**:
    -   Create Request -> Submit -> RO Validate -> TO Approve.
    -   Verify status changes at each step.
2.  **Dashboard**:
    -   Create a new transaction.
    -   Verify it appears on the dashboard.
    -   Update status.
    -   Verify status update on dashboard.
    -   Expand row to verify history.
3.  **Persistence**:
    -   Create data -> Refresh page -> Verify data remains.

### Validation Plan
-   Use manual verification for UI flows (since Cypress/Selenium is not set up).
-   Use console logs and debugger for logic verification.
