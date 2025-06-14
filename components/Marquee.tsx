import React, { useRef, useEffect, useState } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // pixels per second
}

export default function Marquee({ children, speed = 100 }: MarqueeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    function updateWidth() {
      if (contentRef.current) {
        setContentWidth(contentRef.current.scrollWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const duration = contentWidth > 0 ? contentWidth / speed : 0;

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        background: "#111827",
        color: "white",
        whiteSpace: "nowrap",
        padding: 0,
        margin: 0,
      }}
    >
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          willChange: "transform",
          animation: contentWidth
            ? `marquee-x ${duration}s linear infinite`
            : "none",
        }}
      >
        <div
          ref={contentRef}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            verticalAlign: "top",
          }}
        >
          {children}
        </div>
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            verticalAlign: "top",
          }}
        >
          {children}
        </div>
      </div>
      <style>{`
        @keyframes marquee-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${contentWidth}px); }
        }
      `}</style>
    </div>
  );
} 