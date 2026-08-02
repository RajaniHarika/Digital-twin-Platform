import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  LinearProgress,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Refresh,
  Dns,
  Storage,
  Hub,
  Speed,
  Memory,
  Timer,
  GridView,
  ViewList,
  NetworkCheck,
  Api,
  Circle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { topologyApi } from '../../services/api';
import StatusChip from '../../components/StatusChip';
import { PageSkeleton } from '../../components/LoadingSkeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const typeIcons = {
  gateway: <Hub sx={{ fontSize: 28 }} />,
  service: <Dns sx={{ fontSize: 28 }} />,
  database: <Storage sx={{ fontSize: 28 }} />,
};

const typeColors = {
  gateway: '#1976D2',
  service: '#9C27B0',
  database: '#2E7D32',
};

const Topology = () => {
  const theme = useTheme();
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [nodesRes, connsRes] = await Promise.all([
        topologyApi.getNodes(),
        topologyApi.getConnections(),
      ]);
      setNodes(nodesRes.data);
      setConnections(connsRes.data);
    } catch (err) {
      console.error('Topology fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statusCounts = useMemo(() => {
    const counts = { healthy: 0, warning: 0, critical: 0 };
    nodes.forEach((n) => { counts[n.status] = (counts[n.status] || 0) + 1; });
    return counts;
  }, [nodes]);

  if (loading) return <PageSkeleton />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Infrastructure Topology
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor and manage your service architecture
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, v) => v && setViewMode(v)}
                size="small"
              >
                <ToggleButton value="grid"><GridView fontSize="small" /></ToggleButton>
                <ToggleButton value="list"><ViewList fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchData} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        {/* Status Overview */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Total Nodes', value: nodes.length, color: theme.palette.primary.main },
              { label: 'Healthy', value: statusCounts.healthy, color: theme.palette.success.main },
              { label: 'Warning', value: statusCounts.warning, color: theme.palette.warning.main },
              { label: 'Critical', value: statusCounts.critical, color: theme.palette.error.main },
              { label: 'Connections', value: connections.length, color: theme.palette.info.main },
            ].map((stat) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={stat.label}>
                <Card sx={{ textAlign: 'center', py: 2, bgcolor: alpha(stat.color, 0.06), border: `1px solid ${alpha(stat.color, 0.15)}` }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Node Grid / List */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: selectedNode ? 8 : 12 }}>
            <Grid container spacing={2}>
              {nodes.map((node) => {
                const nodeColor = typeColors[node.type] || theme.palette.primary.main;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <Grid size={{ xs: 12, sm: 6, md: selectedNode ? 6 : 4 }} key={node.id}>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
                      <Card
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: isSelected
                            ? `2px solid ${nodeColor}`
                            : `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            boxShadow: `0 4px 20px ${alpha(nodeColor, 0.2)}`,
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2,
                                  bgcolor: alpha(nodeColor, 0.1),
                                  color: nodeColor,
                                  display: 'flex',
                                }}
                              >
                                {typeIcons[node.type]}
                              </Box>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {node.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" textTransform="capitalize">
                                  {node.type}
                                </Typography>
                              </Box>
                            </Box>
                            <StatusChip status={node.status} size="small" />
                          </Box>

                          <Grid container spacing={1.5}>
                            <Grid size={4}>
                              <Typography variant="caption" color="text.secondary">CPU</Typography>
                              <LinearProgress
                                variant="determinate"
                                value={node.cpu}
                                sx={{
                                  mt: 0.5, height: 5, borderRadius: 3,
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  '& .MuiLinearProgress-bar': { bgcolor: node.cpu > 80 ? theme.palette.error.main : theme.palette.info.main, borderRadius: 3 },
                                }}
                              />
                              <Typography variant="caption" fontWeight={600}>{node.cpu}%</Typography>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="caption" color="text.secondary">Memory</Typography>
                              <LinearProgress
                                variant="determinate"
                                value={node.memory}
                                sx={{
                                  mt: 0.5, height: 5, borderRadius: 3,
                                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                  '& .MuiLinearProgress-bar': { bgcolor: node.memory > 80 ? theme.palette.error.main : theme.palette.secondary.main, borderRadius: 3 },
                                }}
                              />
                              <Typography variant="caption" fontWeight={600}>{node.memory}%</Typography>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="caption" color="text.secondary">Latency</Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                                {node.latency}ms
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          {/* Detail Panel */}
          {selectedNode && (
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ position: 'sticky', top: 80 }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          p: 1, borderRadius: 2,
                          bgcolor: alpha(typeColors[selectedNode.type], 0.1),
                          color: typeColors[selectedNode.type],
                          display: 'flex',
                        }}>
                          {typeIcons[selectedNode.type]}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>{selectedNode.label}</Typography>
                          <Typography variant="caption" color="text.secondary" textTransform="capitalize">
                            {selectedNode.type} • {selectedNode.id}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    action={<StatusChip status={selectedNode.status} />}
                  />
                  <Divider />
                  <CardContent>
                    <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      Resource Utilization
                    </Typography>
                    {[
                      { label: 'CPU Usage', value: selectedNode.cpu, icon: <Speed fontSize="small" />, color: theme.palette.info.main },
                      { label: 'Memory Usage', value: selectedNode.memory, icon: <Memory fontSize="small" />, color: theme.palette.secondary.main },
                    ].map((res) => (
                      <Box key={res.label} sx={{ mb: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {res.icon}
                            <Typography variant="body2" fontWeight={500}>{res.label}</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={700} color={res.value > 80 ? 'error.main' : 'text.primary'}>
                            {res.value}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={res.value}
                          sx={{
                            height: 8, borderRadius: 4,
                            bgcolor: alpha(res.color, 0.1),
                            '& .MuiLinearProgress-bar': { bgcolor: res.value > 80 ? theme.palette.error.main : res.color, borderRadius: 4 },
                          }}
                        />
                      </Box>
                    ))}

                    <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block', mt: 3 }}>
                      Network
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Timer fontSize="small" color="action" />
                      <Typography variant="body2">Latency: <strong>{selectedNode.latency}ms</strong></Typography>
                    </Box>

                    <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block', mt: 3 }}>
                      Connections
                    </Typography>
                    {connections
                      .filter((c) => c.source === selectedNode.id || c.target === selectedNode.id)
                      .map((conn) => {
                        const peerId = conn.source === selectedNode.id ? conn.target : conn.source;
                        const peer = nodes.find((n) => n.id === peerId);
                        return (
                          <Chip
                            key={conn.id}
                            icon={<Circle sx={{ fontSize: '8px !important', color: peer?.status === 'healthy' ? 'success.main' : 'warning.main' }} />}
                            label={peer?.label || peerId}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                            onClick={() => setSelectedNode(peer)}
                          />
                        );
                      })}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Topology;
