import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import HeroNav from './HeroNav'
import HeroCopy from './HeroCopy'
import HeroCollage from './HeroCollage'
import HeroSocials from './HeroSocials'
import { DecorativeLines } from './Decorative'
import { useMusicGlitch } from '../../hooks/useMusicGlitch'
import { useAudioReactiveBars } from '../../hooks/useAudioReactiveBars'

const INK_SETTINGS = {
  portrait: { size: 1.4, speed: 1, rotation: -8 },
  window: { size: 1.55, speed: 0.85, rotation: 12 },
  concert: { size: 1.7, speed: 1.15, rotation: -18 },
  eyes: { size: 1.5, speed: 0.95, rotation: 22 },
}

const PORTRAIT_LAYOUT = {
  width: 60,
  maxWidth: 488,
  heightShow: 93,
  opacity: 0.85,
  blendFade: 60,
  top: 1,
  left: 45.5,
}

const GLITCH_SETTINGS = {
  amount: 0.35,
  everySeconds: 5,
  burstMs: 500,
}

function MoonScroll() {
  return (
    <div
      className="absolute bottom-7 right-6 z-30 flex flex-row-reverse items-end gap-5 md:bottom-9 md:right-10 md:gap-7"
      data-ui="scroll"
    >
      <div className="flex flex-col items-end gap-2">
        <span className="font-body text-[0.5rem] tracking-[0.38em] text-aemia-fog/85">
          SCROLL
        </span>
        <div className="mr-[0.12rem] h-5 w-px bg-white/55 md:h-6" />
      </div>

      <div className="mb-[9px] flex flex-row-reverse items-center md:mb-[11px]">
        <div className="h-px w-24 bg-white/50 md:w-36" />
        <img
          src="/img/moon.png"
          alt=""
          className="h-3.5 w-auto translate-x-px select-none opacity-90 md:h-4"
          draggable={false}
          aria-hidden
        />
      </div>
    </div>
  )
}

export default function Hero({ playing = false, audioGraphRef = null }) {
  const rootRef = useRef(null)
  const inkRef = useRef(null)
  const entranceCtxRef = useRef(null)
  const [inkReady, setInkReady] = useState(false)

  useMusicGlitch(playing && inkReady, rootRef, GLITCH_SETTINGS)
  useAudioReactiveBars(playing, audioGraphRef)

  const onInkReady = useCallback((ready) => {
    setInkReady(Boolean(ready))
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    entranceCtxRef.current = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const otherLayers = gsap.utils.toArray(
        '[data-collage="spray"], [data-collage="wave"], [data-collage="peek"]',
      )
      const fadeShapes = gsap.utils.toArray('[data-fade-shape]')

      gsap.set(fadeShapes, { opacity: 0 })
      gsap.set(otherLayers, { opacity: 0 })
      gsap.set('[data-copy="title"]', { opacity: 0 })
      // Bars are driven by endpoint attributes — no scaleY

      if (!reduceMotion) {
        tl.add(() => {
          inkRef.current?.replay?.()
        }, 0)
      } else {
        tl.add(() => {
          inkRef.current?.reveal?.()
        }, 0)
      }

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
        '[data-ui="scroll"], [data-ui="sections"], [data-ui="socials"]',
        { opacity: 0, duration: 0.7 },
        '-=0.45',
      )
    }, root)

    return () => {
      entranceCtxRef.current?.revert()
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const els = gsap.utils.toArray(root.querySelectorAll('.parallax-layer'))
    if (!els.length) return undefined

    const layers = els.map((el, i) => {
      const depth = Number(el.dataset.depth || 0.3)
      return {
        el,
        depth,
        lag: 0.02 + (1 - Math.min(depth, 1)) * 0.028 + (i % 7) * 0.006,
        curX: 0,
        curY: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.22,
        ampX: 1.8 + depth * 4.5 + Math.random() * 2.5,
        ampY: 1.4 + depth * 3.5 + Math.random() * 2,
        mxScale: 0.85 + Math.random() * 0.3,
        myScale: 0.85 + Math.random() * 0.3,
        invertX: Math.random() > 0.85 ? -1 : 1,
        invertY: Math.random() > 0.88 ? -1 : 1,
      }
    })

    const mouse = { x: 0, y: 0 }

    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const tick = () => {
      const t = performance.now() / 1000

      layers.forEach((L) => {
        const idleX =
          Math.sin(t * L.speed + L.phase) * L.ampX +
          Math.sin(t * L.speed * 0.4 + L.phase * 2.1) * L.ampX * 0.3
        const idleY =
          Math.cos(t * L.speed * 0.9 + L.phase * 1.35) * L.ampY +
          Math.sin(t * L.speed * 0.55 + L.phase) * L.ampY * 0.25

        const targetX =
          mouse.x * L.depth * 12 * L.mxScale * L.invertX + idleX
        const targetY =
          mouse.y * L.depth * 8 * L.myScale * L.invertY + idleY

        L.curX += (targetX - L.curX) * L.lag
        L.curY += (targetY - L.curY) * L.lag
        gsap.set(L.el, { x: L.curX, y: L.curY })
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tick)
      layers.forEach((L) => gsap.set(L.el, { x: 0, y: 0 }))
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
          src="/img/bg.jpg"
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <DecorativeLines />
      <HeroCollage
        ref={inkRef}
        inkSettings={INK_SETTINGS}
        portraitLayout={PORTRAIT_LAYOUT}
        onInkReady={onInkReady}
      />
      <HeroNav playing={playing} />
      <HeroCopy />
      <HeroSocials />
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
