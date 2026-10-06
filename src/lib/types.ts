export type LeadTag = {
  id: string;
  name: string;
  color: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  tagId: string;
  channel: string;
  notes: string;
  /** When the lead was marked / contacted — editable, defaults to now */
  datedAt: string;
  createdAt: string;
};

export const TAG_COLOR_PRESETS = [
  "#34c759",
  "#007aff",
  "#ff9500",
  "#af52de",
  "#ff3b30",
  "#5ac8fa",
  "#ffcc00",
  "#8e8e93",
] as const;

export const DEFAULT_TAGS: LeadTag[] = [
  { id: "tag-new", name: "New", color: "#34c759" },
  { id: "tag-contacted", name: "Contacted", color: "#007aff" },
  { id: "tag-replied", name: "Replied", color: "#ff9500" },
  { id: "tag-meeting", name: "Meeting", color: "#af52de" },
  { id: "tag-closed", name: "Closed", color: "#8e8e93" },
];

export function tagColor(tags: LeadTag[], tagId: string): string {
  return tags.find((t) => t.id === tagId)?.color ?? "#8e8e93";
}

export function tagName(tags: LeadTag[], tagId: string): string {
  return tags.find((t) => t.id === tagId)?.name ?? "Untagged";
}

/** datetime-local input value from ISO string */
export function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return toDatetimeLocalValue(new Date().toISOString());
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

export function formatLeadDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
