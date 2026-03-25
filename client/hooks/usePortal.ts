// hooks/usePortal.ts
import { useEffect, useState } from "react";

export const usePopoverPortal = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted;
};
