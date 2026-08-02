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
  LinearProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Analytics,
  Refresh,
  TrendingUp,
  TrendingDown,
  AccessTime,
  Memory,
  Speed,
  Storage,
  AutoFixHigh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// Mock prediction data
const cpuPrediction = [
  { time: 'Now', actual: 72, predicted: 72 },
  { time: '+1h', actual: null, predicted: 75 },
  { time: '+2h', actual: null, predicted: 79 },
  { time: '+3h', actual: null, predicted: 82 },
  { time: '+4h', actual: null, predicted: 78 },
  { time: '+6h', actual: null, predicted: 85 },
  { time: '+8h', actual: null, predicted: 88 },
  { time: '+12h', actual: null, predicted: 76 },
  { time: '+24h', actual: null, predicted: 65 },
];

const memoryPrediction = [
  { time: 'Now', actual: 68, predicted: 68 },
  { time: '+1h', actual: null, predicted: 70 },
  { time: '+2h', actual: null, predicted: 73 },
  { time: '+3h', actual: null, predicted: 76 },
  { time: '+4h', actual: null, predicted: 74 },
  { time: '+6h', actual: null, predicted: 78 },
  { time: '+8h', actual: null, predicted: 80 },
  { time: '+12h', actual: null, predicted: 72 },
  { time: '+24h', actual: null, predicted: 66 },
];

const scalingEvents = [
  { time: 'Now', pods: 8 },
  { time: '+1h', pods: 8 },
  { time: '+2h', pods: 10 },
  { time: '+3h', pods: 12 },
  { time: '+4h', pods: 12 },
  { time: '+6h', pods: 14 },
  { time: '+8h', pods: 14 },
  { time: '+12h', pods: 10 },
  { time: '+24h', pods: 8 },
];

const anomalies = [
  { id: 1, service: 'Order Service', type: 'Latency Spike', confidence: 89, timeframe: '2-4 hours', severity: 'warning', description: 'Predicted p99 latency increase to 450ms based on current traffic patterns' },
  { id: 2, service: 'Payment Service', type: 'Memory Leak', confidence: 76, timeframe: '6-8 hours', severity: 'warning', description: 'Gradual memory increase detected, potential leak in connection pool' },
  { id: 3, service: 'API Gateway', type: 'Traffic Surge', confidence: 92, timeframe: '1-2 hours', severity: 'info', description: 'Expected traffic increase based on historical weekday patterns' },
  { id: 4, service: 'Database', type: 'Disk Usage', confidence: 65, timeframe: '24-48 hours', severity: 'info', description: 'Current growth rate suggests disk threshold in ~36 hours' },
];

const Prediction = () => {
  const theme = useTheme();
  const [predictionTab, setPredictionTab] = useState(0);
  const [autoScale, setAutoScale] = useState(true);

  const predictionDatasets = [cpuPrediction, memoryPrediction];
  const predictionColors = [theme.palette.primary.main, theme.palette.secondary.main];

  const currentData = predictionDatasets[predictionTab];
  const currentColor = predictionColors[predictionTab];

  const severityColors = {
    critical: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Predictive Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered forecasting and anomaly detection
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                icon={<AutoFixHigh />}
                label="ML Model v2.4"
                variant="outlined"
                color="primary"
                sx={{ fontWeight: 600 }}
              />
              <Tooltip title="Refresh">
                <IconButton sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        {/* Prediction Summary Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Peak CPU (24h)', value: '88%', trend: 'up', icon: <Speed />, color: theme.palette.error.main },
              { label: 'Peak Memory (24h)', value: '80%', trend: 'up', icon: <Memory />, color: theme.palette.warning.main },
              { label: 'Predicted Scaling', value: '14 pods', trend: 'up', icon: <Storage />, color: theme.palette.info.main },
              { label: 'Anomalies Detected', value: anomalies.length.toString(), trend: 'down', icon: <Analytics />, color: theme.palette.secondary.main },
            ].map((stat) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Card sx={{ bgcolor: alpha(stat.color, 0.06), border: `1px solid ${alpha(stat.color, 0.15)}` }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(stat.color, 0.15), color: stat.color, display: 'flex' }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      {stat.trend === 'up' ? <TrendingUp sx={{ color: theme.palette.error.light }} /> : <TrendingDown sx={{ color: theme.palette.success.light }} />}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Prediction Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader
                  title={<Typography variant="h6" fontWeight={600}>Resource Prediction (24h)</Typography>}
                  action={
                    <Tabs value={predictionTab} onChange={(_, v) => setPredictionTab(v)} sx={{ '& .MuiTab-root': { minWidth: 'auto', px: 2 } }}>
                      <Tab label="CPU" />
                      <Tab label="Memory" />
                    </Tabs>
                  }
                />
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={currentData}>
                      <defs>
                        <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={currentColor} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={currentColor} stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} vertical={false} />
                      <XAxis dataKey="time" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                      <ReferenceLine y={85} stroke={theme.palette.error.main} strokeDasharray="5 5" label={{ value: 'Threshold', position: 'right', fill: theme.palette.error.main, fontSize: 12 }} />
                      <Area type="monotone" dataKey="actual" stroke={currentColor} strokeWidth={3} fill="none" dot={{ r: 5, strokeWidth: 2 }} name="Actual" />
                      <Area type="monotone" dataKey="predicted" stroke={currentColor} strokeWidth={2} strokeDasharray="8 4" fill="url(#predGradient)" dot={{ r: 4, strokeWidth: 2, strokeDasharray: '' }} name="Predicted" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title={<Typography variant="h6" fontWeight={600}>Auto-Scaling Forecast</Typography>}
                  action={
                    <FormControlLabel
                      control={<Switch checked={autoScale} onChange={(e) => setAutoScale(e.target.checked)} color="primary" size="small" />}
                      label={<Typography variant="caption">Enabled</Typography>}
                    />
                  }
                />
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={scalingEvents}>
                      <defs>
                        <linearGradient id="scaleGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.palette.info.main} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} vertical={false} />
                      <XAxis dataKey="time" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                      <Area type="stepAfter" dataKey="pods" stroke={theme.palette.info.main} strokeWidth={2} fill="url(#scaleGradient)" name="Pod Count" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Anomaly Predictions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight={600}>Predicted Anomalies</Typography>
                  <Chip label={anomalies.length} size="small" color="warning" sx={{ fontWeight: 700, height: 22 }} />
                </Box>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Grid container spacing={2}>
                {anomalies.map((anomaly) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={anomaly.id}>
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          border: `1px solid ${alpha(severityColors[anomaly.severity], 0.3)}`,
                          bgcolor: alpha(severityColors[anomaly.severity], 0.04),
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: severityColors[anomaly.severity],
                            bgcolor: alpha(severityColors[anomaly.severity], 0.08),
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>{anomaly.service}</Typography>
                          <Chip label={anomaly.type} size="small" sx={{ bgcolor: alpha(severityColors[anomaly.severity], 0.15), color: severityColors[anomaly.severity], fontWeight: 600 }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{anomaly.description}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">ETA: {anomaly.timeframe}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">Confidence:</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={anomaly.confidence}
                              sx={{
                                width: 60, height: 6, borderRadius: 3,
                                bgcolor: alpha(severityColors[anomaly.severity], 0.15),
                                '& .MuiLinearProgress-bar': { bgcolor: severityColors[anomaly.severity], borderRadius: 3 },
                              }}
                            />
                            <Typography variant="caption" fontWeight={600} sx={{ color: severityColors[anomaly.severity] }}>
                              {anomaly.confidence}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default Prediction;
