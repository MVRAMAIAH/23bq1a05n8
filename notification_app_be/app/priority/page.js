'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fetchNotifications } from '../lib/api';
import { getTopNNotifications } from '../lib/priority';
import NotificationCard from '../components/NotificationCard';
import { useViewedNotifications } from '../hooks/useViewedNotifications';

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Priority specific controls
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState('all');
  
  const { isViewed, markAsViewed } = useViewedNotifications();

  useEffect(() => {
    const loadAndProcessNotifications = async () => {
      setLoading(true);
      try {
        // Fetch a large pool of notifications to process priority correctly.
        // If the API supports true priority sorting, we'd pass limit=topN. 
        // For fallback safety, we fetch without limit and sort locally.
        const data = await fetchNotifications({ type: filterType });
        
        // Use the Min-Heap logic to extract Top N Unread
        const topPriority = getTopNNotifications(data, topN, isViewed);
        
        setNotifications(topPriority);
        setError(null);
      } catch (err) {
        setError('Failed to load priority notifications.');
      } finally {
        setLoading(false);
      }
    };

    loadAndProcessNotifications();
  }, [topN, filterType, isViewed]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Priority Inbox
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Top N</InputLabel>
            <Select value={topN} label="Top N" onChange={(e) => setTopN(e.target.value)}>
              <MenuItem value={5}>Top 5</MenuItem>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="placement">Placement</MenuItem>
              <MenuItem value="result">Result</MenuItem>
              <MenuItem value="event">Event</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No unread notifications qualify for the priority inbox.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Box>
          {notifications.map((notif, index) => (
            <NotificationCard 
              key={notif.id} 
              notification={notif} 
              isViewed={false} // Priority inbox only shows unread items natively by our heap logic
              onMarkViewed={markAsViewed}
              rank={index + 1}
              score={notif.score}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
