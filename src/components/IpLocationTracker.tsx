import { useEffect, useState } from "react";

export type IpLocation = {
  ip: string;
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  region?: string;
};

export default function IpLocationTracker({
  onLocated,
}: { onLocated?: (loc: IpLocation) => void } = {}) {
  const [ip, setIp] = useState("");
  const [loc, setLoc] = useState<IpLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loc && onLocated) onLocated(loc);
  }, [loc, onLocated]);

  const track = async (targetIp?: string) => {
    setLoading(true);
    setError(null);
    try {
      const ipOrEmpty = targetIp ?? ip;
      if (!ipOrEmpty) throw new Error("Enter an IP address");
      const res = await fetch(`https://ipapi.co/${ipOrEmpty}/json/`);
      const data = await res.json();
      if (data.error) throw new Error(data.reason || "Lookup failed");

      const location: IpLocation = {
        ip: data.ip,
        lat: data.latitude,
        lon: data.longitude,
        city: data.city,
        country: data.country_name,
        region: data.region,
      };
      setLoc(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        padding: "1rem",
        borderRadius: "0.75rem",
        background: "#f6faf7",
        border: "1px solid #e3efe6",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h3
        style={{
          margin: "0 0 0.75rem 0",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        📍 IP Location Tracker
      </h3>

      <div
        style={{
          display: "flex",
          gap: 0.5,
          marginBottom: 0.75rem,
          flexWrap: "wrap",
        }}
      >
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="e.g. 8.8.8.8"
          style={{
            flex: 1,
            minWidth: 140,
            padding: "0.5rem 0.75rem",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        />
        <button
          onClick={() => track()}
          disabled={loading || !ip}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            background: "#2d6a4f",
            color: "#fff",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
            cursor: loading || !ip ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Looking up…" : "Track"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#b5451b", fontSize: "0.85rem", margin: 0 }}>
          {error}
        </p>
      )}

      {loc && (
        <>
          <div
            style={{
              display: "flex",
              gap: 0.75rem,
              alignItems: "center",
              fontSize: "0.9rem",
              marginBottom: 0.75rem,
            }}
          >
            <span style={{ fontWeight: 600, color: "#2d6a4f" }}>{loc.ip}</span>
            <span>→</span>
            <span>{loc.city}, {loc.country}</span>
            <span style={{ color: "#666" }}>
              ({loc.lat.toFixed(4)}, {loc.lon.toFixed(4)})
            </span>
          </div>
          <iframe
            title="Location map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${loc.lon - 0.5}%2C${loc.lat - 0.5}%2C${loc.lon + 0.5}%2C${loc.lat + 0.5}&layer=mapnik`}
            style={{ width: "100%", height: "200px", border: "1px solid #ddd", borderRadius: "0.5rem" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </>
      )}
    </section>
  );
}
