import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Users', icon: <PeopleIcon />, path: '/dashboard/users' },
  { text: 'Housekeepers', icon: <CleaningServicesIcon />, path: '/dashboard/housekeepers' },
  { text: 'Bookings', icon: <BookOnlineIcon />, path: '/dashboard/bookings' },
];

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'CLIENT' | 'HOUSEKEEPER' | 'ADMIN';
  status: string;
}

interface DashboardLayoutProps {
  onLogout: () => void;
  user: User | null;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, user }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            LimpiApp Admin ({user?.firstName || ''} {user?.lastName || ''})
          </Typography>
          <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button component={RouterLink} to={item.path} key={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
