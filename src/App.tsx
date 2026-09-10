import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent, ReactNode } from 'react'
import { companies, contact, pillars, trackEvent } from './siteData'
import { useSiteNavigation } from './useSiteNavigation'
import { buildContactMailto } from './contactMail'
import './App.css'

const BrandScene = lazy(() => import('./BrandScene'))
type Navigate = (event: MouseEvent<HTMLAnchorElement>) => void
type Company = typeof companies[number]

function Arrow({ direction = 'diagonal' }: { direction?: 'right' | 'left' | 'diagonal' }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: direction === 'left' ? 'rotate(180deg)' : direction === 'diagonal' ? 'rotate(-45deg)' : undefined }}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
}
function Wordmark() { return <span className="wordmark"><span className="wordmark-text"><span className="wordmark-group">Grupo</span>{' '}<span className="wordmark-name">AyM</span></span><span className="wordmark-accent" aria-hidden="true" /></span> }
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}
function BrandLink({ company, destination, placement, children, className }: { company: Company; destination: Company['destinations'][number]; placement: string; children: ReactNode; className?: string }) {
  return <a className={className} href={destination.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('brand_outbound', { brand: company.id, product: destination.name, placement })}>{children}<span className="sr-only"> (abre en otra pestaña)</span></a>
}
function ContactForm() {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined
  const privacyUrl = import.meta.env.VITE_PRIVACY_URL as string | undefined
  const directDelivery = Boolean(endpoint && privacyUrl)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'prepared'>('idle')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form).entries())
    if (!directDelivery) {
      const company = companies.find(c => c.id === fields.brand)
      if (!company) return
      window.location.href = buildContactMailto(company.email || contact.email, company.name, fields)
      setStatus('prepared')
      trackEvent('contact_email_prepare', { brand: company.id })
      return
    }
    setStatus('sending')
    try {
      const response = await fetch(endpoint!, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields), signal: AbortSignal.timeout(15000) })
      if (!response.ok) throw new Error('Delivery failed')
      setStatus('success'); trackEvent('contact_submit', { brand: String(fields.brand) }); form.reset()
    } catch { setStatus('error') }
  }
  return <div className="contact-form-wrap"><p className="eyebrow">Cuéntanos qué necesitas</p><h2>Empecemos una conversación.</h2>
    {!directDelivery && <p className="form-notice" id="form-availability">Completa tu consulta y abriremos tu aplicación de correo con el mensaje preparado para que lo revises y envíes. También puedes escribirnos por WhatsApp.</p>}
    <form onSubmit={submit} aria-describedby={!directDelivery ? 'form-availability' : undefined}><fieldset disabled={status === 'sending'}><div className="form-grid">
      <label>Nombre<input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>Empresa <span className="optional">(opcional)</span><input name="company" autoComplete="organization" maxLength={160} /></label>
      <label>Correo electrónico<input name="email" type="email" autoComplete="email" maxLength={200} required /></label>
      <label>Teléfono <span className="optional">(opcional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={30} /></label>
      <label className="form-full">Marca de interés<select name="brand" required defaultValue=""><option value="" disabled>Selecciona una marca</option>{companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label className="form-full">Mensaje<textarea name="message" rows={4} maxLength={3000} required /></label>
    </div>{directDelivery && privacyUrl && <label className="consent"><input type="checkbox" name="consent" value="yes" required /><span>He leído la <a href={privacyUrl} target="_blank" rel="noopener noreferrer">política de privacidad</a> y acepto el tratamiento de mis datos para atender esta consulta.</span></label>}
    <button className="orange-button" type="submit">{status === 'sending' ? 'Enviando…' : directDelivery ? 'Enviar consulta' : 'Abrir consulta en mi correo'}<Arrow direction="right" /></button></fieldset>
    <div role="status" aria-live="polite" className={`form-status ${status}`}>{status === 'prepared' && 'Tu consulta está preparada; debes enviarla desde tu aplicación de correo. Si no se abre, utiliza los correos de contacto o WhatsApp.'}{status === 'success' && 'Recibimos tu consulta. Gracias por contactar con Grupo AyM.'}{status === 'error' && 'No pudimos enviar tu consulta. Inténtalo de nuevo o utiliza los canales de nuestras marcas.'}</div></form></div>
}
function Closing({ navigate }: { navigate: Navigate }) {
  return <section className="closing-section"><p className="eyebrow">Contigo en cada etapa</p><h2>Tres marcas. Una misma visión.</h2><p>Contabilidad, tecnología y movilidad integradas para acompañarte en cada etapa de tu crecimiento. Esto es Grupo AyM.</p><a className="dark-button" href="/contacto" onClick={navigate}>Conversemos sobre tu empresa <Arrow /></a></section>
}
function Pillars() { return <div className="pillars">{pillars.map(([title, text], i) => <article key={title}><span className="pillar-number">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div> }

export default function App({ initialPath = '/' }: { initialPath?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [detail, setDetail] = useState<number | null>(null)
  const [motion, setMotion] = useState(false)
  const [visibleCard, setVisibleCard] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const dialogTrigger = useRef<HTMLElement | null>(null)
  const gallery = useRef<HTMLDivElement>(null)
  const brandMenu = useRef<HTMLDetailsElement>(null)
  const { path, navigate: changePage } = useSiteNavigation(initialPath)
  const selectedDetail = detail === null ? null : companies[detail]
  const navigate: Navigate = event => { changePage(event); setMenuOpen(false) }

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (brandMenu.current?.open && !brandMenu.current.contains(event.target as Node)) brandMenu.current.open = false
    }
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && brandMenu.current?.open && !dialog.current?.open) {
        brandMenu.current.open = false
        brandMenu.current.querySelector('summary')?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeWithEscape)
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeWithEscape) }
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 1100px)')
    const update = () => setMotion(preference.matches)
    update(); preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => { if (detail !== null) dialog.current?.showModal() }, [detail])
  useEffect(() => {
    if (!gallery.current) return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setVisibleCard(Number((entry.target as HTMLElement).dataset.index))
    }, { root: gallery.current, threshold: 0.7 })
    for (const card of gallery.current.children) observer.observe(card)
    return () => observer.disconnect()
  }, [path])
  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); document.getElementById('menu-toggle')?.focus() } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])
  function openDetail(index: number, event: MouseEvent<HTMLElement>) { dialogTrigger.current = event.currentTarget; setDetail(index); setMenuOpen(false) }
  function scrollCard(index: number) {
    const card = gallery.current?.children[index] as HTMLElement | undefined
    if (card && gallery.current) gallery.current.scrollTo({ left: card.offsetLeft - (gallery.current.children[0] as HTMLElement).offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="header"><a className="home-link" href="/" onClick={navigate} aria-label="Grupo AyM, inicio"><Wordmark /></a>
      <nav id="navigation" className={menuOpen ? 'open' : ''} aria-label="Navegación principal"><a href="/" onClick={navigate} aria-current={path === '/' ? 'page' : undefined}>Inicio</a>
        <details ref={brandMenu} className="brand-menu" key={path + String(menuOpen)}><summary>Empresas <svg className="nav-chevron" width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></summary><div className="brand-menu-list"><div className="brand-menu-heading"><span>Nuestras marcas</span><span>03</span></div>{companies.map((c, i) => {
          const label = <><span className="nav-brand-logo"><img src={c.logo} alt="" width="74" height="42" /></span><span className="nav-brand-copy"><strong>{c.name}</strong><small>{c.category}</small></span><Arrow /></>
          return c.destinations.length === 1 ? <BrandLink key={c.id} company={c} destination={c.destinations[0]} placement="menu">{label}</BrandLink> : <button key={c.id} onClick={e => openDetail(i, e)} aria-haspopup="dialog">{label}</button>
        })}<a className="nav-all-brands" href="/#empresas" onClick={navigate}>Explorar el grupo <Arrow direction="right" /></a></div></details>
        <a href="/nosotros" onClick={navigate} aria-current={path === '/nosotros' ? 'page' : undefined}>Nosotros</a><a href="/contacto" onClick={navigate} aria-current={path === '/contacto' ? 'page' : undefined}>Contacto</a></nav>
      <div className="header-actions"><a className="orange-button header-contact" href="/contacto" onClick={navigate}>Contáctanos <Arrow /></a><button id="menu-toggle" className="menu-toggle" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button></div>
    </header>
    <main id="contenido" tabIndex={-1}>
      {path === '/' && <>
        <section className="hero" aria-labelledby="hero-title"><div className="intro"><div className="intro-copy"><p className="eyebrow"><span className="status-dot" /> Grupo AyM · Perú</p><h1 id="hero-title">Contabilidad, tecnología<br className="desktop-break" /> y movilidad.<br /><span>Todo con el mismo respaldo.</span></h1><p className="hero-description">En Grupo AyM integramos experiencia contable, soluciones tecnológicas y servicios de movilidad para acompañar el crecimiento de empresas y personas en Lima y en todo el Perú.</p><div className="hero-actions"><a className="orange-button" href="/nosotros" onClick={navigate}>Conoce nuestro grupo <Arrow /></a><a className="text-link" href="/contacto" onClick={navigate}>Contáctanos <Arrow direction="right" /></a></div></div>{motion && <div className="brand-scene" aria-hidden="true"><SceneBoundary><Suspense fallback={null}><BrandScene /></Suspense></SceneBoundary></div>}</div>
          <section className="brands-section" id="empresas" tabIndex={-1} aria-labelledby="brands-title"><div className="section-heading"><div><p className="eyebrow">Especialidades que se complementan</p><h2 id="brands-title">Tres marcas. El mismo respaldo.</h2></div><span className="section-number">01 — 03</span></div>
            <div className="company-gallery" ref={gallery} aria-label="Las tres marcas de Grupo AyM">{companies.map((c, index) => <article className="company-panel" key={c.id} data-index={index} aria-labelledby={`brand-${c.id}`}><img className="panel-image" src={c.image} alt="" width="700" height="900" decoding="async" /><div className="panel-shade" /><div className="panel-top"><span>0{index + 1}</span><span>{c.category}</span></div>
              {c.destinations.length === 1 ? <BrandLink className="panel-brand" company={c} destination={c.destinations[0]} placement="logo"><img src={c.logo} alt={c.name} decoding="async" width="1000" height="400" /></BrandLink> : <button className="panel-brand" onClick={e => openDetail(index, e)} aria-label={`Conocer ${c.name}`} aria-haspopup="dialog"><img src={c.logo} alt={c.name} decoding="async" width="1000" height="400" /></button>}
              <div className="panel-copy"><p className="brand-name">{c.name}</p><h3 id={`brand-${c.id}`}>{c.headline}</h3><p>{c.description}</p><button className="panel-discover" onClick={e => openDetail(index, e)} aria-label={`Descubrir ${c.name}`} aria-haspopup="dialog">Descubrir <Arrow /></button></div></article>)}</div>
            <div className="gallery-mobile-controls"><button aria-label="Marca anterior" disabled={visibleCard === 0} onClick={() => scrollCard(visibleCard - 1)}><Arrow direction="left" /></button><div className="gallery-dots">{companies.map((c, i) => <button key={c.id} className={visibleCard === i ? 'current' : ''} aria-label={`Ver ${c.name}`} aria-current={visibleCard === i ? 'true' : undefined} onClick={() => scrollCard(i)} />)}</div><button aria-label="Marca siguiente" disabled={visibleCard === companies.length - 1} onClick={() => scrollCard(visibleCard + 1)}><Arrow direction="right" /></button></div><p className="hero-baseline">Independientes en especialidad. Conectados en visión.</p></section></section>
        <section className="group-section" id="ecosistema" tabIndex={-1}><div className="section-kicker"><span className="tiny-square" /> Nuestro ecosistema</div><div className="group-grid"><h2>Independientes en especialidad.<br /><span>Conectados en visión.</span></h2><div className="group-copy"><p>Grupo AyM nació de nuestra pasión por la contabilidad.</p><p>Con el tiempo incorporamos tecnología para simplificar la gestión empresarial y soluciones de movilidad para que nuestros clientes puedan trabajar, crecer y avanzar con mayor tranquilidad.</p><a className="text-link" href="/#empresas" onClick={navigate}>Descubre nuestras soluciones <Arrow /></a></div></div><Pillars /></section>
        <section className="history-teaser"><div className="history-year"><span>El inicio de nuestra historia</span><strong>2007<span>↗</span></strong></div><div><p className="eyebrow">Una visión que sigue creciendo</p><h2>De una pequeña idea a un grupo que acompaña empresas.</h2><p>Nuestra historia comenzó con una convicción: hacer de la contabilidad una herramienta para tomar mejores decisiones.</p><a className="text-link" href="/nosotros" onClick={navigate}>Conoce nuestra trayectoria <Arrow /></a></div></section><Closing navigate={navigate} />
      </>}
      {path === '/nosotros' && <><section className="page-intro"><p className="eyebrow">Nosotros · Grupo AyM</p><h1>Una historia compartida.<br /><span>Una visión que crece.</span></h1><p>De una pequeña idea en 2007 a un grupo que acompaña empresas dentro y fuera del Perú.</p></section><section className="story-section"><div className="history-year"><span>Desde</span><strong>2007<span>↗</span></strong></div><div><p className="eyebrow">Nuestra trayectoria</p><h2>Todo empezó con la contabilidad.</h2><p>Nuestra historia comenzó en 2007 con una pequeña idea y una gran convicción: hacer de la contabilidad una herramienta para que las empresas tomen mejores decisiones.</p><p>Hoy esa visión es Grupo AyM, un equipo que atiende empresas en todo el país y asesora a clientes en varios países de América y el Caribe.</p><p>La tecnología y la movilidad amplían esa vocación de servicio. Tres especialidades conectadas para acompañar distintas necesidades con una misma visión.</p></div></section><section className="group-section"><div className="section-heading"><div><p className="eyebrow">Lo que nos une</p><h2>Un mismo estándar de atención.</h2></div></div><Pillars /><a className="text-link" href="/#empresas" onClick={navigate}>Conoce nuestras tres marcas <Arrow /></a></section><Closing navigate={navigate} /></>}
      {path === '/contacto' && <><section className="page-intro"><p className="eyebrow">Contacto · Grupo AyM</p><h1>Conversemos sobre<br /><span>tu siguiente paso.</span></h1><p>Contabilidad, tecnología o movilidad. Encuentra la atención que tu empresa necesita.</p></section><section className="contact-layout"><ContactForm /><aside className="contact-channels"><p className="eyebrow">Atención por especialidad</p><h2>Conecta con nuestras marcas.</h2>{companies.map((c, i) => <article className="contact-brand" key={c.id}><img src={c.logo} alt={c.name} width="200" height="80" /><h3>{c.name}</h3><p>{c.category}</p>{c.destinations.length ? c.destinations.map(d => <BrandLink key={d.url} company={c} destination={d} placement="contact" className="text-link">{d.name}<Arrow /></BrandLink>) : <button className="text-link" onClick={e => openDetail(i, e)} aria-haspopup="dialog">Conoce nuestros servicios <Arrow /></button>}{c.email && <a className="text-link contact-email" href={`mailto:${c.email}`} onClick={() => trackEvent('email_click', { placement: 'contact', brand: c.id })}>{c.email}<Arrow /></a>}</article>)}{contact.email && <a className="text-link" href={`mailto:${contact.email}`} onClick={() => trackEvent('email_click', { placement: 'contact' })}>{contact.email}<Arrow /></a>}{contact.phone && <a className="text-link" href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} onClick={() => trackEvent('phone_click', { placement: 'contact' })}>{contact.phone}</a>}</aside></section></>}
      {!['/', '/nosotros', '/contacto'].includes(path) && <section className="page-intro"><p className="eyebrow">404</p><h1>No encontramos esta página.</h1><p>Explora nuestras marcas desde el inicio.</p><a className="orange-button" href="/" onClick={navigate}>Volver al inicio <Arrow /></a></section>}
    </main>
    <footer className="footer"><div className="footer-grid"><div className="footer-about"><a href="/" onClick={navigate} aria-label="Grupo AyM, inicio"><Wordmark /></a><p>Contabilidad · Tecnología · Movilidad</p><p>Tres marcas conectadas para acompañar el crecimiento de empresas y personas.</p></div><div><h2>Nuestras marcas</h2>{companies.map((c, i) => c.destinations.length === 1 ? <BrandLink key={c.id} company={c} destination={c.destinations[0]} placement="footer">{c.name}</BrandLink> : <button key={c.id} onClick={e => openDetail(i, e)} aria-haspopup="dialog">{c.name}</button>)}</div><div><h2>El grupo</h2><a href="/nosotros" onClick={navigate}>Nuestra historia</a><a href="/#ecosistema" onClick={navigate}>Nuestro ecosistema</a><a href="/contacto" onClick={navigate}>Contacto</a></div><div><h2>Conversemos</h2><p>Encuentra los canales de atención de nuestras marcas.</p><a className="footer-cta" href="/contacto" onClick={navigate}>Contáctanos <Arrow /></a>{contact.address && <p>{contact.address}</p>}{contact.hours && <p>{contact.hours}</p>}{contact.email && <a href={`mailto:${contact.email}`} onClick={() => trackEvent('email_click', { placement: 'footer' })}>{contact.email}</a>}{contact.phone && <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} onClick={() => trackEvent('phone_click', { placement: 'footer' })}>{contact.phone}</a>}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Grupo AyM. Todos los derechos reservados.</span><span>Perú</span></div></footer>
    {contact.whatsapp && <a className="whatsapp-float" href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { placement: 'floating' })} aria-label="Contactar por WhatsApp (abre en otra pestaña)"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.3-4.1A8 8 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.7" /><path d="M9 8c0 4 3 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg><span>WhatsApp</span></a>}
    <dialog ref={dialog} className="company-dialog" aria-labelledby="company-dialog-title" onClose={() => { setDetail(null); if (dialogTrigger.current?.isConnected && dialogTrigger.current.getClientRects().length) dialogTrigger.current.focus(); else document.getElementById('menu-toggle')?.focus() }} onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.current?.close() } }}>
      {selectedDetail && <div className="dialog-inner"><button className="dialog-close" aria-label="Cerrar detalle de empresa" onClick={() => dialog.current?.close()}>×</button><p className="eyebrow">Grupo AyM / {selectedDetail.category}</p><img className="dialog-company-logo" src={selectedDetail.logo} alt={selectedDetail.name} width="340" height="135" /><h2 id="company-dialog-title">{selectedDetail.name}</h2><p className="dialog-headline">{selectedDetail.headline}</p><p>{selectedDetail.description}</p><ul>{selectedDetail.services.map(service => <li key={service}><span />{service}</li>)}</ul><div className="product-links">{selectedDetail.destinations.map(d => <BrandLink key={d.url} company={selectedDetail} destination={d} placement="modal" className="product-link"><span><strong>{d.name}</strong><small>{d.description}</small></span><Arrow /></BrandLink>)}</div>{!selectedDetail.destinations.length && <div className="product-links"><a className="product-link" href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hola, quisiera información sobre Renting Car A&M.')}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { placement: 'modal', brand: 'renting' })}><span><strong>Consultar por WhatsApp</strong><small>{contact.phone}</small></span><Arrow /></a><a className="text-link contact-email" href={`mailto:${contact.email}?subject=${encodeURIComponent('Consulta sobre Renting Car A&M')}`}>{contact.email}<Arrow /></a></div>}<button className="details-button" onClick={() => dialog.current?.close()}>Seguir explorando <Arrow direction="right" /></button></div>}
    </dialog>
  </>
}
