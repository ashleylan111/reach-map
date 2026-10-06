"use client";

import { useState } from "react";
import { Loader2, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { geocodePlace } from "@/lib/geocode";
import { useLeads } from "@/lib/leads-store";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

const CHANNELS = ["Cold email", "LinkedIn", "Referral", "Event", "Inbound", "Other"];

type FormState = {
  name: string;
  company: string;
  location: string;
  status: LeadStatus;
  channel: string;
  notes: string;
};

const emptyForm: FormState = {
  name: "",
  company: "",
  location: "",
  status: "new",
  channel: "Cold email",
  notes: "",
};

const fieldClass =
  "h-10 rounded-xl border-transparent bg-[#787880]/12 text-[15px] shadow-none focus-visible:border-[#0071e3]/40 focus-visible:ring-[#0071e3]/20";

export function AddLeadDialog() {
  const { addLead } = useLeads();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.company.trim() || !form.location.trim()) {
      setError("Name, company, and location are required.");
      return;
    }

    setSubmitting(true);
    try {
      const place = await geocodePlace(form.location);
      if (!place) {
        setError("No match for that location. Try “Austin, TX” or “Berlin, Germany”.");
        return;
      }

      addLead({
        name: form.name.trim(),
        company: form.company.trim(),
        city: place.city,
        region: place.region,
        country: place.country,
        lat: place.lat,
        lng: place.lng,
        status: form.status,
        channel: form.channel,
        notes: form.notes.trim(),
      });

      setForm(emptyForm);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setError(null);
          setForm(emptyForm);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-8 gap-1 rounded-full bg-[#0071e3] px-3 text-[13px] font-semibold text-white shadow-none hover:bg-[#0077ed]">
          <Plus className="size-3.5" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-[20px] border-black/5 p-0 shadow-2xl sm:max-w-[400px]">
        <DialogHeader className="border-b border-black/5 px-5 py-4 text-left">
          <DialogTitle className="text-[19px] font-semibold tracking-[-0.02em]">
            New Lead
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#6e6e73]">
            Pin someone by city. We’ll place them on the map.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 px-5 py-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-[12px] font-medium text-[#6e6e73]">
              Name
            </Label>
            <Input
              id="name"
              className={fieldClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jordan Hale"
              autoComplete="name"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="company" className="text-[12px] font-medium text-[#6e6e73]">
              Company
            </Label>
            <Input
              id="company"
              className={fieldClass}
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="Harbor & Co"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="location" className="text-[12px] font-medium text-[#6e6e73]">
              Location
            </Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#86868b]" />
              <Input
                id="location"
                className={`${fieldClass} pl-9`}
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Austin, TX or London, UK"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium text-[#6e6e73]">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, status: value as LeadStatus }))
                }
              >
                <SelectTrigger className={`${fieldClass} w-full`}>
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
            <div className="grid gap-1.5">
              <Label className="text-[12px] font-medium text-[#6e6e73]">Channel</Label>
              <Select
                value={form.channel}
                onValueChange={(value) => setForm((f) => ({ ...f, channel: value }))}
              >
                <SelectTrigger className={`${fieldClass} w-full`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="notes" className="text-[12px] font-medium text-[#6e6e73]">
              Notes
            </Label>
            <Textarea
              id="notes"
              className="min-h-[84px] rounded-xl border-transparent bg-[#787880]/12 text-[15px] shadow-none focus-visible:border-[#0071e3]/40 focus-visible:ring-[#0071e3]/20"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Next step or context…"
              rows={3}
            />
          </div>
          {error ? (
            <p className="rounded-xl bg-[#ff3b30]/10 px-3 py-2 text-[13px] text-[#ff3b30]">
              {error}
            </p>
          ) : null}
          <DialogFooter className="gap-2 border-t border-black/5 pt-4 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-full px-4 text-[14px] font-semibold text-[#0071e3] hover:bg-[#0071e3]/10"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 rounded-full bg-[#0071e3] px-4 text-[14px] font-semibold text-white shadow-none hover:bg-[#0077ed]"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Finding…
                </>
              ) : (
                "Add to Map"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
