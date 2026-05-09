# Notification System Design

## Stage 1

### Approach for Top 'n' Priority Notifications
The requirement is to introduce a Priority Inbox that displays the top 'n' most important unread notifications. Priority is determined by a combination of weight (`Placement` > `Result` > `Event`) and recency.

**Implementation Logic:**
1. **Fetching:** We fetch the current list of notifications from the provided API endpoint.
2. **Weight Assignment:** We assign a numerical weight to each notification type to easily compare them:
   - `Placement`: 3
   - `Result`: 2
   - `Event`: 1
3. **Sorting:** 
   - We use the standard array `sort` method. 
   - First, we compare the weights of two notifications. The one with the higher weight is placed first.
   - If two notifications have the exact same weight (e.g., both are `Result`), we then compare their `Timestamp`. The notification with the more recent timestamp is placed first.
4. **Extraction:** After sorting the entire list, we simply take the first `n` elements (e.g., `notifications.slice(0, 10)`).
5. **Efficiency Note:** While sorting the entire list is `O(N log N)`, it is perfectly adequate and very simple for relatively small arrays (like what a typical user inbox might hold unread). If the number of unread notifications scales to millions, a more efficient approach would be to use a Min-Heap of size `n` which would achieve `O(N log k)` time complexity. However, for a beginner-friendly approach in a frontend/BFF context, simple sorting is clean and maintainable.

**Logging:** All operations are logged extensively using the mandated `logging_middleware`.
