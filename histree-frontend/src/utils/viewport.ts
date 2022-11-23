import { RefObject, useEffect, useMemo, useState } from "react";

export const useIsInViewport = (ref: RefObject<HTMLElement>): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        // console.log(entry.boundingClientRect)
        setIsIntersecting(entry.isIntersecting);
      }),
    []
  );

  useEffect(() => {
    if (ref.current !== null) {
      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [ref, observer]);

  return isIntersecting;
};
