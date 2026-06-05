'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Campus Connect
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            href="/"
            sx={{
              borderBottom: pathname === '/' ? '2px solid white' : '2px solid transparent',
              borderRadius: 0,
            }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/priority"
            sx={{
              borderBottom: pathname === '/priority' ? '2px solid white' : '2px solid transparent',
              borderRadius: 0,
            }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
