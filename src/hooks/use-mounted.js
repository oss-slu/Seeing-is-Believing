import { useCallback, useEffect, useRef } from 'react';

//This hook provides functionality to tell if something is currently mounted
//This is a pretty basic useMounted implementation, if you need to know how it works you can find it online I'm sure

export const useMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
};
