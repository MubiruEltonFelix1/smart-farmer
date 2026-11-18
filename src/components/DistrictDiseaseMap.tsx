import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { mockAuthService } from "../auth/mockAuthService";
import { DEMO_OUTBREAKS } from "../data/seedData";
import type { Locale } from "../types";
import {
  IconWarning, IconMapPin, IconUsers, IconLeaf,
} from "../components/Icons";

/* ─────────────────────────────────────────────────────────────
   Approximate centroids for Ugandan districts / sub-counties
   appearing in the demo data. Used when a record only names a
   district (outbreaks / scans) rather than carrying GPS coords.
   ───────────────────────────────────────────────────────────── */
const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  Mbarara:        { lat: -0.6078, lng: 30.6548 },
  Bushenyi:       { lat: -0.5417, lng: 30.1875 },
  Kiruhura:       { lat: -0.1667, lng: 30.8333 },
  Kakiika:        { lat: -0.6017, lng: 30.6545 },
  Biharwe:        { lat: -0.6500, lng: 30.6200 },
  Nyamitanga:     { lat: -0.6200, lng: 30.6600 },
  Rubindi:        { lat: -0.5800, lng: 30.6800 },
  "Bushenyi-Ishaka": { lat: -0.5417, lng: 30.1875 },
};

type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  type: "farmer" | "outbreak" | "scan";
  title: string;
  subtitle: string;
  severity: "High" | "Moderate" | "Low" | "Healthy" | "info" | "watch" | "attention";
  disease?: string;
  district?: string;
  popupContent: React.ReactNode;
};

function markerColor(severity: MapMarker["severity"]): string {
  switch (severity) {
    case "High":
    case "attention": return "#b5451b";
    case "Moderate":
    case "watch":     return "#c8a94e";
    case "Low":
    case "info":      return "#0e7490";
    case "Healthy":   return "#2d6a4f";
  }
}

function severityLabel(locale: Locale, sev: MapMarker["severity"]): string {
  const map: Record<string, Record<string, string>> = {
    en: { High: "High", Moderate: "Moderate", Low: "Low", Healthy: "Healthy", info: "Informational", watch: "Watch", attention: "High Attention" },
    lg: { High: "Gumu", Moderate: "Ebyonna", Low: "Bimu", Healthy: "Bulungi", info: "Obusinga", watch: "Okutambula", attention: "Kuggulika" },
    nyn: { High: "Kirungi", Moderate: "Kirungi", Low: "Birungi", Healthy: "Bulungi", info: "Ekiko", watch: "Okwirirana", attention: "Kwirebura" },
  };
  return map[locale]?.[sev] ?? sev;
}

