"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface StepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  width?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  className?: string;
}

export const StepModal: React.FC<StepModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  width = "md",
  children,
  className,
}) => {
  const widthClass =
    width === "sm"
      ? "max-w-sm"
      : width === "md"
      ? "max-w-md"
      : width === "lg"
      ? "max-w-2xl"
      : "max-w-4xl";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "rounded-lg border border-slate-200 bg-white p-6 shadow-xl",
          widthClass,
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-slate-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
