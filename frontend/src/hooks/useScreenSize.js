import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setScreenSize({
        width,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, screenSize, isDesktop: screenSize.width > 768 };
};

export default useScreenSize;