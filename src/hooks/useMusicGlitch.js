import { useEffect, useRef } from 'react'

/**
 * Occasional mgGlitch-style bursts while music plays (after ink).
 * Between bursts the image is fully normal — no overlay layers.
 */

const GLITCH_SEL = '[data-glitch]'

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeLayer(src, className, zIndex, blendMode) {
  const el = document.createElement('div')
  el.className = `mg-glitch-layer ${className}`
  el.setAttribute('aria-hidden', 'true')
  el.style.cssText = [
    'position:absolute',
    'inset:0',
    `z-index:${zIndex}`,
    `background-image:url("${src}")`,
    'background-size:cover',
    'background-position:center',
    'background-repeat:no-repeat',
    'pointer-events:none',
    'opacity:1',
    blendMode ? `mix-blend-mode:${blendMode}` : '',
  ]
    .filter(Boolean)
    .join(';')
  return el
}

/**
 * Run a short glitch burst on one host, then remove overlays.
 * @returns {() => void} cancel
 */
function runBurst(host, amount = 1, durationMs = 280) {
  const src = host.getAttribute('data-glitch-src')
  if (!src || amount <= 0.01) return () => {}

  const off1 = Math.round(16 * amount)
  const off2 = Math.round(40 * amount)
  const scaleJitter = 0.1 * amount

  const prevOverflow = host.style.overflow
  host.style.overflow = 'hidden'
  host.classList.add('is-mg-glitching')

  const front1 = makeLayer(src, 'mg-front-1', 6)
  const front2 = makeLayer(src, 'mg-front-2', 7)
  const front3 = makeLayer(src, 'mg-front-3', 8, 'hue')
  host.appendChild(front1)
  host.appendChild(front2)
  host.appendChild(front3)

  let t1 = 0
  let t2 = 0
  let t3 = 0
  let endTimer = 0
  let alive = true

  const slice = (el, maxOff, withScale) => {
    const top = rand(10, 1900)
    const bottom = rand(10, 1300)
    el.style.clip = `rect(${top}px, 9999px, ${bottom}px, 0px)`
    el.style.left = `${rand(0, Math.max(0, maxOff))}px`
    el.style.right = `${rand(0, Math.max(0, maxOff))}px`
    el.style.top = '0'
    if (withScale) {
      const scale = (
        Math.random() * (1 + scaleJitter - (1 - scaleJitter)) +
        (1 - scaleJitter)
      ).toFixed(2)
      el.style.transform = `scale(${scale})`
    }
  }

  const tick1 = () => {
    if (!alive) return
    slice(front1, off1, false)
    t1 = window.setTimeout(tick1, rand(10, 50))
  }

  const tick2 = () => {
    if (!alive) return
    slice(front2, off2, true)
    t2 = window.setTimeout(tick2, rand(15, 70))
  }

  const tick3 = () => {
    if (!alive) return
    slice(front3, off2, true)
    t3 = window.setTimeout(tick3, rand(15, 70))
  }

  const cleanup = () => {
    if (!alive) return
    alive = false
    window.clearTimeout(t1)
    window.clearTimeout(t2)
    window.clearTimeout(t3)
    window.clearTimeout(endTimer)
    front1.remove()
    front2.remove()
    front3.remove()
    host.classList.remove('is-mg-glitching')
    host.style.overflow = prevOverflow
  }

  tick1()
  tick2()
  tick3()
  endTimer = window.setTimeout(cleanup, durationMs)

  return cleanup
}

/**
 * @param {boolean} enabled
 * @param {React.RefObject} scopeRef
 * @param {{ amount?: number, everySeconds?: number, burstMs?: number }} settings
 */
export function useMusicGlitch(enabled, scopeRef, settings = {}) {
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  const amount = settings.amount ?? 1
  const everySeconds = settings.everySeconds ?? 3
  const burstMs = settings.burstMs ?? 280

  useEffect(() => {
    const root = scopeRef?.current
    if (!root || !enabled || amount <= 0.01) return undefined

    let disposed = false
    let scheduleTimer = 0
    let activeCleanups = []

    const clearActive = () => {
      activeCleanups.forEach((fn) => fn?.())
      activeCleanups = []
    }

    const fire = () => {
      if (disposed) return
      clearActive()

      const hosts = Array.from(root.querySelectorAll(GLITCH_SEL))
      if (!hosts.length) {
        schedule()
        return
      }

      // Glitch 1–all hosts in this burst (random subset feels less synced)
      const count = Math.max(
        1,
        Math.min(hosts.length, Math.round(1 + Math.random() * hosts.length)),
      )
      const shuffled = [...hosts].sort(() => Math.random() - 0.5)
      const picked = shuffled.slice(0, count)

      const s = settingsRef.current
      picked.forEach((host) => {
        activeCleanups.push(
          runBurst(host, s.amount ?? amount, s.burstMs ?? burstMs),
        )
      })

      schedule()
    }

    const schedule = () => {
      if (disposed) return
      const s = settingsRef.current
      const every = Math.max(0.4, s.everySeconds ?? everySeconds)
      // Small jitter so it doesn't feel metronomic
      const wait = (every + (Math.random() * 0.6 - 0.3)) * 1000
      scheduleTimer = window.setTimeout(fire, Math.max(200, wait))
    }

    // First burst after a short delay (not immediately on ink end)
    scheduleTimer = window.setTimeout(fire, Math.max(400, everySeconds * 400))

    return () => {
      disposed = true
      window.clearTimeout(scheduleTimer)
      clearActive()
    }
  }, [enabled, scopeRef, amount, everySeconds, burstMs])
}
