import { Box, Skeleton } from '@mui/material';
import { shadows, radii, palette } from '../theme/colors';

const cardSx = {
  borderRadius: `${radii.xl}px`,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: shadows.card,
  p: 3,
  bgcolor: 'background.paper',
};

export const MetricCardSkeleton = () => (
  <Box sx={cardSx}>
    <Skeleton variant="text" width="45%" height={18} animation="wave" />
    <Skeleton variant="text" width="35%" height={40} sx={{ mt: 1 }} animation="wave" />
    <Skeleton variant="rounded" width="55%" height={14} sx={{ mt: 2, borderRadius: 2 }} animation="wave" />
  </Box>
);

export const PageSkeleton = () => (
  <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
    <Skeleton variant="rounded" width={280} height={36} sx={{ mb: 1, borderRadius: 2 }} animation="wave" />
    <Skeleton variant="text" width="50%" height={22} animation="wave" sx={{ mb: 4 }} />
    <Box sx={{ display: 'grid', gap: 3, mb: 4, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' } }}>
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
    </Box>
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
      <Box sx={{ ...cardSx, minHeight: 320 }}>
        <Skeleton variant="rounded" height={280} animation="wave" />
      </Box>
      <Box sx={{ ...cardSx, minHeight: 320 }}>
        <Skeleton variant="rounded" height={240} animation="wave" />
      </Box>
    </Box>
  </Box>
);

export default { MetricCardSkeleton, PageSkeleton };
