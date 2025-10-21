import { Link } from 'react-router-dom'
export default function ShimmerButton() {
  return (
    <Link to="/demo" data-cursor="hover" className="relative inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-white font-semibold glow-border shimmer">
      Try the Demo
      <svg className="absolute -z-10 inset-0 rounded-2xl" width="0" height="0"/>
    </Link>
  )
}
