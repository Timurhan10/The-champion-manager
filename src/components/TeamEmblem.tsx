interface TeamEmblemProps {
  shortName: string;
  primary: string;
  secondary: string;
  size?: number;
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function TeamEmblem({ shortName, primary, secondary, size = 28 }: TeamEmblemProps) {
  const variant = hashCode(shortName) % 3;
  const r = size / 2;
  const fs = size * 0.35;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="inline-block flex-shrink-0">
      <circle cx={r} cy={r} r={r} fill={primary} />
      {variant === 0 && (
        <circle cx={r} cy={r} r={r * 0.7} fill="none" stroke={secondary} strokeWidth={size * 0.08} />
      )}
      {variant === 1 && (
        <rect x={0} y={r - size * 0.08} width={size} height={size * 0.16} fill={secondary} />
      )}
      {variant === 2 && (
        <line x1={0} y1={size} x2={size} y2={0} stroke={secondary} strokeWidth={size * 0.12} />
      )}
      <text
        x={r}
        y={r}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={fs}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {shortName.slice(0, 2)}
      </text>
    </svg>
  );
}
