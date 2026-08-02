import gsap from 'gsap'
import { useEffect, useRef } from 'react'

const COMPASS = {
  left: 50,
  top: 50,
  width: 520,
  opacity: 0.63,
}

const CENTER_STAR = {
  left: 50,
  top: 12,
  width: 120,
  opacity: 0.77,
}

export default function Intro({ onEnterClick, onEnterComplete }) {
  const rootRef = useRef(null)
  const leavingRef = useRef(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let glitchTimer = null

    const ctx = gsap.context(() => {
      const compass = root.querySelector('[data-intro-compass]')
      const spin = root.querySelector('[data-intro-compass-spin]')
      const ghostR = root.querySelector('[data-intro-ghost="r"]')
      const ghostB = root.querySelector('[data-intro-ghost="b"]')

      gsap.from('[data-intro]', {
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power2.out',
      })

      // Slow continuous spin (whole stack)
      gsap.to(spin, {
        rotation: 360,
        duration: 90,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      })

      // Super subtle, slow blink
      const blink = gsap.to(compass, {
        opacity: COMPASS.opacity * 0.92,
        duration: 4.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      const resetGlitch = () => {
        gsap.set(compass, {
          x: 0,
          y: 0,
          skewX: 0,
          filter: 'none',
          opacity: COMPASS.opacity,
        })
        gsap.set([ghostR, ghostB], {
          opacity: 0,
          x: 0,
          y: 0,
        })
      }

      const runGlitch = () => {
        if (leavingRef.current || !compass) return

        blink.pause()

        const tl = gsap.timeline({
          onComplete: () => {
            resetGlitch()
            blink.invalidate().restart(true)
            glitchTimer = gsap.delayedCall(
              gsap.utils.random(2.6, 7.2),
              runGlitch,
            )
          },
        })

        // Blink burst
        tl.to(compass, { opacity: 0.08, duration: 0.035, ease: 'none' })
          .to(compass, {
            opacity: Math.min(1, COMPASS.opacity * 1.25),
            duration: 0.04,
            ease: 'none',
          })
          .to(compass, { opacity: 0.2, duration: 0.03, ease: 'none' })

          // Color / channel glitch
          .to(
            compass,
            {
              filter: 'hue-rotate(110deg) saturate(2.4) contrast(1.3)',
              x: gsap.utils.random(-7, 7),
              y: gsap.utils.random(-3, 3),
              skewX: gsap.utils.random(-4, 4),
              duration: 0.05,
              ease: 'none',
            },
            '+=0.01',
          )
          .set(ghostR, { opacity: 0.55, x: -6, y: 1 })
          .set(ghostB, { opacity: 0.5, x: 6, y: -1 })
          .to(compass, {
            filter: 'hue-rotate(-95deg) saturate(2) contrast(1.2)',
            x: gsap.utils.random(-8, 8),
            duration: 0.05,
            ease: 'none',
          })
          .to([ghostR, ghostB], { opacity: 0, duration: 0.04 }, '<')

          // Second micro flicker
          .to(compass, {
            opacity: 0.12,
            filter: 'hue-rotate(40deg) brightness(1.4)',
            x: gsap.utils.random(-4, 4),
            duration: 0.03,
            ease: 'none',
          })
          .to(compass, {
            opacity: COMPASS.opacity,
            filter: 'none',
            x: 0,
            y: 0,
            skewX: 0,
            duration: 0.09,
            ease: 'power1.out',
          })
      }

      glitchTimer = gsap.delayedCall(gsap.utils.random(1.8, 3.5), runGlitch)
    }, root)

    return () => {
      glitchTimer?.kill()
      ctx.revert()
    }
  }, [])

  const handleEnter = (e) => {
    e.preventDefault()
    if (leavingRef.current) return
    leavingRef.current = true

    onEnterClick?.()

    const root = rootRef.current
    if (!root) {
      onEnterComplete?.()
      return
    }

    gsap.to(root, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      onComplete: () => onEnterComplete?.(),
    })
  }

  return (
    <section
      ref={rootRef}
      className="relative h-svh max-h-svh w-full overflow-hidden bg-aemia-black text-aemia-bone"
    >
      <img
        src="/img/intro-background.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <div
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${COMPASS.left}%`,
          top: `${COMPASS.top}%`,
          width: COMPASS.width,
        }}
      >
        <div data-intro-compass-spin className="relative w-full">
          <img
            data-intro-ghost="r"
            src="/img/intro-compass.png"
            alt=""
            className="pointer-events-none absolute inset-0 h-auto w-full select-none opacity-0 mix-blend-screen"
            style={{
              filter: 'sepia(1) saturate(8) hue-rotate(-40deg) brightness(1.1)',
            }}
            draggable={false}
            aria-hidden
          />
          <img
            data-intro-compass
            src="/img/intro-compass.png"
            alt=""
            className="relative block h-auto w-full select-none"
            style={{ opacity: COMPASS.opacity }}
            draggable={false}
            aria-hidden
          />
          <img
            data-intro-ghost="b"
            src="/img/intro-compass.png"
            alt=""
            className="pointer-events-none absolute inset-0 h-auto w-full select-none opacity-0 mix-blend-screen"
            style={{
              filter: 'sepia(1) saturate(8) hue-rotate(160deg) brightness(1.1)',
            }}
            draggable={false}
            aria-hidden
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${CENTER_STAR.left}%`,
          top: `${CENTER_STAR.top}%`,
          width: CENTER_STAR.width,
        }}
      >
        <img
          src="/img/intro-center-star.png"
          alt=""
          className="block h-auto w-full select-none"
          style={{ opacity: CENTER_STAR.opacity }}
          draggable={false}
          aria-hidden
        />
      </div>

      <a
        data-intro
        href="#top"
        className="pointer-events-auto absolute z-30 block"
        style={{ left: 40, top: 21 }}
        onClick={(e) => e.preventDefault()}
      >
        <img
          src="/img/aemia-logo.png"
          alt="Aemia"
          className="w-auto select-none"
          style={{ height: 64 }}
          draggable={false}
        />
      </a>

      <button
        data-intro
        type="button"
        onClick={handleEnter}
        className="absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center outline-none"
        aria-label="Enter Aemia"
      >
        <span className="font-body text-[0.72rem] font-medium tracking-[0.55em] text-aemia-bone md:text-[0.8rem]">
          ENTER AEMIA
        </span>
        <span className="mt-3 text-sm text-aemia-bone/80" aria-hidden>
          →
        </span>
      </button>

      <div
        data-intro
        className="absolute bottom-7 left-6 z-30 md:bottom-9 md:left-10"
      >
        <p className="font-body text-[0.58rem] font-medium tracking-[0.32em] text-aemia-bone/85">
          MUSIC IS SURVIVAL.
        </p>
        <div className="mt-3 h-px w-28 bg-white/45 md:w-36" />
      </div>
    </section>
  )
}
