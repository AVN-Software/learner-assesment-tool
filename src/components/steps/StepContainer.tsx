"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import Stepper from "@/components/layout/Stepper";
import DownloadRubricButton from "@/components/DownloadButton";
import { useAssessment } from "@/context/AssessmentProvider";

/* =========================================================================================
   TYPES
========================================================================================= */
type Width = "sm" | "md" | "lg" | "xl" | "2xl";

interface StepHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

interface StepActionsProps {
  children?: React.ReactNode;
  leftHint?: React.ReactNode;
  primary?: { label: string; onClick: () => void; disabled?: boolean };
  secondary?: { label: string; onClick: () => void; disabled?: boolean };
  className?: string;
}

interface StepScaffoldProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  rightHeader?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: Width;
  padded?: boolean;
  actions?: StepActionsProps;
  modals?: React.ReactNode;
  className?: string;
}

/* =========================================================================================
   STEP HEADER
========================================================================================= */
export const StepHeader: React.FC<StepHeaderProps> = ({
  title,
  description,
  right,
  className,
}) => (
  <div
    className={cn(
      "w-full flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
      className
    )}
  >
    <div className="min-w-0 flex-1">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
        {title}
      </h2>
      {description && (
        <div className="text-xs sm:text-sm text-slate-600 mt-1">
          {description}
        </div>
      )}
    </div>
    {right && <div className="flex-shrink-0 mt-1">{right}</div>}
  </div>
);

/* =========================================================================================
   STEP ACTIONS
========================================================================================= */
export const StepActions: React.FC<StepActionsProps> = ({
  children,
  leftHint,
  primary,
  secondary,
  className,
}) => {
  const { navigation, nextStep, previousStep } = useAssessment();
  const showProvided = !!children || !!primary || !!secondary;

  return (
    <div
      className={cn(
        "bg-white/90 backdrop-blur border-t border-slate-200",
        "px-4 sm:px-6 py-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="text-sm text-slate-500 min-h-[20px] flex items-center">
        {leftHint ?? navigation.statusMessage}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {showProvided ? (
          <>
            {children}
            {!children && secondary && (
              <Button
                type="button"
                variant="outline"
                disabled={secondary.disabled}
                onClick={secondary.onClick}
                className="min-w-[100px]"
              >
                {secondary.label}
              </Button>
            )}
            {!children && primary && (
              <Button
                type="button"
                disabled={primary.disabled}
                onClick={primary.onClick}
                className="min-w-[100px]"
              >
                {primary.label}
              </Button>
            )}
          </>
        ) : (
          <>
            {navigation.canGoBack && (
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                className="min-w-[100px]"
              >
                Back
              </Button>
            )}
            {navigation.canGoNext && (
              <Button
                type="button"
                onClick={nextStep}
                className="min-w-[100px]"
              >
                {navigation.nextLabel}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* =========================================================================================
   STEP MODAL
========================================================================================= */
export interface StepModalProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: Width;
  className?: string;
}

export const StepModal: React.FC<StepModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  width = "md",
  className,
}) => {
  const sizeClass =
    width === "sm"
      ? "max-w-sm"
      : width === "md"
      ? "max-w-md"
      : width === "lg"
      ? "max-w-lg"
      : width === "xl"
      ? "max-w-xl"
      : "max-w-2xl";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClass, className)}>
        <DialogHeader>
          <DialogTitle className="text-left">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-left">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

/* =========================================================================================
   HOOK — useStepModals
========================================================================================= */
export function useStepModals<T extends string>(ids?: readonly T[]) {
  const [openId, setOpenId] = React.useState<T | null>(null);
  const open = (id: T) => setOpenId(id);
  const close = () => setOpenId(null);
  const isOpen = (id: T) => openId === id;
  const toggle = (id: T) => setOpenId((cur) => (cur === id ? null : id));

  React.useEffect(() => {
    if (!ids || openId === null) return;
    if (!ids.includes(openId)) setOpenId(null);
  }, [ids, openId]);

  return { openId, open, close, isOpen, toggle };
}

/* =========================================================================================
   STEP SCAFFOLD - Full Height, No Scrolling
========================================================================================= */
export const StepScaffold: React.FC<StepScaffoldProps> = ({
  title,
  description,
  rightHeader,
  children,
  maxWidth = "lg",
  padded = true,
  modals,
  className,
  actions,
}) => {
  const { navigation, stepInfo } = useAssessment();

  const widthClass =
    maxWidth === "sm"
      ? "max-w-screen-sm"
      : maxWidth === "md"
      ? "max-w-screen-md"
      : maxWidth === "lg"
      ? "max-w-screen-lg"
      : maxWidth === "xl"
      ? "max-w-screen-xl"
      : "max-w-[1400px]";

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Bar - Fixed Height */}
      <header className="flex-shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-slate-900 truncate">
              TTN Fellowship — Learner Observation
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {stepInfo.meta.label} • Step {stepInfo.index + 1} of {stepInfo.total}
            </p>
          </div>
          <div className="flex-shrink-0">
            <DownloadRubricButton />
          </div>
        </div>
      </header>

      {/* Stepper - Fixed Height */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white">
        <div className={cn("mx-auto", widthClass)}>
          <Stepper />
        </div>
      </div>

      {/* Main Content - Flexible Height */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={cn("mx-auto w-full flex-1 flex flex-col", widthClass)}>
          <div className="flex-1 flex flex-col min-h-0 py-4 sm:py-6">
            <Card className="flex-1 flex flex-col rounded-xl border-slate-200 shadow-sm overflow-hidden">
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Step Header */}
                <div className={cn("flex-shrink-0", padded ? "p-4 sm:p-6 pb-0" : "p-4 sm:p-6")}>
                  <StepHeader
                    title={title}
                    description={description}
                    right={rightHeader}
                  />
                  <Separator className="my-4" />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className={cn("h-full", padded ? "px-4 sm:px-6" : "")}>
                    {children}
                  </div>
                </div>

                {/* Fixed Actions Footer */}
                <div className="flex-shrink-0">
                  <StepActions {...actions} />
                </div>
              </CardContent>
            </Card>

            {modals}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================================
   UTILITY COMPONENTS
========================================================================================= */
export const StepLoading: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-2" />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  </div>
);

export const StepEmpty: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 text-slate-400 mb-4">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H8.25m2.25 0H5.625a1.125 1.125 0 00-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75a1.125 1.125 0 001.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-slate-900">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  </div>
);

export default StepScaffold;