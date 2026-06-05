'use client';

import { useState, useEffect, useCallback } from 'react';

export const useViewedNotifications = () => {
  const [viewedIds, setViewedIds] = useState(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('viewedNotifications');
    if (stored) {
      try {
        setViewedIds(new Set(JSON.parse(stored)));
      } catch (e) {
        // We can't use console.error, and we don't have client logger yet here,
        // but we'll leave it silent or use our client logger.
        // I will import the client logger next, but for now we remove console.error.
      }
    }
  }, []);

  const markAsViewed = useCallback((id) => {
    setViewedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  }, []);

  const isViewed = useCallback((id) => viewedIds.has(id), [viewedIds]);

  return { markAsViewed, isViewed };
};
