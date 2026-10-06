"use client";

import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLeads } from "@/lib/leads-store";
import { STATUS_COLORS, type Lead } from "@/lib/types";

function FitBounds({ leads, selectedId }: { leads: Lead[]; selectedId: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const selected = leads.find((l) => l.id === selectedId);
      if (selected) {
        map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 6), {
          duration: 0.75,
        });
      }
      return;
    }

    if (leads.length === 0) {
      map.setView([30, -40], 2);
      return;
    }

    if (leads.length === 1) {
      map.setView([leads[0].lat, leads[0].lng], 5);
      return;
    }

    const lats = leads.map((l) => l.lat);
    const lngs = leads.map((l) => l.lng);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [48, 48], maxZoom: 5, animate: true },
    );
  }, [leads, map, selectedId]);

  return null;
}

export function LeadsMap({ filteredLeads }: { filteredLeads: Lead[] }) {
  const { selectedId, setSelectedId } = useLeads();

  const center = useMemo<[number, number]>(() => [30, -40], []);

  return (
    <MapContainer
      center={center}
      zoom={2}
      className="h-full w-full"
      zoomControl={false}
      attributionControl
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <FitBounds leads={filteredLeads} selectedId={selectedId} />
      {filteredLeads.map((lead) => {
        const active = lead.id === selectedId;
        const color = STATUS_COLORS[lead.status];
        return (
          <CircleMarker
            key={lead.id}
            center={[lead.lat, lead.lng]}
            radius={active ? 11 : 8}
            pathOptions={{
              color: "#0f1c24",
              weight: active ? 2.5 : 1.5,
              fillColor: color,
              fillOpacity: active ? 1 : 0.85,
            }}
            eventHandlers={{
              click: () => setSelectedId(lead.id),
            }}
          >
            <Popup>
              <div className="min-w-[160px] font-sans text-sm">
                <p className="font-semibold text-[#123047]">{lead.name}</p>
                <p className="text-[#4a6270]">{lead.company}</p>
                <p className="mt-1 text-xs text-[#6b7f8a]">
                  {lead.city}
                  {lead.region ? `, ${lead.region}` : ""} · {lead.country}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
