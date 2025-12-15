import { useEffect, useState } from 'react'

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    // consider touch devices (phones) as mobile even in landscape
    const isTouch =
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      'ontouchstart' in window
    return mq.matches || (isTouch && window.innerWidth <= 1024)
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = () => {
      const isTouch =
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
        'ontouchstart' in window
      setIsMobile(mq.matches || (isTouch && window.innerWidth <= 1024))
    }
    if (mq.addEventListener) mq.addEventListener('change', handler)
    else mq.addListener(handler)
    // set initial
    handler()
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler)
      else mq.removeListener(handler)
    }
  }, [breakpoint])

  return isMobile
}
