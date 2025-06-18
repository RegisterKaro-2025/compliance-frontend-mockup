import React from 'react';
import { 
  Popover, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button, 
  Paper,
  IconButton,
  Stack,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import {
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  ErrorOutline as ErrorOutlineIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon
} from '@mui/icons-material';

const NotificationPopover = ({ anchorEl, open, onClose }) => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification 
  } = useNotification();

  // Function to format notification date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'DEADLINE_APPROACHING':
        return <AccessTimeIcon color="warning" />;
      case 'DOCUMENT_UPLOADED':
        return <DescriptionIcon color="info" />;
      case 'STATUS_CHANGE':
        return <AssignmentTurnedInIcon color="primary" />;
      case 'DOCUMENT_VERIFICATION':
        return <ErrorOutlineIcon color="error" />;
      case 'FILING_SUCCESS':
        return <CheckIcon color="success" />;
      case 'SYSTEM':
        return <ErrorOutlineIcon />;
      default:
        return <ErrorOutlineIcon />;
    }
  };

  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate to the related item if there's an action URL
    if (notification.actions && notification.actions.length > 0) {
      navigate(notification.actions[0].url);
    }
    
    onClose();
  };

  // Handle Mark All as Read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  // Handle notification deletion
  const handleDeleteNotification = (event, notificationId) => {
    event.stopPropagation();
    deleteNotification(notificationId);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: { width: 360, maxHeight: 500 }
      }}
    >
      <Paper sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
          <Button size="small" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        </Box>

        {/* Notification List */}
        {notifications.length > 0 ? (
          <List sx={{ p: 0, maxHeight: 380, overflowY: 'auto' }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  alignItems="flex-start" 
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ 
                    cursor: 'pointer',
                    backgroundColor: notification.isRead ? 'inherit' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    }
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      size="small"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    <Box sx={{ mt: 0.5 }}>
                      {getNotificationIcon(notification.type)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" component="div">
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={notification.priority} 
                          size="small" 
                          color={getPriorityColor(notification.priority)}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications to display
            </Typography>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
          <Button size="small" onClick={() => { navigate('/notifications'); onClose(); }}>
            View All Notifications
          </Button>
        </Box>
      </Paper>
    </Popover>
  );
};

export default NotificationPopover;