'use client';

import { useState, useEffect } from 'react';

export const useViewedNotifications = () => {
  const [viewedIds, setViewedIds] = useState(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('viewedNotifications');
    if (stored) {
      try {
        setViewedIds(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error("Failed to parse viewed notifications from local storage", e);
      }
    }
  }, []);

  const markAsViewed = (id) => {
    setViewedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const isViewed = (id) => viewedIds.has(id);

  return { markAsViewed, isViewed };
};
