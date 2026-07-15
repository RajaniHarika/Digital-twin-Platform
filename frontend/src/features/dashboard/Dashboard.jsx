import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Dns,
  Memory,
  Speed,
  NetworkCheck,
  Science,
  Warning,
  Payments,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import MetricCard from '../../components/MetricCard';
import StatusChip from '../../components/StatusChip';
import AlertItem from '../../components/AlertItem';
import { PageSkeleton } from '../../components/LoadingSkeleton';
import { dashboardApi } from '../../services/api';
import { formatCurrency, formatPercent, getRelativeTime, formatDuration } from '../../utils/formatters';
import ResourceTrendsChart from './components/ResourceTrendsChart';
import ServiceHealthWidget from './components/ServiceHealthWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const Dashboard = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartTab, setChartTab] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsRes, simsRes, deploysRes, healthRes, alertsRes] = await Promise.all([
        dashboardApi.getMetrics(),
        dashboardApi.getRecentSimulations(),
        dashboardApi.getRecentDeployments(),
        dashboardApi.getHealthStatus(),
        dashboardApi.getAlerts(),
      ]);
      setMetrics(metricsRes.data);
      setSimulations(simsRes.data);
      setDeployments(deploysRes.data);
      setHealthStatus(healthRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !metrics) {
    return <PageSkeleton />;
  }

  const chartDataMap = ['cpu', 'memory', 'network'];
  const currentChartData = metrics.trends[chartDataMap[chartTab]];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time overview of your DevOps infrastructure
              </Typography>
            </Box>
            <Tooltip title="Refresh data">
              <IconButton onClick={fetchData} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>

        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Active Services', value: metrics.activeServices, icon: <Dns />, color: 'primary', trend: 'up', trendValue: '+3', subtitle: 'All namespaces' },
            { title: 'Running Pods', value: metrics.runningPods, icon: <Memory />, color: 'info', trend: 'up', trendValue: '+12', subtitle: 'Across 4 clusters' },
            { title: 'CPU Usage', value: formatPercent(metrics.cpuUsage), icon: <Speed />, color: metrics.cpuUsage > 80 ? 'error' : metrics.cpuUsage > 60 ? 'warning' : 'success', trend: 'up', trendValue: '+5.2%' },
            { title: 'Memory Usage', value: formatPercent(metrics.memoryUsage), icon: <Memory />, color: metrics.memoryUsage > 80 ? 'error' : metrics.memoryUsage > 60 ? 'warning' : 'success', trend: 'down', trendValue: '-2.1%' },
            { title: 'Network Traffic', value: `${metrics.networkTraffic}`, unit: 'Mbps', icon: <NetworkCheck />, color: 'primary', trend: 'up', trendValue: '+8.4%' },
            { title: 'Active Simulations', value: metrics.activeSimulations, icon: <Science />, color: 'info', trend: 'up', trendValue: '+2' },
            { title: 'Risk Score', value: metrics.riskScore, icon: <Warning />, color: metrics.riskScore > 70 ? 'error' : metrics.riskScore > 40 ? 'warning' : 'success', trend: 'down', trendValue: '-4pts' },
            { title: 'Monthly Cost', value: formatCurrency(metrics.monthlyCost), icon: <Payments />, color: 'warning', trend: 'up', trendValue: '+3.2%' },
          ].map((metric) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={metric.title}>
              <motion.div variants={itemVariants}>
                <MetricCard {...metric} />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts + Health Status */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Trend Charts */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <ResourceTrendsChart
                chartTab={chartTab}
                setChartTab={setChartTab}
                currentChartData={currentChartData}
              />
            </motion.div>
          </Grid>

          {/* Service Health */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <ServiceHealthWidget healthStatus={healthStatus} />
            </motion.div>
          </Grid>
        </Grid>

        {/* Alerts + Deployments + Simulations */}
        <Grid container spacing={3}>
          {/* Active Alerts */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Active Alerts
                      </Typography>
                      <Chip
                        label={alerts.filter((a) => !a.acknowledged).length}
                        size="small"
                        color="error"
                        sx={{ fontWeight: 700, minWidth: 28, height: 22 }}
                      />
                    </Box>
                  }
                />
                <CardContent sx={{ pt: 0, maxHeight: 400, overflowY: 'auto' }}>
                  <AnimatePresence>
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <AlertItem alert={alert} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Deployments */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title={
                    <Typography variant="h6" fontWeight={600}>
                      Recent Deployments
                    </Typography>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {deployments.slice(0, 5).map((deploy) => (
                      <Box
                        key={deploy.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.action.hover, 0.04),
                          border: `1px solid ${theme.palette.divider}`,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.action.hover, 0.08),
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {deploy.service}
                          </Typography>
                          <StatusChip status={deploy.status} size="small" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            v{deploy.version} • {formatDuration(deploy.duration)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getRelativeTime(deploy.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Simulations */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title={
                    <Typography variant="h6" fontWeight={600}>
                      Recent Simulations
                    </Typography>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {simulations.slice(0, 5).map((sim) => (
                      <Box
                        key={sim.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.action.hover, 0.04),
                          border: `1px solid ${theme.palette.divider}`,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.action.hover, 0.08),
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ maxWidth: 180 }}>
                            {sim.name}
                          </Typography>
                          <StatusChip status={sim.status} size="small" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {sim.riskScore !== null ? `Risk: ${sim.riskScore}%` : 'In progress...'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getRelativeTime(sim.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Dashboard;