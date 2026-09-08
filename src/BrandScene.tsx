import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
function Crystal() {
  const group = useRef<Group>(null)
  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += Math.min(delta, 0.05) * 0.09
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.18 + 0.3
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06
  })
  return <group ref={group} rotation={[0.3, 0.3, 0.35]}><mesh rotation={[0.3, 0, 0]}><torusGeometry args={[1.08, 0.34, 40, 128]} /><meshPhysicalMaterial color="#ff8a24" metalness={0.18} roughness={0.16} clearcoat={1} clearcoatRoughness={0.08} /></mesh><mesh rotation={[0.3, 0, 0]} scale={0.98}><torusGeometry args={[1.08, 0.35, 24, 96]} /><meshBasicMaterial color="#ffbd5a" transparent opacity={0.08} /></mesh></group>
}
export default function BrandScene() {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    if (host.current) observer.observe(host.current)
    const visibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  return <div ref={host} style={{ width: '100%', height: '100%' }}><Canvas frameloop={visible && pageVisible ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }}><ambientLight intensity={1.6} /><directionalLight position={[3, 4, 5]} intensity={3.5} /><directionalLight position={[-4, -2, 2]} intensity={1.4} color="#ffd18f" /><Crystal /></Canvas></div>
}
