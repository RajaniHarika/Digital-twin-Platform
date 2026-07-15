import { memo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Tabs,
  Tab,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const chartColors = ['#1976D2', '#9C27B0', '#2E7D32'];
const chartLabels = ['CPU Usage (%)', 'Memory Usage (%)', 'Network (Mbps)'];

const ResourceTrendsChart = ({ chartTab, setChartTab, currentChartData }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            Resource Trends
          </Typography>
        }
        action={
          <Tabs
            value={chartTab}
            onChange={(_, v) => setChartTab(v)}
            sx={{
              '& .MuiTab-root': { minWidth: 'auto', px: 2, py: 1 },
              '& .MuiTabs-indicator': { height: 3 },
            }}
          >
            <Tab label="CPU" />
            <Tab label="Memory" />
            <Tab label="Network" />
          </Tabs>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={currentChartData}>
            <defs>
              <linearGradient id={`chartGradient-${chartTab}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors[chartTab]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors[chartTab]} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={alpha(theme.palette.text.secondary, 0.1)}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: theme.palette.text.primary, fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColors[chartTab]}
              strokeWidth={2.5}
              fill={`url(#chartGradient-${chartTab})`}
              name={chartLabels[chartTab]}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default memo(ResourceTrendsChart);
