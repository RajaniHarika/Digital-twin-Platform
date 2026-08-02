export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  spring: { type: 'spring', stiffness: 120, damping: 18 },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: ease.out },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: ease.out } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: ease.out },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

export const floatLoop = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const pulseGlow = {
  animate: {
    opacity: [0.4, 1, 0.4],
    scale: [1, 1.15, 1],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: ease.out },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: ease.inOut } },
};

/** Trigger reveal when section enters viewport while scrolling */
export const scrollViewport = { once: true, amount: 0.18, margin: '0px 0px -40px 0px' };

export const scrollRevealTransition = (delay = 0) => ({
  duration: 0.45,
  delay,
  ease: ease.out,
});

export const cardHover = {
  rest: { y: 0, boxShadow: '0 10px 35px rgba(0,0,0,0.05)' },
  hover: {
    y: -8,
    boxShadow: '0 24px 60px rgba(0,0,0,0.08)',
    transition: { duration: 0.25, ease: ease.out },
  },
};
