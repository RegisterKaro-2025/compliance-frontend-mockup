import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  IconButton, 
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Stack,
  Badge
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  ViewModule as ViewModuleIcon,
  ViewWeek as ViewWeekIcon,
  ViewList as ViewListIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCompliance } from '../../contexts/ComplianceContext';

// Days of the week
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ComplianceCalendar = () => {
  const navigate = useNavigate();
  const { 
    compliances, 
    complianceTypes, 
    getComplianceById, 
    getComplianceTypeById, 
    getEntityById 
  } = useCompliance();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', or 'list'
  const [selectedComplianceId, setSelectedComplianceId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    complianceType: 'all',
    status: 'all'
  });
  
  // Calculate calendar data based on current date and view
  const [calendarData, setCalendarData] = useState([]);
  
  // Helper function to check if a date is today
  const isToday = useCallback((date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }, []);
  
  // Helper function to get compliances for a specific date
  const getCompliancesForDate = useCallback((date) => {
    // Filter compliances by date and applied filters
    const filteredCompliances = compliances.filter(compliance => {
      // Check if compliance due date matches the calendar date
      const dueDate = new Date(compliance.dueDate);
      const isMatchingDate = dueDate.getDate() === date.getDate() &&
        dueDate.getMonth() === date.getMonth() &&
        dueDate.getFullYear() === date.getFullYear();
      
      // Apply type filter
      const matchesType = filters.complianceType === 'all' ||
        compliance.complianceTypeId === filters.complianceType;
      
      // Apply status filter
      const matchesStatus = filters.status === 'all' ||
        compliance.status === filters.status;
      
      const result = isMatchingDate && matchesType && matchesStatus;
      
      // Debug logging
      if (isMatchingDate) {
        console.log(`Found compliance for ${date.toDateString()}:`, {
          compliance: compliance.id,
          dueDate: dueDate.toDateString(),
          matchesType,
          matchesStatus,
          result
        });
      }
      
      return result;
    });
    
    return filteredCompliances;
  }, [compliances, filters]);
  
  // Generate month view calendar data
  const generateMonthViewData = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Previous month's days to show
    const previousMonthDays = startingDayOfWeek;
    
    // Calculate total cells needed (days from prev month + current month + next month)
    const totalCells = Math.ceil((previousMonthDays + totalDays) / 7) * 7;
    
    // Generate calendar days
    const days = [];
    
    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < previousMonthDays; i++) {
      const dayNum = prevMonthLastDay - previousMonthDays + i + 1;
      const date = new Date(year, month - 1, dayNum);
      days.push({
        date,
        dayNumber: dayNum,
        isCurrentMonth: false,
        hasCompliances: getCompliancesForDate(date).length > 0,
        compliances: getCompliancesForDate(date)
      });
    }
    
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: isToday(date),
        hasCompliances: getCompliancesForDate(date).length > 0,
        compliances: getCompliancesForDate(date)
      });
    }
    
    // Next month's days
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        hasCompliances: getCompliancesForDate(date).length > 0,
        compliances: getCompliancesForDate(date)
      });
    }
    
    setCalendarData(days);
  }, [currentDate, getCompliancesForDate, isToday]);
  
  // Generate week view calendar data
  const generateWeekViewData = useCallback(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    
    // Calculate the first day of the week (Sunday)
    date.setDate(date.getDate() - day);
    
    const days = [];
    
    // Generate 7 days (full week)
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(date);
      days.push({
        date: currentDate,
        dayNumber: currentDate.getDate(),
        dayName: DAYS_OF_WEEK[currentDate.getDay()],
        isToday: isToday(currentDate),
        hasCompliances: getCompliancesForDate(currentDate).length > 0,
        compliances: getCompliancesForDate(currentDate)
      });
      date.setDate(date.getDate() + 1);
    }
    
    setCalendarData(days);
  }, [currentDate, getCompliancesForDate, isToday]);
  
  // Generate list view calendar data
  const generateListViewData = useCallback(() => {
    // Get all compliances for the current month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let filteredCompliances = compliances.filter(compliance => {
      const dueDate = new Date(compliance.dueDate);
      return dueDate >= firstDay && dueDate <= lastDay;
    });
    
    // Apply filters
    if (filters.complianceType !== 'all') {
      filteredCompliances = filteredCompliances.filter(
        compliance => compliance.complianceTypeId === filters.complianceType
      );
    }
    
    if (filters.status !== 'all') {
      filteredCompliances = filteredCompliances.filter(
        compliance => compliance.status === filters.status
      );
    }
    
    // Sort by due date
    filteredCompliances.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    // Group by date
    const groupedCompliances = {};
    
    filteredCompliances.forEach(compliance => {
      const dueDate = new Date(compliance.dueDate);
      const dateKey = dueDate.toDateString();
      
      if (!groupedCompliances[dateKey]) {
        groupedCompliances[dateKey] = {
          date: dueDate,
          compliances: []
        };
      }
      
      groupedCompliances[dateKey].compliances.push(compliance);
    });
    
    setCalendarData(Object.values(groupedCompliances));
  }, [currentDate, compliances, filters]);
  
  // Generate calendar data based on current view
  const generateCalendarData = useCallback(() => {
    if (calendarView === 'month') {
      generateMonthViewData();
    } else if (calendarView === 'week') {
      generateWeekViewData();
    } else {
      generateListViewData();
    }
  }, [calendarView, generateMonthViewData, generateWeekViewData, generateListViewData]);

  // Debug effect to log compliance data
  useEffect(() => {
    console.log('ComplianceCalendar - Available compliances:', compliances.length);
    console.log('ComplianceCalendar - Current date:', currentDate.toDateString());
    console.log('ComplianceCalendar - Current view:', calendarView);
    console.log('ComplianceCalendar - Filters:', filters);
    
    // Log all compliance due dates
    compliances.forEach(compliance => {
      const dueDate = new Date(compliance.dueDate);
      console.log(`Compliance ${compliance.id}: Due ${dueDate.toDateString()}`);
    });
  }, [compliances, currentDate, calendarView, filters]);

  // Generate calendar days for the current month
  useEffect(() => {
    console.log('ComplianceCalendar - Generating calendar data...');
    generateCalendarData();
  }, [currentDate, calendarView, compliances, filters, generateCalendarData]);
  
  // Handle navigation to previous month/week
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };
  
  // Handle navigation to next month/week
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  // Handle navigation to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  // Handle calendar view change
  const handleViewChange = (view) => {
    setCalendarView(view);
  };
  
  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Handle compliance selection
  const handleComplianceClick = (complianceId) => {
    setSelectedComplianceId(complianceId);
    setDrawerOpen(true);
  };
  
  // Handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  
  // Handle navigation to compliance details
  const handleViewDetails = () => {
    if (selectedComplianceId) {
      navigate(`/compliance/${selectedComplianceId}`);
    }
  };
  
  // Render the calendar header
  const renderCalendarHeader = () => {
    return (
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handlePrevious}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h5" component="div" sx={{ flex: 1, textAlign: 'center' }}>
                {calendarView === 'month' ? (
                  `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                ) : (
                  `Week of ${currentDate.getDate()} ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                )}
              </Typography>
              <IconButton onClick={handleNext}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={handleToday}
              sx={{ mr: 1 }}
            >
              Today
            </Button>
            <ButtonGroup view={calendarView} onViewChange={handleViewChange} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="compliance-type-label">Compliance Type</InputLabel>
                <Select
                  labelId="compliance-type-label"
                  id="compliance-type"
                  name="complianceType"
                  value={filters.complianceType}
                  label="Compliance Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {complianceTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  // Render month view
  const renderMonthView = () => {
    return (
      <Box>
        {/* Day names header */}
        <Grid container sx={{ mb: 1 }}>
          {DAYS_OF_WEEK.map((day, index) => (
            <Grid item xs key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {day.substring(0, 3)}
              </Typography>
            </Grid>
          ))}
        </Grid>
        
        {/* Calendar grid */}
        <Grid container sx={{ height: '70vh' }}>
          {calendarData.map((day, index) => (
            <Grid item xs key={index} sx={{ height: 'calc(100% / 6)', border: '1px solid #e0e0e0' }}>
              <Box
                sx={{
                  height: '100%',
                  p: 1,
                  backgroundColor: day.isToday ? 'primary.light' : (day.isCurrentMonth ? 'white' : '#f5f5f5'),
                  opacity: day.isCurrentMonth ? 1 : 0.7,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    fontWeight: day.isToday ? 'bold' : 'normal',
                    color: day.isToday ? 'white' : 'inherit',
                    mb: 1
                  }}
                >
                  {day.dayNumber}
                </Typography>
                
                {day.hasCompliances && (
                  <Box sx={{ maxHeight: 'calc(100% - 30px)', overflow: 'auto' }}>
                    {day.compliances.slice(0, 3).map((compliance) => {
                      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                      return (
                        <Chip
                          key={compliance.id}
                          label={complianceType?.name || 'Compliance'}
                          size="small"
                          onClick={() => handleComplianceClick(compliance.id)}
                          color={getComplianceStatusColor(compliance.status)}
                          sx={{ mb: 0.5, width: '100%', height: 'auto', py: 0.5 }}
                        />
                      );
                    })}
                    {day.compliances.length > 3 && (
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                        +{day.compliances.length - 3} more
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    return (
      <Box>
        <Grid container spacing={2}>
          {calendarData.map((day, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: day.isToday ? 'primary.light' : 'white',
                  color: day.isToday ? 'white' : 'inherit',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {day.dayName} {day.dayNumber}
                </Typography>
                {day.hasCompliances ? (
                  <List sx={{ width: '100%' }}>
                    {day.compliances.map((compliance) => {
                      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                      const entity = getEntityById(compliance.entityId);
                      
                      return (
                        <ListItem 
                          key={compliance.id}
                          button
                          onClick={() => handleComplianceClick(compliance.id)}
                          sx={{ 
                            borderLeft: 3, 
                            borderColor: getComplianceStatusColor(compliance.status) + '.main',
                            mb: 1,
                            backgroundColor: 'background.paper',
                            color: 'text.primary',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemIcon>
                            {getComplianceStatusIcon(compliance.status)}
                          </ListItemIcon>
                          <ListItemText
                            primary={complianceType?.name}
                            secondary={entity?.name}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No compliances scheduled
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  // Render list view
  const renderListView = () => {
    return (
      <Box>
        {calendarData.length > 0 ? (
          calendarData.map((dateGroup, index) => (
            <Paper key={index} sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {dateGroup.date.toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ width: '100%' }}>
                {dateGroup.compliances.map((compliance) => {
                  const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                  const entity = getEntityById(compliance.entityId);
                  
                  return (
                    <ListItem 
                      key={compliance.id}
                      button
                      onClick={() => handleComplianceClick(compliance.id)}
                      sx={{ 
                        mb: 1,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon>
                        {getComplianceStatusIcon(compliance.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" component="span">
                              {complianceType?.name}
                            </Typography>
                            <Chip 
                              label={compliance.status} 
                              size="small" 
                              color={getComplianceStatusColor(compliance.status)}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {entity?.name} - Due {new Date(compliance.dueDate).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          ))
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No compliances found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try changing your filters or selecting a different month
            </Typography>
          </Paper>
        )}
      </Box>
    );
  };
  
  // Render compliance details drawer
  const renderComplianceDrawer = () => {
    if (!selectedComplianceId) return null;
    
    const compliance = getComplianceById(selectedComplianceId);
    if (!compliance) return null;
    
    const complianceType = getComplianceTypeById(compliance.complianceTypeId);
    const entity = getEntityById(compliance.entityId);
    const dueDate = new Date(compliance.dueDate);
    
    return (
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': { 
            width: '400px',
            boxSizing: 'border-box',
            p: 2
          },
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Compliance Details</Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
        
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {complianceType?.name || 'Unknown Compliance Type'}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Entity
              </Typography>
              <Typography variant="body1">
                {entity?.name || 'Unknown Entity'}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Due Date
              </Typography>
              <Typography variant="body1">
                {dueDate.toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label={compliance.status} 
                color={getComplianceStatusColor(compliance.status)}
              />
            </Box>
            
            {compliance.workflowState && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Step
                </Typography>
                <Typography variant="body1">
                  {formatWorkflowState(compliance.workflowState)}
                </Typography>
              </Box>
            )}
            
            {compliance.documents && compliance.documents.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Documents
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {compliance.documents.map((doc) => (
                    <Chip 
                      key={doc.id}
                      label={doc.documentType}
                      size="small"
                      color={getDocumentStatusColor(doc.status)}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
          <CardActions>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleViewDetails}
              fullWidth
            >
              View Full Details
            </Button>
          </CardActions>
        </Card>
        
        <Button 
          variant="outlined" 
          onClick={handleDrawerClose}
          fullWidth
        >
          Close
        </Button>
      </Drawer>
    );
  };
  
  // Helper function to get compliance status color
  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Helper function to get compliance status icon
  const getComplianceStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon color="success" />;
      case 'IN_PROGRESS':
        return <AccessTimeIcon color="primary" />;
      case 'PENDING':
        return <WarningIcon color="warning" />;
      default:
        return <ErrorIcon color="error" />;
    }
  };
  
  // Helper function to get document status color
  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Helper function to format workflow state
  const formatWorkflowState = (state) => {
    return state
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Compliance Calendar
      </Typography>
      
      {renderCalendarHeader()}
      
      {calendarView === 'month' && renderMonthView()}
      {calendarView === 'week' && renderWeekView()}
      {calendarView === 'list' && renderListView()}
      
      {renderComplianceDrawer()}
    </Box>
  );
};

// Button group for calendar view options
const ButtonGroup = ({ view, onViewChange }) => {
  return (
    <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Tooltip title="Month View">
        <IconButton
          color={view === 'month' ? 'primary' : 'default'}
          onClick={() => onViewChange('month')}
        >
          <ViewModuleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Week View">
        <IconButton
          color={view === 'week' ? 'primary' : 'default'}
          onClick={() => onViewChange('week')}
        >
          <ViewWeekIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="List View">
        <IconButton
          color={view === 'list' ? 'primary' : 'default'}
          onClick={() => onViewChange('list')}
        >
          <ViewListIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ComplianceCalendar;