import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { dashboardApi } from '../../services/api';
import { cloudMockData } from '../../data/cloudMockData';
import { PageSkeleton } from '../LoadingSkeleton';
import CloudHeader from './CloudHeader';
import KpiCards from './KpiCards';
import ResourceUtilization from './ResourceUtilization';
import NodeCapacity from './NodeCapacity';
import CostAnalysis from './CostAnalysis';
import StorageUsage from './StorageUsage';
import NetworkTraffic from './NetworkTraffic';

const CloudDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getCloudDashboard();
      setData(res.data || cloudMockData);
      setUsingMock(res.source === 'mock');
    } catch {
      setData(cloudMockData);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !data) {
    return (
      <Box sx={{ bgcolor: 'background.default', p: { xs: 2, md: 3 } }}>
        <PageSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 1.5, md: 2 }, px: { xs: 1.5, md: 2 } }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        {usingMock && (
          <Alert severity="info" sx={{ mb: 2 }} action={<Button color="inherit" size="small" onClick={fetchData}>Retry</Button>}>
            Using cached cloud data. Connect the backend for live metrics.
          </Alert>
        )}
        <Box sx={{ mb: 2 }}>
          <CloudHeader data={data.header} onRefresh={fetchData} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <KpiCards data={data.kpis} />
        </Box>
        <Grid container spacing={2} sx={{ mb: 2, alignItems: 'flex-start' }}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ResourceUtilization data={data.resourceUtilization} />
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <NodeCapacity data={data.nodeCapacity} />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2, alignItems: 'flex-start' }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <CostAnalysis data={data.costAnalysis} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <StorageUsage data={data.storageUsage} />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <NetworkTraffic data={data.networkTraffic} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CloudDashboard;
