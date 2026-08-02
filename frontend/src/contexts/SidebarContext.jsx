import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : true;
  });

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem('sidebarOpen', newState);
      return newState;
    });
  }, []);

  const setOpen = useCallback((open) => {
    setIsOpen(open);
    localStorage.setItem('sidebarOpen', open);
  }, []);

  const value = {
    isOpen,
    toggle,
    setOpen,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;