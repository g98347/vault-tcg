export function BabyIcon({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="cute baby girl"
    >
      {/* Hair — warm brown */}
      <ellipse cx="50" cy="24" rx="30" ry="20" fill="#b8895a" />
      <ellipse cx="26" cy="32" rx="11" ry="15" fill="#b8895a" transform="rotate(-18 26 32)" />
      <ellipse cx="74" cy="32" rx="11" ry="15" fill="#b8895a" transform="rotate(18 74 32)" />

      {/* Head */}
      <circle cx="50" cy="54" r="33" fill="#fcd5a2" />

      {/* Ears */}
      <ellipse cx="17" cy="54" rx="6" ry="8" fill="#fcd5a2" />
      <ellipse cx="83" cy="54" rx="6" ry="8" fill="#fcd5a2" />
      <ellipse cx="17" cy="54" rx="3.5" ry="5" fill="#f5b97e" />
      <ellipse cx="83" cy="54" rx="3.5" ry="5" fill="#f5b97e" />

      {/* Eyes — white sclera */}
      <ellipse cx="37" cy="51" rx="7" ry="8" fill="white" />
      <ellipse cx="63" cy="51" rx="7" ry="8" fill="white" />
      {/* Irises — amethyst purple */}
      <circle cx="38" cy="52" r="4.5" fill="#7b3fa0" />
      <circle cx="64" cy="52" r="4.5" fill="#7b3fa0" />
      {/* Pupils */}
      <circle cx="38" cy="52" r="2.5" fill="#2d0a40" />
      <circle cx="64" cy="52" r="2.5" fill="#2d0a40" />
      {/* Catchlights */}
      <circle cx="39.5" cy="50.5" r="1.2" fill="white" />
      <circle cx="65.5" cy="50.5" r="1.2" fill="white" />

      {/* Long eyelashes — upper */}
      <line x1="31" y1="44" x2="29" y2="40" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="34" y1="43" x2="33" y2="39" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="37" y1="43" x2="37" y2="39" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="40" y1="43" x2="41" y2="39" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="43" y1="44" x2="45" y2="40" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="57" y1="44" x2="55" y2="40" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="60" y1="43" x2="59" y2="39" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="63" y1="43" x2="63" y2="39" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="66" y1="43" x2="67" y2="39" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="69" y1="44" x2="71" y2="40" stroke="#5a2d0c" strokeWidth="1.4" strokeLinecap="round" />

      {/* Eyebrows — soft arched */}
      <path d="M 30 41 Q 37 38 44 41" stroke="#a0714f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 56 41 Q 63 38 70 41" stroke="#a0714f" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Rosy cheeks */}
      <ellipse cx="24" cy="61" rx="9" ry="6" fill="#e87aad" opacity="0.35" />
      <ellipse cx="76" cy="61" rx="9" ry="6" fill="#e87aad" opacity="0.35" />

      {/* Nose */}
      <ellipse cx="50" cy="60" rx="4" ry="2.5" fill="#f0aa6a" />
      <circle cx="47.5" cy="60" r="1.5" fill="#e0905a" />
      <circle cx="52.5" cy="60" r="1.5" fill="#e0905a" />

      {/* Big smile */}
      <path d="M 38 68 Q 50 80 62 68" stroke="#c0785a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="37.5" cy="67" r="1.5" fill="#f0aa6a" opacity="0.6" />
      <circle cx="62.5" cy="67" r="1.5" fill="#f0aa6a" opacity="0.6" />

      {/* Body / onesie — amethyst purple */}
      <ellipse cx="50" cy="105" rx="26" ry="18" fill="#9b59b6" />
      <path d="M 35 90 Q 50 98 65 90" stroke="#7d3c98" strokeWidth="2" fill="none" />
      <circle cx="50" cy="114" r="2.2" fill="#7d3c98" />

      {/* Big bow on top of head — amethyst */}
      {/* Left loop */}
      <ellipse cx="38" cy="16" rx="11" ry="7" fill="#9b59b6" transform="rotate(-25 38 16)" />
      <ellipse cx="38" cy="16" rx="7" ry="4" fill="#b07ec8" transform="rotate(-25 38 16)" />
      {/* Right loop */}
      <ellipse cx="62" cy="16" rx="11" ry="7" fill="#9b59b6" transform="rotate(25 62 16)" />
      <ellipse cx="62" cy="16" rx="7" ry="4" fill="#b07ec8" transform="rotate(25 62 16)" />
      {/* Bow center knot */}
      <ellipse cx="50" cy="17" rx="6" ry="5" fill="#7d3c98" />
      <ellipse cx="50" cy="17" rx="3.5" ry="3" fill="#af7ac5" />
      {/* Bow tails */}
      <path d="M 46 20 Q 40 28 36 26" stroke="#9b59b6" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 54 20 Q 60 28 64 26" stroke="#9b59b6" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Amethyst gem on bow center */}
      <polygon points="50,13 53,16 50,20 47,16" fill="#d7bde2" opacity="0.9" />
      <polygon points="50,13 53,16 50,16" fill="white" opacity="0.5" />
    </svg>
  );
}
