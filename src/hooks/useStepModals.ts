"use client";

import { useCallback, useState } from "react";

/**
 * Hook for managing multiple modals by key.
 * Example: const modals = useStepModals(["help", "confirm"] as const)
 */
export function useStepModals<const T extends readonly string[]>(keys: T) {
  const [openModals, setOpenModals] = useState<Record<T[number], boolean>>(
    () =>
      keys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<T[number], boolean>
      )
  );

  const open = useCallback(
    (key: T[number]) =>
      setOpenModals((prev) => ({ ...prev, [key]: true })),
    []
  );

  const close = useCallback(
    (key: T[number]) =>
      setOpenModals((prev) => ({ ...prev, [key]: false })),
    []
  );

  const toggle = useCallback(
    (key: T[number]) =>
      setOpenModals((prev) => ({ ...prev, [key]: !prev[key] })),
    []
  );

  const isOpen = useCallback(
    (key: T[number]) => !!openModals[key],
    [openModals]
  );

  const closeAll = useCallback(() => {
    setOpenModals(
      keys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<T[number], boolean>
      )
    );
  }, [keys]);

  return { open, close, toggle, isOpen, closeAll };
}
