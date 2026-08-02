import { useEffect, useRef } from 'react'

const WAVE_IDLE = 1
const SW_IDLE = 0.35
const PLAY_LERP = 0.42
const STOP_LERP = 0.07
const SETTLE_EPS = 0.008

function setBarLevel(bar, level) {
  const amp = Number(bar.dataset.amp || 0)
  const mid = Number(bar.dataset.mid || 0)
  const topJ = Number(bar.dataset.topJitter || 0)
  const botJ = Number(bar.dataset.botJitter || 0)
  const half = (amp * level) / 2

  bar.querySelectorAll('.wave-stroke').forEach((stroke) => {
    const scale = Number(stroke.dataset.scale || 1)
    const h = half * scale
    stroke.setAttribute('y1', String(mid - h + topJ))
    stroke.setAttribute('y2', String(mid + h + botJ))
  })
}

function ensureLevels(ref, waveN, swN) {
  if (!ref.current.wave || ref.current.wave.length !== waveN) {
    ref.current.wave = new Float32Array(waveN).fill(WAVE_IDLE)
  }
  if (!ref.current.sw || ref.current.sw.length !== swN) {
    ref.current.sw = new Float32Array(swN).fill(SW_IDLE)
  }
}

/**
 * Drive .sw-bar / .wave-bar by rewriting stroke endpoints
 * so amplitude grows equally above and below the midline.
 * On stop/end, levels ease back to the default silhouette.
 */
export function useAudioReactiveBars(playing, audioGraphRef) {
  const rafRef = useRef(0)
  const levelsRef = useRef({ wave: null, sw: null })

  useEffect(() => {
    const swBars = Array.from(document.querySelectorAll('.sw-bar'))
    const waveBars = Array.from(document.querySelectorAll('.wave-bar'))
    if (!swBars.length && !waveBars.length) return undefined

    ensureLevels(levelsRef, waveBars.length, swBars.length)
    cancelAnimationFrame(rafRef.current)

    let alive = true

    const tick = () => {
      if (!alive) return

      const waveLevels = levelsRef.current.wave
      const swLevels = levelsRef.current.sw
      const graph = audioGraphRef?.current

      if (playing && graph?.analyser) {
        const { analyser, freq, time } = graph
        analyser.getByteFrequencyData(freq)
        analyser.getByteTimeDomainData(time)

        const usable = Math.max(8, Math.floor(freq.length * 0.5))
        const n = waveBars.length

        for (let i = 0; i < n; i++) {
          const t = n <= 1 ? 0.5 : i / (n - 1)
          const envelope = Math.sin(Math.PI * t)

          const dist = Math.abs(t - 0.5) * 2
          const bin = Math.min(usable - 1, Math.floor(dist * usable))
          const neighbor = Math.min(usable - 1, bin + 1)
          const freqLevel = (freq[bin] * 0.7 + freq[neighbor] * 0.3) / 255

          const ti = Math.min(time.length - 1, Math.floor(t * time.length))
          const timeLevel = Math.abs(time[ti] - 128) / 128

          const level = Math.min(1, freqLevel * 0.85 + timeLevel * 0.55)
          const target = Math.max(0.12, envelope * (0.18 + level * 1.15))
          waveLevels[i] += (target - waveLevels[i]) * PLAY_LERP
          setBarLevel(waveBars[i], waveLevels[i])
        }

        const swN = swBars.length
        for (let i = 0; i < swN; i++) {
          const t = swN <= 1 ? 0.5 : i / (swN - 1)
          const bin = Math.min(
            usable - 1,
            Math.floor(4 + t * (usable * 0.35)),
          )
          const level = freq[bin] / 255
          const target = Math.max(0.2, 0.3 + level * 1.25)
          swLevels[i] += (target - swLevels[i]) * 0.35
          setBarLevel(swBars[i], swLevels[i])
        }

        rafRef.current = requestAnimationFrame(tick)
        return
      }

      // Smoothly settle back to default shape
      let settling = false
      for (let i = 0; i < waveBars.length; i++) {
        waveLevels[i] += (WAVE_IDLE - waveLevels[i]) * STOP_LERP
        if (Math.abs(waveLevels[i] - WAVE_IDLE) > SETTLE_EPS) settling = true
        else waveLevels[i] = WAVE_IDLE
        setBarLevel(waveBars[i], waveLevels[i])
      }
      for (let i = 0; i < swBars.length; i++) {
        swLevels[i] += (SW_IDLE - swLevels[i]) * STOP_LERP
        if (Math.abs(swLevels[i] - SW_IDLE) > SETTLE_EPS) settling = true
        else swLevels[i] = SW_IDLE
        setBarLevel(swBars[i], swLevels[i])
      }

      if (settling) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [playing, audioGraphRef])
}
