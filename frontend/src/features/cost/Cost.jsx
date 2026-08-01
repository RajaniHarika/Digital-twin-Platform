import { useState, useEffect, useCallback } from 'react';
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
  Alert,
  Button,
} from '@mui/material';
import {
  Payments,
  Refresh,
  TrendingDown,
  Savings,
  Speed,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { dashboardApi } from '../../services/api';
import ServiceCostTable from './components/ServiceCostTable';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const buildMonthlyTrend = (total, budget) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  return months.map((month, i) => ({
    month,
    cost: Math.round((total || 0) * (0.82 + i * 0.03)),
    budget: Math.round((budget || total || 0) * (0.94 + i * 0.008)),
  }));
};

const monthlyCosts = [
  { month: 'Jan', cost: 38200, budget: 42000 },
  { month: 'Feb', cost: 39800, budget: 42000 },
  { month: 'Mar', cost: 41500, budget: 42000 },
  { month: 'Apr', cost: 40200, budget: 43000 },
  { month: 'May', cost: 43100, budget: 43000 },
  { month: 'Jun', cost: 44800, budget: 45000 },
  { month: 'Jul', cost: 45678, budget: 45000 },
];

const MOCK_COST_BY_CATEGORY = [
  { name: 'Compute', value: 22340, color: '#94C600' },
  { name: 'Storage', value: 8450, color: 'storage' },
  { name: 'Network', value: 6780, color: '#22C55E' },
  { name: 'Database', value: 5200, color: '#F59E0B' },
  { name: 'Other', value: 2908, color: '#565656' },
];

const dailyCosts = [
  { day: 'Mon', compute: 780, storage: 280, network: 220, database: 170 },
  { day: 'Tue', compute: 820, storage: 290, network: 240, database: 175 },
  { day: 'Wed', compute: 760, storage: 275, network: 210, database: 168 },
  { day: 'Thu', compute: 890, storage: 310, network: 260, database: 185 },
  { day: 'Fri', compute: 850, storage: 295, network: 250, database: 180 },
  { day: 'Sat', compute: 620, storage: 240, network: 180, database: 155 },
  { day: 'Sun', compute: 580, storage: 230, network: 170, database: 150 },
];

const MOCK_SERVICE_COSTS = [
  { service: 'API Gateway', monthly: 8450, daily: 281, trend: +5.2, category: 'Compute' },
  { service: 'User Service', monthly: 6200, daily: 207, trend: -2.1, category: 'Compute' },
  { service: 'Order Service', monthly: 7800, daily: 260, trend: +8.4, category: 'Compute' },
  { service: 'Payment Service', monthly: 5400, daily: 180, trend: -1.3, category: 'Compute' },
  { service: 'PostgreSQL', monthly: 5200, daily: 173, trend: +3.7, category: 'Database' },
  { service: 'Redis Cache', monthly: 3200, daily: 107, trend: +1.2, category: 'Storage' },
  { service: 'S3 Storage', monthly: 5250, daily: 175, trend: +6.1, category: 'Storage' },
  { service: 'CloudFront CDN', monthly: 4178, daily: 139, trend: -0.8, category: 'Network' },
];

const CATEGORY_COLORS = {
  compute: '#94C600',
  storage: 'storage',
  network: '#22C55E',
  database: '#F59E0B',
  registry: '#565656',
  monitoring: '#F59E0B',
  other: '#565656',
};

const mapBreakdownToCategories = (breakdown) => {
  const groups = {};
  breakdown.forEach((item) => {
    const key = item.category || 'other';
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    groups[label] = (groups[label] || 0) + item.monthly;
  });
  return Object.entries(groups).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name.toLowerCase()] || '#565656',
  }));
};

const mapBreakdownToServices = (breakdown) =>
  breakdown.map((item) => ({
    service: item.service,
    monthly: item.monthly,
    daily: Math.round(item.monthly / 30),
    trend: item.trend ?? 0,
    category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Other',
  }));

const optimizations = [
  { title: 'Right-size Order Service', savings: 1200, effort: 'Low', description: 'Reduce from 4 vCPU to 2 vCPU based on utilization data' },
  { title: 'Reserved Instances', savings: 3800, effort: 'Medium', description: 'Switch to 1-year reserved for steady-state workloads' },
  { title: 'S3 Lifecycle Policies', savings: 850, effort: 'Low', description: 'Move infrequent data to Glacier after 30 days' },
  { title: 'Spot Instances for CI/CD', savings: 2100, effort: 'High', description: 'Use spot instances for non-critical build workloads' },
];

