const TYPE_WEIGHTS = {
  placement: 30,
  result: 20,
  event: 10,
};

const RECENCY_MAX_SCORE = 10;
const RECENCY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function calculatePriority(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.type] || 0;

  const now = Date.now();
  const notifTime = new Date(notification.timestamp).getTime();
  const ageMs = now - notifTime;

  const recencyScore =
    ageMs >= RECENCY_WINDOW_MS
      ? 0
      : RECENCY_MAX_SCORE * (1 - ageMs / RECENCY_WINDOW_MS);

  return typeWeight + recencyScore;
}

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

  insert(item) {
    if (this.heap.length < this.capacity) {
      this.heap.push(item);
      this._siftUp(this.heap.length - 1);
    } else if (item.score > this.heap[0].score) {
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

export function getTopNNotifications(notifications, n = 10, isViewedFn) {
  const heap = new MinHeap(n);

  for (const notif of notifications) {
    // Skip if read property is explicitly true, or if our hook says it's viewed
    if (notif.read || (isViewedFn && isViewedFn(notif.id))) continue;

    const score = calculatePriority(notif);
    heap.insert({ ...notif, score });
  }

  return heap.extractAllDescending();
}
