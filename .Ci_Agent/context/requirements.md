Background 

Chubb's APAC operations team manages insurance policies across multiple regions. They currently rely on spreadsheets and need a web-based dashboard to view, filter, and act on policy data. Your task is to build the Policy Overview Dashboard — a single-page application that demonstrates production-quality frontend engineering. 

The dashboard will consume policy data from a lightweight local API (JSON Server or a simple mock server). The focus of this assessment is entirely on the frontend — architecture, component design, testing, accessibility, and code quality. 

Requirements 

Core Features 

Policy Table View 

Paginated, sortable table displaying policy records 

Server-side filtering by status, line of business, date range, and region 

Free-text search across policy number, policyholder name, and underwriter 

Configurable page size with sensible defaults 

Bulk Actions 

Multi-select policies via checkboxes 

"Flag for Review" bulk action on selected policies 

Clear visual feedback on action success/failure 

Summary Statistics Panel 

Counts by policy status (Active, Expired, Pending, Cancelled) 

Total premium by line of business 

Count of policies expiring within 30 days 

Should update when filters are applied 

State Management 

Loading states for all async operations (skeleton screens or loading indicators, not just spinners) 

Empty states when no data matches filters 

Error states with meaningful messages and retry options 

Optimistic updates where appropriate (e.g., flagging for review) 

Data Source 

Use a lightweight mock backend to serve policy data. Provide a seed dataset of 200+ policy records matching this schema: 

Field | Type | Notes 

id | UUID | Primary key 

policyNumber | String | Unique, format: POL-XXXXXX 

policyholderName |String |Realistic APAC names 

lineOfBusiness | Enum | Property, Casualty, A&H, Marine 

status | Enum | Active, Expired, Pending, Cancelled 

premiumAmount | Decimal | Range: 1,000 – 5,000,000 

currency | String | USD, SGD, HKD, AUD, JPY, THB 

effectiveDate | Date | 

expiryDate | Date | 

region | String | Singapore, Hong Kong, Australia, Japan, Thailand, Indonesia, Malaysia, Philippines 

underwriter | String 

flaggedForReview | Boolean | Default: false 
  

Component Architecture (Required) 

Your solution should demonstrate clear component design thinking — composable, single-responsibility components with appropriate granularity, and a clean separation between data and presentation concerns. 

State Management (Required) 

Choose a state management approach that fits the complexity of the application and justify your choice. Server and client state should be clearly separated, and URL state should make the application shareable and bookmarkable where it matters. 

Theming and Design Tokens (Required) 

Support light and dark themes with a user toggle. The implementation should reflect modern design token practice, with theme preferences persisted across sessions and system preferences respected as defaults. 

Local Storage (Required) 

Demonstrate thoughtful, abstracted use of browser storage for user preferences (theme, page size, last-used filters, etc.). Storage access should be properly encapsulated, not scattered through the codebase. 

Accessibility (Required) 

The dashboard must meet modern accessibility standards (WCAG 2.1 AA). We expect this applied with the same care as any other production requirement — not retrofitted at the end. 

Test Automation (Required) 

We expect production-quality engineering standards for testing. Think about what a senior engineer would expect to see in a pull request. 

Cross-Cutting Concerns 

A production application needs more than features. Consider error handling, logging, internationalisation readiness, externalised configuration, and CI-readiness as appropriate. 

Engineering Principles We Value 

We expect the application to reflect the principles a senior engineer would naturally apply: DRY, SOLID, clean code, and clear separation of concerns — not as a checklist, but evident in how the code is structured