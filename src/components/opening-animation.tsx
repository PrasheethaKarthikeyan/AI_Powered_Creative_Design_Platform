"use client";

export function OpeningAnimation() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="relative w-48 h-24">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,25 C 25,0 75,0 100,25"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            fill="none"
            className="eye-lid top-lid"
          />
          <path
            d="M 0,25 C 25,50 75,50 100,25"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            fill="none"
            className="eye-lid bottom-lid"
          />
        </svg>
        <div className="pupil-container">
          <div className="pupil">
            <div className="iris-highlight"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
