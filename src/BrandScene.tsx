import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
function Crystal() {
  const group = useRef<Group>(null)
  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += Math.min(delta, 0.05) * 0.14
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.18 + 0.3
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06
  })
  return <group ref={group} rotation={[0.3, 0.3, 0.35]}><mesh><octahedronGeometry args={[1.6, 0]} /><meshPhysicalMaterial color="#ff7100" metalness={0.2} roughness={0.15} transparent opacity={0.55} flatShading /></mesh><mesh scale={1.003}><octahedronGeometry args={[1.6, 0]} /><meshBasicMaterial color="#e64a00" wireframe transparent opacity={0.9} /></mesh><mesh rotation={[0, 0, Math.PI / 2]} scale={0.57}><octahedronGeometry args={[1.6, 0]} /><meshBasicMaterial color="#ffbf00" wireframe transparent opacity={0.9} /></mesh></group>
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
  return <div ref={host} style={{ width: '100%', height: '100%' }}><Canvas frameloop={visible && pageVisible ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }}><ambientLight intensity={1.2} /><directionalLight position={[3, 2, 4]} intensity={3} /><Crystal /></Canvas></div>
}
