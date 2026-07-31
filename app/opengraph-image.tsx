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
              // Satori has no CSS custom properties, so the brand gradient is
              // written out; keep these in step with globals.css.
              background: "linear-gradient(135deg, #7A4DFF, #3D5AFF)",
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 400,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {site.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05 }}>
          <span style={{ color: "#5B3DF5", fontWeight: 600 }}>
            {hero.headline.accent}
          </span>
          <span style={{ fontWeight: 600 }}>{hero.headline.rest}</span>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#5A5B63" }}>
          {/* Service names exactly as the navigation, mega menu and footer use
              them. This image is the site's social preview, so labels that
              drift here contradict every page it represents. */}
          <span>SEO &amp; GEO</span>
          <span>Google Ads</span>
          <span>Website Design</span>
          <span>Branding</span>
        </div>
      </div>
    ),
    size,
  );
}
