'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Pagination, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { fetchNotifications } from './lib/api';
import NotificationCard from './components/NotificationCard';
import { useViewedNotifications } from './hooks/useViewedNotifications';

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and Pagination
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { isViewed, markAsViewed } = useViewedNotifications();

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications({ limit, page, type: filterType });
        setNotifications(data);
        setError(null);
      } catch (err) {
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [filterType, page]);

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          All Notifications
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select value={filterType} label="Type" onChange={handleFilterChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="placement">Placement</MenuItem>
            <MenuItem value="result">Result</MenuItem>
            <MenuItem value="event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found for this filter.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <>
          <Box mb={4}>
            {notifications.map((notif) => (
              <NotificationCard 
                key={notif.id} 
                notification={notif} 
                isViewed={isViewed(notif.id)}
                onMarkViewed={markAsViewed}
              />
            ))}
          </Box>
          <Box display="flex" justifyContent="center">
            {/* Hardcoding count for mock purposes, realistically API returns total pages */}
            <Pagination 
              count={3} 
              page={page} 
              onChange={(e, value) => setPage(value)} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Box>
  );
}
