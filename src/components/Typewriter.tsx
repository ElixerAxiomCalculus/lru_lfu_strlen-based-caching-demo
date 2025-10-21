import { useEffect, useState } from 'react'
export default function Typewriter({ text, speed = 28, className = '' }: { text: string; speed?: number; className?: string }) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return <div className={className}>{out}<span className="opacity-60">▍</span></div>
}
