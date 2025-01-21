import { create } from "zustand";

interface ReportState {
  stateAvailableReports: any[]; // Data structure for reports
  setStateAvailableReports: (reports: any[]) => void; // Action to update reports
  userId: string | null; // Store userId
  setUserId: (id: string) => void; // Action to update userId
}

// Helper to load data from localStorage
const loadFromStorage = (key: string): any => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  }
  return null;
};

// Helper to save data to localStorage
const saveToStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Create the Zustand store
export const useReportStore = create<ReportState>((set) => ({
  stateAvailableReports: loadFromStorage("stateAvailableReports") || [], // Load reports from localStorage
  setStateAvailableReports: (reports) => {
    saveToStorage("stateAvailableReports", reports); // Save reports to localStorage
    set({ stateAvailableReports: reports });
  },
  userId: loadFromStorage("userId"), // Load userId from localStorage
  setUserId: (id) => {
    saveToStorage("userId", id); // Save userId to localStorage
    set({ userId: id });
  },
}));