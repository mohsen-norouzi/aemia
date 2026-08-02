const LINKS = [
  { label: 'INSTAGRAM', href: 'https://instagram.com' },
  { label: 'YOUTUBE', href: 'https://youtube.com' },
  { label: 'SPOTIFY', href: 'https://spotify.com' },
]

export default function HeroSocials() {
  return (
    <div
      className="pointer-events-auto absolute bottom-7 left-6 z-30 w-[min(52%,460px)] md:bottom-9 md:left-10"
      data-ui="socials"
    >
      <nav
        className="mb-3 flex items-center justify-between"
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

      <div className="flex items-center gap-5 md:gap-6">
        <div className="relative h-9 min-w-0 flex-[1.65] overflow-hidden border border-aemia-bone/30 md:h-10">
          <img
            src="/img/abstract.png"
            alt=""
            className="h-full w-full select-none object-cover object-left"
            draggable={false}
            aria-hidden
          />
        </div>
        <img
          src="/img/globe-wireframe.png"
          alt=""
          className="h-9 w-auto shrink-0 select-none opacity-90 md:h-10"
          draggable={false}
          aria-hidden
        />
      </div>
    </div>
  )
}
