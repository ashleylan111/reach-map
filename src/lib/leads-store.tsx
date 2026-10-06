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
import {
  DEFAULT_TAGS,
  TAG_COLOR_PRESETS,
  type Lead,
  type LeadTag,
} from "./types";

const STORAGE_KEY = "reach-map-data-v2";

type StoredData = {
  leads: Lead[];
  tags: LeadTag[];
};

type LeadsContextValue = {
  leads: Lead[];
  tags: LeadTag[];
  ready: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  addLead: (
    lead: Omit<Lead, "id" | "createdAt" | "datedAt"> & {
      datedAt?: string;
    },
  ) => Lead;
  updateLead: (
    id: string,
    patch: Partial<Pick<Lead, "tagId" | "datedAt" | "notes" | "channel">>,
  ) => void;
  removeLead: (id: string) => void;
  clearAllLeads: () => void;
  resetToSeed: () => void;
  addTag: (name: string, color?: string) => LeadTag;
  updateTag: (id: string, patch: Partial<Pick<LeadTag, "name" | "color">>) => void;
  removeTag: (id: string) => void;
};

const LeadsContext = createContext<LeadsContextValue | null>(null);

function loadData(): StoredData {
  if (typeof window === "undefined") {
    return { leads: SEED_LEADS, tags: DEFAULT_TAGS };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { leads: SEED_LEADS, tags: DEFAULT_TAGS };
    const parsed = JSON.parse(raw) as StoredData;
    if (!Array.isArray(parsed.leads) || !Array.isArray(parsed.tags)) {
      return { leads: SEED_LEADS, tags: DEFAULT_TAGS };
    }
    const tags = parsed.tags.length > 0 ? parsed.tags : DEFAULT_TAGS;
    const fallbackTag = tags[0]?.id ?? DEFAULT_TAGS[0].id;
    const leads = parsed.leads.map((lead) => ({
      ...lead,
      tagId: tags.some((t) => t.id === lead.tagId)
        ? lead.tagId
        : fallbackTag,
      datedAt: lead.datedAt || lead.createdAt || new Date().toISOString(),
    }));
    return { leads, tags };
  } catch {
    return { leads: SEED_LEADS, tags: DEFAULT_TAGS };
  }
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [tags, setTags] = useState<LeadTag[]>(DEFAULT_TAGS);
  const [ready, setReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const data = loadData();
    setLeads(data.leads);
    setTags(data.tags);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: StoredData = { leads, tags };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [leads, tags, ready]);

  const addLead = useCallback(
    (
      input: Omit<Lead, "id" | "createdAt" | "datedAt"> & {
        datedAt?: string;
      },
    ) => {
      const now = new Date().toISOString();
      const lead: Lead = {
        ...input,
        id: `lead-${crypto.randomUUID()}`,
        datedAt: input.datedAt ?? now,
        createdAt: now,
      };
      setLeads((prev) => [lead, ...prev]);
      setSelectedId(lead.id);
      return lead;
    },
    [],
  );

  const updateLead = useCallback(
    (
      id: string,
      patch: Partial<Pick<Lead, "tagId" | "datedAt" | "notes" | "channel">>,
    ) => {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)),
      );
    },
    [],
  );

  const removeLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  const clearAllLeads = useCallback(() => {
    setLeads([]);
    setSelectedId(null);
  }, []);

  const resetToSeed = useCallback(() => {
    setLeads(SEED_LEADS);
    setTags(DEFAULT_TAGS);
    setSelectedId(null);
  }, []);

  const addTag = useCallback((name: string, color?: string) => {
    const trimmed = name.trim();
    const tag: LeadTag = {
      id: `tag-${crypto.randomUUID()}`,
      name: trimmed || "Untitled",
      color:
        color ??
        TAG_COLOR_PRESETS[Math.floor(Math.random() * TAG_COLOR_PRESETS.length)],
    };
    setTags((prev) => [...prev, tag]);
    return tag;
  }, []);

  const updateTag = useCallback(
    (id: string, patch: Partial<Pick<LeadTag, "name" | "color">>) => {
      setTags((prev) =>
        prev.map((tag) => (tag.id === id ? { ...tag, ...patch } : tag)),
      );
    },
    [],
  );

  const removeTag = useCallback((id: string) => {
    setTags((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((tag) => tag.id !== id);
      const fallback = next[0]?.id;
      if (fallback) {
        setLeads((leadsPrev) =>
          leadsPrev.map((lead) =>
            lead.tagId === id ? { ...lead, tagId: fallback } : lead,
          ),
        );
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      leads,
      tags,
      ready,
      selectedId,
      setSelectedId,
      addLead,
      updateLead,
      removeLead,
      clearAllLeads,
      resetToSeed,
      addTag,
      updateTag,
      removeTag,
    }),
    [
      leads,
      tags,
      ready,
      selectedId,
      addLead,
      updateLead,
      removeLead,
      clearAllLeads,
      resetToSeed,
      addTag,
      updateTag,
      removeTag,
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
