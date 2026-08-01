import { SoundwaveIcon } from './Decorative'

const LINKS = ['MUSIC', 'VIDEOS', 'TOUR', 'ABOUT', 'MERCH']

export default function HeroNav() {
  return (
    <header className="hero-nav relative z-30 flex items-start justify-between gap-4 px-5 pt-5 md:px-10 md:pt-7">
      <div className="flex flex-col items-start gap-5 md:gap-6" data-nav="logo">
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

      <nav
        className="absolute left-1/2 top-7 hidden -translate-x-1/2 items-center gap-7 lg:flex md:top-8"
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
        className="group relative z-40 flex shrink-0 items-center gap-3 pt-1.5 font-body text-[0.68rem] font-medium tracking-[0.28em] text-aemia-bone transition-opacity hover:opacity-80"
        data-nav="cta"
      >
        LISTEN NOW
        <SoundwaveIcon className="translate-y-px" />
      </a>
    </header>
  )
}
