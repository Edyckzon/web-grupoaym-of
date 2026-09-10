import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { pages } from './siteData'
import { isPlainNavigation, normalizePath } from './navigation'

export function useSiteNavigation(initialPath: string) {
  const [path, setPath] = useState(normalizePath(initialPath))
  useEffect(() => {
    const restore = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  useEffect(() => {
    const page = pages[path as keyof typeof pages]
    document.title = page?.title ?? 'Página no encontrada | Grupo AyM'
    document.querySelector('meta[name="description"]')?.setAttribute('content', page?.description ?? '')
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://grupoaym.com${path === '/' ? '/' : path}`)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', page?.description ?? '')
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://grupoaym.com${path}`)
    const legacy = window.location.pathname === '/empresas' ? '#empresas' : window.location.pathname === '/experiencia' ? '#ecosistema' : ''
    const hash = window.location.hash === '#expertise' ? '#ecosistema' : window.location.hash === '#grupo' ? '#ecosistema' : window.location.hash || legacy
    if (window.location.pathname !== path || hash !== window.location.hash) window.history.replaceState(null, '', path + window.location.search + hash)
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1))
      if (target) target.scrollIntoView({ behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [path])

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (!isPlainNavigation(event) || event.currentTarget.target === '_blank' || event.currentTarget.hasAttribute('download')) return
    const url = new URL(event.currentTarget.href)
    if (url.origin !== window.location.origin) return
    event.preventDefault()
    window.history.pushState(null, '', url.pathname + url.search + url.hash)
    setPath(normalizePath(url.pathname))
    requestAnimationFrame(() => {
      const target = document.getElementById(url.hash.slice(1)) ?? document.getElementById('contenido')
      target?.focus({ preventScroll: true })
      if (url.hash) target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    })
  }
  return { path, navigate }
}
