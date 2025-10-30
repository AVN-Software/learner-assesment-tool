"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  Search,
  Mail,
  UserCog,
} from "lucide-react";

// Simplified Types
interface Coach {
  coachId: string;
  coachName: string;
  email: string;
}

interface Fellow {
  fellowId: string;
  fellowName: string;
  email: string;
  grade: string;
}

interface Learner {
  learnerId: string;
  learnerName: string;
}

// Sample Data
const SAMPLE_COACHES: Coach[] = [
  { coachId: "c1", coachName: "Sarah Johnson", email: "sarah.j@ttn.org" },
  { coachId: "c2", coachName: "Michael Chen", email: "michael.c@ttn.org" },
  { coachId: "c3", coachName: "Amara Okafor", email: "amara.o@ttn.org" },
  { coachId: "c4", coachName: "David Martinez", email: "david.m@ttn.org" },
  { coachId: "c5", coachName: "Priya Sharma", email: "priya.s@ttn.org" },
];

const SAMPLE_FELLOWS: Record<string, Fellow[]> = {
  c1: [
    {
      fellowId: "f1",
      fellowName: "Emma Wilson",
      email: "emma.w@ttn.org",
      grade: "Grade 4",
    },
    {
      fellowId: "f2",
      fellowName: "James Brown",
      email: "james.b@ttn.org",
      grade: "Grade 5",
    },
    {
      fellowId: "f3",
      fellowName: "Sophia Davis",
      email: "sophia.d@ttn.org",
      grade: "Grade 3",
    },
  ],
  c2: [
    {
      fellowId: "f4",
      fellowName: "Liam Taylor",
      email: "liam.t@ttn.org",
      grade: "Grade 6",
    },
    {
      fellowId: "f5",
      fellowName: "Olivia Martin",
      email: "olivia.m@ttn.org",
      grade: "Grade 4",
    },
  ],
  c3: [
    {
      fellowId: "f6",
      fellowName: "Noah Anderson",
      email: "noah.a@ttn.org",
      grade: "Grade 5",
    },
    {
      fellowId: "f7",
      fellowName: "Ava Thomas",
      email: "ava.t@ttn.org",
      grade: "Grade 7",
    },
    {
      fellowId: "f8",
      fellowName: "Ethan Jackson",
      email: "ethan.j@ttn.org",
      grade: "Grade 3",
    },
    {
      fellowId: "f9",
      fellowName: "Isabella White",
      email: "isabella.w@ttn.org",
      grade: "Grade 6",
    },
  ],
  c4: [
    {
      fellowId: "f10",
      fellowName: "Mason Harris",
      email: "mason.h@ttn.org",
      grade: "Grade 4",
    },
    {
      fellowId: "f11",
      fellowName: "Charlotte Lee",
      email: "charlotte.l@ttn.org",
      grade: "Grade 5",
    },
  ],
  c5: [
    {
      fellowId: "f12",
      fellowName: "Lucas Garcia",
      email: "lucas.g@ttn.org",
      grade: "Grade 3",
    },
    {
      fellowId: "f13",
      fellowName: "Mia Rodriguez",
      email: "mia.r@ttn.org",
      grade: "Grade 6",
    },
    {
      fellowId: "f14",
      fellowName: "Henry Martinez",
      email: "henry.m@ttn.org",
      grade: "Grade 4",
    },
  ],
};

