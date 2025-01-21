import { create } from "zustand";

interface ReportState {
  stateAvailableReports: any[]; // Data structure for reports
  setStateAvailableReports: (reports: any[]) => void; // Action to update reports
  userId: string | null; // Store userId
  setUserId: (id: string) => void; // Action to update userId
}

const loadFromStorage = (key: string): any => {
  if (typeof window !== "undefined") {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      // Clear invalid entry to prevent future errors
      localStorage.removeItem(key);
      return null;
    }
  }
  return null;
};

const saveToStorage = (key: string, value: any): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving key "${key}" to localStorage:`, error);
    }
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