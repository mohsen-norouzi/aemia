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
  const hoverRef = useRef(false)
  const animRef = useRef({
    spin: null,
    blink: null,
    glitchTimer: null,
    glitchTl: null,
  })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const compass = root.querySelector('[data-intro-compass]')
      const spinEl = root.querySelector('[data-intro-compass-spin]')
      const ghostR = root.querySelector('[data-intro-ghost="r"]')
      const ghostB = root.querySelector('[data-intro-ghost="b"]')
      const star = root.querySelector('[data-intro-star]')

      gsap.from('[data-intro]', {
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power2.out',
      })

      const spin = gsap.to(spinEl, {
        rotation: 360,
        duration: 90,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      })

      const blink = gsap.to(compass, {
        opacity: COMPASS.opacity * 0.92,
        duration: 4.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      animRef.current.spin = spin
      animRef.current.blink = blink

      const resetGlitch = () => {
        if (hoverRef.current) return
        gsap.set(compass, {
          x: 0,
          y: 0,
          skewX: 0,
          filter: 'none',
          opacity: COMPASS.opacity,
        })
        gsap.set([ghostR, ghostB], { opacity: 0, x: 0, y: 0 })
      }

      const scheduleGlitch = () => {
        animRef.current.glitchTimer?.kill()
        if (leavingRef.current || hoverRef.current) return
        animRef.current.glitchTimer = gsap.delayedCall(
          gsap.utils.random(2.6, 7.2),
          runGlitch,
        )
      }

      const runGlitch = () => {
        if (leavingRef.current || hoverRef.current || !compass) return

        blink.pause()

        const tl = gsap.timeline({
          onComplete: () => {
            animRef.current.glitchTl = null
            if (hoverRef.current) return
            resetGlitch()
            blink.invalidate().restart(true)
            scheduleGlitch()
          },
        })
        animRef.current.glitchTl = tl

        tl.to(compass, { opacity: 0.08, duration: 0.035, ease: 'none' })
          .to(compass, {
            opacity: Math.min(1, COMPASS.opacity * 1.25),
            duration: 0.04,
            ease: 'none',
          })
          .to(compass, { opacity: 0.2, duration: 0.03, ease: 'none' })
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

      animRef.current.glitchTimer = gsap.delayedCall(
        gsap.utils.random(1.8, 3.5),
        runGlitch,
      )

      // Hover API used by button handlers
      animRef.current.onEnterHover = () => {
        hoverRef.current = true
        animRef.current.glitchTimer?.kill()
        animRef.current.glitchTl?.kill()
        spin.pause()
        blink.pause()

        gsap.to(compass, {
          opacity: 0.95,
          filter: 'brightness(1.25) contrast(1.05)',
          x: 0,
          y: 0,
          skewX: 0,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: true,
        })
        gsap.to([ghostR, ghostB], { opacity: 0, duration: 0.2 })
        gsap.to(star, {
          opacity: 1,
          scale: 1.08,
          duration: 0.35,
          ease: 'power2.out',
        })
        gsap.to('[data-enter-label]', {
          letterSpacing: '0.52em',
          color: '#e8e6e0',
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        })
      }

      animRef.current.onLeaveHover = () => {
        if (leavingRef.current) return
        hoverRef.current = false

        gsap.to(compass, {
          opacity: COMPASS.opacity,
          filter: 'none',
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
        })
        gsap.to(star, {
          opacity: CENTER_STAR.opacity,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        })
        gsap.to('[data-enter-label]', {
          letterSpacing: '0.42em',
          color: 'rgba(200,200,196,0.9)',
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        })

        spin.resume()
        blink.invalidate().restart(true)
        scheduleGlitch()
      }
    }, root)

    return () => {
      animRef.current.glitchTimer?.kill()
      animRef.current.glitchTl?.kill()
      ctx.revert()
    }
  }, [])

  const handleEnter = (e) => {
    e.preventDefault()
    if (leavingRef.current) return
    leavingRef.current = true
    hoverRef.current = true
    animRef.current.glitchTimer?.kill()
    animRef.current.glitchTl?.kill()
    animRef.current.spin?.pause()
    animRef.current.blink?.pause()

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
      className="relative h-svh max-h-svh w-full overflow-hidden bg-vexara-black text-vexara-bone"
    >
      <img
        src="/img/intro-background.jpg"
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
        data-intro-star
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
          src="/img/vexara-logo.png"
          alt="Vexara"
          className="w-auto select-none"
          style={{ height: 92 }}
          draggable={false}
        />
      </a>

      <button
        data-intro
        type="button"
        onClick={handleEnter}
        onMouseEnter={() => animRef.current.onEnterHover?.()}
        onMouseLeave={() => animRef.current.onLeaveHover?.()}
        onFocus={() => animRef.current.onEnterHover?.()}
        onBlur={() => animRef.current.onLeaveHover?.()}
        className="group absolute left-1/2 top-1/2 z-30 flex h-[min(58vw,280px)] w-[min(58vw,280px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full outline-none"
        aria-label="Enter Vexara"
      >
        <span
          data-enter-label
          className="font-display text-[0.95rem] font-normal uppercase tracking-[0.42em] text-vexara-fog/90 md:text-[1.1rem]"
        >
          Enter Vexara
        </span>
      </button>

      <div
        data-intro
        className="pointer-events-none absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center md:bottom-9"
      >
        <p className="font-body text-[0.55rem] font-medium tracking-[0.42em] text-vexara-fog/75 md:text-[0.58rem] md:tracking-[0.48em]">
          MUSIC IS{' '}
          <span className="text-[#66846b]">SURVIVAL</span>
          <span className="text-vexara-fog/40">.</span>
        </p>
        <div
          className="mt-3.5 flex items-center gap-1.5"
          aria-hidden
        >
          <span className="h-px w-5 bg-[#66846b]/45 md:w-7" />
          <span className="h-px w-10 bg-vexara-bone/30 md:w-14" />
          <span className="inline-block h-1.5 w-1.5 rotate-45 border border-vexara-bone/35" />
          <span className="h-px w-10 bg-vexara-bone/30 md:w-14" />
          <span className="h-px w-5 bg-[#66846b]/45 md:w-7" />
        </div>
      </div>
    </section>
  )
}
