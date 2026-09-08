import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ExtrudeGeometry, Path, Shape } from 'three'
import type { Group } from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import brandFont from './assets/brand-font.json'

const font = new FontLoader().parse(brandFont)
const glyphs = ['A', '&', 'M'].map(letter => {
  const geometry = new TextGeometry(letter, {
    font, size: 0.92, depth: 0.16, curveSegments: 10,
    bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.012, bevelSegments: 3,
  })
  geometry.computeBoundingBox()
  const bounds = geometry.boundingBox!
  const width = bounds.max.x - bounds.min.x
  geometry.translate(-bounds.min.x, -(bounds.max.y + bounds.min.y) / 2, 0)
  return { letter, geometry, width }
})
const gap = 0.09
const wordWidth = glyphs.reduce((sum, glyph) => sum + glyph.width, 0) + gap * 2
const positions = glyphs.map((_, index) => -wordWidth / 2 + glyphs.slice(0, index).reduce((sum, glyph) => sum + glyph.width + gap, 0))

function roundedRectangle(path: Path, width: number, height: number, radius: number) {
  const x = width / 2
  const y = height / 2
  path.moveTo(-x + radius, -y)
  path.lineTo(x - radius, -y)
  path.quadraticCurveTo(x, -y, x, -y + radius)
  path.lineTo(x, y - radius)
  path.quadraticCurveTo(x, y, x - radius, y)
  path.lineTo(-x + radius, y)
  path.quadraticCurveTo(-x, y, -x, y - radius)
  path.lineTo(-x, -y + radius)
  path.quadraticCurveTo(-x, -y, -x + radius, -y)
  path.closePath()
}
const frameShape = new Shape()
roundedRectangle(frameShape, wordWidth + 0.8, 1.9, 0.3)
const innerFrame = new Path()
roundedRectangle(innerFrame, wordWidth + 0.67, 1.77, 0.245)
frameShape.holes.push(innerFrame)
const frameGeometry = new ExtrudeGeometry(frameShape, {
  depth: 0.08, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3, curveSegments: 16,
})

function Monogram() {
  const group = useRef<Group>(null)
  const time = useRef(0)
  useFrame((_, delta) => {
    if (!group.current) return
    time.current += Math.min(delta, 0.05)
    // A gentle turn shows the extrusion while keeping the brand readable.
    group.current.rotation.y = Math.sin(time.current * 0.38) * 0.48
    group.current.rotation.x = Math.sin(time.current * 0.25) * 0.1 - 0.08
    group.current.rotation.z = Math.sin(time.current * 0.22) * 0.035
    group.current.position.y = Math.sin(time.current * 0.5) * 0.055
  })
  return <group ref={group} dispose={null}>
    <mesh geometry={frameGeometry} position={[0, 0, -0.12]}>
      <meshPhysicalMaterial color="#ffb35e" transparent opacity={0.48} metalness={0.15} roughness={0.1} clearcoat={1} />
    </mesh>
    {glyphs.map((glyph, index) => <mesh key={glyph.letter} geometry={glyph.geometry} position={[positions[index], 0, 0]}>
      <meshPhysicalMaterial color={glyph.letter === '&' ? '#ff790b' : '#25262a'} metalness={0.26} roughness={0.24} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>)}
  </group>
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
  return <div ref={host} style={{ width: '100%', height: '100%' }}>
    <Canvas frameloop={visible && pageVisible ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 42 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.7} />
      <directionalLight position={[3, 4, 5]} intensity={3.2} />
      <directionalLight position={[-4, -2, 3]} intensity={1.2} color="#ffd7aa" />
      <Monogram />
    </Canvas>
  </div>
}
