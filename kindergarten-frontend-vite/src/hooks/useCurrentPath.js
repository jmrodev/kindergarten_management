import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useCurrentPath = () => {
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState('general');

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/classrooms')) {
      setCurrentSection('classrooms');
    } else if (path.startsWith('/staff')) {
      setCurrentSection('staff');
    } else if (path.startsWith('/guardians')) {
      setCurrentSection('guardians');
    } else if (path.startsWith('/vaccinations')) {
      setCurrentSection('vaccinations');
    } else if (path.startsWith('/activities')) {
      setCurrentSection('activities');
    } else if (path.startsWith('/dashboard')) {
      setCurrentSection('general');
    } else {
      // Para otras rutas que no están clasificadas, puedes agregar más casos
      setCurrentSection('general');
    }
  }, [location.pathname]);

  return { currentSection };
};

export default useCurrentPath;