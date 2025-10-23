
import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Landmark, Sparkles, ArrowRight } from 'lucide-react'
import Preloader from '../components/Preloader'
import Aurora from '../components/Aurora'
import Particles from '../components/Particles'
import Marquee from '../components/Marquee'
import GlitchTitle from '../components/GlitchTitle'
import OrbitRings from '../components/OrbitRings'
import Typewriter from '../components/Typewriter'
import NeonBadge from '../components/NeonBadge'
import FeatureGrid from '../components/FeatureGrid'
import ShimmerButton from '../components/ShimmerButton'
import NumberTicker from '../components/NumberTicker'
import TiltCard from '../components/TiltCard'
import MiniSim from '../components/MiniSim'
import { Link } from 'react-router-dom'
export default function Landing() {
  const [loaded, setLoaded] = useState(false)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 80, damping: 20 })
  const sy = useSpring(my, { stiffness: 80, damping: 20 })
  const rotateX = useTransform(sy, v => (0.5 - v) * 12)
  const rotateY = useTransform(sx, v => (v - 0.5) * 12)
  const onMove = (e: React.MouseEvent) => { mx.set(e.clientX / window.innerWidth); my.set(e.clientY / window.innerHeight) }
  return (
    <div className="h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden relative" onMouseMove={onMove}>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <Aurora />
      <Particles />
      <div className="noise" />
      <header className="px-6 py-5 flex items-center justify-between relative z-10">
        <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 grid place-items-center">
            <Landmark className="w-5 h-5" />
          </div>
          <div className="text-lg font-semibold">CacheLab</div>
        </motion.div>
        <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }} className="text-sm text-neutral-300">LRU • LFU • String-Length+Time</motion.div>
      </header>
      <Marquee />
      <main className="relative z-10 grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 px-6 pb-10 pt-8 h-[calc(100vh-140px)]">
        <div className="flex flex-col justify-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-5xl md:text-6xl font-extrabold leading-[1.05]">
            <GlitchTitle text="Cache Policy Simulator" />
          </motion.h1>
          <Typewriter text="LRU • LFU • String-Length+Time — visualize eviction, frequency, and tie-breaks in real time." className="mt-3 text-brand-200/90" />
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="mt-3 text-lg text-neutral-300 max-w-xl">
            A cinematic, interactive lab for LRU, LFU, and String-Length with Time tie-break. Visualize eviction, frequency, timestamps, and performance in real time.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }} className="mt-8 flex items-center gap-3">
            <ShimmerButton />
            <Link to="/demo" data-cursor="hover" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm">
              <Sparkles className="w-5 h-5" />
              Live Visualizer
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <NeonBadge label="Live Visualizer" />
            <NeonBadge label="Animated Structures" />
            <NeonBadge label="Autoplay Scenarios" />
            <NeonBadge label="Poppins • Dark Purple" />
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="mt-6 grid grid-cols-3 gap-3 max-w-2xl">
            <TiltCard>
              <div className="text-2xl font-bold"><NumberTicker from={0} to={15000} /></div>
              <div className="text-xs text-neutral-400 mt-1">Operations Simulated</div>
            </TiltCard>
            <TiltCard>
              <div className="text-2xl font-bold">O(1)</div>
              <div className="text-xs text-neutral-400 mt-1">LRU</div>
            </TiltCard>
            <TiltCard>
              <div className="text-2xl font-bold">O(log n)</div>
              <div className="text-xs text-neutral-400 mt-1">LFU & Len+Time</div>
            </TiltCard>
          </motion.div>
        </div>
        <div className="relative flex items-center justify-center">
          <motion.div style={{ rotateX, rotateY }} className="w-full max-w-[720px] aspect-[16/10] rounded-3xl bg-[var(--panel-bg)] border border-neutral-800 p-5 overflow-hidden glow-border">
            <div className="grid grid-rows-[1fr_1fr] gap-4 h-full">
              <div className="rounded-2xl overflow-hidden">
                <MiniSim />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TiltCard>
                  <div className="text-sm text-neutral-300">Dynamic Reordering</div>
                  <div className="text-xs text-neutral-400 mt-1">Watch items reshuffle by policy</div>
                </TiltCard>
                <TiltCard>
                  <div className="text-sm text-neutral-300">Interactive Controls</div>
                  <div className="text-xs text-neutral-400 mt-1">Hover, tilt, and glow cues</div>
                </TiltCard>
              </div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="absolute inset-0 pointer-events-none">
              <div className="absolute -left-24 top-10 w-80 h-80 rounded-full bg-brand-600/20 blur-3xl" />
              <div className="absolute -right-24 bottom-10 w-80 h-80 rounded-full bg-brand-400/20 blur-3xl" />
            </motion.div>
          </motion.div>
          <OrbitRings />
        </div>
      </main>
      <footer className="px-6 py-4 text-xs text-neutral-400 relative z-10">© CacheLab</footer>
    </div>
  )
}
