import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import RoleDashboardLayout from './shared/RoleDashboardLayout';
import MetricGrid from './shared/MetricGrid';
import DashboardCard from '../dashboard/components/DashboardCard';
import StatusChip from '../../components/StatusChip';
import { PageSkeleton } from '../../components/LoadingSkeleton';
import { useAppTheme } from '../../theme/useAppTheme';
import { roleDashboardApi } from './roleDashboardApi';
import { formatCurrency, getRelativeTime } from '../../utils/formatters';

const ProjectManagerDashboard = () => {
  const { tokens, theme } = useAppTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleDashboardApi.getProjectManager();
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

  const { summary, projects, deployments, teamActivity, riskReports, costReports } = data;

  return (
    <RoleDashboardLayout
      title="Project Manager Dashboard"
      subtitle="Project status, deployments, team activity, risk and cost reports"
      onRefresh={fetchData}
      usingMock={usingMock}
    >
      <MetricGrid
        metrics={[
          { label: 'Projects', value: summary.projectStatus },
          { label: 'Deployments', value: summary.deployments },
          { label: 'Team Events', value: summary.teamEvents },
          { label: 'Risk Score', value: summary.riskScore, color: theme.palette.warning.main },
          { label: 'Monthly Cost', value: formatCurrency(summary.monthlyCost) },
        ]}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <DashboardCard title="Project Status">
            {projects.map((p) => (
              <Box key={p.name} sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography fontWeight={600}>{p.name}</Typography>
                  <StatusChip status={p.status === 'On Track' ? 'success' : 'warning'} label={p.status} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Owner: {p.owner}
                </Typography>
                <LinearProgress variant="determinate" value={p.progress} sx={{ height: 6, borderRadius: 3 }} />
                <Typography variant="caption" color="text.secondary">{p.progress}% complete</Typography>
              </Box>
            ))}
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <DashboardCard title="Recent Deployments">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Service', 'Version', 'Status'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.65rem', color: tokens.textLabel }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {deployments.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.service}</TableCell>
                    <TableCell>{d.version}</TableCell>
                    <TableCell><StatusChip status={d.status === 'success' ? 'success' : 'failed'} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DashboardCard>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Team Activity">
            {teamActivity.map((a) => (
              <Box key={a.id} sx={{ py: 1, borderBottom: `1px solid ${tokens.border}` }}>
                <Typography variant="body2" fontWeight={500}>{a.action}</Typography>
                <Typography variant="caption" color="text.secondary">{a.user} · {getRelativeTime(a.timestamp)}</Typography>
              </Box>
            ))}
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Risk Reports">
            {riskReports.map((r) => (
              <Box key={r.id} sx={{ py: 1, borderBottom: `1px solid ${tokens.border}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>{r.title}</Typography>
                  <StatusChip status={r.severity} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">{r.service} · score {r.score}</Typography>
              </Box>
            ))}
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Cost Reports">
            {costReports.map((c) => (
              <Box key={c.service} sx={{ py: 1, borderBottom: `1px solid ${tokens.border}`, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>{c.service}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.category}</Typography>
                </Box>
                <Typography fontWeight={700}>{formatCurrency(c.monthly)}</Typography>
              </Box>
            ))}
          </DashboardCard>
        </Grid>
      </Grid>
    </RoleDashboardLayout>
  );
};

export default ProjectManagerDashboard;
