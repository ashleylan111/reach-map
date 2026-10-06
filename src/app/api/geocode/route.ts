import { NextResponse } from "next/server";

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    region?: string;
    country_code?: string;
    country?: string;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      "User-Agent": "ReachMap/1.0 (outreach lead map demo)",
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Location lookup failed" },
      { status: 502 },
    );
  }

  const data = (await res.json()) as NominatimResult[];
  const hit = data[0];
  if (!hit) {
    return NextResponse.json({ result: null });
  }

  const address = hit.address ?? {};
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    q.split(",")[0]?.trim() ||
    "Unknown";

  return NextResponse.json({
    result: {
      lat: Number(hit.lat),
      lng: Number(hit.lon),
      city,
      region: address.state || address.region || "",
      country: (address.country_code || "").toUpperCase() || "??",
      label: hit.display_name,
    },
  });
}
