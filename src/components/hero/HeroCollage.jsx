import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import { Waveform } from './Decorative'
import InkRevealPortrait, { INK_REVEAL } from './InkRevealPortrait'

const GIRL_WINDOW = {
  width: 226,
  height: 294,
  left: 35.5,
  top: 50.5,
  opacity: 1,
  rotate: 0,
}

const GIRL_FRAME = {
  width: 284,
  height: 446,
  left: 34,
  top: 40,
  opacity: 1,
  rotate: 0,
}

const GIRL_WINDOW_FADE = {
  top: 39,
  topLeft: 50,
  topRight: 53,
}

/** Locked portrait foot fade (Leva) */
const PORTRAIT_FOOT_FADE = {
  fadeHeight: 5,
  maskSolid: 62,
  maskStart: 30,
  maskMid: 70.5,
  maskEdge: 50,
  brushDistort: 0,
  overlayStrength: 1,
}

const WAVE_PLAY = {
  // % of wave width (not height) so taller bars don't scale the glyph
  size: 22.5,
  opacity: 0.33,
  x: 0,
  y: -138,
}

const DEFAULT_INK = {
  size: INK_REVEAL.size,
  speed: INK_REVEAL.speed,
  rotation: INK_REVEAL.rotation,
}

const INK_COUNT = 4

