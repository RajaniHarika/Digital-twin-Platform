import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  IconButton,
  Chip,
  alpha,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Science,
  Refresh,
  Add,
  Timer,
  CheckCircle,
  Error as ErrorIcon,
  HourglassEmpty,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import StatusChip from '../../components/StatusChip';
import { PageSkeleton } from '../../components/LoadingSkeleton';
import { dashboardApi } from '../../services/api';
import { getRelativeTime, formatDuration } from '../../utils/formatters';
import NewSimulationDialog from './components/NewSimulationDialog';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const radarData = [
  { subject: 'Reliability', A: 86, fullMark: 100 },
  { subject: 'Performance', A: 72, fullMark: 100 },
  { subject: 'Security', A: 91, fullMark: 100 },
  { subject: 'Scalability', A: 68, fullMark: 100 },
  { subject: 'Cost Eff.', A: 77, fullMark: 100 },
  { subject: 'Recovery', A: 83, fullMark: 100 },
];

const Simulation = () => {
  const theme = useTheme();
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [newSim, setNewSim] = useState({
    name: '',
    strategy: 'rolling',
    targetService: '',
    loadFactor: 1,
  });

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setActiveStep(0);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getRecentSimulations();
      setSimulations(res.data);
    } catch (err) {
      console.error('Simulation fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statusIcon = {
    completed: <CheckCircle sx={{ color: 'success.main' }} />,
    running: <HourglassEmpty sx={{ color: 'info.main' }} />,
    failed: <ErrorIcon sx={{ color: 'error.main' }} />,
    pending: <Timer sx={{ color: 'text.secondary' }} />,
  };

  const stats = {
    total: simulations.length,
    completed: simulations.filter((s) => s.status === 'completed').length,
    running: simulations.filter((s) => s.status === 'running').length,
    failed: simulations.filter((s) => s.status === 'failed').length,
  };

  const barChartData = simulations
    .filter((s) => s.riskScore !== null)
    .map((s) => ({
      name: s.name.length > 15 ? s.name.slice(0, 15) + '...' : s.name,
      risk: s.riskScore,
      fill: s.riskScore > 70 ? theme.palette.error.main : s.riskScore > 40 ? theme.palette.warning.main : theme.palette.success.main,
    }));

  if (loading) return <PageSkeleton />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Simulation Engine
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Run what-if scenarios and deployment simulations
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': { background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})` },
                }}
              >
                New Simulation
              </Button>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchData} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Total Simulations', value: stats.total, color: theme.palette.primary.main, icon: <Science /> },
              { label: 'Completed', value: stats.completed, color: theme.palette.success.main, icon: <CheckCircle /> },
              { label: 'Running', value: stats.running, color: theme.palette.info.main, icon: <HourglassEmpty /> },
              { label: 'Failed', value: stats.failed, color: theme.palette.error.main, icon: <ErrorIcon /> },
            ].map((stat) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Card sx={{ bgcolor: alpha(stat.color, 0.06), border: `1px solid ${alpha(stat.color, 0.15)}` }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(stat.color, 0.15), color: stat.color, display: 'flex' }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader title={<Typography variant="h6" fontWeight={600}>Risk Score by Simulation</Typography>} />
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="risk" radius={[6, 6, 0, 0]} barSize={40}>
                        {barChartData.map((entry, index) => (
                          <motion.rect key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title={<Typography variant="h6" fontWeight={600}>System Health Radar</Typography>} />
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={alpha(theme.palette.text.secondary, 0.15)} />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: theme.palette.text.secondary }} />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke={theme.palette.primary.main}
                        fill={alpha(theme.palette.primary.main, 0.2)}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Simulation List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader title={<Typography variant="h6" fontWeight={600}>Simulation History</Typography>} />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {simulations.map((sim) => (
                  <motion.div
                    key={sim.id}
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.action.hover, 0.03),
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.action.hover, 0.08),
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {statusIcon[sim.status]}
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>{sim.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {sim.id} • {getRelativeTime(sim.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {sim.duration && (
                          <Chip
                            icon={<Timer sx={{ fontSize: '16px !important' }} />}
                            label={formatDuration(sim.duration)}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {sim.riskScore !== null && (
                          <Chip
                            label={`Risk: ${sim.riskScore}%`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor: alpha(
                                sim.riskScore > 70 ? theme.palette.error.main
                                  : sim.riskScore > 40 ? theme.palette.warning.main
                                    : theme.palette.success.main,
                                0.1,
                              ),
                              color: sim.riskScore > 70 ? theme.palette.error.main
                                : sim.riskScore > 40 ? theme.palette.warning.main
                                  : theme.palette.success.main,
                            }}
                          />
                        )}
                        <StatusChip status={sim.status} />
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Simulation Dialog */}
        <NewSimulationDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          newSim={newSim}
          setNewSim={setNewSim}
        />
      </Box>
    </motion.div>
  );
};

export default Simulation;
