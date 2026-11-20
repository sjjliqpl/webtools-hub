import { useEffect, useRef, useState } from 'react'
export function useTimedSession(duration: number) {
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [remaining, setRemaining] = useState(duration)
  const deadline = useRef(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  function clear() { if (timer.current !== null) clearInterval(timer.current); timer.current = null }
  useEffect(() => () => { if (timer.current !== null) clearInterval(timer.current) }, [])
  function start() {
    clear()
    deadline.current = performance.now() + duration * 1000
    setRemaining(duration); setFinished(false); setRunning(true)
    timer.current = setInterval(() => {
      const left = Math.max(0, (deadline.current - performance.now()) / 1000)
      setRemaining(left)
      if (!left) { clear(); setRunning(false); setFinished(true) }
    }, 50)
  }
  function reset() { clear(); setRunning(false); setFinished(false); setRemaining(duration) }
  function isLive() { return performance.now() < deadline.current }
  return { running, finished, remaining: running || finished ? remaining : duration, start, reset, isLive }
}
