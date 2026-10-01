import { useEffect, useRef, useState } from 'react'
import './Reviews.css'

// Manual selection transcribed from the screenshots supplied by the site owner.
// Do not infer review dates, missing text, or an overall Google rating.
const reviews = [
  { name: 'yeleidy gutierrez', initials: 'YG', text: 'Equipo responsable y capacitado con asesoría óptima en el manejo de tu empresa. Acompañamiento desde el inicio de la constitución de la empresa.', excerpt: true },
  { name: 'Alfonso Albornoz Fabian', initials: 'AA', text: 'Atención eficiente' },
  { name: 'gustavo hinojosa', initials: 'GH', text: 'Excelete! Te dan soluciones para poder mejorar tu empresa.' },
  { name: 'wildor bustamante davila', initials: 'WB' },
  { name: 'Cristhian Soto', initials: 'CS' },
  { name: 'Mirella Angie Ruiz Arroyo', initials: 'MR' },
  { name: 'Exportadora Beto', initials: 'EB' },
  { name: 'EDIXON PAISIĆ B. (Vincenzo)', initials: 'EP' },
]

function ReviewArrow({ previous = false }: { previous?: boolean }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" style={{ transform: previous ? 'rotate(180deg)' : undefined }}><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function Reviews() {
  const track = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  useEffect(() => {
    const list = track.current
    if (!list) return
    const update = () => setEdges({ start: list.scrollLeft < 2, end: list.scrollLeft + list.clientWidth >= list.scrollWidth - 2 })
    const observer = new ResizeObserver(update)
    observer.observe(list)
    list.addEventListener('scroll', update, { passive: true })
    update()
    return () => { observer.disconnect(); list.removeEventListener('scroll', update) }
  }, [])

  function slide(direction: number) {
    const list = track.current
    if (!list || list.children.length < 2) return
    const step = (list.children[1] as HTMLElement).offsetLeft - (list.children[0] as HTMLElement).offsetLeft
    list.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <section className="reviews-section" id="resenas" aria-labelledby="reviews-title">
    <div className="reviews-heading">
      <div><p className="reviews-eyebrow"><span aria-hidden="true" />Reseñas de Google</p><h2 id="reviews-title">La confianza se comparte.</h2></div>
      <a className="reviews-source" href="https://maps.app.goo.gl/CdcyJVYk5wtG7aqa6" target="_blank" rel="noopener noreferrer">Ver en Google Maps <span aria-hidden="true">↗</span><span className="sr-only"> (abre en otra pestaña)</span></a>
    </div>
    <ul className="reviews-track" id="reviews-track" ref={track} tabIndex={0} aria-label="Reseñas seleccionadas; usa las flechas para desplazarte" onKeyDown={event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); slide(event.key === 'ArrowRight' ? 1 : -1) }
    }}>
      {reviews.map((review, index) => <li className={`review-card ${review.text ? '' : 'rating-only'}`} key={review.name}>
        <div className="review-author"><span className={`review-avatar tone-${index % 3}`} aria-hidden="true">{review.initials}</span><h3>{review.name}</h3><span className="review-quote" aria-hidden="true">“</span></div>
        <div className="review-stars" role="img" aria-label="5 de 5 estrellas">{Array.from({ length: 5 }, (_, i) => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z" /></svg>)}</div>
        {review.text ? <blockquote>{review.excerpt ? review.text.replace(/\.$/, '') : review.text}{review.excerpt && <span aria-label="Extracto">…</span>}</blockquote> : <p className="review-rating-label">Una valoración de <strong>5 estrellas.</strong></p>}
        <p className="review-caption">{review.excerpt ? 'Extracto de reseña' : review.text ? 'Reseña' : 'Valoración'} en Google Maps</p>
      </li>)}
    </ul>
    <div className="reviews-bottom"><p>Una selección de opiniones de nuestros clientes.</p><div className="reviews-controls" aria-label="Controles de reseñas"><button type="button" onClick={() => slide(-1)} disabled={edges.start} aria-label="Reseñas anteriores" aria-controls="reviews-track"><ReviewArrow previous /></button><button type="button" onClick={() => slide(1)} disabled={edges.end} aria-label="Reseñas siguientes" aria-controls="reviews-track"><ReviewArrow /></button></div></div>
  </section>
}