export default function DistrictDiseaseMap({ onLocated }: { onLocated?: (district: string | null) => void } = {}) {
  const { user, profile, locale } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [viewerDistrict, setViewerDistrict] = useState<string | null>(null);
  const [viewerCoords, setViewerCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    district: "",
    disease: "",
    severity: "" as string,
    type: "" as string,
  });

  /* ─── 1. Auto-detect viewer's district via IP (the IP tracker's real job) ─── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.error || cancelled) return;
        const district = data.region || data.city || null;
        const coords = data.latitude && data.longitude
          ? { lat: data.latitude, lng: data.longitude }
          : null;
        if (!cancelled) {
          setViewerDistrict(district);
          setViewerCoords(coords);
          if (onLocated) onLocated(district);
        }
      } catch {
        /* IP lookup is optional — fall back to default centre. */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [onLocated]);

  /* ─── 2. Build markers from farmers + outbreaks + user scans ─── */
  const buildMarkers = useCallback(async () => {
    const built: MapMarker[] = [];

    /* Farmer markers — from the logged-in profile's farms with GPS consent. */
    const farms = profile?.farms?.filter(f => f.gpsConsent && f.gpsLat != null && f.gpsLng != null) ?? [];
    for (const farm of farms) {
      built.push({
        id: `farm-${farm.id}`,
        lat: farm.gpsLat!,
        lng: farm.gpsLng!,
        type: "farmer",
        title: farm.name,
        subtitle: `${farm.district}, ${farm.subCounty}`,
        severity: "Healthy",
        district: farm.district,
        popupContent: (
          <div style={{ minWidth: "160px", fontSize: "0.85rem" }}>
            <div style={{ fontWeight: 700, color: "#2d6a4f", marginBottom: 4 }}>{farm.name}</div>
            <div style={{ color: "#666", fontSize: "0.8rem", marginBottom: 6 }}>
              {farm.district} · {farm.subCounty}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#333" }}>
              <IconLeaf size={10} style={{ verticalAlign: "middle", marginRight: 4 }} /> {farm.mainCrops.join(", ")}
            </div>
          </div>
        ),
      });
    }

    /* Outbreak markers — from DEMO_OUTBREAKS, positioned by district/sub-county centroid. */
    for (const ob of DEMO_OUTBREAKS) {
      const coord = DISTRICT_COORDS[ob.subCounty ?? ob.district] ?? DISTRICT_COORDS[ob.district];
      if (!coord) continue;
      built.push({
        id: `outbreak-${ob.id}`,
        lat: coord.lat,
        lng: coord.lng,
        type: "outbreak",
        title: ob.diseaseName,
        subtitle: `${ob.cropName} · ${ob.locationLabel}`,
        severity: ob.alertLevel,
        disease: ob.diseaseName,
        district: ob.district,
        popupContent: (
          <div style={{ minWidth: "200px", fontSize: "0.85rem" }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {ob.alertLevel === "attention" ? <IconWarning size={11} style={{ verticalAlign: "middle", marginRight: 4, color: "#b5451b" }} /> : null}
              {ob.diseaseName}
            </div>
            <div style={{ color: "#666", fontSize: "0.8rem", marginBottom: 4 }}>
              {ob.cropName} · {ob.locationLabel}
            </div>
            <div style={{ fontSize: "0.8rem", marginBottom: 4 }}>
              <IconUsers size={10} style={{ verticalAlign: "middle", marginRight: 4 }} /> {ob.reportCount} reported cases
            </div>
            <div style={{ fontSize: "0.75rem", color: "#666" }}>
              Trend: {severityLabel(locale, ob.trendDirection as any)} · Last reported {ob.windowDays} days
            </div>
          </div>
        ),
      });
    }

    /* Scan markers — from the logged-in user's scan history, matched to a district centroid. */
    if (user?.id) {
      const scans = await mockAuthService.getScans(user.id);
      for (const scan of scans.filter(s => s.contributesToOutbreak && s.location)) {
        const key = Object.keys(DISTRICT_COORDS).find(k => scan.location!.toLowerCase().includes(k.toLowerCase()));
        const coord = key ? DISTRICT_COORDS[key] : null;
        if (!coord) continue;
        const sev = (scan.severity ?? "Healthy") as MapMarker["severity"];
        built.push({
          id: `scan-${scan.id}`,
          lat: coord.lat,
          lng: coord.lng,
          type: "scan",
          title: scan.disease ?? "Crop scan",
          subtitle: `${scan.cropType} · ${scan.location}`,
          severity: sev,
          disease: scan.disease,
          district: key,
          popupContent: (
            <div style={{ minWidth: "180px", fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{scan.disease ?? "Crop scan"}</div>
              <div style={{ color: "#666", fontSize: "0.8rem", marginBottom: 4 }}>
                {scan.cropType} · {scan.location}
              </div>
              <div style={{ fontSize: "0.8rem", marginBottom: 4 }}>
                Severity: {severityLabel(locale, sev)}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666" }}>
                {new Date(scan.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </div>
            </div>
          ),
        });
      }
    }

    setMarkers(built);
  }, [user, profile, locale]);

  useEffect(() => {
    buildMarkers();
  }, [buildMarkers]);

  /* ─── 3. Initialise Leaflet map once CDN script is ready ─── */
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const initMap = () => {
      const L = (window as any).L;
      if (!L) return;
      const start = viewerCoords ?? { lat: -0.6078, lng: 30.6548 };
      const map = L.map(mapRef.current, { center: [start.lat, start.lng], zoom: 9 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);
      mapInstance.current = map;
    };
    initMap();
  }, [mapRef.current, viewerCoords]);

  /* ─── 4. Render markers on map ─── */
  useEffect(() => {
    const L = (window as any).L;
    const map = mapInstance.current;
    if (!L || !map) return;

    /* Clear previous layers. */
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) return;
      map.removeLayer(layer);
    });

    const filtered = markers.filter(m => {
      if (filters.district && m.district !== filters.district) return false;
      if (filters.disease && (m.disease ?? "").toLowerCase() !== filters.disease.toLowerCase()) return false;
      if (filters.type && m.type !== filters.type) return false;
      if (filters.severity && m.severity !== filters.severity) return false;
      return true;
    });

    for (const m of filtered) {
      const color = markerColor(m.severity);
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: m.type === "farmer" ? 6 : 9,
        color: m.type === "farmer" ? "#2d6a4f" : color,
        fillColor: color,
        fillOpacity: m.type === "farmer" ? 0.6 : 0.8,
        weight: 2,
      }).addTo(map);
      marker.bindPopup(m.popupContent as any, { maxWidth: 220 });
    }

    /* If viewer's coords are known, add a small marker for them. */
    if (viewerCoords && viewerDistrict) {
      const you = L.circleMarker([viewerCoords.lat, viewerCoords.lng], {
        radius: 8, color: "#2d6a4f", fillColor: "#fff", fillOpacity: 0.9, weight: 3,
      }).addTo(map);
      you.bindPopup(`You are likely near ${viewerDistrict}`, { maxWidth: 180 });
      map.setView([viewerCoords.lat, viewerCoords.lng], 10);
    } else if (filtered.length > 0) {
      const first = filtered[0];
      map.setView([first.lat, first.lng], 10);
    }
  }, [markers, filters, viewerCoords, viewerDistrict]);

  /* ─── Derived filter options ─── */
  const districts = useMemo(() => [...new Set(markers.map(m => m.district).filter(Boolean))], [markers]);
  const diseases = useMemo(() => [...new Set(markers.map(m => m.disease).filter(Boolean))], [markers]);

  return (
    <section
      style={{
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconMapPin size={16} style={{ color: "#2d6a4f" }} />
          <h2 style={{ margin: 0, fontSize: "1.15rem", color: "#1e5c3a" }}>District Disease Map</h2>
        </div>
        {viewerDistrict && (
          <span style={{ fontSize: "0.8rem", color: "#666", background: "#eef7f1", padding: "2px 8px", borderRadius: "12px", border: "1px solid #2d6a4f" }}>
            Detected region: {viewerDistrict}
          </span>
        )}
      </div>

      {loading && <p style={{ color: "#666", fontSize: "0.9rem" }}>Locating your region…</p>}

      <div ref={mapRef} style={{ height: "420px", width: "100%", borderRadius: "0.75rem", border: "1px solid #ddd", background: "#eef7f1" }} />

      {/* ─── Filters ─── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={filters.district}
          onChange={e => setFilters({ ...filters, district: e.target.value })}
          style={{ padding: "4px 10px", borderRadius: "0.5rem", border: "1px solid #ccc", fontSize: "0.85rem" }}
        >
          <option value="">{t(locale, "outbreakFilterLocation")}</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filters.disease}
          onChange={e => setFilters({ ...filters, disease: e.target.value })}
          style={{ padding: "4px 10px", borderRadius: "0.5rem", border: "1px solid #ccc", fontSize: "0.85rem" }}
        >
          <option value="">{t(locale, "outbreakFilterCrop")}</option>
          {diseases.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filters.type}
          onChange={e => setFilters({ ...filters, type: e.target.value })}
          style={{ padding: "4px 10px", borderRadius: "0.5rem", border: "1px solid #ccc", fontSize: "0.85rem" }}
        >
          <option value="">{t(locale, "dashRecentScans")}</option>
          <option value="farmer">Farmers</option>
          <option value="outbreak">Outbreaks</option>
          <option value="scan">Recent scans</option>
        </select>
      </div>

      {/* ─── Legend ─── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.8rem", color: "#555" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#b5451b" }} />
          High / Attention
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#c8a94e" }} />
          Moderate / Watch
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#0e7490" }} />
          Low / Info
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#2d6a4f" }} />
          Farmer / Healthy
        </div>
      </div>

      {/* ─── Marker summary list ─── */}
      <div style={{ fontSize: "0.85rem" }}>
        <p style={{ margin: "0 0 6px 0", fontWeight: 600, color: "#1e5c3a" }}>
          {markers.length} location{(markers.length === 1 ? "" : "s")} mapped
          {viewerDistrict ? ` · centred on your detected region ({viewerDistrict})` : ""}
        </p>
      </div>
    </section>
  );
}

function t(_locale: Locale | undefined, key: string): string {
  const fallback: Record<string, string> = {
    outbreakFilterLocation: "District",
    outbreakFilterCrop: "Disease / Crop",
    dashRecentScans: "Marker type",
  };
  return fallback[key] ?? key;
}
