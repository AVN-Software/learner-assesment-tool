import React from "react";
import { GraduationCap, CheckCircle2, Mail, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Fellow } from "@/types/people";

interface FellowSummaryCardProps {
  fellow: Fellow;
  selectedGrade?: string;
  showGradePrompt?: boolean;
}

/**
 * Fellow Summary Card Component
 * Horizontal bar layout with all information in a single row
 */
export const FellowSummaryCard: React.FC<FellowSummaryCardProps> = ({
  fellow,
  selectedGrade,
  showGradePrompt = false,
}) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon + Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 rounded-lg bg-slate-100 p-2">
            <GraduationCap className="h-4 w-4 text-slate-700" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm truncate">
              {fellow.name}
            </h3>
          </div>
        </div>

        {/* Middle: Metadata */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <User className="h-3 w-3" />
            {fellow.coachName}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Calendar className="h-3 w-3" />
            {fellow.yearOfFellowship}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span className="max-w-[180px] truncate">{fellow.email}</span>
          </span>
          {selectedGrade && (
            <span className="text-slate-700 font-medium px-2 py-1 rounded-md bg-slate-50 border border-slate-200 whitespace-nowrap">
              {selectedGrade}
            </span>
          )}
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-3 shrink-0">
          {showGradePrompt && (
            <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
              {selectedGrade ? "Ready to assess" : "Select grade"}
            </p>
          )}
          <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      </div>
    </div>
  );
};