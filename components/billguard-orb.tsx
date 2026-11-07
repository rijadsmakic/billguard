'use client'
import { motion, useReducedMotion } from 'motion/react'
export function BillGuardOrb({ small = false, active = false }: { small?: boolean; active?: boolean }) {
  const reduced = useReducedMotion()
  return <motion.div className={`orb ${small ? 'orb-small' : ''}`} animate={reduced ? {} : { y: [0, -12, 0], scale: active ? [1, 1.035, 1] : 1 }} transition={{ duration: active ? 3 : 7, repeat: Infinity, ease: 'easeInOut' }}><img src="/images/billguard-orb.png" alt="" width={640} height={640} fetchPriority={small ? 'auto' : 'high'} /></motion.div>
}
