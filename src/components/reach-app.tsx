"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LeadPanel } from "@/components/lead-panel";
import { LeadsProvider, useLeads } from "@/lib/leads-store";
import type { LeadStatus } from "@/lib/types";

const LeadsMap = dynamic(
  () => import("@/components/leads-map").then((m) => m.LeadsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#d7e3ea] text-sm text-[#4a6270]">
        Loading map…
      </div>
    ),
  },
);

function ReachAppInner() {
  const { leads, ready } = useLeads();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        lead.name,
        lead.company,
        lead.city,
        lead.region,
        lead.country,
        lead.channel,
        lead.notes,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [leads, query, statusFilter]);

  return (
    <div className="relative flex min-h-dvh flex-col lg:h-dvh lg:flex-row lg:overflow-hidden">
      <aside className="order-2 flex min-h-[420px] min-h-0 flex-1 flex-col border-t border-[color:var(--line)] lg:order-1 lg:h-full lg:w-[380px] lg:flex-none lg:border-t-0 lg:border-r">
        <LeadPanel
          filteredLeads={filteredLeads}
          query={query}
          onQueryChange={setQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </aside>

      <section className="relative order-1 h-[52dvh] min-h-[280px] w-full lg:order-2 lg:h-full lg:min-h-0 lg:flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex justify-end p-3 sm:p-4">
          <div className="animate-in fade-in duration-500 rounded-md bg-white/90 px-3 py-2 text-xs text-[#4a6270] shadow-sm backdrop-blur-sm">
            {ready ? `${filteredLeads.length} leads plotted` : "Loading…"}
          </div>
        </div>

        <div className="absolute inset-0 map-fade-in">
          <LeadsMap filteredLeads={filteredLeads} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] flex justify-center p-3 sm:justify-end sm:p-4">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-xs text-[#4a6270] shadow-sm backdrop-blur-sm">
            <LegendDot color="#0e8a7d" label="New" />
            <LegendDot color="#2563eb" label="Contacted" />
            <LegendDot color="#d97706" label="Replied" />
            <LegendDot color="#7c3aed" label="Meeting" />
            <LegendDot color="#64748b" label="Closed" />
          </div>
        </div>
      </section>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}

export function ReachApp() {
  return (
    <LeadsProvider>
      <ReachAppInner />
    </LeadsProvider>
  );
}
