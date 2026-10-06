export type LeadStatus =
  | "new"
  | "contacted"
  | "replied"
  | "meeting"
  | "closed";

export type Lead = {
  id: string;
  name: string;
  company: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  status: LeadStatus;
  channel: string;
  notes: string;
  createdAt: string;
};

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "meeting", label: "Meeting" },
  { value: "closed", label: "Closed" },
];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "#34c759",
  contacted: "#007aff",
  replied: "#ff9500",
  meeting: "#af52de",
  closed: "#8e8e93",
};
