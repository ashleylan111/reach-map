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
        <Button className="gap-1.5 bg-[#0e8a7d] text-white hover:bg-[#0b7368]">
          <Plus className="size-4" />
          Add lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-display)] text-xl">
            Pin a new lead
          </DialogTitle>
          <DialogDescription>
            Drop a contact on the map by city. Location lookup uses OpenStreetMap.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Contact name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jordan Hale"
              autoComplete="name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="Harbor & Co"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                className="pl-9"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Austin, TX or London, UK"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, status: value as LeadStatus }))
                }
              >
                <SelectTrigger className="w-full">
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
            <div className="grid gap-2">
              <Label>Channel</Label>
              <Select
                value={form.channel}
                onValueChange={(value) => setForm((f) => ({ ...f, channel: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Next step, context, or who introduced you…"
              rows={3}
            />
          </div>
          {error ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0e8a7d] text-white hover:bg-[#0b7368]"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Finding place…
                </>
              ) : (
                "Add to map"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
