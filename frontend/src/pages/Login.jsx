import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Container, useTheme, alpha } from '@mui/material';
import { AccountTree } from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../services/auth';
import LoginForm from '../components/LoginForm';

// DevOps Illustration SVG Component with built-in CSS animations
const DevOpsIllustration = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 440,
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
      }}
    >
      <svg
        width="100%"
        height="320"
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            @keyframes pulse {
              0% { r: 8; opacity: 0.4; }
              50% { r: 16; opacity: 0.8; }
              100% { r: 8; opacity: 0.4; }
            }
            @keyframes pulse-ring {
              0% { r: 12; opacity: 0.8; stroke-width: 1px; }
              50% { r: 24; opacity: 0.2; stroke-width: 2px; }
              100% { r: 12; opacity: 0; stroke-width: 1px; }
            }
            @keyframes dash {
              to { stroke-dashoffset: -40; }
            }
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
            .glow-node {
              filter: drop-shadow(0px 0px 8px rgba(56, 189, 248, 0.6));
            }
            .glow-node-purple {
              filter: drop-shadow(0px 0px 8px rgba(168, 85, 247, 0.6));
            }
            .flow-line {
              stroke-dasharray: 8, 8;
              animation: dash 2s linear infinite;
            }
            .floating-svg {
              animation: float 6s ease-in-out infinite;
            }
            .pulse-circle {
              animation: pulse 3s ease-in-out infinite;
            }
            .pulse-ring-element {
              animation: pulse-ring 3s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
              transform-origin: center;
            }
          `}
        </style>
        <g className="floating-svg">
          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>

          {/* Connection Lines (Network Pathways) */}
          <path d="M 100 160 L 200 80" stroke="#1e293b" strokeWidth="3" />
          <path d="M 100 160 L 200 240" stroke="#1e293b" strokeWidth="3" />
          <path d="M 200 80 L 300 160" stroke="#1e293b" strokeWidth="3" />
          <path d="M 200 240 L 300 160" stroke="#1e293b" strokeWidth="3" />
          <path d="M 200 80 L 200 240" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

          {/* Animated Flow Lines */}
          <path d="M 100 160 L 200 80" stroke="url(#grad-blue)" strokeWidth="2" className="flow-line" />
          <path d="M 100 160 L 200 240" stroke="url(#grad-purple)" strokeWidth="2" className="flow-line" style={{ animationDelay: '-1s' }} />
          <path d="M 200 80 L 300 160" stroke="url(#grad-green)" strokeWidth="2" className="flow-line" style={{ animationDelay: '-0.5s' }} />
          <path d="M 200 240 L 300 160" stroke="url(#grad-blue)" strokeWidth="2" className="flow-line" style={{ animationDelay: '-1.5s' }} />

          {/* Pulse rings around nodes */}
          <circle cx="100" cy="160" r="16" fill="none" stroke="#38bdf8" className="pulse-ring-element" />
          <circle cx="200" cy="80" r="16" fill="none" stroke="#c084fc" className="pulse-ring-element" style={{ animationDelay: '-1s' }} />
          <circle cx="200" cy="240" r="16" fill="none" stroke="#38bdf8" className="pulse-ring-element" style={{ animationDelay: '-2s' }} />
          <circle cx="300" cy="160" r="16" fill="none" stroke="#4ade80" className="pulse-ring-element" style={{ animationDelay: '-1.5s' }} />

          {/* Left Node (Source / Load Balancer) */}
          <g className="glow-node">
            <circle cx="100" cy="160" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="100" cy="160" r="6" fill="#38bdf8" className="pulse-circle" />
            <path d="M 95 160 H 105 M 100 155 V 165" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Top Node (Compute Instance) */}
          <g className="glow-node-purple">
            <circle cx="200" cy="80" r="14" fill="#0f172a" stroke="url(#grad-purple)" strokeWidth="2" />
            <rect x="194" y="74" width="12" height="12" rx="2" fill="url(#grad-purple)" />
          </g>

          {/* Bottom Node (Database / State) */}
          <g className="glow-node">
            <circle cx="200" cy="240" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            {/* Database cylinders */}
            <rect x="193" y="232" width="14" height="4" rx="1" fill="#38bdf8" />
            <rect x="193" y="238" width="14" height="4" rx="1" fill="#38bdf8" />
            <rect x="193" y="244" width="14" height="4" rx="1" fill="#38bdf8" />
          </g>

          {/* Right Node (Digital Twin Orchestrator) */}
          <g className="glow-node">
            <circle cx="300" cy="160" r="14" fill="#0f172a" stroke="url(#grad-green)" strokeWidth="2" />
            <polygon points="300,152 307,163 293,163" fill="url(#grad-green)" />
          </g>

          {/* Overlay connection rings */}
          <circle cx="200" cy="160" r="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        </g>
      </svg>
    </Box>
  );
};

export const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleLoginSubmit = async ({ email, password, role }) => {
    setIsLoading(true);
    setApiError('');

    try {
      await authService.login(email, password, role);
      // Redirect to Dashboard on success
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto',
        bgcolor: '#0a0f1d', // Solid very dark backdrop for the premium glass feel
      }}
    >
      {/* Left Column: DevOps Info & SVG (Hidden on Mobile) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '40%',
          p: 6,
          background: 'linear-gradient(145deg, #070a13 0%, #0f172a 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid pattern background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.15,
            backgroundSize: '30px 30px',
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', zIndex: 1 }}
        >
          <DevOpsIllustration />
        </motion.div>

        <Box sx={{ zIndex: 1, textAlign: 'center', mt: 4, px: 2 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: -0.5,
            }}
          >
            DevOps Digital Twin
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 320,
              mx: 'auto',
              opacity: 0.8,
              fontSize: '1rem',
              fontWeight: 500,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: '#38bdf8',
            }}
          >
            Simulate • Predict • Optimize • Secure
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: 'text.secondary', opacity: 0.6, maxWidth: 300, mx: 'auto' }}
          >
            Deploy virtual replicas of Kubernetes clusters to simulate scaling and optimize infrastructure budgets.
          </Typography>
        </Box>
      </Box>

      {/* Right Column: Centered Glassmorphic Login Card */}
      <Box
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: '60%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          position: 'relative',
          // Sleek radiant glow behind the card
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 6 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.55)', // Deep slate transparency
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
                },
              }}
            >
              {/* Header Details */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  <AccountTree sx={{ color: '#38bdf8', fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={800}
                  sx={{ color: '#ffffff', letterSpacing: -0.5 }}
                >
                  TwinDigital
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4, color: '#94a3b8' }}>
                Enterprise DevOps Infrastructure Console
              </Typography>

              {/* Login Form */}
              <LoginForm
                onSubmit={handleLoginSubmit}
                isLoading={isLoading}
                apiError={apiError}
              />
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
