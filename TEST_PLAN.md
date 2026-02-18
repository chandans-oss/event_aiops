# Comprehensive Test Plan for Event Analytics Platform

This document outlines the testing strategy and specific test categories to ensure the reliability, data integrity, and user experience of the Event Analytics Platform.

## 1. Admin & Rule Management
Focus: Verifying the configuration and management of event processing rules.
*   **Deduplication Rules**
    *   Create a new deduplication rule (Exact Match, Time Window).
    *   Edit an existing rule and verify updates persist.
    *   Delete a rule and confirm removal from the list.
    *   Toggle rule status (Active/Inactive).
*   **Suppression Rules**
    *   Create a suppression rule (Maintenance, Business Hours).
    *   Verify that suppressed events do not appear in the main event feed (excluding 'Suppressed' filter).
*   **Correlation Rules**
    *   Create a simple correlation rule (Temporal, Spatial).
    *   Verify that events matching the rule are incorrectly grouped in clusters.
*   **Data Integrity**
    *   **Edge Case**: Verify behavior when rule lists are empty or mock data is undefined (Regression test for `RulesSection.tsx` fix).

## 2. Event Ingestion & Processing
Focus: Ensuring raw event data is correctly parsed, displayed, and filtered.
*   **Event Feed**
    *   Verify all events load with correct Severity, Status, and Timestamp.
    *   Test searching by Event ID, Device Name, and Message.
    *   Test filtering by Severity (Critical, Major, etc.) and Label (Root, Child).
    *   Verify "Show Resolved" toggle correctly shows/hides historical events.
*   **Detailed View**
    *   Clicking an event opens the correct Sidebar (Info, RCA, etc.).
    *   Verify all event details (properties, extended attributes) are displayed correctly.

## 3. Root Cause Analysis (RCA) Engine
Focus: Validating the automated analysis pipeline and result presentation.
*   **Pipeline Stages**
    *   Verify visualization of the 6-stage pipeline (Orchestration -> RCA Engine).
    *   Ensure status indicators (Pending, Active, Complete) update correctly based on cluster state.
*   **RCA Results**
    *   Verify "Root Cause Identified" card appears only for completed clusters.
    *   Check accuracy of "Confidence Score" and "Top Hypothesis".
    *   Validate the "Similar Past Incidents" list logic (e.g., ensuring high similarity matches appear).
*   **Drill-down**
    *   Navigate from Overview -> Timeline -> Detail view for a specific cluster.

## 4. Automated Remediation
Focus: Testing the interactive remediation workflows and audit logging.
*   **Workflow Execution**
    *   Start a remediation session for a cluster.
    *   Execute steps sequentially and verify "Success" state transition.
    *   Simulate a "Failed" step and verify "Retry" or "Abort" options.
*   **Terminal & Logs**
    *   Verify pseudo-terminal output matches the executed actions.
    *   Check "Audit Log" generation (mock) upon completion.
*   **State Persistence**
    *   Ensure remediation progress is preserved when navigating away and back (within the mock session context).

## 5. Topology & Dependency Mapping
Focus: Visualizing service relationships and propagating status.
*   **Graph Interaction**
    *   Verify all nodes are rendered and connected correctly based on mock data.
    *   Clicking a node (e.g., `api-gateway`) opens the "Node Insights" sidebar.
*   **Status Propagation**
    *   Ensure nodes with active critical events are visually highlighted (e.g., red border/icon).
    *   Verify "Predicted Impact" links show potential future degradation.

## 6. Clustering & Correlation
Focus: Grouping related events into meaningful clusters.
*   **Clustering Logic**
    *   Verify that "Child Events" are correctly nested under their "Root Cause" event.
    *   Check "Correlation Score" visualization (e.g., 87% match).
*   **Strategy Validation**
    *   Verify active correlation strategies (Temporal, Topological) are correctly indicated.

## 7. Performance & Stability
Focus: Application responsiveness and error handling.
*   **Empty States**: Verify graceful handling of no data across all pages (Dashboard, Events, Admin).
*   **Loading States**: Ensure loading spinners/skeletons appear during data fetching (mocked delays).
*   **Navigation**: Verify strict routing (e.g., `/rca/detail/:id` works, 404 for invalid IDs).

## 8. Mobile & Responsive Design
Focus: Usability across different screen sizes.
*   **Sidebar Behavior**: Verify sidebars (Navigation, Details) collapse/expand correctly on smaller screens.
*   **Table Layouts**: Ensure event tables scroll horizontally without breaking layout.
