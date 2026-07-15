import { Box, Skeleton, Card, CardContent } from '@mui/material';

export const MetricCardSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="30%" height={40} />
      <Skeleton variant="text" width="50%" height={16} sx={{ mt: 1 }} />
    </CardContent>
  </Card>
);

export const PageSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ mb: 3 }}>
      <Skeleton variant="text" width="40%" height={32} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
    </Box>
    <Box sx={{ display: 'grid', gap: 2, mb: 3, gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
    </Box>
  </Box>
);

export default { MetricCardSkeleton, PageSkeleton };