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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, leadKey]);

  return (
    <Map
      theme="light"
      viewport={viewport}
      onViewportChange={setViewport}
      className="h-full w-full rounded-none"
    >
      <MapControls position="bottom-left" showZoom showCompass={false} />
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
                className="block rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-transform"
                style={{
                  width: active ? 18 : 14,
                  height: active ? 18 : 14,
                  backgroundColor: color,
                  transform: active ? "scale(1.12)" : undefined,
                }}
                aria-hidden
              />
            </MarkerContent>
            <MarkerPopup className="apple-material-soft min-w-[180px] rounded-2xl p-3.5">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">
                {lead.name}
              </p>
              <p className="text-[13px] text-[#6e6e73]">{lead.company}</p>
              <p className="mt-1 text-[12px] text-[#86868b]">
                {lead.city}
                {lead.region ? `, ${lead.region}` : ""} · {lead.country}
              </p>
            </MarkerPopup>
          </MapMarker>
        );
      })}
    </Map>
  );
}
