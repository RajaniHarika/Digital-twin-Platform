import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, Tabs, Tab, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RoleDashboardLayout from './shared/RoleDashboardLayout';
import MetricGrid from './shared/MetricGrid';
import DashboardCard from '../dashboard/components/DashboardCard';
import { PageSkeleton } from '../../components/LoadingSkeleton';
import { useAppTheme } from '../../theme/useAppTheme';
import { roleDashboardApi } from './roleDashboardApi';
import { formatCurrency } from '../../utils/formatters';
import Dashboard from '../dashboard/Dashboard';
import CloudDashboard from '../../components/cloud/CloudDashboard';
import BackendDashboard from './BackendDashboard';
import SreDashboard from './SreDashboard';
import ProjectManagerDashboard from './ProjectManagerDashboard';

const AdminOverview = ({ data }) => {
  const { tokens } = useAppTheme();
  const navigate = useNavigate();
  const { platform, sections } = data;

  return (
    <>
      <MetricGrid
        metrics={[
          { label: 'Platform Users', value: platform.totalUsers },
          { label: 'Active Roles', value: platform.activeRoles },
          { label: 'Cluster Health', value: platform.clusterHealth },
          { label: 'Monthly Cost', value: formatCurrency(platform.monthlyCost) },
        ]}
      />
      <Grid container spacing={2}>
        {sections.map((section) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={section.role}>
            <DashboardCard title={section.role}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                {section.metrics.map((m) => (
                  <Typography key={m} variant="caption" sx={{ px: 1, py: 0.25, bgcolor: tokens.surface, borderRadius: 1 }}>
                    {m}
                  </Typography>
                ))}
              </Box>
              <Button size="small" variant="outlined" onClick={() => navigate('/dashboard')} sx={{ textTransform: 'none' }}>
                View as role
              </Button>
            </DashboardCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const TAB_PANELS = [
  { label: 'Overview', key: 'overview' },
  { label: 'DevOps', key: 'devops' },
  { label: 'Cloud', key: 'cloud' },
  { label: 'Backend', key: 'backend' },
  { label: 'SRE', key: 'sre' },
  { label: 'Project Mgr', key: 'pm' },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleDashboardApi.getAdmin();
      setData(res.data);
      setUsingMock(res.source === 'mock');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !data) {
    return <Box sx={{ p: 3 }}><PageSkeleton /></Box>;
  }

  const renderTab = () => {
    switch (TAB_PANELS[tab].key) {
      case 'devops':
        return <Dashboard />;
      case 'cloud':
        return <CloudDashboard />;
      case 'backend':
        return <BackendDashboard />;
      case 'sre':
        return <SreDashboard />;
      case 'pm':
        return <ProjectManagerDashboard />;
      default:
        return <AdminOverview data={data} />;
    }
  };

  if (tab > 0) {
    return (
      <Box>
        <Box sx={{ px: { xs: 1.5, md: 2 }, pt: 2, maxWidth: 1440, mx: 'auto' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 1 }}>
            {TAB_PANELS.map((t, i) => (
              <Tab key={t.key} label={t.label} value={i} />
            ))}
          </Tabs>
        </Box>
        {renderTab()}
      </Box>
    );
  }

  return (
    <RoleDashboardLayout
      title="Admin Console"
      subtitle="Full visibility across all role dashboards and platform metrics"
      onRefresh={fetchData}
      usingMock={usingMock}
    >
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        {TAB_PANELS.map((t, i) => (
          <Tab key={t.key} label={t.label} value={i} />
        ))}
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      {renderTab()}
    </RoleDashboardLayout>
  );
};

export default AdminDashboard;
