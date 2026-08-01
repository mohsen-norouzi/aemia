import { Compass, Waveform } from './Decorative'

export default function HeroCollage() {
  return (
    <div className="hero-collage pointer-events-none absolute inset-0 z-10 overflow-hidden max-md:opacity-90">
      {/* Main portrait */}
      <div
        className="parallax-layer rough-frame absolute left-[48%] top-[28%] w-[46%] max-w-[420px] min-w-[160px] sm:left-[42%] sm:top-[14%] sm:w-[38%] md:left-[46%] md:top-[10%] lg:left-[48%]"
        data-depth="0.35"
        data-collage="main"
      >
        <div className="overflow-hidden">
          <img
            src="/img/girl-1.jpg"
            alt="Aemia"
            className="aspect-[3/4] h-full w-full object-cover object-[center_20%] brightness-[0.85] contrast-[1.05] saturate-[0.75]"
          />
        </div>
        <div className="absolute -left-3 top-[18%] h-px w-8 bg-white/50" />
        <div className="absolute -right-4 top-[8%] h-10 w-px bg-white/40" />
        <div className="absolute -bottom-2 left-[12%] h-px w-16 bg-white/35" />
        <div className="absolute bottom-[20%] -right-5 h-px w-10 bg-white/40" />
      </div>

      {/* Concert inset — top right */}
      <div
        className="parallax-layer absolute right-[6%] top-[10%] z-[5] w-[18%] max-w-[200px] min-w-[110px] overflow-hidden border border-white/20 md:right-[9%] md:top-[12%]"
        data-depth="0.55"
        data-collage="concert"
      >
        <img
          src="/img/concert.jpg"
          alt=""
          className="aspect-[4/3] w-full object-cover brightness-[0.7] contrast-[1.1] hue-rotate-[190deg] saturate-[0.6]"
        />
        <div className="absolute inset-0 bg-sky-900/25 mix-blend-color" />
      </div>

      {/* Eyes strip — bottom right, torn */}
      <div
        className="parallax-layer torn-edge absolute bottom-[16%] right-[4%] z-[5] w-[28%] max-w-[320px] min-w-[160px] md:bottom-[18%] md:right-[8%]"
        data-depth="0.7"
        data-collage="eyes"
      >
        <img
          src="/img/eyes.jpg"
          alt=""
          className="aspect-[16/9] w-full object-cover object-center brightness-[0.8] contrast-[1.15] saturate-[0.5]"
        />
        <div className="absolute inset-0 bg-aemia-moss/35 mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Girl window photo */}
      <div
        className="parallax-layer absolute z-[10]"
        data-depth="0.45"
        data-collage="mia"
        style={{
          left: '35.5%',
          top: '50.5%',
          width: 244,
          opacity: 1,
        }}
      >
        <img
          src="/img/girl-window.png"
          alt=""
          className="block h-auto w-full select-none"
          draggable={false}
        />
      </div>

      {/* Girl window frame */}
      <div
        className="parallax-layer absolute z-[12]"
        data-depth="0.45"
        data-collage="frame"
        style={{
          left: '34%',
          top: '40%',
          width: 300,
          opacity: 1,
        }}
      >
        <img
          src="/img/girl-window-frame.png"
          alt=""
          className="block h-auto w-full select-none"
          draggable={false}
          aria-hidden
        />
      </div>

      {/* Spray-paint A — in front */}
      <div
        className="parallax-layer absolute z-30"
        data-depth="0.25"
        data-collage="spray"
        style={{
          left: '47%',
          top: '73%',
          width: 188,
          opacity: 1,
        }}
      >
        <img
          src="/img/spray-a.png"
          alt=""
          className="h-auto w-full select-none"
          style={{ transform: 'rotate(1deg)' }}
          draggable={false}
          aria-hidden
        />
      </div>

      {/* Compass / star */}
      <div
        className="parallax-layer absolute right-[2%] top-[42%] z-[5] w-[140px] md:right-[4%] md:top-[40%] md:w-[170px]"
        data-depth="0.9"
        data-collage="compass"
      >
        <Compass className="h-full w-full opacity-80" />
      </div>

      {/* Handwritten quote */}
      <div
        className="parallax-layer absolute right-[10%] top-[54%] z-[5] max-w-[200px] rotate-[-2deg] md:right-[14%] md:top-[56%] md:max-w-[220px]"
        data-depth="0.6"
        data-collage="quote"
      >
        <p className="font-hand text-[1.35rem] leading-[1.55] tracking-wide text-aemia-fog/80 md:text-[1.55rem]">
          they call it
          <br />
          kleptomaniac,
          <br />
          i call it
          <br />
          survival
        </p>
        <div className="mt-3 h-px w-[85%] origin-left rotate-[-2deg] bg-white/45" />
      </div>

      {/* Soundwave graphic */}
      <div
        className="parallax-layer absolute bottom-[10%] right-[10%] z-[5] w-[40%] max-w-[360px] opacity-70 md:bottom-[12%] md:right-[14%]"
        data-depth="0.4"
        data-collage="wave"
      >
        <Waveform className="h-auto w-full" />
      </div>

      {/* Extra girl-2 peek */}
      <div
        className="parallax-layer absolute left-[58%] top-[62%] z-[5] hidden w-[10%] max-w-[110px] rotate-3 overflow-hidden border border-white/15 opacity-60 lg:block"
        data-depth="0.8"
        data-collage="peek"
      >
        <img
          src="/img/girl-2.jpg"
          alt=""
          className="aspect-[3/4] w-full object-cover brightness-[0.7] grayscale"
        />
      </div>
    </div>
  )
}
