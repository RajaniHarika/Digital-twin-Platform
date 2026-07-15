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
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Warning,
  Refresh,
  Security,
  Shield,
  BugReport,
  GppBad,
  GppGood,
  GppMaybe,
  ArrowDropUp,
  ArrowDropDown,
  FiberManualRecord,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const overallRiskScore = 78;

const riskCategories = [
  { name: 'Security', score: 82, items: 3, color: '#D32F2F' },
  { name: 'Performance', score: 71, items: 5, color: '#ED6C02' },
  { name: 'Reliability', score: 65, items: 2, color: '#1976D2' },
  { name: 'Compliance', score: 88, items: 1, color: '#9C27B0' },
];

const riskTrend = [
  { date: 'Mon', score: 72 },
  { date: 'Tue', score: 75 },
  { date: 'Wed', score: 68 },
  { date: 'Thu', score: 82 },
  { date: 'Fri', score: 78 },
  { date: 'Sat', score: 74 },
  { date: 'Sun', score: 78 },
];

const pieData = [
  { name: 'High', value: 3, color: '#D32F2F' },
  { name: 'Medium', value: 5, color: '#ED6C02' },
  { name: 'Low', value: 8, color: '#2E7D32' },
];

const riskItems = [
  { id: 1, title: 'Unpatched CVE in nginx:1.21', severity: 'high', category: 'Security', service: 'API Gateway', impact: 'Critical vulnerability allowing RCE', mitigation: 'Upgrade to nginx:1.25' },
  { id: 2, title: 'Single Point of Failure - DB', severity: 'high', category: 'Reliability', service: 'PostgreSQL', impact: 'No failover configured', mitigation: 'Enable HA with read replicas' },
  { id: 3, title: 'CPU Throttling on Order Service', severity: 'medium', category: 'Performance', service: 'Order Service', impact: 'Latency increase during peak', mitigation: 'Increase CPU limits to 2 cores' },
  { id: 4, title: 'Expired TLS Certificate (14d)', severity: 'medium', category: 'Security', service: 'API Gateway', impact: 'Service interruption risk', mitigation: 'Renew via cert-manager' },
  { id: 5, title: 'Memory Fragmentation', severity: 'medium', category: 'Performance', service: 'User Service', impact: 'Gradual performance degradation', mitigation: 'Enable jemalloc allocator' },
  { id: 6, title: 'Missing Rate Limiting', severity: 'medium', category: 'Security', service: 'Payment Service', impact: 'Vulnerable to DDoS', mitigation: 'Configure Istio rate limit' },
  { id: 7, title: 'Outdated Helm Charts', severity: 'low', category: 'Compliance', service: 'Multiple', impact: 'Missing security patches', mitigation: 'Update Helm charts to latest' },
  { id: 8, title: 'Log Retention Policy', severity: 'low', category: 'Compliance', service: 'All Services', impact: 'Non-compliant with SOC2', mitigation: 'Extend retention to 90 days' },
];

const Risk = () => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const severityConfig = {
    high: { color: theme.palette.error.main, icon: <GppBad />, label: 'High' },
    medium: { color: theme.palette.warning.main, icon: <GppMaybe />, label: 'Medium' },
    low: { color: theme.palette.success.main, icon: <GppGood />, label: 'Low' },
  };

  const filteredItems = selectedCategory
    ? riskItems.filter((i) => i.category === selectedCategory)
    : riskItems;

  const riskScoreColor = overallRiskScore > 70
    ? theme.palette.error.main
    : overallRiskScore > 40
      ? theme.palette.warning.main
      : theme.palette.success.main;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Risk Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Identify, assess, and mitigate infrastructure risks
              </Typography>
            </Box>
            <Tooltip title="Refresh">
              <IconButton sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>

        {/* Top Row: Risk Score + Categories + Pie */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Overall Risk Score */}
          <Grid size={{ xs: 12, md: 3 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%', textAlign: 'center', py: 3 }}>
                <CardContent>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                    <Box
                      sx={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: `conic-gradient(${riskScoreColor} ${overallRiskScore * 3.6}deg, ${alpha(riskScoreColor, 0.1)} ${overallRiskScore * 3.6}deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 110,
                          height: 110,
                          borderRadius: '50%',
                          bgcolor: theme.palette.background.paper,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h3" fontWeight={800} sx={{ color: riskScoreColor }}>
                          {overallRiskScore}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">/ 100</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>Overall Risk Score</Typography>
                  <Chip
                    label="High Risk"
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: alpha(riskScoreColor, 0.1),
                      color: riskScoreColor,
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Risk Categories */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title={<Typography variant="h6" fontWeight={600}>Risk Categories</Typography>} />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {riskCategories.map((cat) => (
                      <Box
                        key={cat.name}
                        onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                        sx={{
                          cursor: 'pointer',
                          p: 1.5,
                          borderRadius: 2,
                          border: `1px solid ${selectedCategory === cat.name ? cat.color : 'transparent'}`,
                          bgcolor: selectedCategory === cat.name ? alpha(cat.color, 0.05) : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: alpha(cat.color, 0.05) },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FiberManualRecord sx={{ fontSize: 10, color: cat.color }} />
                            <Typography variant="subtitle2" fontWeight={600}>{cat.name}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ color: cat.color }}>{cat.score}</Typography>
                            <Chip label={`${cat.items} items`} size="small" variant="outlined" sx={{ height: 22 }} />
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={cat.score}
                          sx={{
                            height: 6, borderRadius: 3,
                            bgcolor: alpha(cat.color, 0.1),
                            '& .MuiLinearProgress-bar': { bgcolor: cat.color, borderRadius: 3 },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Risk Distribution Pie */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title={<Typography variant="h6" fontWeight={600}>Severity Distribution</Typography>} />
                <CardContent sx={{ pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    {pieData.map((d) => (
                      <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FiberManualRecord sx={{ fontSize: 10, color: d.color }} />
                        <Typography variant="caption">{d.name}: {d.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Risk Trend */}
        <motion.div variants={itemVariants}>
          <Card sx={{ mb: 4 }}>
            <CardHeader title={<Typography variant="h6" fontWeight={600}>Risk Score Trend (7 days)</Typography>} />
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={riskTrend}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={riskScoreColor} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={riskScoreColor} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="score" stroke={riskScoreColor} strokeWidth={2.5} fill="url(#riskGradient)" dot={{ r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Items List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedCategory ? `${selectedCategory} Risks` : 'All Risk Items'}
                  </Typography>
                  <Chip label={filteredItems.length} size="small" sx={{ fontWeight: 700, height: 22 }} />
                  {selectedCategory && (
                    <Chip
                      label="Clear Filter"
                      size="small"
                      variant="outlined"
                      onDelete={() => setSelectedCategory(null)}
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {filteredItems.map((item) => {
                  const sev = severityConfig[item.severity];
                  return (
                    <motion.div key={item.id} whileHover={{ scale: 1.003 }}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          border: `1px solid ${alpha(sev.color, 0.2)}`,
                          bgcolor: alpha(sev.color, 0.03),
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: sev.color,
                            bgcolor: alpha(sev.color, 0.06),
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: alpha(sev.color, 0.15), color: sev.color, width: 36, height: 36 }}>
                              {sev.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>{item.title}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.service} • {item.category}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={sev.label}
                            size="small"
                            sx={{ bgcolor: alpha(sev.color, 0.12), color: sev.color, fontWeight: 600 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 6.5 }}>
                          <strong>Impact:</strong> {item.impact}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 6.5 }}>
                          <strong>Mitigation:</strong> {item.mitigation}
                        </Typography>
                      </Box>
                    </motion.div>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default Risk;
