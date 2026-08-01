import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { ease } from '../../theme/motion';

const ScrollReveal = ({
  children,
  delay = 0,
  y = 36,
  x = 0,
  scale = 1,
  blur = 0,
  once = true,
  duration = 0.65,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px' });

  return (
    <Box ref={ref}>
      <motion.div
        animate={
          isInView
            ? { opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }
            : undefined
        }
        initial={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'none' }}
        transition={{ duration, delay, ease: ease.out }}
      >
        {children}
      </motion.div>
    </Box>
  );
};

export const AnimatedCounter = ({ value, suffix = '', duration = 1.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric)) return;

    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(numeric * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  const prefix = String(value).startsWith('<') ? '<' : '';
  const formatted = Number.isInteger(parseFloat(String(value)))
    ? Math.round(display)
    : display.toFixed(2);

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default ScrollReveal;
