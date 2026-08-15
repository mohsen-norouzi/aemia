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
        className="absolute left-0 font-body text-[0.58rem] font-medium tracking-[0.42em] text-vexara-fog/80"
        style={{ top: -34 }}
        data-copy="eyebrow"
      >
        NEW SINGLE
      </p>

      <div className="relative w-full" data-copy="title-wrap">
        <h1 className="m-0 leading-none opacity-0" data-copy="title">
          <img
            src="/img/anathematize.png"
            alt="Anathematize"
            className="h-auto w-full select-none"
            draggable={false}
          />
        </h1>

        <div
          className="pointer-events-none absolute z-10 opacity-0"
          data-copy="outnow"
          style={{
            left: '57.5%',
            bottom: '95.5%',
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
          className="max-w-[230px] font-body text-[0.8rem] leading-[1.7] tracking-wide text-vexara-fog/85"
          data-copy="desc"
        >
          A new chapter begins.
          <br />
          Anathematize is out now
          <br />
          on <span className="text-[#66846b]">all platforms.</span>
        </p>

        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noreferrer"
          className="listen-btn relative mt-7 flex w-[min(100%,280px)] items-center justify-between gap-8 border-[0.5px] border-[#66846b]/50 bg-transparent py-[1.15rem] pl-6 pr-7 font-body text-[0.62rem] font-medium tracking-[0.34em] text-vexara-fog/90"
          data-copy="btn"
        >
          WATCH VIDEO
          <span
            className="listen-arrow text-[0.9rem] font-light leading-none text-vexara-fog/80"
            aria-hidden
          >
            ↗
          </span>
        </a>
      </div>
    </div>
  )
}
