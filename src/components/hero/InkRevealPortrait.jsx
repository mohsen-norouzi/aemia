import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useInkVideoReveal } from '../../hooks/useInkVideoReveal'

/** Locked ink clip defaults */
export const INK_REVEAL = {
  videoUrl: '/video/ink-splash.mp4',
  invert: true,
  randomize: true,
  size: 1.45,
  speed: 1,
  rotation: 0,
}

/**
 * PIXI ink video-mask reveal for a single image.
 * Drive via ref.replay().
 */
const InkRevealPortrait = forwardRef(function InkRevealPortrait(
  {
    imageUrl = '/img/hero-portrait.png',
    videoUrl = INK_REVEAL.videoUrl,
    invert = INK_REVEAL.invert,
    randomize = INK_REVEAL.randomize,
    size = INK_REVEAL.size,
    speed = INK_REVEAL.speed,
    rotation = INK_REVEAL.rotation,
    autoPlay = false,
    onComplete,
    className = '',
    imgClassName = 'aspect-[3/4] h-full w-full object-cover object-center',
    style,
    alt = '',
  },
  ref,
) {
  const hostRef = useRef(null)
  const { replay, reveal } = useInkVideoReveal(hostRef, {
    imageUrl,
    videoUrl,
    invert,
    randomize,
    size,
    speed,
    rotation,
    autoPlay,
    onComplete,
  })

  useImperativeHandle(ref, () => ({ replay, reveal }), [replay, reveal])

  return (
    <div className={`relative overflow-hidden ${className}`.trim()} style={style}>
      <img
        src={imageUrl}
        alt={alt}
        className={`${imgClassName} opacity-0`.trim()}
        draggable={false}
      />
      <div
        ref={hostRef}
        className="absolute inset-0"
        data-ink-host
        aria-hidden
      />
    </div>
  )
})

export default InkRevealPortrait
