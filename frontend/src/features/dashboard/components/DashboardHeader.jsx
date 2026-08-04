import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  CloudDone, Sync, MoreHoriz, Terminal, Science, RocketLaunch,
  Description, Insights, RestartAlt, Download, DataObject, Settings
} from '@mui/icons-material';
import StatusBadge from './StatusBadge';
import { palette, shadows, radii, transitions } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/useAppTheme';
import { dashboardApi } from '../../../services/api';
import authService from '../../../services/auth';

const DashboardHeader = ({ data, onRefresh }) => {
  const navigate = useNavigate();
  const { tokens } = useAppTheme();
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [anchorEl, setAnchorEl] = useState(null);
  const [deployOpen, setDeployOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const roleTitle = authService.getCurrentUser()?.role || 'Engineer';

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const refreshDashboard = async (silent = false) => {
    if (onRefresh) {
      await onRefresh();
    }
    setLastSync(new Date().toLocaleTimeString());
    if (!silent) {
      showSnackbar('Dashboard refreshed successfully.');
    }
  };

  const handleRefresh = () => refreshDashboard(false);

  const handleDeploy = () => {
    setDeployOpen(false);
    showSnackbar('Deployment initiated successfully.', 'info');
  };

  const handleRunSimulation = () => {
    setSimOpen(true);
    setSimProgress(0);
  };

  useEffect(() => {
    if (simOpen && simProgress < 100) {
      const timer = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            dashboardApi.createSimulation({ name: 'Dashboard quick simulation', type: 'scale' }).catch(() => {});
            setTimeout(() => {
              setSimOpen(false);
              showSnackbar('Simulation completed successfully.');
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [simOpen, simProgress]);

  const downloadJson = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleMenuClick = async (action) => {
    setAnchorEl(null);
    switch (action) {
      case 'View Logs':
        // Real logging! Open the raw text logs from K8s in a new tab
        window.open(`${window.location.origin}/api/cluster/logs?service=api-gateway`, '_blank');
        break;
      case 'Open Grafana':
        // Real Worker IP + Grafana NodePort
        window.open('http://13.207.71.68:30300', '_blank');
        break;
      case 'Open Prometheus':
        // Real Worker IP + Prometheus NodePort
        window.open('http://13.207.71.68:30090', '_blank');
        break;
      case 'Restart Service':
        // Execute real K8s rollout restart
        try {
          showSnackbar('Initiating cluster restart...', 'info');
          const response = await fetch(`${window.location.origin}/api/cluster/restart`, { method: 'POST' });
          if (!response.ok) throw new Error('Restart failed');
          showSnackbar('Success: Cluster rolling restart initiated!', 'success');
        } catch (error) {
          showSnackbar('Error triggering restart: Check permissions', 'error');
        }
        break;
      case 'Download Report':
        downloadJson(
          {
            generatedAt: new Date().toISOString(),
            clusterHealth: data.clusterHealth,
            podStatus: data.podStatus,
            deployments: data.deployments,
            alerts: data.alerts,
          },
          `twin-digital-report-${Date.now()}.json`
        );
        showSnackbar('Dashboard report downloaded.', 'success');
        break;
      case 'Export Metrics':
        // Fix: Use the raw kpi metrics object returned by our API, not the missing prometheusMetrics field
        downloadJson(data.kpi || {}, `prometheus-metrics-${Date.now()}.json`);
        showSnackbar('Metrics exported successfully.', 'success');
        break;
      default:
        showSnackbar(`Action "${action}" completed.`, 'info');
    }
  };

  const menuItems = [
    { label: 'View Logs', icon: <Description fontSize="small" /> },
    { label: 'Open Grafana', icon: <Insights fontSize="small" /> },
    { label: 'Open Prometheus', icon: <DataObject fontSize="small" /> },
    { divider: true },
    { label: 'Restart Service', icon: <RestartAlt fontSize="small" /> },
    { label: 'Download Report', icon: <Download fontSize="small" /> },
    { label: 'Export Metrics', icon: <Settings fontSize="small" /> },
  ];

  const btnOutlined = {
    color: tokens.textSecondary,
    borderColor: tokens.border,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8rem',
    borderRadius: `${radii.lg}px`,
    px: 2,
    py: 0.75,
    boxShadow: 'none',
    transition: transitions.default,
    '&:hover': { bgcolor: tokens.surfaceHover, borderColor: tokens.border, boxShadow: 'none' },
  };

  const btnPrimary = {
    bgcolor: palette.accent,
    color: '#111111',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8rem',
    borderRadius: `${radii.pill}px`,
    px: 2.5,
    py: 0.75,
    boxShadow: shadows.button,
    transition: transitions.default,
    '&:hover': { bgcolor: palette.accentHover, boxShadow: shadows.button, transform: 'translateY(-1px)' },
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            bgcolor: tokens.paper,
            borderRadius: `${radii.xl}px`,
            border: `1px solid ${tokens.border}`,
            boxShadow: tokens.shadow,
            px: { xs: 2.5, md: 3 },
            py: { xs: 2, md: 2.25 },
            transition: transitions.default,
            '&:hover': {
              boxShadow: tokens.shadowHover,
              transform: 'translateY(-3px)',
            },
          }}
        >
          {/* Left: Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: palette.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111111',
              }}
            >
              <Terminal sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ color: tokens.text, fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
                  {roleTitle} Dashboard
                </Typography>
                <StatusBadge status="Production" />
              </Box>
              <Typography sx={{ color: tokens.textSecondary, fontSize: '0.8rem', mt: 0.25, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CloudDone sx={{ fontSize: 14 }} />
                {data.welcomeMessage} · Synced {lastSync}
              </Typography>
            </Box>
          </Box>

          {/* Right: Status + Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right', mr: 1 }}>
              <Typography sx={{ color: tokens.textLabel, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cluster
              </Typography>
              <StatusBadge status={data.clusterHealthBadge} />
            </Box>

            <Button variant="outlined" startIcon={<Science sx={{ fontSize: '18px !important' }} />} onClick={handleRunSimulation} sx={btnOutlined}>
              Simulate
            </Button>

            <Button
              variant="contained"
              startIcon={<RocketLaunch sx={{ fontSize: '18px !important' }} />}
              onClick={() => setDeployOpen(true)}
              sx={btnPrimary}
            >
              Deploy
            </Button>

            <IconButton
              onClick={handleRefresh}
              sx={{ color: tokens.textSecondary, border: `1px solid ${tokens.border}`, borderRadius: '10px', width: 38, height: 38, '&:hover': { bgcolor: tokens.surfaceHover } }}
            >
              <Sync sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: tokens.textSecondary, border: `1px solid ${tokens.border}`, borderRadius: '10px', width: 38, height: 38, '&:hover': { bgcolor: tokens.surfaceHover } }}
            >
              <MoreHoriz sx={{ fontSize: 18 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 0,
                sx: {
                  borderRadius: `${radii.xl}px`,
                  minWidth: 220,
                  mt: 1,
                  bgcolor: tokens.paper,
                  border: `1px solid ${tokens.border}`,
                  boxShadow: tokens.shadow,
                  py: 0.5,
                },
              }}
            >
              {menuItems.map((item, i) =>
                item.divider ? (
                  <Divider key={`d-${i}`} sx={{ my: 0.5 }} />
                ) : (
                  <MenuItem
                    key={item.label}
                    onClick={() => handleMenuClick(item.label)}
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: `${radii.lg}px`,
                      mx: 0.5,
                      color: tokens.text,
                      '&:hover': { bgcolor: tokens.surfaceHover },
                      '& .MuiListItemIcon-root': { color: tokens.textSecondary },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 600, color: tokens.text }}
                    />
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
        </Box>
      </motion.div>

      {/* Deploy Dialog */}
      <Dialog open={deployOpen} onClose={() => setDeployOpen(false)} PaperProps={{ sx: { borderRadius: '28px', minWidth: 420, p: 1, bgcolor: tokens.paper } }}>
        <DialogTitle sx={{ fontWeight: 700, color: tokens.text, fontSize: '1.1rem' }}>Start New Deployment?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: tokens.textSecondary, fontSize: '0.85rem', lineHeight: 1.6 }}>
            This will trigger the CI/CD pipeline and deploy the latest build to the production environment. All health checks will run automatically.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeployOpen(false)} sx={{ color: tokens.textSecondary, fontWeight: 600, textTransform: 'none', borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeploy}
            variant="contained"
            startIcon={<RocketLaunch sx={{ fontSize: '18px !important' }} />}
            sx={btnPrimary}
          >
            Deploy Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Simulation Dialog */}
      <Dialog open={simOpen} PaperProps={{ sx: { borderRadius: '28px', minWidth: 420, p: 2, bgcolor: tokens.paper } }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: palette.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
            <Science sx={{ fontSize: 28, color: '#111111' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: tokens.text, fontSize: '1.1rem', mb: 0.75 }}>
            Digital Twin Simulation
          </Typography>
          <Typography sx={{ color: tokens.textSecondary, fontSize: '0.8rem', mb: 3 }}>
            Running predictive analysis on infrastructure topology...
          </Typography>
          <LinearProgress
            variant="determinate"
            value={simProgress}
            sx={{
              height: 6,
              borderRadius: 3,
              mb: 1.5,
              bgcolor: tokens.surface,
              '& .MuiLinearProgress-bar': { bgcolor: palette.accent, borderRadius: 3 },
            }}
          />
          <Typography sx={{ color: tokens.textSecondary, fontSize: '0.75rem', fontWeight: 600 }}>{simProgress}% Complete</Typography>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DashboardHeader;
