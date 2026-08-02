import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import { Compass, Waveform } from './Decorative'
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

const DEFAULT_INK = {
  size: INK_REVEAL.size,
  speed: INK_REVEAL.speed,
  rotation: INK_REVEAL.rotation,
}

const STAR_CIRCLE = {
  left: 22.5,
  top: 3,
  width: 520,
  opacity: 0.72,
  rotate: 0,
}

const HeroCollage = forwardRef(function HeroCollage(
  { inkSettings = {} },
  inkRef,
) {
  const mainInkRef = useRef(null)
  const miaInkRef = useRef(null)
  const concertInkRef = useRef(null)
  const eyesInkRef = useRef(null)
  const chromeShownRef = useRef(false)
  const chromeFallbackRef = useRef(null)

  const portrait = { ...DEFAULT_INK, ...inkSettings.portrait }
  const windowInk = { ...DEFAULT_INK, ...inkSettings.window }
  const concert = { ...DEFAULT_INK, ...inkSettings.concert }
  const eyes = { ...DEFAULT_INK, ...inkSettings.eyes }

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

  useImperativeHandle(
    inkRef,
    () => ({
      replay: async () => {
        hideChrome()
        await Promise.all([
          mainInkRef.current?.replay?.(),
          miaInkRef.current?.replay?.(),
          concertInkRef.current?.replay?.(),
          eyesInkRef.current?.replay?.(),
        ])
      },
      reveal: async () => {
        await Promise.all([
          mainInkRef.current?.reveal?.(),
          miaInkRef.current?.reveal?.(),
          concertInkRef.current?.reveal?.(),
          eyesInkRef.current?.reveal?.(),
        ])
        revealChrome()
      },
    }),
    [hideChrome, revealChrome],
  )

  const baseInk = {
    ...INK_REVEAL,
    autoPlay: false,
  }

  return (
    <div className="hero-collage pointer-events-none absolute inset-0 z-10 overflow-hidden max-md:opacity-90">
      {/* Star circle — locked behind girl images */}
      <div
        className="parallax-layer absolute z-0 opacity-0"
        data-depth="0.2"
        data-collage="star-circle"
        data-fade-shape="star-circle"
        style={{
          left: `${STAR_CIRCLE.left}%`,
          top: `${STAR_CIRCLE.top}%`,
          width: STAR_CIRCLE.width,
        }}
      >
        <img
          src="/img/star-circle.png"
          alt=""
          className="h-auto w-full select-none"
          style={{
            opacity: STAR_CIRCLE.opacity,
            transform: `rotate(${STAR_CIRCLE.rotate}deg)`,
          }}
          draggable={false}
          aria-hidden
        />
      </div>

      {/* Main portrait */}
      <div
        className="parallax-layer rough-frame is-waiting-border absolute left-[48%] top-[28%] z-[3] w-[46%] max-w-[420px] min-w-[160px] sm:left-[42%] sm:top-[14%] sm:w-[38%] md:left-[46%] md:top-[10%] lg:left-[48%]"
        data-depth="0.35"
        data-collage="main"
        data-ink
      >
        <InkRevealPortrait
          ref={mainInkRef}
          imageUrl="/img/hero-portrait.png"
          alt="Aemia"
          {...baseInk}
          size={portrait.size}
          speed={portrait.speed}
          rotation={portrait.rotation}
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
      </div>

      {/* Concert inset — ink */}
      <div
        className="parallax-layer absolute right-[6%] top-[10%] z-[5] w-[18%] max-w-[200px] min-w-[110px] overflow-hidden border border-white/20 md:right-[9%] md:top-[12%]"
        data-depth="0.55"
        data-collage="concert"
        data-ink
      >
        <div className="brightness-[0.7] contrast-[1.1] hue-rotate-[190deg] saturate-[0.6]">
          <InkRevealPortrait
            ref={concertInkRef}
            imageUrl="/img/concert.jpg"
            className="w-full"
            imgClassName="aspect-[4/3] w-full object-cover"
            {...baseInk}
            size={concert.size}
            speed={concert.speed}
            rotation={concert.rotation}
          />
        </div>
        <div className="absolute inset-0 bg-sky-900/25 mix-blend-color" />
      </div>

      {/* Eyes strip — ink */}
      <div
        className="parallax-layer torn-edge absolute bottom-[16%] right-[4%] z-[5] w-[28%] max-w-[320px] min-w-[160px] md:bottom-[18%] md:right-[8%]"
        data-depth="0.7"
        data-collage="eyes"
        data-ink
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
            imageUrl="/img/girl-window.png"
            className="h-full w-full"
            imgClassName="block h-full w-full object-cover"
            {...baseInk}
            size={windowInk.size}
            speed={windowInk.speed}
            rotation={windowInk.rotation}
            onComplete={revealChrome}
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

      {/* Compass / star */}
      <div
        className="parallax-layer absolute right-[2%] top-[42%] z-[5] w-[140px] opacity-0 md:right-[4%] md:top-[40%] md:w-[170px]"
        data-depth="0.9"
        data-collage="compass"
        data-fade-shape="star"
      >
        <Compass className="h-full w-full opacity-80" />
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

      {/* Soundwave graphic */}
      <div
        className="parallax-layer absolute bottom-[10%] right-[10%] z-[5] w-[40%] max-w-[360px] opacity-70 md:bottom-[12%] md:right-[14%]"
        data-depth="0.4"
        data-collage="wave"
      >
        <Waveform className="h-auto w-full" />
      </div>

      {/* Extra girl-2 peek — no ink */}
      <div
        className="parallax-layer absolute left-[58%] top-[62%] z-[5] hidden w-[10%] max-w-[110px] rotate-3 overflow-hidden border border-white/15 opacity-60 lg:block"
        data-depth="0.8"
        data-collage="peek"
      >
        <img
          src="/img/girl-2.jpg"
          alt=""
          className="aspect-[3/4] w-full object-cover brightness-[0.7] grayscale"
        />
      </div>
    </div>
  )
})

export default HeroCollage
