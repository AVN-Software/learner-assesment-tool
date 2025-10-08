
// ============================================================================
// step-scaffold.tsx - Generic step layout for different use cases
// ============================================================================
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

/* =========================================================================================
   TYPES
========================================================================================= */
export type Width = "sm" | "md" | "lg" | "xl" | "2xl";

export interface StepInfo {
  current: string;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  config: {
    meta: {
      label: string;
      desc: string;
      shortLabel: string;
    };
  };
}

export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel: string;
  statusMessage: string;
}

export interface StepHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export interface StepActionsProps {
  children?: React.ReactNode;
  leftHint?: React.ReactNode;
  primary?: { label: string; onClick: () => void; disabled?: boolean };
  secondary?: { label: string; onClick: () => void; disabled?: boolean };
  className?: string;
}

export interface StepScaffoldProps<Step extends string = string> {
  stepInfo: StepInfo;
  navigation: NavigationState;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (step: Step) => void;

  title: React.ReactNode;
  description?: React.ReactNode;
  rightHeader?: React.ReactNode;
  children: React.ReactNode;

  maxWidth?: Width;
  padded?: boolean;
  actions?: StepActionsProps;
  modals?: React.ReactNode;
  className?: string;

  appHeader?: {
    title: string;
    subtitle?: string;
    rightAction?: React.ReactNode;
  };
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
  <div className={cn("w-full flex flex-col gap-3", className)}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {description && (
          <p className="text-base text-slate-600 mt-2 leading-relaxed">{description}</p>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  </div>
);

/* =========================================================================================
   STEP ACTIONS
========================================================================================= */
export const StepActions: React.FC<
  StepActionsProps & {
    navigation: NavigationState;
    onNext: () => void;
    onPrevious: () => void;
  }
> = ({
  children,
  leftHint,
  primary,
  secondary,
  className,
  navigation,
  onNext,
  onPrevious,
}) => {
  const showProvided = !!children || !!primary || !!secondary;

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-slate-50 to-slate-50/50 border-t border-slate-200",
        "px-6 py-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="text-sm font-medium text-slate-600 min-h-[20px] flex items-center">
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
                className="min-w-[110px] h-10 font-semibold"
              >
                {secondary.label}
              </Button>
            )}
            {!children && primary && (
              <Button
                type="button"
                disabled={primary.disabled}
                onClick={primary.onClick}
                className="min-w-[110px] h-10 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
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
                onClick={onPrevious}
                className="min-w-[110px] h-10 font-semibold"
              >
                ← Back
              </Button>
            )}
            {navigation.canGoNext && (
              <Button
                type="button"
                onClick={onNext}
                disabled={!navigation.canGoNext}
                className="min-w-[110px] h-10 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
              >
                {navigation.nextLabel} →
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* =========================================================================================
   STEP SCAFFOLD - For apps that need custom wizard layouts
========================================================================================= */
export const StepScaffold = <Step extends string = string>({
  stepInfo,
  navigation,
  onNext,
  onPrevious,
  onGoToStep,
  title,
  description,
  rightHeader,
  children,
  maxWidth = "lg",
  padded = true,
  modals,
  className,
  actions,
  appHeader = {
    title: "Assessment Wizard",
    subtitle: "Complete the steps below",
  },
}: StepScaffoldProps<Step>) => {
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 overflow-hidden">
      {/* App Header */}
      <header className="flex-shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {appHeader.title}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-sm font-medium text-slate-600">
                {stepInfo.config.meta.label}
              </p>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-600">
                  Step {stepInfo.index + 1}
                </span>
                <span className="text-sm text-slate-500">of {stepInfo.total}</span>
              </div>
              <div className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {stepInfo.progress}%
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">{appHeader.rightAction}</div>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-1 bg-slate-100 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${stepInfo.progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={cn("mx-auto w-full flex-1 flex flex-col px-4 sm:px-6", widthClass)}>
          <div className="flex-1 flex flex-col min-h-0 py-6">
            <Card className="flex-1 flex flex-col rounded-2xl border-slate-200/80 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm">
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Step Header */}
                <div className="flex-shrink-0 px-8 pt-8 pb-6 bg-gradient-to-b from-slate-50/50 to-transparent">
                  <StepHeader
                    title={title}
                    description={description}
                    right={rightHeader}
                  />
                  <Separator className="mt-6 bg-slate-200" />
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className={cn("h-full", padded ? "px-8 py-6" : "")}>
                    {children}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <StepActions
                    {...actions}
                    navigation={navigation}
                    onNext={onNext}
                    onPrevious={onPrevious}
                  />
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