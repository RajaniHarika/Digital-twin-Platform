import { useState, useEffect } from 'react';

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isXs = screenSize.width < breakpoints.sm;
  const isSm = screenSize.width >= breakpoints.sm && screenSize.width < breakpoints.md;
  const isMd = screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg;
  const isLg = screenSize.width >= breakpoints.lg && screenSize.width < breakpoints.xl;
  const isXl = screenSize.width >= breakpoints.xl;

  const isMobile = screenSize.width < breakpoints.md;
  const isTablet = screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg;
  const isDesktop = screenSize.width >= breakpoints.lg;

  return {
    ...screenSize,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isMobile,
    isTablet,
    isDesktop,
  };
};

export default useResponsive;