import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import HeroNav from './HeroNav'
import HeroCopy from './HeroCopy'
import HeroCollage from './HeroCollage'
import { DecorativeLines } from './Decorative'

function MoonScroll() {
  return (
    <div
      className="absolute bottom-7 left-6 z-30 flex items-end gap-5 md:bottom-9 md:left-10 md:gap-7"
      data-ui="scroll"
    >
      {/* SCROLL stacked over short vertical tick */}
      <div className="flex flex-col items-start gap-2">
        <span className="font-body text-[0.5rem] tracking-[0.38em] text-aemia-fog/85">
          SCROLL
        </span>
        <div className="ml-[0.12rem] h-5 w-px bg-white/55 md:h-6" />
      </div>

      {/* Horizontal rule → moon */}
      <div className="mb-[9px] flex items-center md:mb-[11px]">
        <div className="h-px w-24 bg-white/50 md:w-36" />
        <img
          src="/img/moon.png"
          alt=""
          className="h-3.5 w-auto -translate-x-px -scale-x-100 select-none opacity-90 md:h-4"
          draggable={false}
          aria-hidden
        />
      </div>
    </div>
  )
}

export default function Hero() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let onMove = null

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-nav="logo"]', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
      })
        .from(
          '[data-nav="link"]',
          { y: -14, opacity: 0, duration: 0.65, stagger: 0.05 },
          '-=0.5',
        )
        .from(
          '[data-nav="cta"]',
          { y: -14, opacity: 0, duration: 0.65 },
          '-=0.5',
        )
        .from(
          '[data-copy="eyebrow"]',
          { y: 14, opacity: 0, duration: 0.55 },
          '-=0.35',
        )
        .from(
          '[data-copy="title"]',
          { y: 40, opacity: 0, duration: 1, skewY: 2 },
          '-=0.3',
        )
        .from(
          '[data-copy="outnow"]',
          {
            scale: 1.25,
            opacity: 0,
            rotation: -14,
            duration: 0.65,
            ease: 'back.out(1.5)',
          },
          '-=0.4',
        )
        .from(
          '[data-copy="desc"], [data-copy="btn"]',
          { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 },
          '-=0.3',
        )
        .from(
          '[data-collage]',
          {
            opacity: 0,
            scale: 1.04,
            y: 24,
            duration: 0.9,
            stagger: { each: 0.07, from: 'center' },
            ease: 'power2.out',
          },
          '-=0.95',
        )
        .from(
          '[data-ui="scroll"], [data-ui="sections"]',
          { opacity: 0, duration: 0.7 },
          '-=0.45',
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
      className="relative h-svh max-h-svh w-full overflow-hidden bg-aemia-black text-aemia-bone"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,#1a1f1a_0%,#050505_55%,#000_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light">
        <img src="/img/bg.png" alt="" className="h-full w-full object-cover invert" />
      </div>

      <DecorativeLines />
      <HeroCollage />
      <HeroNav />
      <HeroCopy />
      <MoonScroll />

      <aside
        className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex"
        data-ui="sections"
        aria-label="Sections"
      >
        {['01', '02', '03'].map((n, i) => (
          <button
            key={n}
            type="button"
            className={`section-dot relative font-body text-[0.62rem] tracking-[0.2em] transition-colors ${
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