const SAMPLE_LEARNERS: Record<string, Learner[]> = {
  f1: [
    { learnerId: "l1", learnerName: "Aiden Cooper" },
    { learnerId: "l2", learnerName: "Zoe Mitchell" },
    { learnerId: "l3", learnerName: "Oliver Scott" },
    { learnerId: "l4", learnerName: "Lily Adams" },
    { learnerId: "l5", learnerName: "Jack Turner" },
  ],
  f2: [
    { learnerId: "l6", learnerName: "Sophie Hall" },
    { learnerId: "l7", learnerName: "Daniel Green" },
    { learnerId: "l8", learnerName: "Emily King" },
    { learnerId: "l9", learnerName: "Ryan Baker" },
    { learnerId: "l10", learnerName: "Grace Nelson" },
  ],
  f3: [
    { learnerId: "l11", learnerName: "Benjamin Carter" },
    { learnerId: "l12", learnerName: "Ella Perez" },
    { learnerId: "l13", learnerName: "Matthew Roberts" },
    { learnerId: "l14", learnerName: "Chloe Wright" },
    { learnerId: "l15", learnerName: "Samuel Phillips" },
  ],
  f4: [
    { learnerId: "l16", learnerName: "Abigail Campbell" },
    { learnerId: "l17", learnerName: "Alexander Parker" },
    { learnerId: "l18", learnerName: "Madison Evans" },
    { learnerId: "l19", learnerName: "Sebastian Edwards" },
    { learnerId: "l20", learnerName: "Avery Collins" },
  ],
  f5: [
    { learnerId: "l21", learnerName: "Harper Stewart" },
    { learnerId: "l22", learnerName: "Jackson Morris" },
    { learnerId: "l23", learnerName: "Evelyn Rogers" },
    { learnerId: "l24", learnerName: "Logan Reed" },
    { learnerId: "l25", learnerName: "Scarlett Cook" },
  ],
  f6: [
    { learnerId: "l26", learnerName: "William Murphy" },
    { learnerId: "l27", learnerName: "Aria Bailey" },
    { learnerId: "l28", learnerName: "James Rivera" },
    { learnerId: "l29", learnerName: "Luna Cooper" },
    { learnerId: "l30", learnerName: "Benjamin Richardson" },
  ],
  f7: [
    { learnerId: "l31", learnerName: "Elijah Cox" },
    { learnerId: "l32", learnerName: "Mila Howard" },
    { learnerId: "l33", learnerName: "Lucas Ward" },
    { learnerId: "l34", learnerName: "Hazel Torres" },
    { learnerId: "l35", learnerName: "Henry Peterson" },
  ],
  f8: [
    { learnerId: "l36", learnerName: "Amelia Gray" },
    { learnerId: "l37", learnerName: "Alexander Ramirez" },
    { learnerId: "l38", learnerName: "Charlotte James" },
    { learnerId: "l39", learnerName: "Jack Watson" },
    { learnerId: "l40", learnerName: "Evelyn Brooks" },
  ],
  f9: [
    { learnerId: "l41", learnerName: "Michael Kelly" },
    { learnerId: "l42", learnerName: "Sophia Sanders" },
    { learnerId: "l43", learnerName: "Daniel Price" },
    { learnerId: "l44", learnerName: "Isabella Bennett" },
    { learnerId: "l45", learnerName: "Matthew Wood" },
  ],
  f10: [
    { learnerId: "l46", learnerName: "Emily Barnes" },
    { learnerId: "l47", learnerName: "Ethan Ross" },
    { learnerId: "l48", learnerName: "Olivia Henderson" },
    { learnerId: "l49", learnerName: "Noah Coleman" },
    { learnerId: "l50", learnerName: "Ava Jenkins" },
  ],
  f11: [
    { learnerId: "l51", learnerName: "Liam Perry" },
    { learnerId: "l52", learnerName: "Emma Powell" },
    { learnerId: "l53", learnerName: "Mason Long" },
    { learnerId: "l54", learnerName: "Mia Patterson" },
    { learnerId: "l55", learnerName: "Noah Hughes" },
  ],
  f12: [
    { learnerId: "l56", learnerName: "Sophia Flores" },
    { learnerId: "l57", learnerName: "Logan Washington" },
    { learnerId: "l58", learnerName: "Charlotte Butler" },
    { learnerId: "l59", learnerName: "Elijah Simmons" },
    { learnerId: "l60", learnerName: "Amelia Foster" },
  ],
  f13: [
    { learnerId: "l61", learnerName: "Oliver Gonzales" },
    { learnerId: "l62", learnerName: "Harper Bryant" },
    { learnerId: "l63", learnerName: "Lucas Alexander" },
    { learnerId: "l64", learnerName: "Ella Russell" },
    { learnerId: "l65", learnerName: "James Griffin" },
  ],
  f14: [
    { learnerId: "l66", learnerName: "Ava Diaz" },
    { learnerId: "l67", learnerName: "William Hayes" },
    { learnerId: "l68", learnerName: "Isabella Myers" },
    { learnerId: "l69", learnerName: "Henry Ford" },
    { learnerId: "l70", learnerName: "Luna Hamilton" },
  ],
};

