import { useState, useEffect, useCallback } from 'react';
import { Box, Grid } from '@mui/material';

// API
import { dashboardApi } from '../../services/api';

// Mock Data
import { mockDashboardData } from './mockData';

// Components
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

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with API response from dashboardApi
      // const [metrics, sims, deploys, health, alerts] = await Promise.all([
      //   dashboardApi.getMetrics(),
      //   dashboardApi.getRecentSimulations(),
      //   dashboardApi.getRecentDeployments(),
      //   dashboardApi.getHealthStatus(),
      //   dashboardApi.getAlerts(),
      // ]);
      setTimeout(() => {
        setData(mockDashboardData);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !data) {
    return (
      <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
        <PageSkeleton />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#F5F7FA',
        minHeight: '100vh',
        py: { xs: 2, md: 3 },
        px: { xs: 2, md: 3, lg: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1600, mx: 'auto' }}>

        {/* ─── Row 0: Header ─── */}
        <Box sx={{ mb: 3 }}>
          <DashboardHeader data={data.header} onRefresh={fetchData} />
        </Box>

        {/* ─── Row 1: KPI Cards (6) ─── */}
        <Box sx={{ mb: 3 }}>
          <KpiCards data={data} />
        </Box>

        {/* ─── Row 2: Cluster Health + Alerts ─── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <ClusterHealth data={data.clusterHealth} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <AlertsPanel data={data.alerts} />
          </Grid>
        </Grid>

        {/* ─── Row 3: Deployments + Pipelines ─── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <DeploymentStatus data={data.deployments} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <JenkinsStatus data={data.jenkinsPipelines} />
          </Grid>
        </Grid>

        {/* ─── Row 4: Prometheus + Docker ─── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <PrometheusMetrics data={data.prometheusMetrics} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <DockerImages data={data.dockerImages} />
          </Grid>
        </Grid>

        {/* ─── Row 5: System Overview (Full Width) ─── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <GrafanaMonitoring data={data.grafanaMonitoring} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <PodStatus data={data.podStatus} />
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default Dashboard;