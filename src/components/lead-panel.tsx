"use client";

import { Search, Trash2 } from "lucide-react";
import { AddLeadDialog } from "@/components/add-lead-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLeads } from "@/lib/leads-store";
import {
  LEAD_STATUSES,
  STATUS_COLORS,
  type Lead,
  type LeadStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type LeadPanelProps = {
  filteredLeads: Lead[];
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: LeadStatus | "all";
  onStatusFilterChange: (value: LeadStatus | "all") => void;
};

export function LeadPanel({
  filteredLeads,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
}: LeadPanelProps) {
  const { selectedId, setSelectedId, updateStatus, removeLead, resetToSeed, leads } =
    useLeads();

  const selected = leads.find((l) => l.id === selectedId) ?? null;

  const cityCounts = filteredLeads.reduce<Record<string, number>>((acc, lead) => {
    const key = lead.city;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <aside className="flex h-full flex-col bg-[color:var(--panel)] text-[color:var(--ink)]">
      <div className="border-b border-[color:var(--line)] px-5 pt-5 pb-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[color:var(--ink)]">
              Reach Map
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted-ink)]">
              See where your outreach leads are coming from.
            </p>
          </div>
          <AddLeadDialog />
        </div>

        <div className="grid gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[color:var(--muted-ink)]" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search name, company, city…"
              className="border-[color:var(--line)] bg-white/70 pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as LeadStatus | "all")
            }
          >
            <SelectTrigger className="w-full border-[color:var(--line)] bg-white/70">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="rounded-md bg-[#0e8a7d]/12 text-[#0b5f56]"
          >
            {filteredLeads.length} on map
          </Badge>
          {topCities.map(([city, count]) => (
            <Badge
              key={city}
              variant="outline"
              className="rounded-md border-[color:var(--line)] text-[color:var(--muted-ink)]"
            >
              {city} · {count}
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <ul className="divide-y divide-[color:var(--line)]">
          {filteredLeads.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-[color:var(--muted-ink)]">
              No leads match this filter. Add one or clear the search.
            </li>
          ) : (
            filteredLeads.map((lead) => {
              const active = lead.id === selectedId;
              return (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(lead.id)}
                    className={cn(
                      "flex w-full flex-col gap-1 px-5 py-3.5 text-left transition-colors",
                      active
                        ? "bg-[#0e8a7d]/10"
                        : "hover:bg-black/[0.03]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{lead.name}</span>
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[lead.status] }}
                        aria-hidden
                      />
                    </div>
                    <span className="text-sm text-[color:var(--muted-ink)]">
                      {lead.company}
                    </span>
                    <span className="text-xs text-[color:var(--muted-ink)]">
                      {lead.city}
                      {lead.region ? `, ${lead.region}` : ""} · {lead.country}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </ScrollArea>

      {selected ? (
        <>
          <Separator className="bg-[color:var(--line)]" />
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 px-5 py-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{selected.name}</p>
                <p className="text-sm text-[color:var(--muted-ink)]">
                  {selected.company}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
                onClick={() => removeLead(selected.id)}
                aria-label="Remove lead"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <p className="mb-3 text-xs text-[color:var(--muted-ink)]">
              {selected.channel} ·{" "}
              {new Date(selected.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            {selected.notes ? (
              <p className="mb-3 text-sm leading-relaxed text-[color:var(--ink)]/90">
                {selected.notes}
              </p>
            ) : null}
            <div className="grid gap-2">
              <p className="text-xs font-medium tracking-wide text-[color:var(--muted-ink)] uppercase">
                Status
              </p>
              <Select
                value={selected.status}
                onValueChange={(value) =>
                  updateStatus(selected.id, value as LeadStatus)
                }
              >
                <SelectTrigger className="w-full border-[color:var(--line)] bg-white/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      ) : null}

      <div className="border-t border-[color:var(--line)] px-5 py-3">
        <button
          type="button"
          onClick={resetToSeed}
          className="text-xs text-[color:var(--muted-ink)] underline-offset-2 hover:underline"
        >
          Reset to sample leads
        </button>
      </div>
    </aside>
  );
}
