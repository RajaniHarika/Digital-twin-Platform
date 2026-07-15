import { Chip } from '@mui/material';
import { CheckCircle, Warning, Error, RemoveCircle } from '@mui/icons-material';

const StatusChip = ({ status, size = 'small', sx, label: customLabel }) => {
  const statusKey = status?.toLowerCase() || 'unknown';

  const config = {
    healthy: { label: 'Healthy', icon: CheckCircle, color: '#2E7D32' },
    warning: { label: 'Warning', icon: Warning, color: '#ED6C02' },
    critical: { label: 'Critical', icon: Error, color: '#D32F2F' },
    unknown: { label: 'Unknown', icon: RemoveCircle, color: '#757575' },
    success: { label: 'Success', icon: CheckCircle, color: '#2E7D32' },
    running: { label: 'Running', icon: CheckCircle, color: '#0288D1' },
    completed: { label: 'Completed', icon: CheckCircle, color: '#2E7D32' },
    failed: { label: 'Failed', icon: Error, color: '#D32F2F' },
    pending: { label: 'Pending', icon: RemoveCircle, color: '#757575' },
  };

  const { Icon, label, color } = config[statusKey] || config.unknown;

  return (
    <Chip
      icon={Icon && <Icon style={{ fontSize: 16 }} />}
      label={customLabel || label}
      size={size}
      sx={{
        bgcolor: color + '1A',
        color: color,
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: color,
        },
        ...sx,
      }}
    />
  );
};

export default StatusChip;