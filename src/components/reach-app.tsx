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
      <div className="flex h-full w-full items-center justify-center bg-[#e8e8ed] text-sm text-[#6e6e73]">
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
    <div className="relative h-dvh w-full overflow-hidden bg-[#e8e8ed]">
      <div className="absolute inset-0 map-fade-in">
        <LeadsMap filteredLeads={filteredLeads} />
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col p-3 sm:p-4 lg:p-5">
        <header className="pointer-events-none mb-3 flex items-start justify-between gap-3">
          <div className="apple-material panel-rise pointer-events-auto rounded-2xl px-4 py-3">
            <p className="text-[21px] leading-tight font-semibold tracking-[-0.022em] text-[#1d1d1f]">
              Reach Map
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-[#6e6e73]">
              Outreach geography
            </p>
          </div>
          <div className="apple-material-soft panel-rise pointer-events-auto rounded-full px-3.5 py-2 text-[13px] font-medium text-[#1d1d1f] [animation-delay:80ms]">
            {ready ? `${filteredLeads.length} leads` : "Loading…"}
          </div>
        </header>

        <div className="pointer-events-none flex min-h-0 flex-1 flex-col justify-end gap-3 lg:flex-row lg:justify-start">
          <div className="pointer-events-auto panel-rise flex max-h-[48%] w-full flex-col sm:max-h-[55%] lg:h-full lg:max-h-none lg:w-[360px] lg:max-w-[360px] [animation-delay:120ms]">
            <div className="apple-material flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px]">
              <LeadPanel
                filteredLeads={filteredLeads}
                query={query}
                onQueryChange={setQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none mt-3 flex justify-center sm:justify-end">
          <div className="apple-material-soft panel-rise pointer-events-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full px-3.5 py-2 text-[12px] text-[#6e6e73] [animation-delay:180ms]">
            <LegendDot color="#34c759" label="New" />
            <LegendDot color="#007aff" label="Contacted" />
            <LegendDot color="#ff9500" label="Replied" />
            <LegendDot color="#af52de" label="Meeting" />
            <LegendDot color="#8e8e93" label="Closed" />
          </div>
        </div>
      </div>
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
