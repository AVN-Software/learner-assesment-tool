/**
 * db.ts
 * ✅ Strictly typed Supabase database access layer for the Assessment Tool
 */

import { createClient } from "@/utils/supabase/client";
import type { Coach, Fellow, Learner } from "@/types";

/* -----------------------------------------------------------------------
   🔒 UTILITY TYPES
----------------------------------------------------------------------- */

interface DbError {
  message: string;
  details?: string | null;
  hint?: string | null;
}

/* -----------------------------------------------------------------------
   🧭 COACHES
----------------------------------------------------------------------- */

/**
 * Fetch all coaches from the database.
 */
export async function fetchCoaches(): Promise<Coach[]> {
  const supabase = createClient();

  try {
    const { data, error, status, statusText } = await supabase
      .from("v_coaches")
      .select("*")
      .order("coach_name");

    if (error) {
      const { message, details, hint } = error as DbError;
      console.error("❌ [DB] Supabase error fetching coaches:", { message, details, hint });
      return [];
    }

    if (!data) {
      console.warn("⚠️ [DB] No data returned for coaches.", { status, statusText });
      return [];
    }

    return data as Coach[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("💥 [DB] Unexpected fetchCoaches() exception:", message);
    return [];
  }
}

/* -----------------------------------------------------------------------
   🧑‍🏫 FELLOWS
----------------------------------------------------------------------- */

/**
 * Fetch all fellows from the database.
 */
export async function fetchFellows(): Promise<Fellow[]> {
  const supabase = createClient();

  try {
    const { data, error, status, statusText } = await supabase
      .from("v_fellows")
      .select("*")
      .order("coach_name");

    if (error) {
      const { message, details, hint } = error as DbError;
      console.error("❌ [DB] Supabase error fetching fellows:", { message, details, hint });
      return [];
    }

    if (!data) {
      console.warn("⚠️ [DB] No data returned for fellows.", { status, statusText });
      return [];
    }

    return data as Fellow[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("💥 [DB] Unexpected fetchFellows() exception:", message);
    return [];
  }
}

/* -----------------------------------------------------------------------
   👩‍🎓 LEARNERS
----------------------------------------------------------------------- */

/**
 * Fetch all learners belonging to a specific fellow.
 */
export async function fetchLearnersForFellow(fellowId: string): Promise<Learner[]> {
  if (!fellowId) {
    console.warn("⚠️ [DB] fetchLearnersForFellow called with no fellowId");
    return [];
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("v_learners")
      .select("*")
      .eq("fellow_id", fellowId)
      .order("learner_name");

    if (error) {
      const { message, details, hint } = error as DbError;
      console.error("❌ [DB] Supabase error fetching learners:", { message, details, hint });
      return [];
    }

    return (data ?? []) as Learner[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("💥 [DB] Unexpected fetchLearnersForFellow() exception:", message);
    return [];
  }
}

/* -----------------------------------------------------------------------
   🧾 ASSESSMENTS
----------------------------------------------------------------------- */

/**
 * Insert one or more assessment records.
 */
export async function submitAssessmentData<T extends Record<string, unknown>>(
  payload: T | T[]
): Promise<boolean> {
  if (!payload || (Array.isArray(payload) && payload.length === 0)) {
    console.warn("⚠️ [DB] submitAssessmentData called with empty payload");
    return false;
  }

  const supabase = createClient();

  try {
    const { error } = await supabase.from("learner_tool.assessments").insert(payload);

    if (error) {
      const { message, details, hint } = error as DbError;
      console.error("❌ [DB] Supabase error inserting assessment:", { message, details, hint });
      return false;
    }

    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("💥 [DB] Unexpected submitAssessmentData() exception:", message);
    return false;
  }
}

/* -----------------------------------------------------------------------
   🧩 UTILITIES
----------------------------------------------------------------------- */

/**
 * Preload all coaches and fellows concurrently.
 */
export async function preloadBaseData(): Promise<{
  coaches: Coach[];
  fellows: Fellow[];
}> {
  try {
    const [coaches, fellows] = await Promise.all([fetchCoaches(), fetchFellows()]);
    return { coaches, fellows };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("💥 [DB] preloadBaseData() failed:", message);
    return { coaches: [], fellows: [] };
  }
}

/**
 * Fetch all learners across all fellows.
 */
export async function fetchAllLearners(): Promise<Learner[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("learner_tool.learners")
      .select("*")
      .order("learner_name");

    if (error) {
      const { message, details, hint } = error as DbError;
      console.error("❌ [DB] Error fetching all learners:", { message, details, hint });
      return [];
    }

    return (data ?? []) as Learner[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("💥 [DB] Unexpected fetchAllLearners() exception:", message);
    return [];
  }
}
