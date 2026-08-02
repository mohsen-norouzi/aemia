import { useCallback, useEffect, useRef, useState } from 'react'
import Intro from './components/Intro'
import Hero from './components/hero/Hero'

function App() {
  const [entered, setEntered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const resumeOnVisibleRef = useRef(false)

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.loop = false
    try {
      await audio.play()
      setPlaying(true)
    } catch (err) {
      console.warn('[audio] play failed', err)
      setPlaying(false)
    }
  }, [])

  // Called on ENTER click (user gesture) — start song immediately
  const handleEnterClick = useCallback(() => {
    startPlayback()
  }, [startPlayback])

  // Called after intro fade — mount main page
  const handleEnterComplete = useCallback(() => {
    setEntered(true)
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

  // LISTEN NOW / nav CTA can restart the track
  useEffect(() => {
    if (!entered) return undefined

    const onListen = () => {
      const audio = audioRef.current
      if (!audio) return
      resumeOnVisibleRef.current = false
      audio.currentTime = 0
      startPlayback()
    }

    window.addEventListener('aemia:listen', onListen)
    return () => window.removeEventListener('aemia:listen', onListen)
  }, [entered, startPlayback])

  return (
    <main>
      <audio ref={audioRef} src="/song.mp3" preload="auto" playsInline />
      {entered ? (
        <Hero playing={playing} />
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
