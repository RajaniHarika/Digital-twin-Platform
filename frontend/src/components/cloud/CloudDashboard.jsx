import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';

// Mock Data
import { cloudMockData } from '../../data/cloudMockData';

// Components
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

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setData(cloudMockData);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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
        
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <CloudHeader data={data.header} />
        </Box>

        {/* KPI Cards */}
        <Box sx={{ mb: 3 }}>
          <KpiCards data={data.kpis} />
        </Box>

        {/* Resource Utilization + Node Capacity */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ResourceUtilization data={data.resourceUtilization} />
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <NodeCapacity data={data.nodeCapacity} />
          </Grid>
        </Grid>

        {/* Cost Analysis + Storage Usage */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <CostAnalysis data={data.costAnalysis} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <StorageUsage data={data.storageUsage} />
          </Grid>
        </Grid>

        {/* Network Traffic */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <NetworkTraffic data={data.networkTraffic} />
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default CloudDashboard;
