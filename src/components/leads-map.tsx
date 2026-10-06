"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  type MapViewport,
} from "@/components/ui/map";
import { useLeads } from "@/lib/leads-store";
import { STATUS_COLORS, type Lead } from "@/lib/types";

function viewportForLeads(
  leads: Lead[],
  selectedId: string | null,
): MapViewport {
  if (selectedId) {
    const selected = leads.find((lead) => lead.id === selectedId);
    if (selected) {
      return {
        center: [selected.lng, selected.lat],
        zoom: 6,
        bearing: 0,
        pitch: 0,
      };
    }
  }

  if (leads.length === 0) {
    return { center: [-40, 30], zoom: 2, bearing: 0, pitch: 0 };
  }

  if (leads.length === 1) {
    return {
      center: [leads[0].lng, leads[0].lat],
      zoom: 5,
      bearing: 0,
      pitch: 0,
    };
  }

  const lngs = leads.map((lead) => lead.lng);
  const lats = leads.map((lead) => lead.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const span = Math.max(maxLng - minLng, maxLat - minLat);
  const zoom = span > 100 ? 2 : span > 40 ? 3 : span > 15 ? 4 : 5;

  return {
    center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
    zoom,
    bearing: 0,
    pitch: 0,
  };
}

export function LeadsMap({ filteredLeads }: { filteredLeads: Lead[] }) {
  const { selectedId, setSelectedId } = useLeads();
  const [viewport, setViewport] = useState<MapViewport>(() =>
    viewportForLeads(filteredLeads, selectedId),
  );

  const leadKey = useMemo(
    () => filteredLeads.map((lead) => lead.id).join("|"),
    [filteredLeads],
  );

  useEffect(() => {
    setViewport(viewportForLeads(filteredLeads, selectedId));
    // Refit when selection or the filtered set identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, leadKey]);

  return (
    <div className="relative h-full w-full">
      <Map
        theme="light"
        viewport={viewport}
        onViewportChange={setViewport}
        className="h-full w-full rounded-none"
      >
        <MapControls position="bottom-right" showZoom showCompass={false} />
        {filteredLeads.map((lead) => {
          const active = lead.id === selectedId;
          const color = STATUS_COLORS[lead.status];
          return (
            <MapMarker
              key={lead.id}
              longitude={lead.lng}
              latitude={lead.lat}
              onClick={() => setSelectedId(lead.id)}
            >
              <MarkerContent>
                <span
                  className="block rounded-full border-2 border-white shadow-md transition-transform"
                  style={{
                    width: active ? 18 : 14,
                    height: active ? 18 : 14,
                    backgroundColor: color,
                    transform: active ? "scale(1.15)" : undefined,
                  }}
                  aria-hidden
                />
              </MarkerContent>
              <MarkerPopup className="min-w-[170px] rounded-md border border-[color:var(--line)] bg-white p-3 shadow-md">
                <p className="font-semibold text-[#123047]">{lead.name}</p>
                <p className="text-sm text-[#4a6270]">{lead.company}</p>
                <p className="mt-1 text-xs text-[#6b7f8a]">
                  {lead.city}
                  {lead.region ? `, ${lead.region}` : ""} · {lead.country}
                </p>
              </MarkerPopup>
            </MapMarker>
          );
        })}
      </Map>
    </div>
  );
}
