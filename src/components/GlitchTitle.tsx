import { useEffect, useState } from 'react'
export default function GlitchTitle({ text }: { text: string }) {
  const [g1, setG1] = useState(false)
  const [g2, setG2] = useState(false)
  useEffect(() => {
    const i1 = setInterval(() => setG1(v => !v), 1100)
    const i2 = setInterval(() => setG2(v => !v), 1700)
    return () => { clearInterval(i1); clearInterval(i2) }
  }, [])
  return (
    <div className="relative inline-block select-none">
      <span className="relative z-10">{text}</span>
      <span className={`absolute inset-0 z-0 translate-x-[2px] ${g1 ? 'opacity-60' : 'opacity-20'} text-brand-400 blur-[0.5px]`} aria-hidden>{text}</span>
      <span className={`absolute inset-0 z-0 -translate-x-[2px] ${g2 ? 'opacity-60' : 'opacity-20'} text-brand-600 blur-[0.5px]`} aria-hidden>{text}</span>
    </div>
  )
}
