// useWizard.ts
import { useState, useMemo, useCallback } from 'react';

export interface UseWizardOptions<Step extends string> {
  steps: readonly Step[];
  initialStep?: Step;
  onStepChange?: (from: Step, to: Step) => void;
}

export interface UseWizardReturn<Step extends string> {
  // ==================== CURRENT STATE ====================
  currentStep: Step;
  stepIndex: number;
  totalSteps: number;
  
  // ==================== NAVIGATION ACTIONS ====================
  goToStep: (step: Step) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  reset: () => void;
  
  // ==================== STEP INFORMATION ====================
  getStep: (index: number) => Step | undefined;
  getStepIndex: (step: Step) => number;
  hasStep: (step: Step) => boolean;
  
  // ==================== NAVIGATION STATUS ====================
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  
  // ==================== NAVIGATION READINESS ====================
  canGoToStep: (step: Step) => boolean;
  canGoNext: boolean;     // ← Just knows if next step EXISTS
  canGoPrevious: boolean; // ← Just knows if previous step EXISTS
  accessibleSteps: Step[];
}

export function useWizard<Step extends string>({
  steps,
  initialStep,
  onStepChange,
}: UseWizardOptions<Step>): UseWizardReturn<Step> {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep || steps[0]);

  const stepIndex = useMemo(() => steps.indexOf(currentStep), [steps, currentStep]);
  const totalSteps = steps.length;

  // ==================== NAVIGATION ACTIONS ====================
  const goToStep = useCallback((step: Step) => {
    const targetIndex = steps.indexOf(step);
    if (targetIndex === -1) return;
    
    setCurrentStep(prev => {
      if (prev === step) return prev;
      onStepChange?.(prev, step);
      return step;
    });
  }, [steps, onStepChange]);

  const goToNext = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      const nextStep = steps[stepIndex + 1];
      goToStep(nextStep);
    }
  }, [stepIndex, totalSteps, steps, goToStep]);

  const goToPrevious = useCallback(() => {
    if (stepIndex > 0) {
      const prevStep = steps[stepIndex - 1];
      goToStep(prevStep);
    }
  }, [stepIndex, steps, goToStep]);

  const reset = useCallback(() => {
    goToStep(steps[0]);
  }, [goToStep, steps]);

  // ==================== STEP INFORMATION ====================
  const getStep = useCallback((index: number): Step | undefined => {
    return steps[index];
  }, [steps]);

  const getStepIndex = useCallback((step: Step): number => {
    return steps.indexOf(step);
  }, [steps]);

  const hasStep = useCallback((step: Step): boolean => {
    return steps.includes(step);
  }, [steps]);

  // ==================== NAVIGATION READINESS ====================
  const canGoToStep = useCallback((step: Step): boolean => {
    const targetIndex = steps.indexOf(step);
    // Can only go to steps that exist AND are before/at current position
    return targetIndex !== -1 && targetIndex <= stepIndex;
  }, [steps, stepIndex]);

  const canGoNext = stepIndex < totalSteps - 1;     // Next step exists
  const canGoPrevious = stepIndex > 0;              // Previous step exists

  const accessibleSteps = useMemo(() => {
    return steps.filter((_, index) => index <= stepIndex);
  }, [steps, stepIndex]);

  // ==================== STATUS ====================
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const progress = totalSteps <= 1 ? 0 : Math.round((stepIndex / (totalSteps - 1)) * 100);

  return {
    // Current state
    currentStep,
    stepIndex,
    totalSteps,
    
    // Navigation actions
    goToStep,
    goToNext,
    goToPrevious,
    reset,
    
    // Step information
    getStep,
    getStepIndex,
    hasStep,
    
    // Navigation status
    isFirst,
    isLast,
    progress,
    
    // Navigation readiness (PURELY structural - no app logic)
    canGoToStep,
    canGoNext,
    canGoPrevious,
    accessibleSteps,
  };
}