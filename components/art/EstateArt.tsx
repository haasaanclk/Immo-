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
  const uid = `e${hue}`;
  const sky0 = `hsl(${hue}, 30%, 9%)`;
  const sky1 = `hsl(${hue}, 26%, 15%)`;
  const sky2 = `hsl(${hue}, 30%, 22%)`;
  const warm = "#E7B765";
  return (
    <svg
      viewBox="0 0 400 240"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Mülk cephesi"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky0} />
          <stop offset="0.6" stopColor={sky1} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
        <radialGradient id={`halo-${uid}`} cx="50%" cy="74%" r="55%">
          <stop offset="0" stopColor="#B08D57" stopOpacity="0.4" />
          <stop offset="1" stopColor="#B08D57" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`moon-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F4EEDD" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F4EEDD" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`vig-${uid}`} cx="50%" cy="45%" r="72%">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <filter id={`bloom-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      <rect width="400" height="240" fill={`url(#sky-${uid})`} />
      {/* moon glow */}
      <circle cx="320" cy="48" r="46" fill={`url(#moon-${uid})`} />
      <circle cx="320" cy="48" r="13" fill="#F4EEDD" opacity="0.85" />
      {/* stars */}
      {[[40, 30], [90, 55], [150, 28], [210, 50], [260, 34], [110, 80]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 1 : 0.7} fill="#EAE2CE" opacity="0.5" />
      ))}
      {/* distant hills */}
      <path d="M0 150 Q100 118 200 145 T400 140 V240 H0 Z" fill="#0C160F" opacity="0.7" />
      {/* warm horizon halo */}
      <ellipse cx="200" cy="170" rx="150" ry="48" fill={`url(#halo-${uid})`} />

      {/* estate */}
      <g>
        <rect x="118" y="98" width="164" height="96" fill="#0B140E" />
        <path d="M104 98 L200 60 L296 98 Z" fill="#091109" />
        <rect x="78" y="128" width="44" height="66" fill="#091109" />
        <rect x="278" y="128" width="44" height="66" fill="#091109" />
        <rect x="150" y="64" width="8" height="20" fill="#091109" />
        <rect x="240" y="64" width="8" height="20" fill="#091109" />
        <g filter={`url(#bloom-${uid})`}>
          {[138, 168, 232, 262].map((x) => (
            <rect key={x} x={x} y="112" width="16" height="22" rx="1" fill={warm} />
          ))}
          {[138, 168, 232, 262].map((x) => (
            <rect key={`b${x}`} x={x} y="150" width="16" height="20" rx="1" fill={warm} opacity="0.8" />
          ))}
          <rect x="190" y="150" width="20" height="44" rx="1.5" fill="#F0C877" />
        </g>
      </g>

      {/* foreground hedge */}
      <path d="M0 198 Q60 178 120 198 Q180 178 240 198 Q300 178 360 198 Q390 184 400 198 V240 H0 Z" fill="#060D09" />
      {/* reflection */}
      <rect x="0" y="206" width="400" height="34" fill="#050A07" />
      <g opacity="0.14" filter={`url(#bloom-${uid})`}>
        {[138, 168, 232, 262].map((x) => (
          <rect key={x} x={x} y="208" width="16" height="16" fill={warm} />
        ))}
      </g>
      <rect width="400" height="240" fill={`url(#vig-${uid})`} />
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
