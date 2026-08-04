import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Storage, Memory } from '@mui/icons-material';
import RoleDashboardLayout from './shared/RoleDashboardLayout';
import MetricGrid from './shared/MetricGrid';
import DashboardCard from '../dashboard/components/DashboardCard';
import StatusChip from '../../components/StatusChip';
import { PageSkeleton } from '../../components/LoadingSkeleton';
import { useAppTheme } from '../../theme/useAppTheme';
import { roleDashboardApi } from './roleDashboardApi';
import { getRelativeTime } from '../../utils/formatters';

const BackendDashboard = () => {
  const { tokens, theme } = useAppTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleDashboardApi.getBackend();
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

  const { summary, apiServices, mysql, redis, dependencies, latencyTrend } = data;

  return (
    <RoleDashboardLayout
      title="Backend Engineer Dashboard"
      subtitle="API health, response times, data stores, and service dependencies"
      onRefresh={fetchData}
      usingMock={usingMock}
    >
      <MetricGrid
        metrics={[
          { label: 'API Health', value: summary.apiHealth },
          { label: 'Avg Response', value: summary.responseTime },
          { label: 'Error Rate', value: summary.errorRate, color: theme.palette.warning.main },
          { label: 'Healthy APIs', value: `${summary.healthyServices}/${summary.totalServices}` },
        ]}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <DashboardCard title="API Health & Response Time">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Service', 'Status', 'Uptime', 'Latency'].map((h) => (
                    <TableCell key={h} sx={{ color: tokens.textLabel, fontWeight: 600, fontSize: '0.65rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {apiServices.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell sx={{ fontWeight: 600 }}>{s.name}</TableCell>
                    <TableCell><StatusChip status={s.status} /></TableCell>
                    <TableCell>{s.uptime}%</TableCell>
                    <TableCell>{s.latency}ms</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <DashboardCard title="Response Time Trend">
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyTrend}>
                  <CartesianGrid stroke={tokens.chartGrid} strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: tokens.textSecondary }} />
                  <YAxis tick={{ fontSize: 10, fill: tokens.textSecondary }} unit="ms" />
                  <Tooltip contentStyle={{ backgroundColor: tokens.tooltipBg, border: `1px solid ${tokens.border}` }} />
                  <Line type="monotone" dataKey="p50" stroke={tokens.accentDark} strokeWidth={2} dot={false} name="p50" />
                  <Line type="monotone" dataKey="p99" stroke={theme.palette.warning.main} strokeWidth={2} dot={false} name="p99" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="MySQL Status">
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Storage sx={{ fontSize: 36, color: tokens.accentDark }} />
              <Box>
                <Typography fontWeight={700}>{mysql.name}</Typography>
                <StatusChip status={mysql.status} />
              </Box>
            </Box>
            <Grid container spacing={1}>
              {[
                { label: 'Latency', value: mysql.latency },
                { label: 'CPU', value: `${mysql.cpu}%` },
                { label: 'Memory', value: `${mysql.memory}%` },
                { label: 'Connections', value: mysql.connections },
              ].map((item) => (
                <Grid size={6} key={item.label}>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  <Typography fontWeight={600}>{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </DashboardCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Redis Cache">
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Memory sx={{ fontSize: 36, color: theme.palette.info.main }} />
              <Box>
                <Typography fontWeight={700}>{redis.label}</Typography>
                <StatusChip status={redis.status} />
              </Box>
            </Box>
            <Grid container spacing={1}>
              {[
                { label: 'Hit Rate', value: `${redis.hitRate}%` },
                { label: 'Memory', value: redis.memoryUsed },
                { label: 'Keys', value: redis.keys.toLocaleString() },
                { label: 'Latency', value: `${redis.latency}ms` },
              ].map((item) => (
                <Grid size={6} key={item.label}>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  <Typography fontWeight={600}>{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>

      <DashboardCard title="Service Dependencies">
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Source', 'Target', 'Status'].map((h) => (
                <TableCell key={h} sx={{ color: tokens.textLabel, fontWeight: 600, fontSize: '0.65rem' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dependencies.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.from}</TableCell>
                <TableCell>{d.to}</TableCell>
                <TableCell><StatusChip status={d.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </RoleDashboardLayout>
  );
};

export default BackendDashboard;
