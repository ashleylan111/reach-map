"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LeadPanel } from "@/components/lead-panel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LeadsProvider, useLeads } from "@/lib/leads-store";

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
  const { leads, tags, ready } = useLeads();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | "all">("all");

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (tagFilter !== "all" && lead.tagId !== tagFilter) return false;
      if (!q) return true;
      const tagLabel =
        tags.find((t) => t.id === lead.tagId)?.name.toLowerCase() ?? "";
      const haystack = [
        lead.name,
        lead.company,
        lead.city,
        lead.region,
        lead.country,
        lead.channel,
        lead.notes,
        tagLabel,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [leads, query, tagFilter, tags]);

  const totalLeads = leads.length;

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
              {user?.email ?? "Outreach geography"}
            </p>
          </div>

          <div className="pointer-events-auto flex items-start gap-2">
            <div className="apple-material panel-rise min-w-[112px] rounded-2xl px-5 py-3 text-right [animation-delay:80ms]">
              <p className="text-[11px] font-medium tracking-[0.06em] text-[#6e6e73] uppercase">
                Total leads
              </p>
              <p className="mt-0.5 text-[40px] leading-none font-semibold tracking-[-0.04em] text-[#1d1d1f] tabular-nums">
                {ready ? totalLeads : "—"}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="apple-material-soft panel-rise h-auto rounded-2xl px-3 py-3 text-[13px] font-semibold text-[#0071e3] hover:bg-white/80 [animation-delay:100ms]"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
            >
              Log out
            </Button>
          </div>
        </header>

        <div className="pointer-events-none flex min-h-0 flex-1 flex-col justify-end gap-3 lg:flex-row lg:justify-start">
          <div className="pointer-events-auto panel-rise flex max-h-[48%] w-full flex-col sm:max-h-[55%] lg:h-full lg:max-h-none lg:w-[380px] lg:max-w-[380px] [animation-delay:120ms]">
            <div className="apple-material flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px]">
              <LeadPanel
                filteredLeads={filteredLeads}
                query={query}
                onQueryChange={setQuery}
                tagFilter={tagFilter}
                onTagFilterChange={setTagFilter}
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none mt-3 flex justify-center sm:justify-end">
          <div className="apple-material-soft panel-rise pointer-events-auto flex max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full px-3.5 py-2 text-[12px] text-[#6e6e73] [animation-delay:180ms]">
            {tags.length === 0 ? (
              <span>No tags yet</span>
            ) : (
              tags.map((tag) => (
                <LegendDot key={tag.id} color={tag.color} label={tag.name} />
              ))
            )}
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