export default function AdminPanel() {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedFellow, setSelectedFellow] = useState<Fellow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fellows = selectedCoach
    ? SAMPLE_FELLOWS[selectedCoach.coachId] || []
    : [];
  const learners = selectedFellow
    ? SAMPLE_LEARNERS[selectedFellow.fellowId] || []
    : [];

  const filteredCoaches = SAMPLE_COACHES.filter(
    (coach) =>
      coach.coachName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCoachSelect = (coach: Coach) => {
    setSelectedCoach(coach);
    setSelectedFellow(null);
  };

  const handleFellowSelect = (fellow: Fellow) => {
    setSelectedFellow(fellow);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#005a6a] to-[#007786] px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <p className="text-sm text-white/80 mt-0.5">
          Manage Coaches, Fellows & Learners
        </p>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Column 1: Coaches */}
        <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <UserCog className="w-5 h-5 text-[#005a6a]" />
              <h2 className="font-semibold text-slate-800">Coaches</h2>
              <span className="ml-auto text-xs text-slate-500">
                {filteredCoaches.length} total
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search coaches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005a6a]/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredCoaches.map((coach) => (
              <button
                key={coach.coachId}
                onClick={() => handleCoachSelect(coach)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedCoach?.coachId === coach.coachId
                    ? "bg-[#005a6a]/10 border-[#005a6a] ring-2 ring-[#005a6a]/20"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="font-medium text-slate-900 text-sm truncate">
                  {coach.coachName}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{coach.email}</span>
                </div>
                <div className="mt-1.5 text-xs text-slate-600">
                  {SAMPLE_FELLOWS[coach.coachId]?.length || 0} fellows
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-200 p-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#005a6a] hover:bg-[#007786] text-white rounded-lg text-sm font-medium transition">
              <Plus className="w-4 h-4" />
              Add Coach
            </button>
          </div>
        </div>

        {/* Column 2: Fellows */}
        <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#005a6a]" />
              <h2 className="font-semibold text-slate-800">Fellows</h2>
              {selectedCoach && (
                <span className="ml-auto text-xs text-slate-500">
                  {fellows.length} under {selectedCoach.coachName}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {!selectedCoach ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <GraduationCap className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">
                  Select a coach to view fellows
                </p>
              </div>
            ) : fellows.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <GraduationCap className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">
                  No fellows assigned to this coach
                </p>
              </div>
            ) : (
              fellows.map((fellow) => (
                <div
                  key={fellow.fellowId}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    selectedFellow?.fellowId === fellow.fellowId
                      ? "bg-[#005a6a]/10 border-[#005a6a] ring-2 ring-[#005a6a]/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => handleFellowSelect(fellow)}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium text-slate-900 text-sm truncate">
                        {fellow.fellowName}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{fellow.email}</span>
                      </div>
                      <div className="mt-1.5 text-xs text-[#005a6a] font-medium">
                        {fellow.grade}
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Remove fellow:", fellow.fellowId);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded transition"
                      title="Remove fellow"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedCoach && (
            <div className="border-t border-slate-200 p-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#005a6a] hover:bg-[#007786] text-white rounded-lg text-sm font-medium transition">
                <Plus className="w-4 h-4" />
                Add Fellow
              </button>
            </div>
          )}
        </div>

        {/* Column 3: Learners */}
        <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#005a6a]" />
              <h2 className="font-semibold text-slate-800">Learners</h2>
              {selectedFellow && (
                <span className="ml-auto text-xs text-slate-500">
                  {learners.length} under {selectedFellow.fellowName}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {!selectedFellow ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">
                  Select a fellow to view learners
                </p>
              </div>
            ) : learners.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">
                  No learners assigned to this fellow
                </p>
              </div>
            ) : (
              learners.map((learner) => (
                <div
                  key={learner.learnerId}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm truncate">
                      {learner.learnerName}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      console.log("Remove learner:", learner.learnerId);
                    }}
                    className="p-1.5 hover:bg-red-50 rounded transition flex-shrink-0"
                    title="Remove learner"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>

          {selectedFellow && (
            <div className="border-t border-slate-200 p-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#005a6a] hover:bg-[#007786] text-white rounded-lg text-sm font-medium transition">
                <Plus className="w-4 h-4" />
                Add Learner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
