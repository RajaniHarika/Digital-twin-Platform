import { Box, Typography, IconButton } from '@mui/material';
import { Close, CheckCircle, Warning, Info, Error as ErrorIcon } from '@mui/icons-material';
import { formatDateTime } from '../utils/formatters';
import StatusChip from './StatusChip';

const severityConfig = {
  critical: { Icon: ErrorIcon, color: '#D32F2F' },
  warning: { Icon: Warning, color: '#ED6C02' },
  info: { Icon: Info, color: '#0288D1' },
  success: { Icon: CheckCircle, color: '#2E7D32' },
};

const AlertItem = ({ alert, onDismiss, onAcknowledge }) => {
  const { Icon, color } = severityConfig[alert.severity] || severityConfig.info;

  return (
    <Box
      sx={{
        p: 2,
        mb: 1,
        borderRadius: 2,
        bgcolor: color + '1A',
        border: `1px solid ${color + '33'}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      <Icon style={{ color, marginTop: 2 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
          <Typography variant="subtitle2" fontWeight={600} style={{ color }}>
            {alert.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(alert.timestamp)}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {alert.message}
        </Typography>
        {alert.acknowledged && (
          <StatusChip status="success" size="small" sx={{ alignSelf: 'flex-start' }} />
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {!alert.acknowledged && onAcknowledge && (
          <IconButton size="small" onClick={() => onAcknowledge(alert.id)}>
            <CheckCircle sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        {onDismiss && (
          <IconButton size="small" onClick={() => onDismiss(alert.id)}>
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default AlertItem;