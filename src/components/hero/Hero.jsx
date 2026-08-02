import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import HeroNav from './HeroNav'
import HeroCopy from './HeroCopy'
import HeroCollage from './HeroCollage'
import { DecorativeLines } from './Decorative'

const INK_SETTINGS = {
  portrait: { size: 1.4, speed: 1, rotation: -8 },
  window: { size: 1.55, speed: 0.85, rotation: 12 },
  concert: { size: 1.7, speed: 1.15, rotation: -18 },
  eyes: { size: 1.5, speed: 0.95, rotation: 22 },
}

function MoonScroll() {
  return (
    <div
      className="absolute bottom-7 left-6 z-30 flex items-end gap-5 md:bottom-9 md:left-10 md:gap-7"
      data-ui="scroll"
    >
      <div className="flex flex-col items-start gap-2">
        <span className="font-body text-[0.5rem] tracking-[0.38em] text-aemia-fog/85">
          SCROLL
        </span>
        <div className="ml-[0.12rem] h-5 w-px bg-white/55 md:h-6" />
      </div>

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
  const inkRef = useRef(null)
  const entranceCtxRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    entranceCtxRef.current = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      // Frame / OUT NOW / accent lines are ink-chrome — not in this set
      const otherLayers = gsap.utils.toArray(
        '[data-collage="spray"], [data-collage="wave"], [data-collage="peek"]',
      )
      const fadeShapes = gsap.utils.toArray('[data-fade-shape]')

      // Hidden until their fade-in — otherwise they flash for the whole intro
      // Start states already hidden in markup/CSS — only set non-border layers here
      gsap.set(fadeShapes, { opacity: 0 })
      gsap.set(otherLayers, { opacity: 0 })
      gsap.set('[data-copy="title"]', { opacity: 0 })

      // Ink starts with the page entrance (not after nav/copy)
      if (!reduceMotion) {
        tl.add(() => {
          inkRef.current?.replay?.()
        }, 0)
      } else {
        tl.add(() => {
          inkRef.current?.reveal?.()
        }, 0)
      }

      // Window border, star, handwritten text — fade in with the page
      tl.to(
        fadeShapes,
        {
          opacity: 1,
          duration: 1.1,
          stagger: 0.18,
          ease: 'power2.out',
        },
        0.15,
      )

      tl.from(
        '[data-nav="logo"]',
        {
          y: -20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
        },
        0,
      )
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

      // Title fades in (no flash)
      tl.to(
        '[data-copy="title"]',
        {
          opacity: 1,
          duration: 1.15,
          ease: 'power2.out',
        },
        '-=0.25',
      )

      tl.from(
        '[data-copy="desc"], [data-copy="btn"]',
        { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 },
        '-=0.35',
      )

      tl.addLabel('collage', '-=0.95')

      tl.to(
        otherLayers,
        {
          opacity: 1,
          duration: 0.9,
          stagger: { each: 0.07, from: 'center' },
          ease: 'power2.out',
        },
        'collage+=0.1',
      )

      tl.from(
        '[data-ui="scroll"], [data-ui="sections"]',
        { opacity: 0, duration: 0.7 },
        '-=0.45',
      )

      gsap.to('.sw-bar', {
        scaleY: () => gsap.utils.random(0.4, 1.4),
        transformOrigin: 'center center',
        duration: () => gsap.utils.random(0.2, 0.45),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 0.05,
      })
    }, root)

    return () => {
      entranceCtxRef.current?.revert()
    }
  }, [])

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative h-svh max-h-svh w-full overflow-hidden bg-aemia-black text-aemia-bone"
    >
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/img/bg.png"
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <DecorativeLines />
      <HeroCollage ref={inkRef} inkSettings={INK_SETTINGS} />
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
