import { useCallback, useEffect, useRef, useState } from 'react'
import Intro from './components/Intro'
import Hero from './components/hero/Hero'
import { createAudioGraph, resumeAudioGraph } from './lib/audioGraph'

function App() {
  const [entered, setEntered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const audioGraphRef = useRef(null)
  const resumeOnVisibleRef = useRef(false)

  const ensureGraph = useCallback(() => {
    if (audioGraphRef.current) return audioGraphRef.current
    const graph = createAudioGraph(audioRef.current)
    audioGraphRef.current = graph
    return graph
  }, [])

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.loop = false
    const graph = ensureGraph()
    await resumeAudioGraph(graph)
    try {
      await audio.play()
      setPlaying(true)
    } catch (err) {
      console.warn('[audio] play failed', err)
      setPlaying(false)
    }
  }, [ensureGraph])

  // ENTER click = user gesture — start song immediately
  const handleEnterClick = useCallback(() => {
    startPlayback()
  }, [startPlayback])

  // After intro fade — mount hero and ensure song is playing
  const handleEnterComplete = useCallback(() => {
    setEntered(true)
    startPlayback()
  }, [startPlayback])

  // Keep React `playing` in sync with the audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const sync = () => setPlaying(!audio.paused && !audio.ended)
    audio.addEventListener('play', sync)
    audio.addEventListener('playing', sync)
    audio.addEventListener('pause', sync)
    return () => {
      audio.removeEventListener('play', sync)
      audio.removeEventListener('playing', sync)
      audio.removeEventListener('pause', sync)
    }
  }, [])

  // Pause when the tab is hidden; resume when it becomes visible again
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current
      if (!audio) return

      if (document.visibilityState === 'hidden') {
        if (!audio.paused) {
          resumeOnVisibleRef.current = true
          audio.pause()
          setPlaying(false)
        }
        return
      }

      if (resumeOnVisibleRef.current) {
        resumeOnVisibleRef.current = false
        startPlayback()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [startPlayback])

  // Song ended → bars stop (via playing=false)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const onEnded = () => {
      resumeOnVisibleRef.current = false
      setPlaying(false)
    }
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [])

  // Nav CTA toggles pause/resume; hero LISTEN NOW restarts
  useEffect(() => {
    if (!entered) return undefined

    const onListen = () => {
      const audio = audioRef.current
      if (!audio) return
      resumeOnVisibleRef.current = false
      audio.currentTime = 0
      startPlayback()
    }

    const onToggle = () => {
      const audio = audioRef.current
      if (!audio) return
      resumeOnVisibleRef.current = false

      if (!audio.paused) {
        audio.pause()
        setPlaying(false)
        return
      }

      if (audio.ended || audio.currentTime >= audio.duration) {
        audio.currentTime = 0
      }
      startPlayback()
    }

    window.addEventListener('aemia:listen', onListen)
    window.addEventListener('aemia:toggle', onToggle)
    return () => {
      window.removeEventListener('aemia:listen', onListen)
      window.removeEventListener('aemia:toggle', onToggle)
    }
  }, [entered, startPlayback])

  return (
    <main>
      <audio ref={audioRef} src="/song.mp3" preload="auto" playsInline />
      {entered ? (
        <Hero playing={playing} audioGraphRef={audioGraphRef} />
      ) : (
        <Intro
          onEnterClick={handleEnterClick}
          onEnterComplete={handleEnterComplete}
        />
      )}
    </main>
  )
}

export default App
