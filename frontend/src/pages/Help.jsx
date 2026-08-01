import { Box, Typography, Paper, Stack, Link } from '@mui/material';
import { HelpOutline, MenuBook, SupportAgent } from '@mui/icons-material';

const Help = () => (
  <Box sx={{ maxWidth: 720 }}>
    <Typography variant="h4" fontWeight={700} gutterBottom>
      Help & Support
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Resources for operating your Kubernetes digital twin.
    </Typography>
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ p: 2.5, border: (t) => `1px solid ${t.palette.divider}` }}>
        <Stack direction="row" spacing={1.5}>
          <MenuBook color="primary" />
          <Box>
            <Typography fontWeight={600}>Documentation</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Review deployment simulation, risk scoring, and cost forecasting guides in the project README.
            </Typography>
          </Box>
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ p: 2.5, border: (t) => `1px solid ${t.palette.divider}` }}>
        <Stack direction="row" spacing={1.5}>
          <SupportAgent color="primary" />
          <Box>
            <Typography fontWeight={600}>Contact support</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Email <Link href="mailto:support@digitaltwin.com">support@digitaltwin.com</Link> for platform assistance.
            </Typography>
          </Box>
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ p: 2.5, border: (t) => `1px solid ${t.palette.divider}` }}>
        <Stack direction="row" spacing={1.5}>
          <HelpOutline color="primary" />
          <Box>
            <Typography fontWeight={600}>Demo credentials</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              DevOps: devops@digitaltwin.com / devops123 · Cloud: cloud@digitaltwin.com / cloud123
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  </Box>
);

export default Help;
