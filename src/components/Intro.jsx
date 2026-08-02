import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function Intro({ onEnterClick, onEnterComplete }) {
  const rootRef = useRef(null)
  const leavingRef = useRef(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.from('[data-intro]', {
        opacity: 0,
        y: 18,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const handleEnter = (e) => {
    e.preventDefault()
    if (leavingRef.current) return
    leavingRef.current = true

    // Start audio in the same user gesture
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
      className="relative flex h-svh max-h-svh w-full flex-col items-center justify-center overflow-hidden bg-aemia-black text-aemia-bone"
    >
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/img/bg.png"
          alt=""
          className="h-full w-full object-cover opacity-80"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <img
          data-intro
          src="/img/aemia-logo.png"
          alt="Aemia"
          className="mb-10 h-10 w-auto select-none md:h-12"
          draggable={false}
        />

        <p
          data-intro
          className="mb-8 max-w-[16rem] font-body text-[0.68rem] font-medium tracking-[0.38em] text-aemia-fog/75"
        >
          NEW SINGLE — KLEPTOMANIAC
        </p>

        <button
          data-intro
          type="button"
          onClick={handleEnter}
          className="group relative border border-aemia-bone/70 bg-transparent px-10 py-3.5 font-body text-[0.72rem] font-medium tracking-[0.42em] text-aemia-bone transition-colors hover:border-aemia-bone hover:bg-aemia-bone/5"
        >
          ENTER
          <span
            className="ml-4 inline-block transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            →
          </span>
        </button>
      </div>

      <div className="grain" aria-hidden />
    </section>
  )
}
