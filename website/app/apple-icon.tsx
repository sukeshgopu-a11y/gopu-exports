import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#F5F0E6",
          borderRadius: 36,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* GE letters */}
        <div
          style={{
            display: "flex",
            gap: 4,
            fontFamily: "Arial Black, sans-serif",
            fontWeight: 900,
            fontSize: 72,
            color: "#1C3A2A",
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          GE
        </div>
        {/* Gold divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#C49A2A",
            borderRadius: 2,
            margin: "6px 0",
          }}
        />
        {/* EXPORTS label */}
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 5,
            color: "#1C6B3A",
          }}
        >
          EXPORTS
        </div>
      </div>
    ),
    { ...size }
  );
}
