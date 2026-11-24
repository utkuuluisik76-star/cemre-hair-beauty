/** Inline SVG arrows/symbols. Replaces text characters (→ ↗ ↘ ↔ ✳), which iOS/macOS draw as colour emoji. */
type Dir = 'right' | 'left' | 'up' | 'down' | 'upRight' | 'downRight' | 'leftRight' | 'asterisk';

const ROTATE: Record<Exclude<Dir, 'leftRight' | 'asterisk'>, number> = { right: 0, left: 180, up: -90, down: 90, upRight: -45, downRight: 45 };

export function Arrow({ dir = 'right', className }: { dir?: Dir; className?: string }) {
  const base = {
    'aria-hidden': true as const,
    focusable: 'false' as const,
    viewBox: '0 0 24 24',
    width: '1em',
    height: '1em',
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
  };
  const style = { display: 'inline-block', flexShrink: 0, verticalAlign: '-0.125em' } as const;
  if (dir === 'asterisk') {
    return (
      <svg {...base} style={style}>
        <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
      </svg>
    );
  }
  if (dir === 'leftRight') {
    return (
      <svg {...base} style={style}>
        <path d="M3 12h18M8 6l-6 6 6 6M16 6l6 6-6 6" />
      </svg>
    );
  }
  return (
    <svg {...base} style={{ ...style, transform: `rotate(${ROTATE[dir]}deg)` }}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}
