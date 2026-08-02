import { useEffect, useRef, useCallback } from 'react'
import {
  Application,
  Assets,
  Sprite,
  Texture,
  VideoSource,
  MaskFilter,
} from 'pixi.js'

function waitForEvent(target, event, timeoutMs = 800) {
  return Promise.race([
    new Promise((resolve) => {
      target.addEventListener(event, () => resolve(), { once: true })
    }),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ])
}

async function seekVideo(video, time) {
  if (!video) return
  if (Number.isFinite(video.duration) && video.duration > 0) {
    time = Math.min(Math.max(0, time), Math.max(0, video.duration - 0.04))
  }
  if (Math.abs(video.currentTime - time) < 0.001 && video.readyState >= 2) {
    return
  }
  const done = waitForEvent(video, 'seeked')
  try {
    video.currentTime = time
  } catch {
    return
  }
  await done
}

function makeSolidTexture(hex) {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 4
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = hex
  ctx.fillRect(0, 0, 4, 4)
  return Texture.from(canvas)
}

function rand(min, max) {
  return min + Math.random() * (max - min)
}

/** Mild per-play variety: stagger + tiny offset. No flips (those clip images). */
export function buildInkFeel(opts = {}) {
  const extras = opts.randomize !== false
  return {
    delay: extras ? rand(0, 0.18) : 0,
    rate: opts.speed ?? opts.playbackRate ?? 1,
    flipX: false,
    flipY: false,
    scale: opts.size ?? 1.35,
    ox: extras ? rand(-0.06, 0.06) : 0,
    oy: extras ? rand(-0.06, 0.06) : 0,
    rot: ((opts.rotation ?? 0) * Math.PI) / 180,
  }
}

/** @deprecated use buildInkFeel */
export function rollInkFeel() {
  return buildInkFeel({ randomize: true })
}

/**
 * PIXI ink video-mask reveal.
 * invert + luminance: white hides, black reveals (black ink on white footage).
 */