const HeroCollage = forwardRef(function HeroCollage(
  {
    inkSettings = {},
    portraitLayout = {},
    starShine = {},
    starCircle = {},
    waveLayout = {},
    playing = false,
    onInkReady,
  },
  inkRef,
) {
  const mainInkRef = useRef(null)
  const miaInkRef = useRef(null)
  const concertInkRef = useRef(null)
  const eyesInkRef = useRef(null)
  const chromeShownRef = useRef(false)
  const chromeFallbackRef = useRef(null)
  const inkDoneRef = useRef(0)
  const inkReadySentRef = useRef(false)

  const portrait = { ...DEFAULT_INK, ...inkSettings.portrait }
  const windowInk = { ...DEFAULT_INK, ...inkSettings.window }
  const concert = { ...DEFAULT_INK, ...inkSettings.concert }
  const eyes = { ...DEFAULT_INK, ...inkSettings.eyes }

  const {
    width: portraitWidth = 60,
    maxWidth: portraitMaxWidth = 488,
    heightShow = 93,
    opacity: portraitOpacity = 1,
    top: portraitTop = 1,
    left: portraitLeft = 45.5,
  } = portraitLayout

  const {
    fadeHeight,
    maskSolid,
    maskStart,
    maskMid,
    maskEdge,
    brushDistort,
    overlayStrength,
  } = PORTRAIT_FOOT_FADE

  const footMask = `linear-gradient(to bottom, #000 0%, #000 ${maskSolid}%, rgba(0,0,0,0.92) ${maskStart}%, rgba(0,0,0,0.55) ${maskMid}%, rgba(0,0,0,0.18) ${maskEdge}%, transparent 100%)`

  const footOverlay = `linear-gradient(to bottom, rgba(5,5,5,0) 0%, rgba(5,5,5,${0.12 * overlayStrength}) 35%, rgba(5,5,5,${0.45 * overlayStrength}) 62%, rgba(5,5,5,${0.82 * overlayStrength}) 82%, rgba(5,5,5,${overlayStrength}) 100%)`

  const {
    left: shineLeft = 82,
    top: shineTop = 32,
    scale: shineScale = 170,
    opacity: shineOpacity = 0.57,
  } = starShine

  const {
    left: circleLeft = 39.5,
    top: circleTop = 3,
    scale: circleScale = 520,
    opacity: circleOpacity = 0.5,
  } = starCircle

  const {
    left: waveLeft = 1.5,
    bottom: waveBottom = 5,
    width: waveWidth = 23,
    maxWidth: waveMaxWidth = 440,
    opacity: waveOpacity = 0.95,
  } = waveLayout

  const { size, opacity, x, y } = WAVE_PLAY

  const togglePlayback = useCallback(() => {
    window.dispatchEvent(new CustomEvent('aemia:toggle'))
  }, [])

  // Full frame is 9/16; heightShow crops how much vertical of that frame is visible
  const portraitAspectH = (16 * heightShow) / 100

  const resetInkReady = useCallback(() => {
    inkDoneRef.current = 0
    inkReadySentRef.current = false
    onInkReady?.(false)
  }, [onInkReady])

  const markInkDone = useCallback(() => {
    inkDoneRef.current += 1
    if (inkDoneRef.current >= INK_COUNT && !inkReadySentRef.current) {
      inkReadySentRef.current = true
      onInkReady?.(true)
    }
  }, [onInkReady])

  const revealChrome = useCallback(() => {
    if (chromeShownRef.current) return
    chromeShownRef.current = true
    if (chromeFallbackRef.current) {
      chromeFallbackRef.current.kill()
      chromeFallbackRef.current = null
    }
    document
      .querySelector('[data-collage="main"]')
      ?.classList.remove('is-waiting-border')

    // Frame + accent lines — soft fade
    gsap.to('[data-collage="frame"], [data-reveal-with-border]', {
      opacity: 1,
      duration: 0.85,
      ease: 'power2.out',
      overwrite: true,
    })

    // OUT NOW — scale pop only (no rotation, no bounce)
    gsap.fromTo(
      '[data-copy="outnow"]',
      { scale: 1.4, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: true,
        transformOrigin: '50% 50%',
      },
    )
  }, [])

  const hideChrome = useCallback(() => {
    chromeShownRef.current = false
    if (chromeFallbackRef.current) {
      chromeFallbackRef.current.kill()
      chromeFallbackRef.current = null
    }
    gsap.set('[data-collage="frame"], [data-reveal-with-border]', {
      opacity: 0,
    })
    gsap.set('[data-copy="outnow"]', {
      opacity: 0,
      scale: 1.4,
      transformOrigin: '50% 50%',
    })
    document
      .querySelector('[data-collage="main"]')
      ?.classList.add('is-waiting-border')
    // Hard fallback — never leave chrome stuck hidden if ended never fires
    chromeFallbackRef.current = gsap.delayedCall(3.2, revealChrome)
  }, [revealChrome])

  const onMainComplete = useCallback(() => {
    markInkDone()
  }, [markInkDone])

  const onMiaComplete = useCallback(() => {
    markInkDone()
    revealChrome()
  }, [markInkDone, revealChrome])

  useImperativeHandle(
    inkRef,
    () => ({
      replay: async () => {
        resetInkReady()
        hideChrome()
        await Promise.all([
          mainInkRef.current?.replay?.(),
          miaInkRef.current?.replay?.(),
          concertInkRef.current?.replay?.(),
          eyesInkRef.current?.replay?.(),
        ])
      },
      reveal: async () => {
        resetInkReady()
        await Promise.all([
          mainInkRef.current?.reveal?.(),
          miaInkRef.current?.reveal?.(),
          concertInkRef.current?.reveal?.(),
          eyesInkRef.current?.reveal?.(),
        ])
        revealChrome()
        // Forced reveal = ink already at end
        inkDoneRef.current = INK_COUNT
        inkReadySentRef.current = true
        onInkReady?.(true)
      },
    }),
    [hideChrome, revealChrome, resetInkReady, onInkReady],
  )

  const baseInk = {
    ...INK_REVEAL,
    autoPlay: false,
  }

  return (
    <div className="hero-collage pointer-events-none absolute inset-0 z-10 overflow-hidden max-md:opacity-90">
      {/*
        Star underlay — own stacking context BELOW the girl.
        mix-blend-screen stays inside this layer so it never paints over the portrait.
      */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ isolation: 'isolate' }}
      >
        <div
          className="parallax-layer absolute opacity-0"
          data-depth="0.2"
          data-collage="star-circle"
          data-fade-shape="star-circle"
          style={{
            left: `${circleLeft}%`,
            top: `${circleTop}%`,
            width: circleScale,
          }}
        >
          <img
            src="/img/star-circle.png"
            alt=""
            className="h-auto w-full select-none mix-blend-screen"
            style={{ opacity: circleOpacity }}
            draggable={false}
            aria-hidden
          />
        </div>

        <div
          className="parallax-layer absolute opacity-0"
          data-depth="0.9"
          data-collage="compass"
          data-fade-shape="star"
          style={{
            left: `${shineLeft}%`,
            top: `${shineTop}%`,
            width: shineScale,
          }}
        >
          <img
            src="/img/star-shine.png"
            alt=""
            className={`star-shine-spin h-auto w-full select-none mix-blend-screen ${playing ? 'is-ticking' : ''}`}
            style={{ opacity: shineOpacity }}
            draggable={false}
            aria-hidden
          />
        </div>
      </div>

      {/* Foreground collage — always above stars */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
      {/* Main portrait */}
      <div
        className="parallax-layer rough-frame is-waiting-border portrait-blend absolute z-[3] min-w-[160px] overflow-hidden"
        style={{
          left: `${portraitLeft}%`,
          top: `${portraitTop}%`,
          width: `${portraitWidth}%`,
          maxWidth: portraitMaxWidth,
          opacity: portraitOpacity,
          WebkitMaskImage: footMask,
          maskImage: footMask,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
        data-depth="0.35"
        data-collage="main"
        data-ink
        data-glitch
        data-glitch-src="/img/hero-portrait.png"
      >
        <InkRevealPortrait
          ref={mainInkRef}
          imageUrl="/img/hero-portrait.png"
          alt="Aemia"
          {...baseInk}
          size={portrait.size}
          speed={portrait.speed}
          rotation={portrait.rotation}
          onComplete={onMainComplete}
          imgClassName="h-full w-full object-cover object-top"
          style={{ aspectRatio: `9 / ${portraitAspectH}` }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0"
          data-reveal-with-border
          aria-hidden
        >
          <div className="absolute -left-3 top-[18%] h-px w-8 bg-white/50" />
          <div className="absolute -right-4 top-[8%] h-10 w-px bg-white/40" />
          <div className="absolute -bottom-2 left-[12%] h-px w-16 bg-white/35" />
          <div className="absolute bottom-[20%] -right-5 h-px w-10 bg-white/40" />
        </div>
        <div
          className="portrait-blend-fade"
          style={{
            height: `${fadeHeight}%`,
            background: footOverlay,
            filter: brushDistort > 0 ? 'url(#portraitBrushFade)' : 'none',
          }}
          aria-hidden
        />
      </div>

      {/* Kurosh inset — ink */}
      <div
        className="parallax-layer absolute right-[6%] top-[8%] z-[5] w-[15%] max-w-[170px] min-w-[96px] overflow-hidden border border-white/20 md:right-[9%] md:top-[10%]"
        data-depth="0.55"
        data-collage="concert"
        data-ink
        data-glitch
        data-glitch-src="/img/kurosh.jpg"
      >
        <div className="brightness-[0.72] contrast-[1.2] saturate-[0.35]">
          <InkRevealPortrait
            ref={concertInkRef}
            imageUrl="/img/kurosh.jpg"
            className="w-full"
            imgClassName="aspect-[4/5] w-full object-cover object-[center_18%]"
            {...baseInk}
            size={concert.size}
            speed={concert.speed}
            rotation={concert.rotation}
            onComplete={markInkDone}
          />
        </div>
        <div className="absolute inset-0 bg-[#66846b]/25 mix-blend-color" />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
      </div>

      {/* Eyes strip — ink */}
      <div
        className="parallax-layer torn-edge absolute bottom-[16%] right-[4%] z-[5] w-[28%] max-w-[320px] min-w-[160px] overflow-hidden md:bottom-[18%] md:right-[8%]"
        data-depth="0.7"
        data-collage="eyes"
        data-ink
        data-glitch
        data-glitch-src="/img/mia-star.jpeg"
      >
        <div className="brightness-[0.8] contrast-[1.15] saturate-[0.5]">
          <InkRevealPortrait
            ref={eyesInkRef}
            imageUrl="/img/mia-star.jpeg"
            className="w-full"
            imgClassName="aspect-square w-full object-cover object-center"
            {...baseInk}
            size={eyes.size}
            speed={eyes.speed}
            rotation={eyes.rotation}
            onComplete={markInkDone}
          />
        </div>
        <div className="absolute inset-0 bg-aemia-moss/35 mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Girl window photo — ink */}
      <div
        className="parallax-layer absolute z-[10]"
        data-depth="0.45"
        data-collage="mia"
        data-ink
        style={{
          left: `${GIRL_WINDOW.left}%`,
          top: `${GIRL_WINDOW.top}%`,
          width: GIRL_WINDOW.width,
          height: GIRL_WINDOW.height,
          opacity: GIRL_WINDOW.opacity,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          data-glitch
          data-glitch-src="/img/girl-window.jpg"
          style={{
            transform: `rotate(${GIRL_WINDOW.rotate}deg)`,
            // Soften hard rect edges so ink image border doesn't peek past the frame
            WebkitMaskImage:
              'linear-gradient(to right, #000 0%, #000 93%, transparent 100%), linear-gradient(to bottom, #000 0%, #000 94%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
            maskImage:
              'linear-gradient(to right, #000 0%, #000 93%, transparent 100%), linear-gradient(to bottom, #000 0%, #000 94%, transparent 100%)',
            maskComposite: 'intersect',
          }}
        >
          <InkRevealPortrait
            ref={miaInkRef}
            imageUrl="/img/girl-window.jpg"
            className="h-full w-full"
            imgClassName="block h-full w-full object-cover"
            {...baseInk}
            size={windowInk.size}
            speed={windowInk.speed}
            rotation={windowInk.rotation}
            onComplete={onMiaComplete}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] bg-gradient-to-b from-black to-transparent"
            style={{ height: `${GIRL_WINDOW_FADE.top}%` }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-0 top-0 z-[1] bg-[radial-gradient(ellipse_at_top_left,black_0%,transparent_70%)]"
            style={{
              width: `${GIRL_WINDOW_FADE.topLeft}%`,
              height: `${GIRL_WINDOW_FADE.topLeft * 0.85}%`,
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 top-0 z-[1] bg-[radial-gradient(ellipse_at_top_right,black_0%,transparent_70%)]"
            style={{
              width: `${GIRL_WINDOW_FADE.topRight}%`,
              height: `${GIRL_WINDOW_FADE.topRight * 0.85}%`,
            }}
            aria-hidden
          />
          {/* Cover hard bot-right ink rect edge under the open frame corner */}
          <div
            className="pointer-events-none absolute bottom-0 right-0 z-[2] h-[14%] w-[16%] bg-gradient-to-tl from-black via-black/80 to-transparent"
            aria-hidden
          />
        </div>
      </div>

      {/* Girl window frame — opacity owned by GSAP (no React style opacity) */}
      <div
        className="parallax-layer absolute z-[12] opacity-0"
        data-depth="0.45"
        data-collage="frame"
        style={{
          left: `${GIRL_FRAME.left}%`,
          top: `${GIRL_FRAME.top}%`,
          width: GIRL_FRAME.width,
          height: GIRL_FRAME.height,
        }}
      >
        <img
          src="/img/girl-window-frame.png"
          alt=""
          className="block h-full w-full select-none object-fill"
          style={{ transform: `rotate(${GIRL_FRAME.rotate}deg)` }}
          draggable={false}
          aria-hidden
        />
      </div>

      {/* Spray-paint A — in front */}
      <div
        className="parallax-layer absolute z-30"
        data-depth="0.25"
        data-collage="spray"
        style={{
          left: '47%',
          top: '73%',
          width: 188,
          opacity: 1,
        }}
      >
        <img
          src="/img/spray-a.png"
          alt=""
          className="h-auto w-full select-none"
          style={{ transform: 'rotate(1deg)' }}
          draggable={false}
          aria-hidden
        />
      </div>

      {/* Handwritten quote */}
      <div
        className="parallax-layer absolute right-[10%] top-[54%] z-[5] max-w-[200px] rotate-[-2deg] opacity-0 md:right-[14%] md:top-[56%] md:max-w-[220px]"
        data-depth="0.6"
        data-collage="quote"
        data-fade-shape="text"
      >
        <p className="font-hand text-[1.35rem] leading-[1.55] tracking-wide text-aemia-fog/80 md:text-[1.55rem]">
          they call it
          <br />
          kleptomaniac,
          <br />
          i call it
          <br />
          survival
        </p>
        <div className="mt-3 h-px w-[85%] origin-left rotate-[-2deg] bg-white/45" />
      </div>

      {/* Soundwave — big faded play/pause behind bars */}
      <div
        className="absolute z-[20]"
        data-collage="wave"
        style={{
          left: `${waveLeft}%`,
          bottom: `${waveBottom}%`,
          width: `${waveWidth}%`,
          maxWidth: waveMaxWidth,
          opacity: waveOpacity,
        }}
      >
        <div
          className="wave-hit relative w-full"
        >
          {/* Clickable glyph — behind bars; play/pause crossfade */}
          <button
            type="button"
            className="wave-play-glyph pointer-events-auto absolute z-0 border-0 bg-transparent p-0"
            style={{
              left: `calc(50% + ${x}%)`,
              top: `calc(50% + ${y}%)`,
              width: `${size}%`,
              height: 'auto',
              aspectRatio: '1',
              transform: 'translate(-50%, -50%)',
              opacity,
            }}
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={togglePlayback}
          >
            <span className="relative block w-full aspect-square">
              <img
                src="/img/play.png?v=3"
                alt=""
                className="wave-play-img absolute inset-0 h-full w-full max-w-none select-none object-contain"
                draggable={false}
                style={{
                  opacity: playing ? 0 : 1,
                  transition: 'opacity 0.45s ease',
                }}
              />
              <img
                src="/img/pause.png?v=3"
                alt=""
                className="wave-play-img absolute inset-0 h-full w-full max-w-none select-none object-contain"
                draggable={false}
                style={{
                  opacity: playing ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                }}
              />
            </span>
          </button>

          <div className="wave-bars-wrap pointer-events-none relative z-[1]">
            <Waveform className="h-auto w-full" />
          </div>

          {/* Toggle when clicking the bars */}
          <button
            type="button"
            className="wave-play-hit pointer-events-auto absolute inset-0 z-[2] border-0 bg-transparent p-0"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={togglePlayback}
          />
        </div>
      </div>

      {/* Extra girl-2 peek — no ink */}
      <div
        className="parallax-layer absolute left-[58%] top-[62%] z-[5] hidden w-[10%] max-w-[110px] rotate-3 overflow-hidden border border-white/15 opacity-60 lg:block"
        data-depth="0.8"
        data-collage="peek"
        data-glitch
        data-glitch-src="/img/girl-2.jpg"
      >
        <img
          src="/img/girl-2.jpg"
          alt=""
          className="aspect-[3/4] w-full object-cover brightness-[0.7] grayscale"
        />
      </div>
      </div>
    </div>
  )
})

export default HeroCollage
