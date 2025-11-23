import React from "react";

export default function ShopVerseIllustration({ className = "w-full h-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 900 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ShopVerse illustration"
    >
      {/* Background */}
      <rect width="900" height="600" rx="20" fill="#EAF2FF" />

      <g transform="translate(60,60)">
        {/* Laptop */}
        <rect x="60" y="40" rx="12" width="420" height="230" fill="#FFFFFF" stroke="#BFD7FF" strokeWidth="2" />
        <rect x="80" y="60" rx="8" width="380" height="150" fill="#E3EEFF" />
        <circle cx="120" cy="210" r="6" fill="#0056D2" />
        <rect x="40" y="290" rx="10" width="500" height="20" fill="#C7DBFF" />

        {/* Person 1 */}
        <circle cx="620" cy="110" r="36" fill="#FFD166" />
        <rect x="590" y="160" rx="14" width="60" height="80" fill="#80AFFF" />

        {/* Person 2 */}
        <circle cx="720" cy="80" r="30" fill="#A0C4FF" />
        <rect x="700" y="120" rx="12" width="40" height="70" fill="#80AFFF" />

        {/* Shopping bag */}
        <rect x="620" y="260" rx="12" width="110" height="90" fill="#FFB6B9" />
        <path d="M640 260 q20 -24 50 0" stroke="#FF7B89" strokeWidth="4" fill="none" />

        {/* Decorative shapes */}
        <circle cx="20" cy="20" r="12" fill="#0056D2" opacity="0.9" />
        <circle cx="520" cy="20" r="10" fill="#FFD166" opacity="0.9" />
      </g>
    </svg>
  );
}
