import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay = 3000) => {
  const [returnValue, setValue] = useState<T>(value);
  // const timer = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // if(timer.current) = clearTimeout(timer)
    const timer = setTimeout(() => {
      setValue(value);
    }, delay);

    return () => {
      // if(timer.current) = clearTimeout(timer)
      clearTimeout(timer);
    };
  }, [delay, value]);

  return returnValue;
};
