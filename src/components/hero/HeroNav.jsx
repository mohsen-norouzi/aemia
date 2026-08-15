import { SoundwaveIcon } from './Decorative'

const LINKS = ['MUSIC', 'VIDEOS', 'TOUR', 'ABOUT', 'MERCH']

export default function HeroNav({ playing = false }) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 h-14 md:h-16">
      <a
        href="#top"
        className="pointer-events-auto absolute block"
        data-nav="logo"
        style={{ left: 40, top: 21, opacity: 1 }}
      >
        <img
          src="/img/vexara-logo.png"
          alt="Vexara"
          className="w-auto select-none"
          style={{ height: 64 }}
          draggable={false}
        />
      </a>

      <img
        src="/img/star.png"
        alt=""
        className="pointer-events-none absolute w-auto select-none"
        style={{ left: 69, top: 134, height: 48, opacity: 0.77 }}
        draggable={false}
        aria-hidden
        data-nav="logo"
      />

      <nav
        className="pointer-events-auto absolute left-1/2 top-5 hidden -translate-x-1/2 items-center gap-8 lg:flex md:top-6"
        aria-label="Primary"
      >
        {LINKS.map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="nav-link font-body text-[0.62rem] font-medium tracking-[0.32em] text-vexara-fog/90 transition-colors hover:text-white"
            data-nav="link"
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="pointer-events-auto absolute right-6 top-5 z-50 flex items-center gap-2.5 font-body text-[0.62rem] font-medium tracking-[0.28em] text-white transition-colors hover:text-vexara-fog md:right-10 md:top-6"
        data-nav="cta"
        aria-label={playing ? 'Pause' : 'Listen now'}
        onClick={() => {
          window.dispatchEvent(new CustomEvent('vexara:toggle'))
        }}
      >
        LISTEN NOW
        <SoundwaveIcon />
      </button>
    </header>
  )
}
