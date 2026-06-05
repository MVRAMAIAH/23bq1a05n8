import ThemeRegistry from './ThemeRegistry';
import Navigation from './components/Navigation';
import { Box, Container } from '@mui/material';

export const metadata = {
  title: 'Campus Notifications',
  description: 'Campus notification app with priority inbox',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Navigation />
          <Container maxWidth="md" sx={{ pt: 10, pb: 4 }}>
            {children}
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
