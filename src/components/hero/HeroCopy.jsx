export default function HeroCopy() {
  return (
    <div className="hero-copy relative z-20 flex max-w-xl flex-col items-start px-5 pt-10 md:px-10 md:pt-16 lg:pt-20">
      <p
        className="font-body text-[0.62rem] font-medium tracking-[0.42em] text-aemia-fog/80"
        data-copy="eyebrow"
      >
        NEW SINGLE
      </p>

      <div className="relative mt-3 w-full" data-copy="title-wrap">
        <h1
          className="title-distressed font-display text-[clamp(3.6rem,12.5vw,8.75rem)] leading-[0.85] tracking-[0.01em]"
          data-copy="title"
        >
          KLEPTOMANIAC
        </h1>

        <span
          className="pointer-events-none absolute -bottom-3 left-[12%] rotate-[-9deg] font-script text-[clamp(2.5rem,5.8vw,4rem)] leading-none text-aemia-moss md:left-[16%] md:-bottom-2"
          data-copy="outnow"
        >
          OUT NOW
        </span>
      </div>

      <p
        className="mt-10 max-w-[240px] font-body text-[0.78rem] leading-relaxed tracking-wide text-aemia-fog/75 md:mt-12 md:max-w-[260px]"
        data-copy="desc"
      >
        A new chapter begins. Kleptomaniac is out now on all platforms.
      </p>

      <a
        href="#listen"
        className="listen-btn mt-8 inline-flex items-center gap-8 border border-aemia-bone/80 bg-transparent px-6 py-3 font-body text-[0.68rem] font-medium tracking-[0.28em] text-aemia-bone md:mt-10"
        data-copy="btn"
      >
        LISTEN NOW
        <span className="listen-arrow text-sm" aria-hidden>
          ↗
        </span>
      </a>
    </div>
  )
}
