import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BackGround({ children }) {
  return (
    <>
      <div className="min-h-screen w-full bg-[#fefcff] relative">
        {/* Dreamy Sky Pink Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
          }}
        />
        {/* Your Content/Components */}
        <div className="relative z-10">{children}</div>
      </div>
      
    </>
  );
}