export function useInkVideoReveal(hostRef, options) {
  const {
    imageUrl,
    videoUrl,
    invert = true,
    playbackRate = 1,
    autoPlay = true,
    randomize = true,
    size = 1.35,
    speed = 1,
    rotation = 0,
    onComplete,
  } = options

  const apiRef = useRef(null)
  const optsRef = useRef({
    invert,
    playbackRate,
    randomize,
    size,
    speed,
    rotation,
    onComplete,
  })
  optsRef.current = {
    invert,
    playbackRate,
    randomize,
    size,
    speed,
    rotation,
    onComplete,
  }

  const replay = useCallback(async () => {
    await apiRef.current?.replay?.()
  }, [])

  const reveal = useCallback(() => {
    apiRef.current?.reveal?.()
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host || !imageUrl || !videoUrl) return undefined

    let disposed = false
    let app = null
    let videoEl = null
    let photo = null
    let videoSprite = null
    let solidSprite = null
    let maskFilter = null
    let whiteTex = null
    let resizeObserver = null
    let onEnded = null
    let finishing = false
    let pendingReplay = false
    let safetyTimer = null
    let feel = {
      delay: 0,
      rate: 1,
      flipX: false,
      flipY: false,
      scale: 1,
      ox: 0,
      oy: 0,
      rot: 0,
    }

    const clearSafety = () => {
      if (safetyTimer != null) {
        clearTimeout(safetyTimer)
        safetyTimer = null
      }
    }

    const safeDestroyApp = () => {
      if (!app) return
      const instance = app
      app = null
      try {
        instance.destroy(true)
      } catch {
        /* StrictMode double-destroy */
      }
    }

    const fitCover = (sprite, w, h) => {
      const tw = sprite.texture.width || 1
      const th = sprite.texture.height || 1
      const scale = Math.max(w / tw, h / th)
      sprite.scale.set(scale)
      sprite.anchor.set(0.5)
      sprite.position.set(w / 2, h / 2)
      sprite.rotation = 0
    }

    const fitFill = (sprite, w, h) => {
      sprite.anchor.set(0.5)
      sprite.rotation = 0
      sprite.position.set(w / 2, h / 2)
      sprite.width = w
      sprite.height = h
    }

    /** Stretch / crop / flip / offset the ink video for a unique feel */
    const fitVideoFeel = (sprite, w, h, f) => {
      sprite.anchor.set(0.5)
      sprite.rotation = f.rot
      sprite.position.set(w / 2 + f.ox * w, h / 2 + f.oy * h)
      sprite.width = w * f.scale
      sprite.height = h * f.scale
      sprite.scale.x = Math.abs(sprite.scale.x) * (f.flipX ? -1 : 1)
      sprite.scale.y = Math.abs(sprite.scale.y) * (f.flipY ? -1 : 1)
    }

    const layout = () => {
      if (!app || !photo) return
      const w = Math.max(1, host.clientWidth)
      const h = Math.max(1, host.clientHeight)
      app.renderer.resize(w, h)
      fitCover(photo, w, h)
      if (videoSprite) fitVideoFeel(videoSprite, w, h, feel)
      if (solidSprite) fitFill(solidSprite, w, h)
    }

    const setMaskSprite = (sprite) => {
      if (!photo || !sprite) return
      maskFilter = new MaskFilter({
        sprite,
        inverse: optsRef.current.invert,
      })
      photo.filters = [maskFilter]
    }

    const maskHidden = () => {
      if (!solidSprite || !whiteTex) return
      solidSprite.texture = whiteTex
      setMaskSprite(solidSprite)
    }

    /** Pause on the final video frame and keep it as the mask */
    const finishOnLastFrame = () => {
      if (disposed || finishing) return
      finishing = true
      clearSafety()
      try {
        videoEl?.pause()
      } catch {
        /* ignore */
      }
      if (videoSprite) {
        layout()
        setMaskSprite(videoSprite)
        videoSprite.renderable = false
      }
      if (photo) photo.alpha = 1
      finishing = false
      optsRef.current.onComplete?.()
    }

    const armSafety = () => {
      clearSafety()
      const duration =
        Number.isFinite(videoEl?.duration) && videoEl.duration > 0
          ? videoEl.duration
          : 2.8
      const rate = Math.max(0.2, feel.rate || 1)
      // Called after delay already waited — only cover video length + buffer
      const ms = ((duration + 0.45) / rate) * 1000
      safetyTimer = setTimeout(() => finishOnLastFrame(), ms)
    }

    /** Jump to end and hold (reduced-motion / forced reveal) */
    const revealImmediate = async () => {
      if (disposed || !videoEl || !videoSprite) {
        clearSafety()
        optsRef.current.onComplete?.()
        return
      }
      finishing = false
      clearSafety()
      const end =
        Number.isFinite(videoEl.duration) && videoEl.duration > 0
          ? Math.max(0, videoEl.duration - 0.05)
          : 0
      await seekVideo(videoEl, end)
      if (disposed) return
      try {
        videoEl.pause()
      } catch {
        /* ignore */
      }
      layout()
      setMaskSprite(videoSprite)
      if (photo) photo.alpha = 1
      optsRef.current.onComplete?.()
    }

    const sleep = (ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms)
      })

    const replayInternal = async () => {
      if (disposed) return
      if (!videoEl || !photo || !videoSprite) {
        pendingReplay = true
        return
      }
      finishing = false
      clearSafety()
      feel = buildInkFeel(optsRef.current)

      try {
        videoEl.pause()
      } catch {
        /* ignore */
      }

      maskHidden()
      photo.alpha = 1
      layout()

      if (feel.delay > 0) {
        await sleep(feel.delay * 1000)
        if (disposed) return
      }

      videoEl.playbackRate = feel.rate
      await seekVideo(videoEl, 0)
      if (disposed) return

      await new Promise((r) => requestAnimationFrame(() => r()))
      if (disposed) return

      layout()
      setMaskSprite(videoSprite)
      armSafety()

      try {
        await videoEl.play()
      } catch (err) {
        console.warn('[useInkVideoReveal] play failed', err)
        await revealImmediate()
      }
    }

    const boot = async () => {
      try {
        // Allow entrance timeline to queue a replay before PIXI is ready
        apiRef.current = {
          replay: async () => {
            pendingReplay = true
          },
          reveal: () => {
            pendingReplay = false
          },
        }

        const w = Math.max(1, host.clientWidth)
        const h = Math.max(1, host.clientHeight)

        app = new Application()
        await app.init({
          width: w,
          height: h,
          backgroundAlpha: 0,
          antialias: true,
          preference: 'webgl',
        })
        if (disposed) {
          safeDestroyApp()
          return
        }

        const canvas = app.canvas
        canvas.style.display = 'block'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        host.replaceChildren(canvas)

        whiteTex = makeSolidTexture('#ffffff')

        const imageTexture = await Assets.load(imageUrl)
        if (disposed) {
          safeDestroyApp()
          return
        }

        photo = new Sprite(imageTexture)
        photo.alpha = 1
        app.stage.addChild(photo)

        solidSprite = new Sprite(whiteTex)
        solidSprite.renderable = false
        app.stage.addChild(solidSprite)

        layout()
        maskHidden()

        videoEl = document.createElement('video')
        videoEl.src = videoUrl
        videoEl.muted = true
        videoEl.defaultMuted = true
        videoEl.playsInline = true
        videoEl.preload = 'auto'
        videoEl.setAttribute('muted', '')
        videoEl.setAttribute('playsinline', '')
        videoEl.crossOrigin = null

        const videoSource = new VideoSource({
          resource: videoEl,
          autoPlay: false,
          autoLoad: true,
        })
        await videoSource.load()
        if (disposed) {
          safeDestroyApp()
          return
        }

        if (videoEl.readyState < 2) {
          await waitForEvent(videoEl, 'loadeddata', 2000)
        }
        if (disposed) {
          safeDestroyApp()
          return
        }

        const videoTexture = new Texture({ source: videoSource })
        videoSprite = new Sprite(videoTexture)
        videoSprite.renderable = false
        app.stage.addChild(videoSprite)

        layout()
        maskHidden()

        onEnded = () => finishOnLastFrame()
        videoEl.addEventListener('ended', onEnded)

        apiRef.current = {
          replay: replayInternal,
          reveal: revealImmediate,
          layout,
          setInvert(next) {
            optsRef.current.invert = next
            if (maskFilter) maskFilter.inverse = next
          },
          setPlaybackRate(rate) {
            optsRef.current.speed = rate
            optsRef.current.playbackRate = rate
            if (videoEl && !videoEl.paused) videoEl.playbackRate = rate
          },
          setTransform({ size: nextSize, rotation: nextRot } = {}) {
            if (nextSize != null) {
              optsRef.current.size = nextSize
              feel.scale = nextSize
            }
            if (nextRot != null) {
              optsRef.current.rotation = nextRot
              feel.rot = (nextRot * Math.PI) / 180
            }
            layout()
          },
        }

        resizeObserver = new ResizeObserver(() => layout())
        resizeObserver.observe(host)

        if (autoPlay || pendingReplay) {
          pendingReplay = false
          await replayInternal()
        }
      } catch (err) {
        console.error('[useInkVideoReveal] failed to boot', err)
        safeDestroyApp()
      }
    }

    boot()

    return () => {
      disposed = true
      clearSafety()
      resizeObserver?.disconnect()
      if (videoEl && onEnded) videoEl.removeEventListener('ended', onEnded)
      try {
        videoEl?.pause()
      } catch {
        /* ignore */
      }
      apiRef.current = null
      safeDestroyApp()
      try {
        host.replaceChildren()
      } catch {
        /* ignore */
      }
    }
  }, [hostRef, imageUrl, videoUrl, autoPlay, randomize])

  useEffect(() => {
    apiRef.current?.setInvert?.(invert)
  }, [invert])

  useEffect(() => {
    apiRef.current?.setPlaybackRate?.(speed)
  }, [speed])

  useEffect(() => {
    apiRef.current?.setTransform?.({ size, rotation })
  }, [size, rotation])

  return { replay, reveal }
}
