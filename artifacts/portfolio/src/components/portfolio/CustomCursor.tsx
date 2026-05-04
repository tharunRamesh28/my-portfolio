import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button"
      );
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[100] transition-transform duration-100 ease-out flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div 
        className={`w-4 h-4 rounded-full bg-primary transition-all duration-300 ${
          isPointer ? "scale-150 opacity-50" : "scale-100 opacity-80"
        }`}
        style={{
          boxShadow: "0 0 15px 5px rgba(0, 229, 255, 0.6)",
        }}
      />
    </div>
  );
}
