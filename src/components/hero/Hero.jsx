import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import HeroNav from './HeroNav'
import HeroCopy from './HeroCopy'
import HeroCollage from './HeroCollage'
import { DecorativeLines } from './Decorative'

export default function Hero() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let onMove = null

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-nav]', {
        y: -24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
      })
        .from(
          '[data-copy="eyebrow"]',
          { y: 16, opacity: 0, duration: 0.6 },
          '-=0.4',
        )
        .from(
          '[data-copy="title"]',
          {
            y: 60,
            opacity: 0,
            duration: 1.1,
            skewY: 3,
          },
          '-=0.35',
        )
        .from(
          '[data-copy="outnow"]',
          {
            scale: 1.4,
            opacity: 0,
            rotation: -18,
            duration: 0.7,
            ease: 'back.out(1.6)',
          },
          '-=0.45',
        )
        .from(
          '[data-copy="desc"], [data-copy="btn"]',
          { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 },
          '-=0.35',
        )
        .from(
          '[data-collage]',
          {
            opacity: 0,
            scale: 1.06,
            y: 30,
            duration: 1,
            stagger: { each: 0.08, from: 'center' },
            ease: 'power2.out',
          },
          '-=1.1',
        )
        .from(
          '[data-ui="scroll"], [data-ui="sections"]',
          { opacity: 0, duration: 0.8 },
          '-=0.5',
        )

      gsap.to('[data-collage="compass"]', {
        rotation: 360,
        duration: 80,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('[data-collage="quote"]', {
        y: '+=8',
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      gsap.to('[data-collage="spray"]', {
        y: '+=6',
        x: '+=3',
        duration: 4.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      gsap.to('.wave-bar', {
        scaleY: () => gsap.utils.random(0.45, 1.35),
        duration: () => gsap.utils.random(0.25, 0.55),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: {
          each: 0.04,
          repeat: -1,
          yoyo: true,
        },
      })

      gsap.to('.sw-bar', {
        scaleY: () => gsap.utils.random(0.4, 1.4),
        transformOrigin: 'center center',
        duration: () => gsap.utils.random(0.2, 0.45),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 0.05,
      })

      const layers = gsap.utils.toArray('.parallax-layer')
      onMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2

        layers.forEach((el) => {
          const depth = Number(el.dataset.depth || 0.3)
          gsap.to(el, {
            x: x * depth * 28,
            y: y * depth * 18,
            duration: 0.9,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        })
      }

      window.addEventListener('mousemove', onMove)
    }, root)

    return () => {
      if (onMove) window.removeEventListener('mousemove', onMove)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative min-h-svh w-full overflow-hidden bg-aemia-black text-aemia-bone"
    >
      {/* Atmospheric base */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,#1a1f1a_0%,#050505_55%,#000_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light">
        <img src="/img/bg.png" alt="" className="h-full w-full object-cover invert" />
      </div>

      <DecorativeLines />
      <HeroCollage />
      <HeroNav />

      <div className="relative z-20 flex min-h-[calc(100svh-5rem)] flex-col justify-between pb-8">
        <HeroCopy />

        {/* Bottom UI chrome */}
        <div className="relative flex items-end justify-between px-5 md:px-10">
          {/* Scroll indicator */}
          <div className="flex items-end gap-3" data-ui="scroll">
            <span className="mb-8 origin-bottom -rotate-90 font-body text-[0.55rem] tracking-[0.4em] text-aemia-ash whitespace-nowrap">
              SCROLL
            </span>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-px bg-gradient-to-b from-white/55 via-white/25 to-transparent md:h-20" />
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M2 7.5C2 5 4 3 6 1.5C8 3 10 5 10 7.5C10 9.4 8.2 11 6 11C3.8 11 2 9.4 2 7.5Z"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          </div>

          {/* Spacer so collage breathes on mobile */}
          <div className="pointer-events-none h-24 w-1/2 md:h-32" />
        </div>
      </div>

      {/* Vertical section numbers */}
      <aside
        className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-5 md:right-5 lg:flex"
        data-ui="sections"
        aria-label="Sections"
      >
        {['01', '02', '03'].map((n, i) => (
          <button
            key={n}
            type="button"
            className={`section-dot relative font-body text-[0.65rem] tracking-[0.2em] transition-colors ${
              i === 1
                ? 'active text-aemia-bone'
                : 'text-aemia-ash/60 hover:text-aemia-fog'
            }`}
          >
            {n}
          </button>
        ))}
      </aside>

      <div className="grain" aria-hidden />
    </section>
  )
}
