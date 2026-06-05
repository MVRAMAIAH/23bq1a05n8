# Notification System Design

# Stage 1

## Priority Inbox — Top N Unread Notifications

### Problem

Students are missing important notifications (like placement offers) because there are too many notifications. We need a **Priority Inbox** that shows the **top N unread notifications** based on importance.

Priority = **type weight** (placement > result > event) + **recency** (newer = higher)

### Approach — Min-Heap of size N

I used a min-heap that only holds N items. The root is always the least important item in the top N, so checking if a new notification belongs is just one comparison.

- If heap isn't full → insert
- If heap is full and new score > root → replace root
- Otherwise → skip

This gives **O(M log N)** time vs O(M log M) for sorting everything. Way faster when you only need 10 out of hundreds.

### Scoring

| Type | Weight |
|------|--------|
| placement | 30 |
| result | 20 |
| event | 10 |

Recency bonus: 0–10 points, decays linearly over 7 days.

**Score = typeWeight + recencyScore**

So a placement from 1hr ago scores ~40, a result from 2hrs ago scores ~30, and a fresh event scores ~20. Placement always stays on top which is what we want.

### Complexity

| | Value |
|--|-------|
| Time | O(M log N) |
| Space | O(N) |

Since log₂(10) ≈ 3, each notification takes roughly constant time.

### Running the code

```bash
node notification_app_fe/priorityInbox.js
```

Output shows all 10 notifications ranked by priority — placements first, then results, then events.
