import { ImageResponse } from "next/og";

export const alt = "Aurea Nairobi — refined fashion designed for everyday living";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f4efe7",
          color: "#1c1a17",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          letterSpacing: "0.04em",
          width: "100%",
        }}
      >
        <div style={{ color: "#a67c3d", fontSize: 24, letterSpacing: "0.35em", textTransform: "uppercase" }}>
          Nairobi, Kenya
        </div>
        <div style={{ fontFamily: "serif", fontSize: 112, marginTop: 24 }}>Aurea</div>
        <div style={{ fontSize: 28, marginTop: 18 }}>Refined fashion for everyday living.</div>
      </div>
    ),
    size,
  );
}
