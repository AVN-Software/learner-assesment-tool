"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { TempAccount, Learner, LearnerWithAssessments } from "@/types";

// 🌐 Context Type
interface DataContextType {
  fellow: TempAccount | null;
  learners: Learner[];
  loading: boolean;
  error: string | null;
  login: (
    coachname: string,
    fellowname: string,
    email: string
  ) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
}

// 🌐 Context
const DataContext = createContext<DataContextType | undefined>(undefined);

// 🪝 Hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// 🔧 Provider Component
interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const supabase = createClient();

  const [fellow, setFellow] = useState<TempAccount | null>(null);
  const [learners, setLearners] = useState<LearnerWithAssessments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Fetch learners for a fellow
  const fetchFellowData = async (fellowId: string) => {
    try {
      setError(null);

      const { data: learnersData, error: learnersError } = await supabase
        .from("learners")
        .select(
          `
          id,
          learner_name,
          fellow_id,
          term1_assessment_id,
          term2_assessment_id,
          term3_assessment_id,
          term4_assessment_id
          `
        )
        .eq("fellow_id", fellowId)
        .order("learner_name");

      if (learnersError) throw learnersError;

      setLearners(learnersData || []);
    } catch (err) {
      console.error("Error fetching fellow data:", err);
      setError("Failed to load learners");
    }
  };

  // 🔑 Login function
  const login = async (
    coachname: string,
    fellowname: string,
    email: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: loginError } = await supabase
        .from("tempaccounts")
        .select("*")
        .eq("coachname", coachname)
        .eq("fellowname", fellowname)
        .eq("email", email)
        .maybeSingle();

      if (loginError) throw loginError;

      if (!data) {
        setError("Invalid login details. Please check your info.");
        setLoading(false);
        return false;
      }

      // Store fellow data (but not persist beyond session)
      setFellow(data as TempAccount);

      // Fetch learners
      await fetchFellowData(data.id);

      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
      setLoading(false);
      return false;
    }
  };

  // 🚪 Logout function
  const logout = () => {
    setFellow(null);
    setLearners([]);
    localStorage.removeItem("tempUser"); // just in case
  };

  // 🔄 Refresh data function
  const refreshData = async () => {
    if (fellow) {
      await fetchFellowData(fellow.id);
    }
  };

  // 🚫 Always clear session on refresh
  useEffect(() => {
    localStorage.removeItem("tempUser");
    setFellow(null);
    setLearners([]);
    setLoading(false);
  }, []);

  const value: DataContextType = {
    fellow,
    learners,
    loading,
    error,
    login,
    logout,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
