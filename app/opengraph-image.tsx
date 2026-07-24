import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          color: "#0A0A0B",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4 }}>
          {site.name.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 1 }}>
          <span>We make brands</span>
          <span style={{ fontStyle: "italic" }}>impossible</span>
          <span>to scroll past.</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 22 }}>
          <div style={{ display: "flex", width: 120, height: 8, background: "#1B32FF" }} />
          <span>Performance · Brand · Content</span>
        </div>
      </div>
    ),
    size,
  );
}
