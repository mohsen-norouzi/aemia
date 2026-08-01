export function Crosshair({ className = "", style }) {
  return <span className={`crosshair ${className}`} style={style} aria-hidden />
}

export function Compass({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
      <circle cx="80" cy="80" r="52" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      <circle cx="80" cy="80" r="28" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
      <line x1="80" y1="6" x2="80" y2="154" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <line x1="6" y1="80" x2="154" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <line x1="28" y1="28" x2="132" y2="132" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      <line x1="132" y1="28" x2="28" y2="132" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      <path
        d="M80 48 L84 76 L112 80 L84 84 L80 112 L76 84 L48 80 L76 76 Z"
        fill="white"
        className="compass-star"
        filter="url(#starGlow)"
      />
      <defs>
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}

export function Waveform({ className = "" }) {
  const bars = [
    8, 14, 22, 18, 28, 16, 32, 24, 12, 30, 20, 36, 18, 26, 14, 34, 22, 10, 28, 16, 38,
    20, 12, 30, 24, 8, 22, 16, 28, 14, 32, 18, 10, 26, 20, 34, 12, 24, 16, 8,
  ]

  return (
    <svg
      className={className}
      viewBox="0 0 320 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {bars.map((h, i) => {
        const x = i * 8
        const y = (48 - h) / 2
        return (
          <rect
            key={i}
            className="wave-bar"
            x={x}
            y={y}
            width="2.5"
            height={h}
            fill="rgba(255,255,255,0.55)"
            rx="0.5"
            data-wave={i}
          />
        )
      })}
    </svg>
  )
}

export function SoundwaveIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="28"
      height="14"
      viewBox="0 0 28 14"
      fill="none"
      aria-hidden
    >
      <rect className="sw-bar" x="0" y="5" width="2" height="4" fill="#5c705e" rx="0.5" />
      <rect className="sw-bar" x="4" y="2" width="2" height="10" fill="#5c705e" rx="0.5" />
      <rect className="sw-bar" x="8" y="0" width="2" height="14" fill="#778e78" rx="0.5" />
      <rect className="sw-bar" x="12" y="3" width="2" height="8" fill="#5c705e" rx="0.5" />
      <rect className="sw-bar" x="16" y="1" width="2" height="12" fill="#778e78" rx="0.5" />
      <rect className="sw-bar" x="20" y="4" width="2" height="6" fill="#5c705e" rx="0.5" />
      <rect className="sw-bar" x="24" y="2.5" width="2" height="9" fill="#5c705e" rx="0.5" />
    </svg>
  )
}

export function SprayA({ className = "" }) {
  return (
    <div className={`spray-a select-none pointer-events-none ${className}`} aria-hidden>
      <span className="relative inline-block text-[7rem] leading-none md:text-[9rem]">
        <span className="absolute inset-0 opacity-40 blur-[1px] scale-105">Ⓐ</span>
        <span className="relative">Ⓐ</span>
      </span>
    </div>
  )
}

export function DecorativeLines() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
      {/* Horizontal registration lines */}
      <div className="reg-line absolute top-[18%] left-[4%] h-px w-[12%]" />
      <div className="reg-line absolute top-[22%] right-[8%] h-px w-[9%]" />
      <div className="reg-line absolute top-[48%] left-[38%] h-px w-[7%] opacity-40" />
      <div className="reg-line absolute bottom-[28%] left-[6%] h-px w-[10%]" />
      <div className="reg-line absolute bottom-[18%] right-[22%] h-px w-[14%]" />

      {/* Vertical accents */}
      <div className="reg-line absolute top-[12%] left-[46%] h-[8%] w-px" />
      <div className="reg-line absolute top-[35%] right-[18%] h-[12%] w-px opacity-40" />
      <div className="reg-line absolute bottom-[12%] left-[32%] h-[6%] w-px" />

      {/* Crosshairs */}
      <Crosshair className="top-[14%] left-[42%]" />
      <Crosshair className="top-[38%] left-[8%]" />
      <Crosshair className="top-[58%] right-[28%]" />
      <Crosshair className="bottom-[22%] left-[48%]" />
      <Crosshair className="top-[72%] right-[12%]" />
      <Crosshair className="bottom-[38%] left-[22%]" />

      {/* L-corner marks */}
      <div className="absolute top-[8%] right-[32%] h-4 w-4 border-l border-t border-white/30" />
      <div className="absolute bottom-[14%] left-[40%] h-3 w-3 border-b border-r border-white/25" />
      <div className="absolute top-[44%] left-[2%] h-5 w-5 border-b border-l border-white/20" />
    </div>
  )
}
