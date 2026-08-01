import { Compass, SprayA, Waveform } from './Decorative'

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
        {/* Broken frame accents */}
        <div className="absolute -left-3 top-[18%] h-px w-8 bg-white/50" />
        <div className="absolute -right-4 top-[8%] h-10 w-px bg-white/40" />
        <div className="absolute -bottom-2 left-[12%] h-px w-16 bg-white/35" />
        <div className="absolute bottom-[20%] -right-5 h-px w-10 bg-white/40" />
      </div>

      {/* Concert inset — top right */}
      <div
        className="parallax-layer absolute right-[6%] top-[10%] w-[18%] max-w-[200px] min-w-[110px] overflow-hidden border border-white/20 md:right-[9%] md:top-[12%]"
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
        className="parallax-layer torn-edge absolute bottom-[16%] right-[4%] w-[28%] max-w-[320px] min-w-[160px] md:bottom-[18%] md:right-[8%]"
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

      {/* Small silhouette — bottom left of collage */}
      <div
        className="parallax-layer torn-edge-sm absolute bottom-[20%] left-[36%] w-[14%] max-w-[150px] min-w-[90px] md:bottom-[22%] md:left-[40%]"
        data-depth="0.45"
        data-collage="sil"
      >
        <img
          src="/img/silhouette.jpg"
          alt=""
          className="aspect-square w-full object-cover brightness-[0.65] contrast-[1.2] saturate-[0.4]"
        />
        <div className="absolute inset-0 bg-aemia-moss/25 mix-blend-soft-light" />
      </div>

      {/* Spray paint A behind silhouette */}
      <div
        className="parallax-layer absolute bottom-[14%] left-[28%] md:bottom-[16%] md:left-[32%]"
        data-depth="0.25"
        data-collage="spray"
      >
        <SprayA />
      </div>

      {/* Compass / star */}
      <div
        className="parallax-layer absolute right-[2%] top-[38%] w-[140px] md:right-[4%] md:top-[36%] md:w-[170px]"
        data-depth="0.9"
        data-collage="compass"
      >
        <Compass className="h-full w-full opacity-80" />
      </div>

      {/* Handwritten quote */}
      <p
        className="parallax-layer absolute right-[14%] top-[46%] max-w-[160px] rotate-[-2deg] text-center font-hand text-[1.15rem] leading-tight tracking-wide text-aemia-fog/70 md:right-[18%] md:top-[48%] md:text-[1.35rem]"
        data-depth="0.6"
        data-collage="quote"
      >
        they call it kleptomaniac,
        <br />
        i call it survival
      </p>

      {/* Soundwave graphic */}
      <div
        className="parallax-layer absolute bottom-[10%] right-[10%] w-[40%] max-w-[360px] opacity-70 md:bottom-[12%] md:right-[14%]"
        data-depth="0.4"
        data-collage="wave"
      >
        <Waveform className="h-auto w-full" />
      </div>

      {/* Extra girl-2 peek for layering richness */}
      <div
        className="parallax-layer absolute left-[58%] top-[62%] hidden w-[10%] max-w-[110px] rotate-3 overflow-hidden border border-white/15 opacity-60 lg:block"
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
