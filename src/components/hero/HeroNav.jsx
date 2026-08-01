import { SoundwaveIcon } from './Decorative'

const LINKS = ['MUSIC', 'VIDEOS', 'TOUR', 'ABOUT', 'MERCH']

export default function HeroNav() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-5 pt-5 md:px-10 md:pt-7">
      {/* Logo + star — top left */}
      <div
        className="pointer-events-auto flex flex-col items-start gap-5 md:gap-6"
        data-nav="logo"
      >
        <a href="#top" className="block shrink-0">
          <img
            src="/img/aemia-logo.png"
            alt="Aemia"
            className="h-8 w-auto select-none md:h-10"
            draggable={false}
          />
        </a>
        <img
          src="/img/star.png"
          alt=""
          className="ml-1 h-3.5 w-auto select-none opacity-90 md:ml-1.5 md:h-4"
          draggable={false}
          aria-hidden
        />
      </div>

      {/* Center nav */}
      <nav
        className="pointer-events-auto absolute left-1/2 top-5 hidden -translate-x-1/2 items-center gap-7 lg:flex md:top-7"
        aria-label="Primary"
      >
        {LINKS.map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="nav-link font-body text-[0.68rem] font-medium tracking-[0.28em] text-aemia-fog/90 transition-colors hover:text-white"
            data-nav="link"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* LISTEN NOW + waveform — locked top-right */}
      <a
        href="#listen"
        className="pointer-events-auto absolute right-5 top-5 z-50 flex items-center gap-3 font-body text-[0.7rem] font-medium tracking-[0.28em] text-white md:right-10 md:top-7"
        data-nav="cta"
      >
        LISTEN NOW
        <SoundwaveIcon />
      </a>
    </header>
  )
}
