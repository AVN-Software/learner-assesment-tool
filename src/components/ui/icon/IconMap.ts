// iconMap.ts
import {
  // System / Status Icons
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Loader2,

  // Navigation Icons
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Menu,
  Home,
  LogIn,
  LogOut,

  // Content / Functional Icons
  User,
  Users,
  BookOpen,
  NotebookPen,
  ClipboardList,
  FileText,
  Send,
  Settings,
  Bell,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

/**
 * Organized icon catalog — consistent naming, grouped by function.
 * All keys are lowercase and match your design system naming.
 */
export const iconMap = {
  system: {
    check: Check,
    checkCircle: CheckCircle2,
    alert: AlertTriangle,
    info: Info,
    error: XCircle,
    loading: Loader2,
  },

  navigation: {
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp,
    menu: Menu,
    home: Home,
    login: LogIn,
    logout: LogOut,
  },

  content: {
    user: User,
    users: Users,
    bookOpen: BookOpen,
    notebook: NotebookPen,
    clipboard: ClipboardList,
    fileText: FileText,
    send: Send,
    settings: Settings,
    bell: Bell,
  },
} as const;

/**
 * Flattened lookup for direct Icon component usage.
 * Allows <Icon name="login" /> instead of <Icon name="navigation.login" />.
 */
export const flatIconMap: Record<string, LucideIcon> = Object.entries(
  iconMap
).reduce((acc, [, group]) => ({ ...acc, ...group }), {});
