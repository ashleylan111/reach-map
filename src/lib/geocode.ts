export type GeocodeResult = {
  lat: number;
  lng: number;
  city: string;
  region: string;
  country: string;
  label: string;
};

export async function geocodePlace(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`);
  if (!res.ok) {
    throw new Error("Could not look up that location. Try a city and country.");
  }

  const data = (await res.json()) as { result: GeocodeResult | null };
  return data.result;
}
