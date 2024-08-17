import { useState, useEffect } from 'react';

function useDeviceType() {
  const [device, setDevice] = useState({
    breakpoint: 'sm',
    type: 'mobile',
  });

  const updateDeviceType = () => {
    const width = window.innerWidth / window.devicePixelRatio;

    if (width < 640) {
      setDevice({ breakpoint: 'sm', type: 'mobile' });
    } else if (width >= 640 && width < 768) {
      setDevice({ breakpoint: 'md', type: 'tablet' });
    } else if (width >= 768 && width < 1024) {
      setDevice({ breakpoint: 'lg', type: 'tablet' });
    } else if (width >= 1024 && width < 1280) {
      setDevice({ breakpoint: 'xl', type: 'desktop' });
    } else if (width >= 1280 && width < 1536) {
      setDevice({ breakpoint: '2xl', type: 'desktop' });
    } else {
      setDevice({ breakpoint: '3xl', type: 'desktop' });
    }
  };

  useEffect(() => {
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return device;
}

export default useDeviceType;
