import { Box, Typography, Grid } from '@mui/material';
import { useAppTheme } from '../../../theme/useAppTheme';

const MetricGrid = ({ metrics }) => {
  const { tokens } = useAppTheme();

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {metrics.map((m) => (
        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={m.label}>
          <Box
            sx={{
              p: 2,
              borderRadius: `${tokens.radii.lg}px`,
              bgcolor: tokens.paper,
              border: `1px solid ${tokens.border}`,
              boxShadow: tokens.shadowSm,
            }}
          >
            <Typography sx={{ color: tokens.textLabel, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {m.label}
            </Typography>
            <Typography sx={{ color: m.color || tokens.text, fontWeight: 800, fontSize: '1.35rem', mt: 0.5 }}>
              {m.value}
            </Typography>
            {m.sub && (
              <Typography variant="caption" color="text.secondary">
                {m.sub}
              </Typography>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricGrid;
