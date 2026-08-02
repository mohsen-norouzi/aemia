const LINKS = [
  { label: 'INSTAGRAM', href: 'https://instagram.com' },
  { label: 'YOUTUBE', href: 'https://youtube.com' },
  { label: 'SPOTIFY', href: 'https://spotify.com' },
]

export default function HeroSocials() {
  return (
    <div
      className="pointer-events-auto absolute bottom-7 left-6 z-30 w-[min(48%,420px)] md:bottom-9 md:left-10"
      data-ui="socials"
    >
      <nav
        className="mb-3.5 flex items-center justify-between"
        aria-label="Social"
      >
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-body text-[0.55rem] font-medium tracking-[0.28em] text-aemia-fog/85 transition-colors hover:text-aemia-bone md:text-[0.58rem]"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative h-10 min-w-0 flex-1 overflow-hidden border border-aemia-bone/35 md:h-11">
          <img
            src="/img/abstract.png"
            alt=""
            className="h-full w-full select-none object-cover object-left"
            draggable={false}
            aria-hidden
          />
        </div>
        <img
          src="/img/moon.png"
          alt=""
          className="h-14 w-auto shrink-0 select-none opacity-95 md:h-16"
          draggable={false}
          aria-hidden
        />
      </div>
    </div>
  )
}
