import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationHistoryContext = createContext();

export const NavigationHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  // Add current location to history
  const addToHistory = (location) => {
    setHistory(prev => [...prev, location]);
  };

  // Remove last location from history (when navigating forward to a new page)
  const removeFromHistory = () => {
    setHistory(prev => {
      if (prev.length > 0) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  // Get previous location (the last item in history)
  const getPreviousLocation = () => {
    if (history.length > 0) {
      return history[history.length - 1];
    }
    return null;
  };

  // Clear entire history
  const clearHistory = () => {
    setHistory([]);
  };

  // Get the current length of history
  const getHistoryLength = () => history.length;

  // Update history when location changes
  useEffect(() => {
    const handlePushState = () => {
      setHistory(prev => [...prev, window.location.pathname]);
    };

    // For browser back/forward buttons, we should handle it differently
    window.addEventListener('popstate', (e) => {
      // When user uses browser back button, remove last entry from history
      setHistory(prev => prev.slice(0, -1));
    });

    // Add current path when component mounts
    addToHistory(window.location.pathname);

    return () => {
      window.removeEventListener('popstate', () => {});
    };
  }, []);

  return (
    <NavigationHistoryContext.Provider value={{
      history,
      addToHistory,
      removeFromHistory,
      getPreviousLocation,
      clearHistory,
      getHistoryLength
    }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistory = () => {
  const context = useContext(NavigationHistoryContext);
  if (!context) {
    throw new Error('useNavigationHistory must be used within a NavigationHistoryProvider');
  }
  return context;
};