const Cost = () => {
  const theme = useTheme();
  const [totalMonthlyCost, setTotalMonthlyCost] = useState(45678);
  const [forecast, setForecast] = useState(45000);
  const [costByCategory, setCostByCategory] = useState(MOCK_COST_BY_CATEGORY);
  const [serviceCosts, setServiceCosts] = useState(MOCK_SERVICE_COSTS);
  const [monthlyTrend, setMonthlyTrend] = useState(monthlyCosts);
  const [error, setError] = useState(null);

  const resolveColor = (color) => (color === 'storage' ? theme.palette.text.primary : color);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const res = await dashboardApi.getCost();
      const { total, breakdown = [], forecast: apiForecast } = res.data;
      setTotalMonthlyCost(total ?? 45678);
      setForecast(apiForecast ?? total ?? 45000);
      setMonthlyTrend(buildMonthlyTrend(total, apiForecast ?? total));
      if (breakdown.length) {
        setCostByCategory(mapBreakdownToCategories(breakdown));
        setServiceCosts(mapBreakdownToServices(breakdown));
      } else {
        setCostByCategory(MOCK_COST_BY_CATEGORY);
        setServiceCosts(MOCK_SERVICE_COSTS);
      }
    } catch (err) {
      console.error('Cost fetch error:', err);
      setError('Unable to load cost data.');
      setTotalMonthlyCost(45678);
      setForecast(45000);
      setCostByCategory(MOCK_COST_BY_CATEGORY);
      setServiceCosts(MOCK_SERVICE_COSTS);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const overBudget = totalMonthlyCost - forecast;
  const potentialSavings = optimizations.reduce((acc, o) => acc + o.savings, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" size="small" onClick={fetchData}>Retry</Button>}>
            {error}
          </Alert>
        )}
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Cost Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track spending, optimize resources, and manage budgets
              </Typography>
            </Box>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchData} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Monthly Cost', value: formatCurrency(totalMonthlyCost), icon: <Payments />, color: theme.palette.primary.main, sub: 'Current billing period' },
              { label: 'Forecast', value: formatCurrency(forecast), icon: <Savings />, color: theme.palette.success.main, sub: overBudget > 0 ? `Over by ${formatCurrency(overBudget)}` : 'Under forecast' },
              { label: 'Daily Average', value: formatCurrency(totalMonthlyCost / 30), icon: <Speed />, color: theme.palette.info.main, sub: 'Last 30 days' },
              { label: 'Potential Savings', value: formatCurrency(potentialSavings), icon: <TrendingDown />, color: theme.palette.warning.main, sub: `${optimizations.length} opportunities` },
            ].map((stat) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Card sx={{ bgcolor: alpha(stat.color, 0.06), border: `1px solid ${alpha(stat.color, 0.15)}` }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(stat.color, 0.15), color: stat.color, display: 'flex' }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{stat.sub}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Monthly Trend + Category Breakdown */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader title={<Typography variant="h6" fontWeight={600}>Monthly Cost vs Budget</Typography>} />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} formatter={(value) => formatCurrency(value)} />
                      <Area type="monotone" dataKey="cost" stroke={theme.palette.primary.main} strokeWidth={2.5} fill="url(#costGradient)" name="Actual Cost" dot={{ r: 4, strokeWidth: 0 }} />
                      <Area type="monotone" dataKey="budget" stroke={theme.palette.warning.main} strokeWidth={2} strokeDasharray="6 3" fill="none" name="Budget" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title={<Typography variant="h6" fontWeight={600}>Cost by Category</Typography>} />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={costByCategory} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {costByCategory.map((entry) => (
                          <Cell key={entry.name} fill={resolveColor(entry.color)} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 1 }}>
                    {costByCategory.map((c) => {
                      const cColor = resolveColor(c.color);
                      return (
                      <Chip
                        key={c.name}
                        label={`${c.name}: ${formatCurrency(c.value)}`}
                        size="small"
                        sx={{ bgcolor: alpha(cColor, 0.1), color: cColor, fontWeight: 500, fontSize: '0.7rem' }}
                      />
                    );})}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Daily Breakdown */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 4 }}>
            <CardHeader title={<Typography variant="h6" fontWeight={600}>Daily Cost Breakdown (This Week)</Typography>} />
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dailyCosts}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="compute" stackId="a" fill="#94C600" radius={[0, 0, 0, 0]} name="Compute" />
                  <Bar dataKey="storage" stackId="a" fill={theme.palette.text.primary} radius={[0, 0, 0, 0]} name="Storage" />
                  <Bar dataKey="network" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} name="Network" />
                  <Bar dataKey="database" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Database" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Costs Table + Optimization Opportunities */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader title={<Typography variant="h6" fontWeight={600}>Cost per Service</Typography>} />
                <CardContent sx={{ pt: 0 }}>
                  <ServiceCostTable serviceCosts={serviceCosts} />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" fontWeight={600}>Optimization Opportunities</Typography>
                      <Chip label={`Save ${formatCurrency(potentialSavings)}/mo`} size="small" color="success" sx={{ fontWeight: 600 }} />
                    </Box>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {optimizations.map((opt) => {
                      const effortColor = opt.effort === 'Low' ? theme.palette.success.main : opt.effort === 'Medium' ? theme.palette.warning.main : theme.palette.error.main;
                      return (
                        <motion.div key={opt.title} whileHover={{ scale: 1.01 }}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              transition: 'all 0.2s',
                              '&:hover': { borderColor: theme.palette.success.main, bgcolor: alpha(theme.palette.success.main, 0.03) },
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="subtitle2" fontWeight={600}>{opt.title}</Typography>
                              <Typography variant="subtitle2" fontWeight={700} color="success.main">
                                -{formatCurrency(opt.savings)}/mo
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {opt.description}
                            </Typography>
                            <Chip
                              label={`${opt.effort} Effort`}
                              size="small"
                              sx={{ bgcolor: alpha(effortColor, 0.1), color: effortColor, fontWeight: 600 }}
                            />
                          </Box>
                        </motion.div>
                      );
                    })}
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

export default Cost;
