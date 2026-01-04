"use client";

export function OpeningAnimation() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0F172A] z-50 eye-animation-container">
      <div className="relative w-64 h-36">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 120 70"
          preserveAspectRatio="none"
        >
          {/* Upper Eyelid */}
          <defs>
            <linearGradient id="upperLidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#1F4FD8'}} />
              <stop offset="100%" style={{stopColor: '#38BDF8'}} />
            </linearGradient>
          </defs>
          <path
            d="M 0,35 C 30,0 90,0 120,35"
            stroke="url(#upperLidGradient)"
            strokeWidth="3"
            fill="none"
            className="eye-lid-v2 top-lid-v2"
          />
          
          {/* Lower Eyelid */}
          <defs>
            <linearGradient id="lowerLidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#2EC4B6'}} />
              <stop offset="100%" style={{stopColor: '#6BCF9D'}} />
            </linearGradient>
          </defs>
          <path
            d="M 0,35 C 30,70 90,70 120,35"
            stroke="url(#lowerLidGradient)"
            strokeWidth="3"
            fill="none"
            className="eye-lid-v2 bottom-lid-v2"
          />
        </svg>

        {/* Iris and Pupil */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="iris-container">
            <div className="iris">
              <div className="pupil-v2">
                  <div className="app-logo-container">
                      <svg className="app-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z" stroke="#A7C7E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#A7C7E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  </div>
              </div>
              <div className="light-ripple"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
