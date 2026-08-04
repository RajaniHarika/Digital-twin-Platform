import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import RoleDashboardLayout from './shared/RoleDashboardLayout';
import MetricGrid from './shared/MetricGrid';
import DashboardCard from '../dashboard/components/DashboardCard';
import StatusChip from '../../components/StatusChip';
import { PageSkeleton } from '../../components/LoadingSkeleton';
import { useAppTheme } from '../../theme/useAppTheme';
import { roleDashboardApi } from './roleDashboardApi';
import { getRelativeTime } from '../../utils/formatters';

const SreDashboard = () => {
  const { tokens, theme } = useAppTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleDashboardApi.getSre();
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

  const { summary, slaHistory, errorBudget, incidents, alerts, serviceAvailability } = data;

  return (
    <RoleDashboardLayout
      title="SRE Dashboard"
      subtitle="Availability, SLA compliance, error budget, incidents, and alerts"
      onRefresh={fetchData}
      usingMock={usingMock}
    >
      <MetricGrid
        metrics={[
          { label: 'Availability', value: summary.availability, color: theme.palette.success.main },
          { label: 'SLA Target', value: summary.sla },
          { label: 'Error Budget', value: summary.errorBudget, color: theme.palette.warning.main },
          { label: 'Active Alerts', value: summary.activeAlerts, color: theme.palette.error.main },
          { label: 'Open Incidents', value: summary.openIncidents },
        ]}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <DashboardCard title="SLA Compliance (Weekly)">
            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={slaHistory}>
                  <CartesianGrid stroke={tokens.chartGrid} strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: tokens.textSecondary }} />
                  <YAxis domain={[99.8, 100]} tick={{ fontSize: 11, fill: tokens.textSecondary }} />
                  <Tooltip contentStyle={{ backgroundColor: tokens.tooltipBg, border: `1px solid ${tokens.border}` }} />
                  <Bar dataKey="actual" fill={tokens.accentDark} name="Actual %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill={theme.palette.warning.main} name="Target %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <DashboardCard title="Error Budget">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Burn rate: {errorBudget.burnRate}
            </Typography>
            <Typography variant="caption" color="text.secondary">Consumed</Typography>
            <LinearProgress variant="determinate" value={errorBudget.consumed} sx={{ mb: 2, height: 8, borderRadius: 4 }} color="warning" />
            <Typography variant="caption" color="text.secondary">Remaining ({errorBudget.remaining}%)</Typography>
            <LinearProgress variant="determinate" value={errorBudget.remaining} sx={{ height: 8, borderRadius: 4 }} color="success" />
          </DashboardCard>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Incident Tracking">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Event', 'Status', 'When'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.65rem', color: tokens.textLabel }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents.map((inc) => (
                  <TableRow key={inc.id}>
                    <TableCell sx={{ fontWeight: 500 }}>{inc.title}</TableCell>
                    <TableCell><StatusChip status={inc.status} /></TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{getRelativeTime(inc.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Active Alerts">
            {alerts.map((a) => (
              <Box key={a.id} sx={{ py: 1.25, borderBottom: `1px solid ${tokens.border}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600}>{a.title}</Typography>
                  <StatusChip status={a.severity?.toLowerCase()} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">{a.message}</Typography>
              </Box>
            ))}
          </DashboardCard>
        </Grid>
      </Grid>

      <DashboardCard title="Service Availability">
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Service', 'Uptime', 'Status'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.65rem', color: tokens.textLabel }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceAvailability.map((s) => (
              <TableRow key={s.name}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.uptime}%</TableCell>
                <TableCell><StatusChip status={s.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </RoleDashboardLayout>
  );
};

export default SreDashboard;
