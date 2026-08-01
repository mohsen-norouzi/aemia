import { SoundwaveIcon } from './Decorative'

const LINKS = ['MUSIC', 'VIDEOS', 'TOUR', 'ABOUT', 'MERCH']

export default function HeroNav() {
  return (
    <header className="hero-nav relative z-30 flex items-center justify-between gap-4 px-5 pt-5 md:px-10 md:pt-7">
      <a
        href="#top"
        className="font-logo text-[1.65rem] leading-none tracking-wide text-aemia-bone md:text-[1.9rem]"
        data-nav="logo"
      >
        AEMIA
      </a>

      <nav
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 lg:flex"
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

      <a
        href="#listen"
        className="group flex items-center gap-2.5 font-body text-[0.68rem] font-medium tracking-[0.22em] text-aemia-bone transition-opacity hover:opacity-80"
        data-nav="cta"
      >
        LISTEN NOW
        <SoundwaveIcon className="translate-y-px" />
      </a>
    </header>
  )
}
