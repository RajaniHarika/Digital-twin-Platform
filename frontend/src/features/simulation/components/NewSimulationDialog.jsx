import { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  alpha,
  useTheme,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { DEPLOYMENT_STRATEGIES } from '../../../utils/constants';

const NewSimulationDialog = ({
  open,
  onClose,
  activeStep,
  setActiveStep,
  newSim,
  setNewSim,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
      aria-labelledby="simulation-dialog-title"
    >
      <DialogTitle id="simulation-dialog-title" sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={700}>New Simulation</Typography>
        <Typography variant="body2" color="text.secondary">Configure your what-if scenario</Typography>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ my: 3 }}>
          {['Configure', 'Parameters', 'Review'].map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="Simulation Name"
              value={newSim.name}
              onChange={(e) => setNewSim({ ...newSim, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Deployment Strategy</InputLabel>
              <Select
                value={newSim.strategy}
                label="Deployment Strategy"
                onChange={(e) => setNewSim({ ...newSim, strategy: e.target.value })}
              >
                {DEPLOYMENT_STRATEGIES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField label="Target Service" value={newSim.targetService} onChange={(e) => setNewSim({ ...newSim, targetService: e.target.value })} fullWidth />
            <TextField label="Load Factor" type="number" value={newSim.loadFactor} onChange={(e) => setNewSim({ ...newSim, loadFactor: e.target.value })} fullWidth />
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="subtitle2" gutterBottom>Configuration Summary</Typography>
            <Typography variant="body2" color="text.secondary">Name: {newSim.name || '—'}</Typography>
            <Typography variant="body2" color="text.secondary">Strategy: {newSim.strategy}</Typography>
            <Typography variant="body2" color="text.secondary">Target: {newSim.targetService || '—'}</Typography>
            <Typography variant="body2" color="text.secondary">Load Factor: {newSim.loadFactor}x</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button variant="outlined" onClick={() => setActiveStep((s) => s - 1)}>Back</Button>
        )}
        {activeStep < 2 ? (
          <Button variant="contained" onClick={() => setActiveStep((s) => s + 1)}>Next</Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={onClose}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            Run Simulation
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default memo(NewSimulationDialog);
