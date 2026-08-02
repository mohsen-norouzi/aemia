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

function scratchRand(i, salt = 1) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function Waveform({ className = "" }) {
  const count = 86
  const W = 400
  const H = 64
  const mid = H / 2
  const step = W / count
  const green = '#66846b'
  const bone = '#e8e6e0'

  const spikes = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)
    const envelope = Math.pow(Math.sin(Math.PI * t), 1.12)
    const jagged =
      0.38 +
      0.62 *
        Math.abs(
          Math.sin(i * 1.7) * 0.5 +
            Math.sin(i * 4.3) * 0.32 +
            Math.sin(i * 9.1) * 0.18,
        )
    if (scratchRand(i, 0) < 0.07) return null

    const amp = Math.max(2, envelope * jagged * (H - 6))
    const centerBias = Math.sin(Math.PI * t)
    const useBone = centerBias > 0.7 || scratchRand(i, 2) > 0.55
    const strokes = scratchRand(i, 3) > 0.62 ? 2 : 1
    const baseX = i * step + step * 0.25 + (scratchRand(i, 4) - 0.5) * 1.6

    return {
      i,
      amp,
      baseX,
      strokes,
      color: useBone ? bone : green,
      opacity: 0.28 + scratchRand(i, 5) * 0.55,
      width: 0.45 + scratchRand(i, 6) * 0.85,
      topJitter: (scratchRand(i, 7) - 0.5) * 2.4,
      botJitter: (scratchRand(i, 8) - 0.5) * 2.4,
      lean: (scratchRand(i, 9) - 0.5) * 1.1,
    }
  }).filter(Boolean)

  const axis = Array.from({ length: 22 }, (_, i) => {
    if (scratchRand(i, 20) < 0.22) return null
    const seg = W / 22
    const x0 = i * seg + scratchRand(i, 21) * 1.5
    const len = seg * (0.35 + scratchRand(i, 22) * 0.55)
    return {
      i,
      x0,
      x1: x0 + len,
      y0: mid + (scratchRand(i, 23) - 0.5) * 1.2,
      y1: mid + (scratchRand(i, 24) - 0.5) * 1.2,
      opacity: 0.18 + scratchRand(i, 25) * 0.4,
      width: 0.35 + scratchRand(i, 26) * 0.4,
    }
  }).filter(Boolean)

  return (
    <svg
      className={`waveform-scratch ${className}`.trim()}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      data-wave-mid={mid}
    >
      <defs>
        <filter
          id="waveGrain"
          x="-10%"
          y="-40%"
          width="120%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.15"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.35"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter="url(#waveGrain)" opacity="0.92">
        {axis.map((a) => (
          <line
            key={`axis-${a.i}`}
            x1={a.x0}
            y1={a.y0}
            x2={a.x1}
            y2={a.y1}
            stroke={green}
            strokeWidth={a.width}
            opacity={a.opacity}
            strokeLinecap="butt"
          />
        ))}

        {spikes.map((s) => {
          const half = s.amp / 2
          return (
            <g
              key={s.i}
              className="wave-bar"
              data-wave={s.i}
              data-amp={s.amp.toFixed(2)}
              data-mid={mid}
              data-top-jitter={s.topJitter.toFixed(2)}
              data-bot-jitter={s.botJitter.toFixed(2)}
            >
              {Array.from({ length: s.strokes }, (_, k) => {
                const ox = s.baseX + k * (0.55 + scratchRand(s.i + k, 10) * 0.5)
                const scale = k === 0 ? 1 : 0.72
                return (
                  <line
                    key={k}
                    className="wave-stroke"
                    x1={ox}
                    y1={mid - half * scale + s.topJitter}
                    x2={ox + s.lean}
                    y2={mid + half * scale + s.botJitter}
                    stroke={s.color}
                    strokeWidth={s.width * (k === 0 ? 1 : 0.65)}
                    opacity={s.opacity * (k === 0 ? 1 : 0.4)}
                    strokeLinecap="butt"
                    data-scale={scale}
                  />
                )
              })}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function SoundwaveIcon({ className = "" }) {
  const green = '#66846b'
  const bone = '#e8e6e0'
  const mid = 9
  const amps = [3, 6, 11, 5, 14, 8, 4, 12, 7, 3, 9, 5]

  return (
    <svg
      className={`waveform-scratch ${className}`.trim()}
      width="42"
      height="18"
      viewBox="0 0 42 18"
      fill="none"
      aria-hidden
    >
      {[0, 9, 18, 28, 36].map((x, i) =>
        scratchRand(i, 40) < 0.15 ? null : (
          <line
            key={x}
            x1={x}
            y1={mid + (scratchRand(i, 41) - 0.5)}
            x2={x + 5 + scratchRand(i, 42) * 3}
            y2={mid + (scratchRand(i, 43) - 0.5)}
            stroke={green}
            strokeWidth={0.55 + scratchRand(i, 44) * 0.35}
            opacity={0.35 + scratchRand(i, 45) * 0.4}
          />
        ),
      )}
      {amps.map((amp, i) => {
        const x = 1.2 + i * 3.4 + (scratchRand(i, 50) - 0.5) * 0.6
        const lean = (scratchRand(i, 51) - 0.5) * 0.5
        const topJ = (scratchRand(i, 52) - 0.5)
        const botJ = (scratchRand(i, 53) - 0.5)
        return (
          <g
            key={i}
            className="sw-bar"
            data-amp={amp * 2}
            data-mid={mid}
            data-top-jitter={topJ}
            data-bot-jitter={botJ}
          >
            <line
              className="wave-stroke"
              x1={x}
              y1={mid - amp + topJ}
              x2={x + lean}
              y2={mid + amp + botJ}
              stroke={i % 3 === 1 ? bone : green}
              strokeWidth={0.6 + scratchRand(i, 54) * 0.7}
              opacity={0.45 + scratchRand(i, 55) * 0.45}
              strokeLinecap="butt"
              data-scale="1"
            />
            {scratchRand(i, 56) > 0.65 && (
              <line
                className="wave-stroke"
                x1={x + 0.55}
                y1={mid - amp * 0.7}
                x2={x + 0.55 + lean * 0.5}
                y2={mid + amp * 0.7}
                stroke={green}
                strokeWidth={0.4}
                opacity={0.3}
                data-scale="0.7"
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function GlobeIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse
        cx="32"
        cy="20"
        rx="30"
        ry="18"
        stroke="rgba(232,230,224,0.75)"
        strokeWidth="0.9"
      />
      <ellipse
        cx="32"
        cy="20"
        rx="14"
        ry="18"
        stroke="rgba(232,230,224,0.55)"
        strokeWidth="0.7"
      />
      <path
        d="M2 20 H62"
        stroke="rgba(232,230,224,0.7)"
        strokeWidth="0.7"
      />
      <path
        d="M32 2 V38"
        stroke="rgba(232,230,224,0.45)"
        strokeWidth="0.6"
      />
      <path
        d="M8 10 C20 14, 44 14, 56 10"
        stroke="rgba(232,230,224,0.4)"
        strokeWidth="0.6"
      />
      <path
        d="M8 30 C20 26, 44 26, 56 30"
        stroke="rgba(232,230,224,0.4)"
        strokeWidth="0.6"
      />
    </svg>
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
