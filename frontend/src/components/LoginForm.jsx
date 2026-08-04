import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  Typography,
  CircularProgress,
  OutlinedInput,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Work } from '@mui/icons-material';
import GlowButton from './marketing/GlowButton';
import { palette, radii } from '../theme/colors';
import { useAppTheme } from '../theme/useAppTheme';

const ROLES = [
  'DevOps Engineer',
  'Backend Engineer',
  'Cloud Engineer',
  'Site Reliability Engineer (SRE)',
  'Project Manager',
  'Admin',
];

export const LoginForm = ({ onSubmit, isLoading, apiError }) => {
  const { tokens } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', role: '' });

  const fieldSx = {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      borderRadius: `${radii.lg}px`,
      bgcolor: tokens.surface,
      color: tokens.text,
      '& fieldset': { borderColor: tokens.border },
      '&:hover fieldset': { borderColor: tokens.textMuted },
      '&.Mui-focused fieldset': { borderColor: palette.accentDark },
    },
    '& .MuiInputLabel-root': { color: tokens.textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: palette.accentDark },
    '& .MuiFormHelperText-root': { color: tokens.textMuted },
  };

  const validateEmail = (val) => {
    if (!val) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePassword = (val) => {
    if (!val) return 'Password is required.';
    if (val.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const validateRole = (val) => (!val ? 'Please select your role.' : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const roleErr = validateRole(role);

    if (emailErr || passErr || roleErr) {
      setErrors({ email: emailErr, password: passErr, role: roleErr });
      return;
    }

    setErrors({ email: '', password: '', role: '' });
    onSubmit({ email, password, role, rememberMe });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      {apiError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: `${radii.lg}px` }} aria-live="assertive">
          {apiError}
        </Alert>
      )}

      <FormControl fullWidth error={!!errors.role} sx={fieldSx}>
        <InputLabel id="role-select-label">Select Role</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
          }}
          input={
            <OutlinedInput
              label="Select Role"
              startAdornment={
                <InputAdornment position="start">
                  <Work sx={{ color: tokens.textMuted, fontSize: 20 }} />
                </InputAdornment>
              }
            />
          }
          disabled={isLoading}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: tokens.paper,
                border: `1px solid ${tokens.border}`,
                borderRadius: `${radii.lg}px`,
                mt: 0.5,
              },
            },
          }}
        >
          {ROLES.map((r) => (
            <MenuItem key={r} value={r} sx={{ color: tokens.text }}>
              {r}
            </MenuItem>
          ))}
        </Select>
        {errors.role && (
          <Typography variant="caption" color="error" sx={{ mt: 0.75, ml: 1.5, display: 'block' }}>
            {errors.role}
          </Typography>
        )}
      </FormControl>

      <TextField
        required
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={!!errors.email}
        helperText={errors.email}
        disabled={isLoading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: tokens.textMuted, fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={fieldSx}
      />

      <TextField
        required
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        }}
        error={!!errors.password}
        helperText={errors.password}
        disabled={isLoading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: tokens.textMuted, fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((p) => !p)}
                edge="end"
                sx={{ color: tokens.textMuted }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ ...fieldSx, mb: 2.5 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              sx={{
                color: tokens.textMuted,
                '&.Mui-checked': { color: palette.accentDark },
              }}
            />
          }
          label={<Typography variant="body2" sx={{ color: tokens.textSecondary }}>Remember me</Typography>}
        />
        <Link
          component={RouterLink}
          to="/help"
          variant="body2"
          sx={{ color: tokens.textMuted, textDecoration: 'none', '&:hover': { color: palette.accentDark } }}
        >
          Forgot password?
        </Link>
      </Box>

      <GlowButton type="submit" fullWidth disabled={isLoading} sx={{ py: 1.6, borderRadius: `${radii.pill}px`, width: '100%' }}>
        {isLoading ? <CircularProgress size={24} sx={{ color: '#111111' }} /> : 'Sign in to console'}
      </GlowButton>
    </Box>
  );
};

export default LoginForm;
