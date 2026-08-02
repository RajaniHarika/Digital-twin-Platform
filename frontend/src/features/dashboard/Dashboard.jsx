import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Stack, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { dashboardApi } from '../../services/api';
import { mockDashboardData } from './mockData';
import { PageSkeleton } from '../../components/LoadingSkeleton';
import DashboardHeader from './components/DashboardHeader';
import KpiCards from './components/KpiCards';
import ClusterHealth from './components/ClusterHealth';
import PodStatus from './components/PodStatus';
import DeploymentStatus from './components/DeploymentStatus';
import JenkinsStatus from './components/JenkinsStatus';
import DockerImages from './components/DockerImages';
import PrometheusMetrics from './components/PrometheusMetrics';
import GrafanaMonitoring from './components/GrafanaMonitoring';
import AlertsPanel from './components/AlertsPanel';

const rowSx = { mb: 2, alignItems: 'flex-start' };

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [partialMock, setPartialMock] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getFullDashboard();
      setData(res.data || mockDashboardData);
      setUsingMock(res.source === 'mock');
      setPartialMock(!!res.partialMock);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setData(mockDashboardData);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={{ bgcolor: 'background.default', p: { xs: 2, md: 3 } }}>
        <PageSkeleton />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ bgcolor: 'background.default', p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>
          Unable to load dashboard data.
        </Alert>
        <Button variant="contained" startIcon={<Refresh />} onClick={fetchData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 1.5, md: 2 }, px: { xs: 1.5, md: 2, lg: 3 } }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        {usingMock && (
          <Alert severity="info" sx={{ mb: 1.5, borderRadius: '16px', py: 0.5 }} action={<Button color="inherit" size="small" onClick={fetchData}>Retry</Button>}>
            Showing cached dashboard data. Live API metrics will appear when the backend is reachable.
          </Alert>
        )}
        {!usingMock && partialMock && (
          <Alert severity="warning" sx={{ mb: 1.5, borderRadius: '16px', py: 0.5 }}>
            Live cluster metrics loaded. CI/CD pipelines, container registry, and some pod details still use demo data until backend endpoints are available.
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <DashboardHeader data={data.header} onRefresh={fetchData} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <KpiCards data={data} />
        </Box>

        {/* Cluster health + sidebar stack (alerts + pod status) */}
        <Grid container spacing={2} sx={rowSx}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <ClusterHealth data={data.clusterHealth} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2}>
              <AlertsPanel data={data.alerts} />
              <PodStatus data={data.podStatus} />
            </Stack>
          </Grid>
        </Grid>

        {/* Resource metrics — full width */}
        <Grid container spacing={2} sx={rowSx}>
          <Grid size={{ xs: 12 }}>
            <PrometheusMetrics data={data.prometheusMetrics} />
          </Grid>
        </Grid>

        {/* Deployments + CI/CD */}
        <Grid container spacing={2} sx={rowSx}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <DeploymentStatus data={data.deployments} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <JenkinsStatus data={data.jenkinsPipelines} />
          </Grid>
        </Grid>

        {/* System overview + registry */}
        <Grid container spacing={2} sx={rowSx}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <GrafanaMonitoring data={data.grafanaMonitoring} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <DockerImages data={data.dockerImages} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
