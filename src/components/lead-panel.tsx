"use client";

import { Search, Trash2 } from "lucide-react";
import { AddLeadDialog } from "@/components/add-lead-dialog";
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

  return (
    <div className="flex h-full min-h-0 flex-col text-[#1d1d1f]">
      <div className="shrink-0 px-4 pt-4 pb-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.01em]">Leads</p>
            <p className="text-[12px] text-[#6e6e73]">
              {filteredLeads.length} on the map
            </p>
          </div>
          <AddLeadDialog />
        </div>

        <div className="grid gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#86868b]" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search"
              className="h-9 rounded-xl border-transparent bg-[#787880]/12 pl-9 text-[15px] shadow-none placeholder:text-[#86868b] focus-visible:border-[#0071e3]/40 focus-visible:ring-[#0071e3]/20"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as LeadStatus | "all")
            }
          >
            <SelectTrigger className="h-9 w-full rounded-xl border-transparent bg-[#787880]/12 text-[14px] shadow-none">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All statuses</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2">
        <ul className="space-y-1 px-1 pb-2">
          {filteredLeads.length === 0 ? (
            <li className="px-3 py-12 text-center text-[13px] text-[#6e6e73]">
              No leads match. Try another search or add one.
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
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      active
                        ? "bg-[#0071e3] text-white"
                        : "hover:bg-[#787880]/10",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        active && "ring-2 ring-white/70",
                      )}
                      style={{ backgroundColor: STATUS_COLORS[lead.status] }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium tracking-[-0.01em]">
                        {lead.name}
                      </span>
                      <span
                        className={cn(
                          "block truncate text-[12px]",
                          active ? "text-white/75" : "text-[#6e6e73]",
                        )}
                      >
                        {lead.company} · {lead.city}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </ScrollArea>

      {selected ? (
        <div className="shrink-0 border-t border-black/5 px-4 py-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-[-0.01em]">
                {selected.name}
              </p>
              <p className="truncate text-[13px] text-[#6e6e73]">
                {selected.company}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-[#ff3b30] hover:bg-[#ff3b30]/10 hover:text-[#ff3b30]"
              onClick={() => removeLead(selected.id)}
              aria-label="Remove lead"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <p className="mb-2 text-[12px] text-[#86868b]">
            {selected.channel} ·{" "}
            {new Date(selected.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {selected.notes ? (
            <p className="mb-3 text-[13px] leading-relaxed text-[#1d1d1f]/90">
              {selected.notes}
            </p>
          ) : null}
          <Select
            value={selected.status}
            onValueChange={(value) =>
              updateStatus(selected.id, value as LeadStatus)
            }
          >
            <SelectTrigger className="h-9 w-full rounded-xl border-transparent bg-[#787880]/12 text-[14px] shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="shrink-0 border-t border-black/5 px-4 py-2.5">
        <button
          type="button"
          onClick={resetToSeed}
          className="text-[12px] font-medium text-[#0071e3]"
        >
          Reset to sample leads
        </button>
      </div>
    </div>
  );
}
