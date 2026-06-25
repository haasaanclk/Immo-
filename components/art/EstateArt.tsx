/**
 * Generative, self-contained SVG art for the old-money concept.
 * No external image dependency — renders crisp at any size, works offline.
 */

export function EstateFacade({
  hue = 158,
  className = "",
}: {
  hue?: number;
  className?: string;
}) {
  const sky1 = `hsl(${hue}, 22%, 24%)`;
  const sky2 = `hsl(${hue}, 28%, 13%)`;
  const stone = "#C9A86A";
  return (
    <svg
      viewBox="0 0 400 220"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Mülk cephesi"
    >
      <defs>
        <linearGradient id={`sky-${hue}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky1} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9A86A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#B08D57" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#sky-${hue})`} />
      {/* moon */}
      <circle cx="330" cy="44" r="16" fill="#EBE5D8" opacity="0.18" />
      {/* tree line silhouette */}
      <path
        d="M0 150 Q40 120 70 150 Q100 118 140 150 L0 150 Z"
        fill="#0F1A14"
        opacity="0.6"
      />
      {/* villa massing */}
      <rect x="120" y="92" width="170" height="100" fill="#15241C" />
      <rect x="120" y="92" width="170" height="100" fill={stone} opacity="0.06" />
      {/* roof */}
      <path d="M110 92 L205 58 L300 92 Z" fill="#0F1A14" />
      <path d="M110 92 L205 58 L300 92 Z" fill={stone} opacity="0.08" />
      {/* windows — warm light */}
      {[140, 172, 232, 264].map((x) => (
        <rect key={x} x={x} y="108" width="18" height="26" fill="url(#glow)" rx="1" />
      ))}
      {[140, 172, 232, 264].map((x) => (
        <rect key={`b${x}`} x={x} y="150" width="18" height="26" fill="url(#glow)" rx="1" opacity="0.7" />
      ))}
      {/* door */}
      <rect x="198" y="150" width="24" height="42" fill="#0F1A14" />
      <rect x="198" y="150" width="24" height="42" fill={stone} opacity="0.18" />
      {/* brass ground line */}
      <rect x="0" y="190" width="400" height="2" fill={stone} opacity="0.5" />
      {/* reflection */}
      <rect x="0" y="192" width="400" height="28" fill="#0B130E" />
      <rect x="120" y="192" width="170" height="20" fill={stone} opacity="0.05" />
    </svg>
  );
}

export function RoomScene({
  wall,
  floor,
  accent,
  textile,
  className = "",
}: {
  wall: string;
  floor: string;
  accent: string;
  textile: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 360 240"
      className={className}
      role="img"
      aria-label="İç mekân görselleştirme"
    >
      {/* back wall */}
      <rect width="360" height="170" fill={wall} />
      {/* floor in perspective */}
      <polygon points="0,170 360,170 360,240 0,240" fill={floor} />
      <polygon points="60,170 300,170 360,240 0,240" fill={floor} opacity="0.0" />
      {/* floor seams */}
      {[90, 180, 270].map((x) => (
        <line key={x} x1={x} y1="170" x2={(x - 180) * 1.7 + 180} y2="240" stroke="#000" opacity="0.06" />
      ))}
      {/* large window with evening light */}
      <rect x="232" y="34" width="96" height="112" fill="#0F1A14" />
      <rect x="238" y="40" width="84" height="100" fill={accent} opacity="0.22" />
      <line x1="280" y1="40" x2="280" y2="140" stroke="#0F1A14" strokeWidth="3" />
      <line x1="238" y1="90" x2="322" y2="90" stroke="#0F1A14" strokeWidth="3" />
      {/* framed art */}
      <rect x="44" y="46" width="60" height="46" fill="none" stroke={accent} strokeWidth="2" />
      <rect x="50" y="52" width="48" height="34" fill={accent} opacity="0.14" />
      {/* sofa */}
      <rect x="40" y="150" width="150" height="34" rx="8" fill={textile} />
      <rect x="40" y="132" width="150" height="26" rx="8" fill={textile} opacity="0.85" />
      <rect x="36" y="150" width="16" height="40" rx="6" fill={textile} />
      <rect x="178" y="150" width="16" height="40" rx="6" fill={textile} />
      {/* cushions */}
      <rect x="56" y="138" width="26" height="22" rx="5" fill={accent} opacity="0.5" />
      <rect x="150" y="138" width="26" height="22" rx="5" fill={accent} opacity="0.5" />
      {/* low table + brass lamp */}
      <rect x="78" y="196" width="74" height="8" rx="3" fill={accent} opacity="0.8" />
      <line x1="208" y1="150" x2="208" y2="120" stroke={accent} strokeWidth="3" />
      <circle cx="208" cy="116" r="9" fill={accent} opacity="0.85" />
      {/* rug */}
      <ellipse cx="120" cy="208" rx="110" ry="14" fill={accent} opacity="0.12" />
      {/* plant */}
      <rect x="300" y="150" width="10" height="34" fill="#2b2118" />
      <path d="M305 150 q-22 -30 -4 -52 q18 22 4 52" fill="#3a5a45" opacity="0.85" />
    </svg>
  );
}
