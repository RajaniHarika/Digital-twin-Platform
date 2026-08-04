import { memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  alpha,
  useTheme,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { formatCurrency } from '../../../utils/formatters';

const ServiceCostTable = ({ serviceCosts }) => {
  const theme = useTheme();

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Monthly</TableCell>
            <TableCell align="right">Daily Avg</TableCell>
            <TableCell align="right">Trend</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {serviceCosts.map((row) => (
            <TableRow key={row.service} sx={{ '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.04) } }}>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>{row.service}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={row.category} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={500}>{formatCurrency(row.monthly)}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">{formatCurrency(row.daily)}</Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                  {row.trend > 0 ? (
                    <TrendingUp sx={{ fontSize: 16, color: 'error.main' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: 'success.main' }} />
                  )}
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={row.trend > 0 ? 'error.main' : 'success.main'}
                  >
                    {row.trend > 0 ? '+' : ''}{row.trend}%
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(ServiceCostTable);
