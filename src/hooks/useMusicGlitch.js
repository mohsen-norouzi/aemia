import { useEffect, useRef } from 'react'

/**
 * Occasional mgGlitch-style bursts while music plays (after ink).
 * Each glitch host runs on its own random schedule — never all at once.
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
    const timers = new Map()
    const cleanups = new Map()

    const clearHost = (host) => {
      window.clearTimeout(timers.get(host))
      timers.delete(host)
      cleanups.get(host)?.()
      cleanups.delete(host)
    }

    const scheduleHost = (host) => {
      if (disposed) return
      const s = settingsRef.current
      const every = Math.max(0.5, s.everySeconds ?? everySeconds)
      // Wide per-host jitter so images never sync
      const wait = (every * (0.55 + Math.random() * 1.6) + Math.random() * 1.2) * 1000
      timers.set(
        host,
        window.setTimeout(() => fireHost(host), Math.max(300, wait)),
      )
    }

    const fireHost = (host) => {
      if (disposed) return
      if (!root.contains(host)) {
        clearHost(host)
        return
      }

      // Skip if still mid-burst
      if (host.classList.contains('is-mg-glitching')) {
        scheduleHost(host)
        return
      }

      // ~30% chance to skip this tick — keeps it sparse/random
      if (Math.random() < 0.3) {
        scheduleHost(host)
        return
      }

      const s = settingsRef.current
      const burst = Math.max(
        120,
        (s.burstMs ?? burstMs) * (0.7 + Math.random() * 0.7),
      )
      cleanups.set(
        host,
        runBurst(host, s.amount ?? amount, burst),
      )
      scheduleHost(host)
    }

    const hosts = Array.from(root.querySelectorAll(GLITCH_SEL))
    hosts.forEach((host, i) => {
      // Stagger first fire so nothing starts together
      const firstWait = 400 + i * rand(350, 900) + Math.random() * 1200
      timers.set(
        host,
        window.setTimeout(() => fireHost(host), firstWait),
      )
    })

    return () => {
      disposed = true
      hosts.forEach(clearHost)
      timers.forEach((id) => window.clearTimeout(id))
      cleanups.forEach((fn) => fn?.())
      timers.clear()
      cleanups.clear()
    }
  }, [enabled, scopeRef, amount, everySeconds, burstMs])
}
