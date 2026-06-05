// Priority Inbox - finds top N unread notifications using a min-heap

const TYPE_WEIGHTS = {
  placement: 30,
  result: 20,
  event: 10,
};

const RECENCY_MAX_SCORE = 10;
const RECENCY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function calculatePriority(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.type] || 0;

  const now = Date.now();
  const notifTime = new Date(notification.timestamp).getTime();
  const ageMs = now - notifTime;

  // newer notifications get higher recency score (max 10, decays linearly over 7 days)
  const recencyScore =
    ageMs >= RECENCY_WINDOW_MS
      ? 0
      : RECENCY_MAX_SCORE * (1 - ageMs / RECENCY_WINDOW_MS);

  return typeWeight + recencyScore;
}

// min-heap that only keeps top N items
class MinHeap {
  constructor(capacity) {
    this.capacity = capacity;
    this.heap = [];
  }

  _parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  _leftChild(i) {
    return 2 * i + 1;
  }
  _rightChild(i) {
    return 2 * i + 2;
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  _siftUp(index) {
    while (index > 0) {
      const parent = this._parentIndex(index);
      if (this.heap[parent].score <= this.heap[index].score) break;
      this._swap(parent, index);
      index = parent;
    }
  }

  _siftDown(index) {
    const size = this.heap.length;
    while (true) {
      let smallest = index;
      const left = this._leftChild(index);
      const right = this._rightChild(index);

      if (left < size && this.heap[left].score < this.heap[smallest].score) {
        smallest = left;
      }
      if (right < size && this.heap[right].score < this.heap[smallest].score) {
        smallest = right;
      }
      if (smallest === index) break;
      this._swap(index, smallest);
      index = smallest;
    }
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  insert(item) {
    if (this.heap.length < this.capacity) {
      // heap not full yet, just add it
      this.heap.push(item);
      this._siftUp(this.heap.length - 1);
    } else if (item.score > this.heap[0].score) {
      // new item is better than the current worst in top N, replace it
      this.heap[0] = item;
      this._siftDown(0);
    }
  }

  extractAllDescending() {
    const result = [];
    while (this.heap.length > 0) {
      this._swap(0, this.heap.length - 1);
      result.push(this.heap.pop());
      if (this.heap.length > 0) this._siftDown(0);
    }
    return result.reverse();
  }
}

function getTopNNotifications(notifications, n = 10) {
  const heap = new MinHeap(n);

  for (const notif of notifications) {
    if (notif.read) continue;

    const score = calculatePriority(notif);
    heap.insert({ ...notif, score });
  }

  return heap.extractAllDescending();
}

// sample data
function generateSampleNotifications() {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  return [
    {
      id: 1,
      type: "placement",
      title: "Google — Offer Letter Released",
      message: "Congratulations! Your offer letter from Google is ready.",
      timestamp: new Date(now - 1 * HOUR).toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "placement",
      title: "Microsoft — Interview Scheduled",
      message: "Your final round interview is on Monday at 10 AM.",
      timestamp: new Date(now - 12 * HOUR).toISOString(),
      read: false,
    },
    {
      id: 3,
      type: "placement",
      title: "Amazon — Application Accepted",
      message: "Your application for SDE-1 has been shortlisted.",
      timestamp: new Date(now - 2 * DAY).toISOString(),
      read: false,
    },
    {
      id: 4,
      type: "placement",
      title: "Infosys — Offer Expired",
      message: "Your Infosys offer has expired. Contact TPO for details.",
      timestamp: new Date(now - 6 * DAY).toISOString(),
      read: false,
    },
    {
      id: 5,
      type: "result",
      title: "Semester 6 Results Published",
      message: "Your SGPA for Semester 6 is 8.75. View full results.",
      timestamp: new Date(now - 2 * HOUR).toISOString(),
      read: false,
    },
    {
      id: 6,
      type: "result",
      title: "Internal Assessment Marks Updated",
      message: "IA-2 marks for Data Structures have been uploaded.",
      timestamp: new Date(now - 1 * DAY).toISOString(),
      read: false,
    },
    {
      id: 7,
      type: "result",
      title: "Revaluation Result — DBMS",
      message: "Your revaluation result for DBMS is now available.",
      timestamp: new Date(now - 3 * DAY).toISOString(),
      read: false,
    },
    {
      id: 8,
      type: "result",
      title: "Lab Exam Grades Released",
      message: "Check your lab exam grades for this semester.",
      timestamp: new Date(now - 5 * DAY).toISOString(),
      read: true,
    },
    {
      id: 9,
      type: "event",
      title: "Hackathon Registration Open",
      message: "Register for the 36-hour campus hackathon by Friday.",
      timestamp: new Date(now - 30 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 10,
      type: "event",
      title: "Guest Lecture — AI in Healthcare",
      message: "Dr. Sharma will speak in Auditorium A at 3 PM today.",
      timestamp: new Date(now - 3 * HOUR).toISOString(),
      read: false,
    },
    {
      id: 11,
      type: "event",
      title: "Sports Day Registrations",
      message: "Register for cricket, badminton, or athletics events.",
      timestamp: new Date(now - 4 * DAY).toISOString(),
      read: false,
    },
    {
      id: 12,
      type: "event",
      title: "NSS Camp — Volunteer Signup",
      message: "NSS camp is scheduled for next week. Sign up now.",
      timestamp: new Date(now - 5 * DAY).toISOString(),
      read: false,
    },
    {
      id: 13,
      type: "event",
      title: "Cultural Fest Auditions",
      message: "Auditions for dance and drama clubs this Saturday.",
      timestamp: new Date(now - 6 * DAY).toISOString(),
      read: false,
    },
    {
      id: 14,
      type: "event",
      title: "Old Workshop Notification",
      message: "Python workshop held last month — resources uploaded.",
      timestamp: new Date(now - 8 * DAY).toISOString(),
      read: false,
    },
  ];
}

function getTimeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function main() {
  const notifications = generateSampleNotifications();

  console.log("=".repeat(70));
  console.log("  PRIORITY INBOX — Top 10 Unread Notifications");
  console.log("=".repeat(70));
  console.log();

  const topN = getTopNNotifications(notifications, 10);

  const readCount = notifications.filter((n) => n.read).length;
  console.log(`  Showing top ${topN.length} of ${notifications.length} total notifications`);
  console.log(`  (${readCount} already read → skipped)`);
  console.log();
  console.log("-".repeat(70));

  topN.forEach((notif, index) => {
    const rank = index + 1;
    const typeLabel = notif.type.toUpperCase().padEnd(10);
    const scoreFormatted = notif.score.toFixed(2);
    const timeAgo = getTimeAgo(notif.timestamp);

    console.log(`  #${rank.toString().padStart(2)}  [${typeLabel}]  Score: ${scoreFormatted}`);
    console.log(`       ${notif.title}`);
    console.log(`       ${notif.message}`);
    console.log(`       ⏱  ${timeAgo}`);
    console.log("-".repeat(70));
  });

  console.log();
  console.log("  Weight breakdown:  placement=30  |  result=20  |  event=10");
  console.log("  Recency bonus:     0-10 points (linear decay over 7 days)");
  console.log();
}

main();
