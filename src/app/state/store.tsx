// store.ts (or store.tsx if you're using JSX syntax)
import { create } from 'zustand';

interface ReportState {
  stateAvailableReports: any[]; // Data structure for reports
  setStateAvailableReports: (reports: any[]) => void; // Action to update reports
}

const loadReportsFromStorage = (): any[] => {
  if (typeof window !== "undefined") {
    const storedReports = localStorage.getItem('stateAvailableReports');
    return storedReports ? JSON.parse(storedReports) : [];
  }
  return [];
};

const saveReportsToStorage = (reports: any[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem('stateAvailableReports', JSON.stringify(reports));
  }
};

export const useReportStore = create<ReportState>((set) => ({
  stateAvailableReports: loadReportsFromStorage(), // Load from localStorage initially
  setStateAvailableReports: (reports) => {
    saveReportsToStorage(reports); // Save to localStorage whenever updated
    set({ stateAvailableReports: reports });
  },
}));
