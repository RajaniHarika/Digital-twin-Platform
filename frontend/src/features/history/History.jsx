import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Chip,
  IconButton,
  alpha,
  useTheme,
  Tooltip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material';
import {
  History as HistoryIcon,
  Refresh,
  Search,
  FilterList,
  CheckCircle,
  Error as ErrorIcon,
  HourglassEmpty,
  RocketLaunch,
  Science,
  Build,
  BugReport,
  Schedule,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatusChip from '../../components/StatusChip';
import { formatDuration, formatDateTime } from '../../utils/formatters';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const historyItems = [
  { id: 'evt-001', type: 'deployment', title: 'Payment Service v2.3.1 Deployed', status: 'success', service: 'payment-service', user: 'john.doe', timestamp: '2026-07-08T10:30:00Z', duration: 180, details: 'Rolling update completed. 0 errors during rollout.' },
  { id: 'evt-002', type: 'simulation', title: 'Load Test - Order Service', status: 'completed', service: 'order-service', user: 'jane.smith', timestamp: '2026-07-08T09:45:00Z', duration: 120, details: 'Peak throughput: 2,400 req/s. P99 latency: 280ms.' },
  { id: 'evt-003', type: 'deployment', title: 'User Service v3.1.0 Deployed', status: 'success', service: 'user-service', user: 'john.doe', timestamp: '2026-07-07T16:30:00Z', duration: 240, details: 'Blue-green deployment. Canary tests passed.' },
  { id: 'evt-004', type: 'incident', title: 'Order Service High Latency', status: 'failed', service: 'order-service', user: 'system', timestamp: '2026-07-07T14:15:00Z', duration: 95, details: 'Auto-scaling triggered. Root cause: database connection pool exhaustion.' },
  { id: 'evt-005', type: 'deployment', title: 'API Gateway v4.2.0 Deployed', status: 'success', service: 'api-gateway', user: 'mike.wilson', timestamp: '2026-07-07T11:00:00Z', duration: 150, details: 'Added rate limiting rules. Zero downtime.' },
  { id: 'evt-006', type: 'simulation', title: 'Failover Test - Database', status: 'completed', service: 'postgresql', user: 'jane.smith', timestamp: '2026-07-07T08:30:00Z', duration: 30, details: 'Failover completed in 12s. RTO within acceptable range.' },
  { id: 'evt-007', type: 'config', title: 'HPA Config Updated', status: 'success', service: 'order-service', user: 'john.doe', timestamp: '2026-07-06T15:00:00Z', duration: 5, details: 'Max replicas increased from 8 to 12. Min replicas: 3.' },
  { id: 'evt-008', type: 'incident', title: 'Notification Service Down', status: 'failed', service: 'notification-service', user: 'system', timestamp: '2026-07-06T12:45:00Z', duration: 300, details: 'Memory OOM kill. Pod restarted automatically.' },
  { id: 'evt-009', type: 'deployment', title: 'Notification Service v2.0.5', status: 'success', service: 'notification-service', user: 'mike.wilson', timestamp: '2026-07-06T09:00:00Z', duration: 120, details: 'Memory leak fix deployed. Heap limit increased.' },
  { id: 'evt-010', type: 'simulation', title: 'Chaos Test - Network Partition', status: 'completed', service: 'multiple', user: 'jane.smith', timestamp: '2026-07-05T14:00:00Z', duration: 60, details: 'Circuit breaker triggered correctly. Service mesh resilience confirmed.' },
  { id: 'evt-011', type: 'config', title: 'Resource Limits Updated', status: 'success', service: 'user-service', user: 'john.doe', timestamp: '2026-07-05T10:00:00Z', duration: 3, details: 'CPU limits: 500m -> 1000m. Memory: 512Mi -> 1Gi.' },
  { id: 'evt-012', type: 'deployment', title: 'Redis Cache v7.2 Upgrade', status: 'success', service: 'redis', user: 'mike.wilson', timestamp: '2026-07-04T16:00:00Z', duration: 45, details: 'In-place upgrade with zero data loss.' },
];

const typeConfig = {
  deployment: { icon: <RocketLaunch />, color: '#1976D2', label: 'Deployment' },
  simulation: { icon: <Science />, color: '#9C27B0', label: 'Simulation' },
  incident: { icon: <BugReport />, color: '#D32F2F', label: 'Incident' },
  config: { icon: <Build />, color: '#ED6C02', label: 'Config Change' },
};

const History = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const stats = {
    deployments: historyItems.filter((i) => i.type === 'deployment').length,
    simulations: historyItems.filter((i) => i.type === 'simulation').length,
    incidents: historyItems.filter((i) => i.type === 'incident').length,
    configs: historyItems.filter((i) => i.type === 'config').length,
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Activity History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete audit trail of deployments, simulations, and incidents
              </Typography>
            </Box>
            <Tooltip title="Refresh">
              <IconButton sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Deployments', value: stats.deployments, ...typeConfig.deployment },
              { label: 'Simulations', value: stats.simulations, ...typeConfig.simulation },
              { label: 'Incidents', value: stats.incidents, ...typeConfig.incident },
              { label: 'Config Changes', value: stats.configs, ...typeConfig.config },
            ].map((stat) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Card sx={{ bgcolor: alpha(stat.color, 0.06), border: `1px solid ${alpha(stat.color, 0.15)}` }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(stat.color, 0.15), color: stat.color, display: 'flex' }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ py: '12px !important' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search events..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Type</InputLabel>
                  <Select value={typeFilter} label="Type" onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="deployment">Deployment</MenuItem>
                    <MenuItem value="simulation">Simulation</MenuItem>
                    <MenuItem value="incident">Incident</MenuItem>
                    <MenuItem value="config">Config</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
                <Chip label={`${filteredItems.length} events`} size="small" variant="outlined" sx={{ ml: 'auto' }} />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {paginatedItems.map((item) => {
            const config = typeConfig[item.type] || typeConfig.deployment;
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.003 }}
              >
                <Card
                  sx={{
                    transition: 'all 0.2s',
                    borderLeft: `4px solid ${config.color}`,
                    '&:hover': {
                      boxShadow: `0 4px 20px ${alpha(config.color, 0.15)}`,
                    },
                  }}
                >
                  <CardContent sx={{ py: '16px !important' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 7 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: alpha(config.color, 0.1),
                              color: config.color,
                              display: 'flex',
                              flexShrink: 0,
                            }}
                          >
                            {config.icon}
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" fontWeight={600}>{item.title}</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.details}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip label={config.label} size="small" sx={{ bgcolor: alpha(config.color, 0.1), color: config.color, fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
                              <Chip label={item.service} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
                              <Chip icon={<Schedule sx={{ fontSize: '14px !important' }} />} label={formatDuration(item.duration)} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.5 }}>
                          <StatusChip status={item.status} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(item.timestamp)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            by {item.user}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default History;
