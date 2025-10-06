"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // optional; replace with your own class merge if needed

// shadcn/ui
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

/* =========================================================================================
   Types
========================================================================================= */

type Width = "sm" | "md" | "lg" | "xl" | "2xl";

interface StepHeaderProps {
  title: string;
  description?: string;
  right?: React.ReactNode; // e.g., Download button, extra actions
  className?: string;
}

interface StepActionsProps {
  children?: React.ReactNode;      // full custom actions row
  leftHint?: React.ReactNode;      // left-aligned helper text
  primary?: { label: string; onClick: () => void; disabled?: boolean };
  secondary?: { label: string; onClick: () => void; disabled?: boolean };
  className?: string;
}

interface StepScaffoldProps {
  title: string;
  description?: string;
  rightHeader?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: Width;
  padded?: boolean;                 // add inner padding
  actions?: StepActionsProps;       // simple action config (or render StepActions yourself)
  modals?: React.ReactNode;         // any <StepModal> nodes you pass in
  className?: string;
}

/* =========================================================================================
   Header
========================================================================================= */

export const StepHeader: React.FC<StepHeaderProps> = ({
  title,
  description,
  right,
  className,
}) => {
  return (
    <div className={cn("w-full flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">{title}</h2>
        {description ? (
          <p className="text-xs sm:text-sm text-slate-600 mt-1">{description}</p>
        ) : null}
      </div>
      {right ? <div className="flex-shrink-0 mt-1">{right}</div> : null}
    </div>
  );
};

/* =========================================================================================
   Actions (sticky at the bottom of the card)
========================================================================================= */

export const StepActions: React.FC<StepActionsProps> = ({
  children,
  leftHint,
  primary,
  secondary,
  className,
}) => {
  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-200",
        "px-3 sm:px-4 py-3 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="text-[11px] sm:text-xs text-slate-500 min-h-[20px] flex items-center">
        {leftHint}
      </div>

      {children ? (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {children}
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {secondary ? (
            <Button
              type="button"
              variant="outline"
              disabled={secondary.disabled}
              onClick={secondary.onClick}
              className="h-9 min-w-[80px]"
            >
              {secondary.label}
            </Button>
          ) : null}
          {primary ? (
            <Button
              type="button"
              disabled={primary.disabled}
              onClick={primary.onClick}
              className="h-9 min-w-[80px]"
            >
              {primary.label}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

/* =========================================================================================
   Modal (shadcn Dialog wrapper)
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
    width === "sm" ? "max-w-sm" :
    width === "md" ? "max-w-md" :
    width === "lg" ? "max-w-lg" :
    width === "xl" ? "max-w-xl" : "max-w-2xl";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClass, className)}>
        <DialogHeader>
          <DialogTitle className="text-left">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-left">{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* =========================================================================================
   Hook to manage simple modal state by id
========================================================================================= */

export function useStepModals<T extends string>(ids: readonly T[]) {
  const [openId, setOpenId] = React.useState<T | null>(null);
  const open = (id: T) => setOpenId(id);
  const close = () => setOpenId(null);
  const isOpen = (id: T) => openId === id;
  
  // Enhanced version with auto-close and toggle
  const toggle = (id: T) => setOpenId(current => current === id ? null : id);
  
  return { openId, open, close, isOpen, toggle };
}

/* =========================================================================================
   Step Scaffold
   - Mobile-first
   - Uses shadcn Card for tidy layout
   - Header, Body, Sticky Actions, and optional Modals
========================================================================================= */

export const StepScaffold: React.FC<StepScaffoldProps> = ({
  title,
  description,
  rightHeader,
  children,
  maxWidth = "lg",
  padded = true,
  actions,
  modals,
  className,
}) => {
  const widthClass =
    maxWidth === "sm" ? "max-w-screen-sm" :
    maxWidth === "md" ? "max-w-screen-md" :
    maxWidth === "lg" ? "max-w-screen-lg" :
    maxWidth === "xl" ? "max-w-screen-xl" : "max-w-[1400px]";

  return (
    <section className={cn("w-full mx-auto px-3 sm:px-4 py-4 sm:py-6", widthClass, className)}>
      <Card className="rounded-xl border-slate-200 shadow-sm sm:shadow-md overflow-hidden">
        <CardContent className={cn("p-0", padded ? "" : "")}>
          {/* Header Section */}
          <div className={cn("p-4 sm:p-6", padded ? "pb-0" : "")}>
            <StepHeader title={title} description={description} right={rightHeader} />
            <Separator className="my-4" />
          </div>

          {/* Body Section */}
          <div className={cn("relative", padded ? "px-4 sm:px-6" : "")}>
            {children}
          </div>

          {/* Actions Section */}
          {actions ? (
            <StepActions
              leftHint={actions.leftHint}
              primary={actions.primary}
              secondary={actions.secondary}
              className={cn("mt-6", padded ? "mx-0" : "mx-4 sm:mx-6")}
            >
              {actions.children}
            </StepActions>
          ) : null}
        </CardContent>
      </Card>

      {/* Modals slot (render any <StepModal/> you pass) */}
      {modals}
    </section>
  );
};

/* =========================================================================================
   Additional Utility Components
========================================================================================= */

/**
 * Simple loading state for steps
 */
export const StepLoading: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-2"></div>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
};

/**
 * Empty state for steps
 */
export const StepEmpty: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-slate-400 mb-4">
        <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

/* =========================================================================================
   Export everything
========================================================================================= */

export {
  // Re-export shadcn components for convenience
  Card,
  CardContent,
  Separator,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};

export type {
  StepHeaderProps,
  StepActionsProps,
  StepScaffoldProps,

  Width,
};

// Default export for convenience
export default StepScaffold;