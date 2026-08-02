/**
 * Lazily wires an <audio> element into Web Audio for reactive visuals.
 * createMediaElementSource may only run once per element — keep the graph for the page life.
 */
export function createAudioGraph(audioEl) {
  if (!audioEl) return null

  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null

  const ctx = new AudioCtx()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.72
  analyser.minDecibels = -85
  analyser.maxDecibels = -20

  const source = ctx.createMediaElementSource(audioEl)
  source.connect(analyser)
  analyser.connect(ctx.destination)

  return {
    ctx,
    analyser,
    freq: new Uint8Array(analyser.frequencyBinCount),
    time: new Uint8Array(analyser.fftSize),
  }
}

export async function resumeAudioGraph(graph) {
  if (!graph?.ctx) return
  if (graph.ctx.state === 'suspended') {
    try {
      await graph.ctx.resume()
    } catch {
      /* ignore */
    }
  }
}
