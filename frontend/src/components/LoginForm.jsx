import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Work,
} from '@mui/icons-material';

const ROLES = [
  'DevOps Engineer',
  'Backend Engineer',
  'Cloud Engineer',
  'Site Reliability Engineer (SRE)',
  'Project Manager',
  'Admin',
];

export const LoginForm = ({ onSubmit, isLoading, apiError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    role: '',
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (val) => {
    if (!val) {
      return 'Email address is required.';
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const validatePassword = (val) => {
    if (!val) {
      return 'Password is required.';
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return '';
  };

  const validateRole = (val) => {
    if (!val) {
      return 'Please select your role.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const roleErr = validateRole(role);

    if (emailErr || passErr || roleErr) {
      setErrors({
        email: emailErr,
        password: passErr,
        role: roleErr,
      });
      return;
    }

    setErrors({ email: '', password: '', role: '' });
    onSubmit({ email, password, role, rememberMe });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      {apiError && (
        <Alert
          severity="error"
          sx={{
            mb: 3.5,
            borderRadius: 2,
            bgcolor: 'rgba(211, 47, 47, 0.15)',
            color: '#ff8a80',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            fontWeight: 500,
            fontSize: '0.875rem',
            '& .MuiAlert-icon': {
              color: '#ff8a80',
            },
          }}
          aria-live="assertive"
        >
          {apiError}
        </Alert>
      )}

      {/* Role Selection */}
      <FormControl
        fullWidth
        error={!!errors.role}
        sx={{
          mb: 3,
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.8)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#42A5F5',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
            transition: 'border-color 0.2s ease-in-out',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.48)',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#42A5F5',
          },
        }}
        variant="outlined"
      >
        <InputLabel id="role-select-label">Select Role</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
          }}
          label="Select Role"
          disabled={isLoading}
          startAdornment={
            <InputAdornment position="start">
              <Work sx={{ color: 'rgba(255, 255, 255, 0.75)', mr: 0.5 }} />
            </InputAdornment>
          }
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: '#0a0f1d',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                mt: 0.5,
                '& .MuiMenuItem-root': {
                  color: '#FFFFFF',
                  py: 1.25,
                  px: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(66, 165, 245, 0.2)',
                    color: '#42A5F5',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(66, 165, 245, 0.3)',
                    },
                  },
                },
              },
            },
          }}
          sx={{
            borderRadius: 2,
            color: '#FFFFFF',
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              color: '#FFFFFF',
            },
            '& .MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.75)',
            },
          }}
        >
          {ROLES.map((r) => (
            <MenuItem key={r} value={r}>
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

      {/* Email Input */}
      <TextField
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={!!errors.email}
        helperText={errors.email}
        disabled={isLoading}
        InputLabelProps={{
          sx: {
            color: 'rgba(255, 255, 255, 0.8)',
            '&.Mui-focused': {
              color: '#42A5F5',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: 'rgba(255, 255, 255, 0.75)' }} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            color: '#FFFFFF',
            caretColor: '#FFFFFF',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
              transition: 'border-color 0.2s ease-in-out',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.48)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#42A5F5',
            },
            '& input::placeholder': {
              color: 'rgba(255, 255, 255, 0.6)',
              opacity: 1,
            },
            '& input:-webkit-autofill': {
              WebkitTextFillColor: '#FFFFFF !important',
              WebkitBoxShadow: '0 0 0px 1000px #0a0f1d inset !important',
              transition: 'background-color 5000s ease-in-out 0s',
            },
          },
        }}
        sx={{
          mb: 3,
          '& .MuiFormHelperText-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 0.75,
            ml: 1.5,
            '&.Mui-error': {
              color: (theme) => theme.palette.error.main,
            },
          },
        }}
      />

      {/* Password Input */}
      <TextField
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
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
        InputLabelProps={{
          sx: {
            color: 'rgba(255, 255, 255, 0.8)',
            '&.Mui-focused': {
              color: '#42A5F5',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: 'rgba(255, 255, 255, 0.75)' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePassword}
                edge="end"
                disabled={isLoading}
                sx={{ color: 'rgba(255, 255, 255, 0.75)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            color: '#FFFFFF',
            caretColor: '#FFFFFF',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
              transition: 'border-color 0.2s ease-in-out',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.48)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#42A5F5',
            },
            '& input::placeholder': {
              color: 'rgba(255, 255, 255, 0.6)',
              opacity: 1,
            },
            '& input:-webkit-autofill': {
              WebkitTextFillColor: '#FFFFFF !important',
              WebkitBoxShadow: '0 0 0px 1000px #0a0f1d inset !important',
              transition: 'background-color 5000s ease-in-out 0s',
            },
          },
        }}
        sx={{
          mb: 2.5,
          '& .MuiFormHelperText-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 0.75,
            ml: 1.5,
            '&.Mui-error': {
              color: (theme) => theme.palette.error.main,
            },
          },
        }}
      />

      {/* Remember Me and Forgot Password */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              sx={{
                color: 'rgba(255, 255, 255, 0.3)',
                '&.Mui-checked': {
                  color: '#42A5F5',
                },
              }}
            />
          }
          label={<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>Remember Me</Typography>}
        />
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => {}}
          sx={{
            textDecoration: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'not-allowed',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
          disabled
        >
          Forgot Password?
        </Link>
      </Box>

      {/* Login Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{
          py: 1.75,
          borderRadius: 2,
          fontWeight: 700,
          fontSize: '1rem',
          bgcolor: 'primary.main',
          color: 'white',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            bgcolor: 'primary.dark',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px rgba(66, 165, 245, 0.4)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
        ) : (
          'Sign In'
        )}
      </Button>
    </Box>
  );
};

export default LoginForm;
