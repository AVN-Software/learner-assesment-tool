// useStepper.ts
import { useMemo, useState } from "react";

/**
 * Strongly-typed step keys. You can also pass a custom union.
 * Example: type WizardStep = "intro" | "select" | "assess" | "summary";
 */
export type StepKey = string;

export interface UseStepperOptions<S extends StepKey> {
  steps: readonly S[];                 // ordered list of steps
  initialStep?: S;                     // default: steps[0]
  canProceed?: (step: S) => boolean;   // gate next() based on current step
  onStepChange?: (step: S) => void;    // side-effects on step change
}

export interface UseStepperReturn<S extends StepKey> {
  steps: readonly S[];
  current: S;
  index: number;
  total: number;

  // navigation
  goTo: (s: S) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;

  // derived
  canGoNext: boolean;
  canGoPrev: boolean;
  progressPct: number; // 0..100
}

/**
 * useStepper — minimal, stale-safe stepper with guards.
 * - Uses functional setState to avoid stale closures.
 * - `canProceed` is evaluated against the *current* step during next().
 */
export function useStepper<S extends StepKey>({
  steps,
  initialStep,
  canProceed,
  onStepChange,
}: UseStepperOptions<S>): UseStepperReturn<S> {
  if (!steps.length) {
    throw new Error("useStepper: `steps` must contain at least one item.");
  }

  const safeInitial = initialStep ?? steps[0];
  const [current, setCurrent] = useState<S>(safeInitial);

  const index = useMemo(() => steps.indexOf(current), [steps, current]);
  const total = steps.length;

  const goTo = (s: S) => {
    if (!steps.includes(s)) return;
    setCurrent((prev) => {
      if (prev === s) return prev;
      onStepChange?.(s);
      return s;
    });
  };

  const next = () => {
    setCurrent((prev) => {
      const i = steps.indexOf(prev);
      // guard with canProceed on *current* step
      if (canProceed && !canProceed(prev)) return prev;
      if (i < steps.length - 1) {
        const nxt = steps[i + 1];
        onStepChange?.(nxt);
        return nxt;
      }
      return prev;
    });
  };

  const prev = () => {
    setCurrent((prev) => {
      const i = steps.indexOf(prev);
      if (i > 0) {
        const p = steps[i - 1];
        onStepChange?.(p);
        return p;
      }
      return prev;
    });
  };

  const reset = () => {
    setCurrent((prev) => {
      const first = steps[0];
      if (prev === first) return prev;
      onStepChange?.(first);
      return first;
    });
  };

  const canGoNext = index > -1 && index < total - 1 && (canProceed ? canProceed(current) : true);
  const canGoPrev = index > 0;

  const progressPct =
    total <= 1 ? 0 : Math.round((index / (total - 1)) * 100);

  return {
    steps,
    current,
    index,
    total,

    goTo,
    next,
    prev,
    reset,

    canGoNext,
    canGoPrev,
    progressPct,
  };
}
