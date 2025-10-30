"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { flatIconMap } from "./IconMap";
import type { LucideIcon } from "lucide-react";

/**
 * 🎨 Base icon styles
 * - Handles tone and size variants
 * - Keeps color usage minimal and reserved for status or emphasis
 */
const iconStyles = cva(
  "inline-block align-middle transition-colors duration-200",
  {
    variants: {
      tone: {
        default: "text-[#004854]", // deep teal (brand)
        primary: "text-[#004854]", // same as default for subtlety
        success: "text-emerald-500",
        warning: "text-[#FDCA40]",
        danger: "text-[#DF2935]",
        muted: "text-[#004854]/50",
        white: "text-white",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "md",
    },
  }
);

export interface IconProps extends VariantProps<typeof iconStyles> {
  /** Name of the icon (matches keys in iconMap) */
  name: string;
  /** Optional extra Tailwind classes */
  className?: string;
  /** Optional override for explicit pixel size */
  pixelSize?: number;
}

/**
 * 🔷 Icon
 *
 * Centralized wrapper for all system, navigation, and content icons.
 * Uses Lucide icons from a categorized map and enforces consistent styling.
 *
 * Example:
 * ```tsx
 * <Icon name="check" tone="success" size="lg" />
 * ```
 */
export function Icon({ name, tone, size, pixelSize, className }: IconProps) {
  const IconComponent: LucideIcon | undefined = flatIconMap[name];

  if (!IconComponent) {
    console.warn(`⚠️ Icon "${name}" not found in iconMap`);
    return null;
  }

  return (
    <IconComponent
      className={cn(iconStyles({ tone, size }), className)}
      size={pixelSize}
    />
  );
}
