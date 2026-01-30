import React from "react";

interface MarqueeProps {
  text: string;
  speed?: number;
  height?: number;
  color?: string;
  blinkSpeed?: number;
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  speed = 15,
  height = 60,
  color = "#fff",
  blinkSpeed = 1.2,
}) => {
  const gap = "   ⚠️   ";
  const content = `${text}${gap}`;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
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
      <style>
        {`
          @keyframes marquee-smooth {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-30%);
            }
          }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: `marquee-smooth ${speed}s linear infinite`,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            <span
              style={{
                fontSize: height * 0.5,
                lineHeight: `${height}px`,
              }}
            >
              {content}
            </span>
          </div>
        ))}
      </div>


    </div>
  );
};

export default Marquee;
