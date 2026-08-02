export default function HeroCopy() {
  return (
    <div
      className="hero-copy absolute z-20"
      style={{
        left: '3.5%',
        top: '50%',
        width: '37%',
        maxWidth: 720,
        transform: 'translateY(-50%)',
      }}
    >
      <p
        className="absolute left-0 font-body text-[0.58rem] font-medium tracking-[0.42em] text-aemia-fog/80"
        style={{ top: -34 }}
        data-copy="eyebrow"
      >
        NEW SINGLE
      </p>

      <div className="relative w-full" data-copy="title-wrap">
        <h1 className="m-0 leading-none opacity-0" data-copy="title">
          <img
            src="/img/kleptomaniac.png"
            alt="Kleptomaniac"
            className="h-auto w-full select-none"
            draggable={false}
          />
        </h1>

        <div
          className="pointer-events-none absolute z-10 opacity-0"
          data-copy="outnow"
          style={{
            left: '57.5%',
            bottom: '-19%',
            width: '48%',
          }}
        >
          <div style={{ transform: 'rotate(-7deg)' }}>
            <img
              src="/img/out-now.png"
              alt="Out now"
              className="h-auto w-full select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }} className="flex flex-col items-start">
        <p
          className="max-w-[240px] font-body text-[0.72rem] leading-[1.55] tracking-wide text-aemia-fog/75"
          data-copy="desc"
        >
          A new chapter begins. Kleptomaniac is out now on all platforms.
        </p>

        <a
          href="#listen"
          className="listen-btn mt-6 inline-flex items-center gap-7 border border-aemia-bone/80 bg-transparent px-5 py-2.5 font-body text-[0.62rem] font-medium tracking-[0.28em] text-aemia-bone"
          data-copy="btn"
          onClick={(e) => {
            e.preventDefault()
            window.dispatchEvent(new CustomEvent('aemia:listen'))
          }}
        >
          LISTEN NOW
          <span className="listen-arrow text-sm" aria-hidden>
            ↗
          </span>
        </a>
      </div>
    </div>
  )
}
