import { ImageResponse } from "next/og";
import { site, hero } from "@/lib/content";

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
          color: "#12131A",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 36,
              height: 36,
              borderRadius: 999,
              background: "#3B1EFF",
            }}
          />
          <span style={{ fontSize: 30, fontWeight: 600 }}>{site.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05 }}>
          <span style={{ color: "#3B1EFF", fontWeight: 600 }}>
            {hero.headline.accent}
          </span>
          <span style={{ fontWeight: 600 }}>{hero.headline.rest}</span>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#5A5B63" }}>
          <span>SEO</span>
          <span>Paid advertising</span>
          <span>Web design</span>
          <span>Conversion</span>
        </div>
      </div>
    ),
    size,
  );
}
