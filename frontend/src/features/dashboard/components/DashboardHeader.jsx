import React, { useState, useEffect } from 'react';
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

const DashboardHeader = ({ data, onRefresh }) => {
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [anchorEl, setAnchorEl] = useState(null);
  const [deployOpen, setDeployOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
    setLastSync(new Date().toLocaleTimeString());
    showSnackbar('Dashboard refreshed successfully.');
  };

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

  const handleMenuClick = (action) => {
    setAnchorEl(null);
    showSnackbar(`Action "${action}" executed successfully.`, 'info');
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
    color: '#374151',
    borderColor: '#D1D5DB',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8rem',
    borderRadius: '10px',
    px: 2,
    py: 0.75,
    '&:hover': { bgcolor: '#F9FAFB', borderColor: '#9CA3AF' },
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
            bgcolor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            px: 3,
            py: 2.5,
          }}
        >
          {/* Left: Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
              }}
            >
              <Terminal sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
                  DevOps Engineer Dashboard
                </Typography>
                <StatusBadge status="Production" />
              </Box>
              <Typography sx={{ color: '#64748B', fontSize: '0.8rem', mt: 0.25, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CloudDone sx={{ fontSize: 14 }} />
                {data.welcomeMessage} · Synced {lastSync}
              </Typography>
            </Box>
          </Box>

          {/* Right: Status + Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right', mr: 1 }}>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
              sx={{
                bgcolor: '#2563EB',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                borderRadius: '10px',
                px: 2.5,
                py: 0.75,
                boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
                '&:hover': { bgcolor: '#1D4ED8' },
              }}
            >
              Deploy
            </Button>

            <IconButton
              onClick={handleRefresh}
              sx={{ color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '10px', width: 38, height: 38, '&:hover': { bgcolor: '#F8FAFC' } }}
            >
              <Sync sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '10px', width: 38, height: 38, '&:hover': { bgcolor: '#F8FAFC' } }}
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
                  borderRadius: '12px',
                  minWidth: 220,
                  mt: 1,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04)',
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
                    sx={{ py: 1, px: 2, borderRadius: '8px', mx: 0.5, '&:hover': { bgcolor: '#F8FAFC' } }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: '#64748B' }}>{item.icon}</ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 500, color: '#334155' }}>
                      {item.label}
                    </ListItemText>
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
        </Box>
      </motion.div>

      {/* Deploy Dialog */}
      <Dialog open={deployOpen} onClose={() => setDeployOpen(false)} PaperProps={{ sx: { borderRadius: '16px', minWidth: 420, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.1rem' }}>Start New Deployment?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6 }}>
            This will trigger the CI/CD pipeline and deploy the latest build to the production environment. All health checks will run automatically.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeployOpen(false)} sx={{ color: '#64748B', fontWeight: 600, textTransform: 'none', borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeploy}
            variant="contained"
            startIcon={<RocketLaunch sx={{ fontSize: '18px !important' }} />}
            sx={{ bgcolor: '#2563EB', fontWeight: 600, textTransform: 'none', borderRadius: '10px', px: 2.5 }}
          >
            Deploy Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Simulation Dialog */}
      <Dialog open={simOpen} PaperProps={{ sx: { borderRadius: '16px', minWidth: 420, p: 2 } }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
            <Science sx={{ fontSize: 28, color: '#2563EB' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.1rem', mb: 0.75 }}>
            Digital Twin Simulation
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.8rem', mb: 3 }}>
            Running predictive analysis on infrastructure topology...
          </Typography>
          <LinearProgress
            variant="determinate"
            value={simProgress}
            sx={{
              height: 6,
              borderRadius: 3,
              mb: 1.5,
              bgcolor: '#E0E7FF',
              '& .MuiLinearProgress-bar': { bgcolor: '#2563EB', borderRadius: 3 },
            }}
          />
          <Typography sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 600 }}>{simProgress}% Complete</Typography>
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
          sx={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DashboardHeader;
