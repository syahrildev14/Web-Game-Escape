import React from "react";

interface MarqueeProps {
  text: string;
  speed?: number;
  height?: number;
  color?: string;
  blinkSpeed?: number; // kecepatan kedip (detik)
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  speed = 15,
  height = 60,
  color = "#fff",
  blinkSpeed = 1.2,
}) => {
  const gap = "   ⚠️   ";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "50%",
        height: `${height}px`,
        overflow: "hidden",
        backgroundColor: "rgba(220, 0, 0, 0.6)",
        color,
        display: "flex",
        alignItems: "center",
        zIndex: 20,
        animation: `blink ${blinkSpeed}s infinite`,
      }}
    >
      {/* STYLE ANIMASI */}
      <style>
        {`
          @keyframes marquee-tsx {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes blink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.4;
            }
          }
        `}
      </style>

      {/* TRACK */}
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: `marquee-tsx ${speed}s linear infinite`,
        }}
      >
        <span
          style={{
            fontSize: height * 0.5,
            lineHeight: `${height}px`,
            paddingRight: "40px",
          }}
        >
          {text}
          {gap}
        </span>

        <span
          style={{
            fontSize: height * 0.5,
            lineHeight: `${height}px`,
          }}
        >
          {text}
          {gap}
        </span>
      </div>
    </div>
  );
};

export default Marquee;
