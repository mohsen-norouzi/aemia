export default function HeroCopy() {
  return (
    <div className="hero-copy relative z-20 flex max-w-xl flex-col items-start px-5 pt-10 md:px-10 md:pt-16 lg:pt-20">
      <p
        className="font-body text-[0.62rem] font-medium tracking-[0.42em] text-aemia-fog/80"
        data-copy="eyebrow"
      >
        NEW SINGLE
      </p>

      <div className="relative mt-2 w-full max-w-[640px]" data-copy="title-wrap">
        <h1 className="m-0" data-copy="title">
          <img
            src="/img/kleptomaniac.png"
            alt="Kleptomaniac"
            className="h-auto w-full max-w-[min(100%,560px)] select-none"
            draggable={false}
          />
        </h1>

        <div
          className="pointer-events-none absolute -bottom-[8%] left-[10%] z-10 w-[55%] max-w-[280px] rotate-[-8deg] md:left-[14%] md:w-[48%]"
          data-copy="outnow"
        >
          <img
            src="/img/out-now.png"
            alt="Out now"
            className="h-auto w-full select-none"
            draggable={false}
          />
        </div>
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
