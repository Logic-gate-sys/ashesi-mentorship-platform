'use client'

/**
 * Refined AshesiLogo Component
 * @param {string} className - Tailwind classes for size and color (e.g., "w-32 h-auto text-maroon")
 * @param {string} textColor - Optional override for the university name color
 */
export const AshesiLogo = ({ 
  className = "max-w-fit h-fit", 
  textColor = "white" 
}) => {
  return (
    <svg
      viewBox="0 0 500 450"
      // Setting width/height to 100% makes it respect the parent container's size
      width="40%"
      height="40%"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill="currentColor">
        {/* Roof */}
        <path d="M250 50 L100 150 L140 150 L250 80 L360 150 L400 150 Z" />
        {/* Eye/Center Sun */}
        <circle cx="250" cy="140" r="25" />  
        {/* Curved Seat/Bar */}
        <path d="M150 180 Q250 250 350 180 L350 220 Q250 290 150 220 Z" />
        {/* Pillars - Refined spacing */}
        <rect x="202" y="240" width="22" height="80" rx="4" />
        <rect x="239" y="250" width="22" height="70" rx="4" />
        <rect x="276" y="240" width="22" height="80" rx="4" />
        {/* Base */}
        <path d="M180 320 L320 320 Q320 340 250 340 Q180 340 180 320 Z" />
      </g>

      {/* Typography Section */}
      <g 
        fill={textColor}
        style={{ 
          fontFamily: "serif", // Fallback to system serif for better cross-platform look
          fontWeight: '400',
          textAnchor: 'middle',
          userSelect: 'none' // Prevents accidental text highlighting on the logo
        }}
      >
        <text x="250" y="395" fontSize="40" letterSpacing="2">ASHESI</text>
        <text x="250" y="445" fontSize="40" letterSpacing="2">UNIVERSITY</text>
      </g>
    </svg>
  );
};

export default AshesiLogo;