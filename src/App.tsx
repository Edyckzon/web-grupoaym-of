import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSectionNavigation } from './useSectionNavigation'
import contawebLogo from './assets/img/contaweb-aym-06.png'
import billingLogo from './assets/img/contaweb_Mesa de trabajo 1.png'
import accountingLogo from './assets/img/AYMASESORESCONTABLES.png'
import rentingLogo from './assets/img/RENTING-CAR.png'
import './App.css'

const BrandScene = lazy(() => import('./BrandScene'))
gsap.registerPlugin(ScrollTrigger)

interface Company {
  name: string
  short: string
  suffix: string
  category: string
  headline: string
  description: string
  services: string[]
  image: string
  position: string
  logo: string
  website?: string
  websiteLabel?: string
}

const companies: Company[] = [
  { name: 'A&M asesores contables', short: 'A&M', suffix: 'ASESORES CONTABLES', category: 'ASESORÍA CONTABLE', headline: 'Orden y claridad para tu negocio.', description: 'Asesoría contable y orientación tributaria para acompañar las decisiones de tu empresa.', services: ['Asesoría contable', 'Orientación tributaria', 'Información para decidir'], image: '/images/accounting.jpg', position: '50% 50%', logo: accountingLogo, website: 'https://www.asesorescontablesaym.com/', websiteLabel: 'Visitar Asesores Contables A&M' },
  { name: 'Conta Web A&M facturación electrónica', short: 'CONTA WEB A&M', suffix: 'FACTURACIÓN ELECTRÓNICA', category: 'FACTURACIÓN ELECTRÓNICA', headline: 'Cada operación cuenta.', description: 'Facturación electrónica para una gestión más ordenada y conectada con tu negocio.', services: ['Facturación electrónica', 'Organización comercial', 'Información de operaciones'], image: '/images/billing.jpg', position: '50% 50%', logo: billingLogo },
  { name: 'Renting Car A&M', short: 'RENTING CAR', suffix: 'A&M', category: 'MOVILIDAD', headline: 'Tu empresa siempre en movimiento.', description: 'Movilidad como parte de una visión empresarial que conecta personas, operaciones y nuevas oportunidades.', services: ['Soluciones de movilidad', 'Atención empresarial', 'Acompañamiento comercial'], image: '/images/car.jpg', position: '50% 50%', logo: rentingLogo },
  { name: 'ContaWebAyM ERP', short: 'CONTAWEBAYM', suffix: 'ERP', category: 'GESTIÓN EMPRESARIAL ERP', headline: 'Todo tu negocio. Una sola visión.', description: 'ContaWebAyM ERP conecta la contabilidad, los inventarios y la gestión empresarial en una sola plataforma.', services: ['Contabilidad integral', 'Gestión de inventarios', 'Integración de procesos'], image: '/images/technology.jpg', position: '50% 50%', logo: contawebLogo, website: 'https://contawebaym.com/', websiteLabel: 'Visitar ContaWebAyM ERP' },
]

function Arrow({ direction = 'right' }: { direction?: 'right' | 'left' | 'diagonal' }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: direction === 'left' ? 'rotate(180deg)' : direction === 'diagonal' ? 'rotate(-45deg)' : undefined }}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

