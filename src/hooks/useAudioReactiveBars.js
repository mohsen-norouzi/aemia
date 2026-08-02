import { useEffect, useRef } from 'react'

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

/**
 * Drive .sw-bar / .wave-bar by rewriting stroke endpoints
 * so amplitude grows equally above and below the midline.
 */
export function useAudioReactiveBars(playing, audioGraphRef) {
  const rafRef = useRef(0)

  useEffect(() => {
    const swBars = Array.from(document.querySelectorAll('.sw-bar'))
    const waveBars = Array.from(document.querySelectorAll('.wave-bar'))
    if (!swBars.length && !waveBars.length) return undefined

    cancelAnimationFrame(rafRef.current)

    if (!playing) {
      waveBars.forEach((bar) => setBarLevel(bar, 1))
      swBars.forEach((bar) => setBarLevel(bar, 0.35))
      return undefined
    }

    const smoothWave = new Float32Array(waveBars.length).fill(0.85)
    const smoothSw = new Float32Array(swBars.length).fill(0.5)

    const tick = () => {
      const graph = audioGraphRef?.current
      if (graph?.analyser) {
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
          smoothWave[i] += (target - smoothWave[i]) * 0.42
          setBarLevel(waveBars[i], smoothWave[i])
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
          smoothSw[i] += (target - smoothSw[i]) * 0.35
          setBarLevel(swBars[i], smoothSw[i])
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [playing, audioGraphRef])
}
