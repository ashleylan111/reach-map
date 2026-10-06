"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_LEADS } from "./seed-leads";
import type { Lead, LeadStatus } from "./types";

const STORAGE_KEY = "reach-map-leads-v1";

type LeadsContextValue = {
  leads: Lead[];
  ready: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => Lead;
  updateStatus: (id: string, status: LeadStatus) => void;
  removeLead: (id: string) => void;
  resetToSeed: () => void;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

function loadLeads(): Lead[] {
  if (typeof window === "undefined") return SEED_LEADS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_LEADS;
    const parsed = JSON.parse(raw) as Lead[];
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_LEADS;
    return parsed;
  } catch {
    return SEED_LEADS;
  }
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [ready, setReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setLeads(loadLeads());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads, ready]);

  const addLead = useCallback((input: Omit<Lead, "id" | "createdAt">) => {
    const lead: Lead = {
      ...input,
      id: `lead-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [lead, ...prev]);
    setSelectedId(lead.id);
    return lead;
  }, []);

  const updateStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
    );
  }, []);

  const removeLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  const resetToSeed = useCallback(() => {
    setLeads(SEED_LEADS);
    setSelectedId(null);
  }, []);

  const value = useMemo(
    () => ({
      leads,
      ready,
      selectedId,
      setSelectedId,
      addLead,
      updateStatus,
      removeLead,
      resetToSeed,
    }),
    [
      leads,
      ready,
      selectedId,
      addLead,
      updateStatus,
      removeLead,
      resetToSeed,
    ],
  );

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}
