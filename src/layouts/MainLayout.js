import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Description as DocumentIcon,
  Assessment as ReportIcon,
  CloudUpload as PortalIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Store as ServiceIcon,
  Subscriptions as SubscriptionIcon,
  Tune as ConfigurationIcon,
  Receipt as BillingIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import NotificationPopover from '../components/notifications/NotificationPopover';

const drawerWidth = 240;

const MainLayout = () => {
  const navigate = useNavigate();
  const { currentUser, logout, hasRole } = useAuth();
  const { getUnreadCount } = useNotification();
  
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const mainMenuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['admin', 'compliance_officer', 'entity_manager']
    },
    {
      text: 'Compliance Calendar',
      icon: <CalendarIcon />,
      path: '/compliance/calendar',
      roles: ['admin', 'compliance_officer', 'entity_manager']
    },
    {
      text: 'Compliance Tasks',
      icon: <CalendarIcon />,
      path: '/compliance',
      roles: ['admin', 'compliance_officer', 'entity_manager']
    },
    {
      text: 'Service Catalog',
      icon: <ServiceIcon />,
      path: '/services/catalog',
      roles: ['admin', 'compliance_officer', 'entity_manager']
    },
    {
      text: 'Subscriptions',
      icon: <SubscriptionIcon />,
      path: '/services/subscriptions',
      roles: ['admin', 'compliance_officer', 'entity_manager']
    },
    {
      text: 'Configuration',
      icon: <ConfigurationIcon />,
      path: '/services/configuration',
      roles: ['admin', 'compliance_officer', 'entity_manager']
    },
    {
      text: 'Billing',
      icon: <BillingIcon />,
      path: '/services/billing',
      roles: ['admin', 'compliance_officer', 'entity_manager']
    },
    {
      text: 'Documents',
      icon: <DocumentIcon />,
      path: '/documents',
      roles: ['admin', 'compliance_officer', 'entity_manager']
    },
    {
      text: 'Reports',
      icon: <ReportIcon />,
      path: '/reports',
      roles: ['admin', 'compliance_officer']
    },
    {
      text: 'Portal Integrations',
      icon: <PortalIcon />,
      path: '/portals',
      roles: ['admin', 'compliance_officer']
    }
  ];
  
  const adminMenuItems = [
    {
      text: 'User Management',
      icon: <PeopleIcon />,
      path: '/admin/users',
      roles: ['admin']
    },
    {
      text: 'Role Management',
      icon: <PeopleIcon />,
      path: '/admin/roles',
      roles: ['admin']
    },
    {
      text: 'Client Credentials',
      icon: <VpnKeyIcon />,
      path: '/admin/credentials',
      roles: ['admin']
    },
    {
      text: 'System Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings',
      roles: ['admin']
    }
  ];
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            RegisterKaro Compliance Module
          </Typography>
          
          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={getUnreadCount()} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* Profile */}
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {currentUser?.name.charAt(0)}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(open ? { width: drawerWidth } : { width: 0 }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        
        {/* Main Menu Items */}
        <List>
          {mainMenuItems.map((item) => (
            item.roles.includes(currentUser?.role) && (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    minHeight: 48,
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )
          ))}
        </List>
        
        <Divider />
        
        {/* Admin Menu Items */}
        {hasRole('admin') && (
          <List>
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    minHeight: 48,
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
      
      {/* Notifications Popover */}
      <NotificationPopover
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
      />
    </Box>
  );
};

export default MainLayout;