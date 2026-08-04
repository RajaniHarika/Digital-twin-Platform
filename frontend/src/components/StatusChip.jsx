import { Chip } from '@mui/material';
import { CheckCircle, Warning, Error, RemoveCircle, Info } from '@mui/icons-material';

const StatusChip = ({ status, size = 'small', sx, label: customLabel }) => {
  const statusKey = status?.toLowerCase() || 'unknown';

  const config = {
    healthy: { label: 'Healthy', icon: CheckCircle, color: '#22C55E' },
    warning: { label: 'Warning', icon: Warning, color: '#F59E0B' },
    critical: { label: 'Critical', icon: Error, color: '#EF4444' },
    unknown: { label: 'Unknown', icon: RemoveCircle, color: '#8F8F8F' },
    success: { label: 'Success', icon: CheckCircle, color: '#22C55E' },
    running: { label: 'Running', icon: CheckCircle, color: '#94C600' },
    completed: { label: 'Completed', icon: CheckCircle, color: '#22C55E' },
    failed: { label: 'Failed', icon: Error, color: '#EF4444' },
    pending: { label: 'Pending', icon: RemoveCircle, color: '#8F8F8F' },
    info: { label: 'Info', icon: Info, color: '#565656' },
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