export default function App() {
  const [active, setActive] = useState(3)
  const [menuOpen, setMenuOpen] = useState(false)
  const [detail, setDetail] = useState<number | null>(null)
  const [motion, setMotion] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const company = companies[active]
  const { currentPath, navigate } = useSectionNavigation(() => setMenuOpen(false))

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotion(!preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!motion) return
    const context = gsap.context(() => {
      gsap.from('.intro-copy > *', { y: 16, opacity: 0, duration: 1.15, stagger: 0.1, ease: 'power3.out' })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => {
        gsap.from(element, { y: 22, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } })
      })
      gsap.to('.gallery-depth', { y: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
    }, root)
    return () => context.revert()
  }, [motion])

  useEffect(() => {
    if (detail !== null && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [detail])

  const move = (step: number) => setActive(index => (index + step + companies.length) % companies.length)
  const selectedDetail = detail === null ? null : companies[detail]

  return <div ref={root}>
    <a className="skip-link" href="#contenido" onClick={event => { event.preventDefault(); const content = document.getElementById('contenido'); content?.focus({ preventScroll: true }); content?.scrollIntoView({ behavior: 'instant' }) }}>Saltar al contenido</a>
    <header className="header">
      <a className="wordmark" href="/" onClick={navigate} aria-label="A&M GROUP, inicio">A<span>&</span>M <b>GROUP</b><i /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Cerrar −' : 'Menú +'}</button>
      <nav id="navigation" className={menuOpen ? 'open' : ''} aria-label="Navegación principal">
        <a href="/grupo" onClick={navigate} aria-current={currentPath === '/grupo' ? 'location' : undefined}>El grupo</a><a href="/experiencia" onClick={navigate} aria-current={currentPath === '/experiencia' ? 'location' : undefined}>Nuestra experiencia</a><a href="/empresas" onClick={navigate} aria-current={currentPath === '/empresas' ? 'location' : undefined}>Nuestras empresas <span className="nav-count">{String(companies.length).padStart(2, '0')}</span></a>
      </nav>
      <a className="header-link" href="/grupo" onClick={navigate}>Conócenos <Arrow direction="diagonal" /></a>
    </header>

    <main id="contenido" tabIndex={-1}>
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="intro">
          <div className="intro-copy"><p className="eyebrow"><span className="status-dot" /> Un grupo. Múltiples posibilidades.</p><h1 id="hero-title">Tu próximo nivel.<br /><span>Nuestra visión.</span></h1></div>
          <div className="intro-aside"><p>Contabilidad, finanzas y asesoría legal.<br />Un ecosistema que impulsa tu empresa.</p><a href="/empresas" onClick={navigate}>Explora el grupo <Arrow /></a></div>
          {motion && <div className="brand-scene" aria-hidden="true"><SceneBoundary><Suspense fallback={null}><BrandScene /></Suspense></SceneBoundary></div>}
        </div>

        <div className="gallery-depth" id="empresas">
          <div className="company-gallery" role="group" aria-label={`Explorar las ${companies.length} empresas del grupo`} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) } }}>
            {companies.map((item, index) => <article key={item.name} className={`company-panel panel-${index} ${index === active ? 'active' : ''}`} onPointerMove={event => { if (!motion || event.pointerType !== 'mouse') return; const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - 0.5) * 10}px`); event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`) }} onPointerLeave={event => { event.currentTarget.style.setProperty('--pointer-x', '0px'); event.currentTarget.style.setProperty('--pointer-y', '0px') }}>
              <div className="panel-image" style={{ '--panel-image': `url(${item.image})`, backgroundPosition: item.position } as CSSProperties} />
              <div className="panel-shade" />
              <span className="panel-top"><span>0{index + 1}</span><span className="panel-plus">{active === index ? '−' : '+'}</span></span>
              <span className={`panel-brand ${item.logo ? 'has-logo' : ''}`}>{item.logo ? <><img className="company-logo" src={item.logo} alt={item.name} decoding="async" /><strong className="logo-mobile-name" aria-hidden="true">{item.short}<em>{item.suffix}</em></strong></> : <><span className="brand-symbol" aria-hidden="true">{['⌁', '◈', '↗', '⋮', '≡'][index]}</span><strong>{item.short}<em>{item.suffix}</em></strong></>}</span>
              <button className="panel-select" aria-label={`Seleccionar ${item.name}`} aria-pressed={index === active} onClick={() => setActive(index)} />
              <div className="panel-bottom"><span>{item.category}</span><button className="panel-discover" aria-label={`Descubrir ${item.name}`} aria-haspopup="dialog" onClick={() => { setActive(index); setDetail(index) }}><span>Descubrir</span><Arrow direction="diagonal" /></button></div>
            </article>)}
          </div>
        </div>
        <div className="gallery-caption">
          <div className="selected-company" aria-live="polite" aria-atomic="true"><span className="caption-index">0{active + 1}<small> / {String(companies.length).padStart(2, '0')}</small></span><div key={active}><span className="caption-name">{company.name}</span><p>{company.headline}</p></div></div>
          <div className="company-actions">{company.website && <a className="discover-button" href={company.website} target="_blank" rel="noopener noreferrer">{company.websiteLabel}<Arrow direction="diagonal" /></a>}<button className={company.website ? 'details-button' : 'discover-button'} onClick={() => setDetail(active)}>Descubrir empresa <Arrow direction="diagonal" /></button></div>
          <div className="gallery-controls"><button onClick={() => move(-1)} aria-label="Empresa anterior"><Arrow direction="left" /></button><button onClick={() => move(1)} aria-label="Empresa siguiente"><Arrow /></button></div>
        </div>
        <div className="hero-baseline"><span>INDEPENDIENTES EN ESPECIALIDAD. CONECTADOS EN VISIÓN.</span><a href="/grupo" onClick={navigate}>SIGUE EXPLORANDO <span>↓</span></a></div>
      </section>

      <section className="group-section" id="grupo" aria-labelledby="group-title">
        <div className="section-kicker reveal"><span className="tiny-square" /> El poder de estar conectados <span className="section-number">A&M Group</span></div>
        <div className="group-grid"><h2 className="reveal" id="group-title">Visión integral.<br />Impacto <span>real.</span></h2><div className="group-copy reveal"><p>Las buenas decisiones empiezan con una perspectiva más amplia.</p><p>En A&M GROUP reunimos contabilidad, finanzas y asesoría legal con empresas que amplían nuestras posibilidades. Distintas especialidades, una misma dirección: acompañar el desarrollo de tu negocio.</p><a className="text-link" href="/experiencia" onClick={navigate}>Conoce nuestra experiencia <Arrow direction="diagonal" /></a></div></div>
        <div className="expertise" id="expertise"><div className="expertise-heading reveal"><p className="eyebrow">Nuestra experiencia</p><span>Tres perspectivas. Una estrategia.</span></div>
          {[
            ['01', 'Contabilidad', 'Orden para crecer.', 'Información contable y orientación tributaria para comprender tu negocio y tomar decisiones con mayor claridad.'],
            ['02', 'Finanzas', 'Perspectiva para avanzar.', 'Análisis y planificación financiera para entender tus recursos, evaluar escenarios y definir tus próximos pasos.'],
            ['03', 'Asesoría legal', 'Respaldo para decidir.', 'Una mirada legal que acompaña las decisiones empresariales y ayuda a identificar las implicancias de cada paso.'],
          ].map(([number, title, subtitle, text]) => <details className="service-row reveal" key={number}><summary><span className="service-number">{number}</span><h3>{title}</h3><span className="service-tagline">{subtitle}</span><span className="service-expand" aria-hidden="true">+</span></summary><p>{text}</p>{number === '01' && <a className="service-website" href="https://www.asesorescontablesaym.com/" target="_blank" rel="noopener noreferrer">Visitar Asesores Contables A&M <Arrow direction="diagonal" /></a>}</details>)}
        </div>
      </section>
      <section className="closing-section"><div className="closing-orbit" aria-hidden="true" /><p className="eyebrow reveal">El ecosistema A&M Group</p><h2 className="reveal">Cuatro empresas.<br /><span>Un horizonte compartido.</span></h2><a className="orange-button reveal" href="/empresas" onClick={navigate}>Encuentra tu siguiente paso <Arrow direction="diagonal" /></a></section>
    </main>
    <footer><a className="wordmark" href="/" onClick={navigate}>A<span>&</span>M <b>GROUP</b><i /></a><p>Contabilidad. Finanzas. Visión empresarial.</p><span>© {new Date().getFullYear()} A&M GROUP</span><a href="/" onClick={navigate} aria-label="Volver al inicio">↑</a></footer>
    <dialog ref={dialog} className="company-dialog" aria-labelledby="company-dialog-title" onClose={() => setDetail(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {selectedDetail && <div className="dialog-inner"><button className="dialog-close" aria-label="Cerrar detalle de empresa" onClick={() => dialog.current?.close()}>×</button><span className="eyebrow">A&M GROUP / {selectedDetail.category}</span>{selectedDetail.logo && <img className="dialog-company-logo" src={selectedDetail.logo} alt={selectedDetail.name} decoding="async" />}<h2 id="company-dialog-title">{selectedDetail.name}</h2><p className="dialog-headline">{selectedDetail.headline}</p><p>{selectedDetail.description}</p><ul>{selectedDetail.services.map(service => <li key={service}><span />{service}</li>)}</ul><div className="dialog-actions">{selectedDetail.website && <a className="orange-button" href={selectedDetail.website} target="_blank" rel="noopener noreferrer">{selectedDetail.websiteLabel}<Arrow direction="diagonal" /></a>}<button className={selectedDetail.website ? 'details-button' : 'orange-button'} onClick={() => dialog.current?.close()}>Seguir explorando <Arrow /></button></div></div>}
    </dialog>
  </div>
}
