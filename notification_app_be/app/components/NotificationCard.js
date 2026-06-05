'use client';

import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const getTypeColor = (type) => {
  switch (type) {
    case 'placement':
      return { bg: '#e8f5e9', text: '#2e7d32', label: 'Placement' };
    case 'result':
      return { bg: '#e3f2fd', text: '#1565c0', label: 'Result' };
    case 'event':
      return { bg: '#fff3e0', text: '#e65100', label: 'Event' };
    default:
      return { bg: '#f5f5f5', text: '#616161', label: type };
  }
};

export default function NotificationCard({ notification, isViewed, onMarkViewed, rank, score }) {
  const color = getTypeColor(notification.type);

  return (
    <Card 
      onClick={() => onMarkViewed(notification.id)}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        border: isViewed ? '1px solid #e0e0e0' : '1px solid #1976d2',
        boxShadow: isViewed ? 'none' : '0 4px 12px rgba(25,118,210,0.15)',
        backgroundColor: isViewed ? '#fafafa' : '#ffffff',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {rank !== undefined && (
              <Box 
                sx={{ 
                  bgcolor: color.bg, 
                  color: color.text, 
                  fontWeight: 'bold', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}
              >
                #{rank}
              </Box>
            )}
            <Chip 
              label={color.label} 
              size="small" 
              sx={{ 
                bgcolor: color.bg, 
                color: color.text, 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.7rem'
              }} 
            />
            {!isViewed && (
              <Box sx={{ width: 8, height: 8, bgcolor: '#1976d2', borderRadius: '50%' }} />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </Typography>
        </Box>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontSize: '1rem', 
            fontWeight: isViewed ? 500 : 700,
            mb: 0.5 
          }}
        >
          {notification.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {notification.message}
        </Typography>

        {score !== undefined && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#9c27b0', fontWeight: 'bold' }}>
            Priority Score: {score.toFixed(2)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
