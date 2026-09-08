import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

export const sectionRoutes = {
  '/': { id: 'inicio', title: 'A&M GROUP — Visión que conecta' },
  '/grupo': { id: 'grupo', title: 'El grupo | A&M GROUP' },
  '/experiencia': { id: 'expertise', title: 'Nuestra experiencia | A&M GROUP' },
  '/empresas': { id: 'empresas', title: 'Nuestras empresas | A&M GROUP' },
} as const
export type SectionPath = keyof typeof sectionRoutes

export function resolveSectionPath(pathname: string, hash = ''): SectionPath | null {
  const legacy = Object.entries(sectionRoutes).find(([, route]) => `#${route.id}` === hash)
  if (legacy) return legacy[0] as SectionPath
  const path = pathname.replace(/\/+$/, '') || '/'
  return Object.hasOwn(sectionRoutes, path) ? path as SectionPath : null
}

export function isPlainNavigation(event: Pick<MouseEvent, 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'defaultPrevented'>) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function useSectionNavigation(onNavigate: () => void) {
  const [currentPath, setCurrentPath] = useState<SectionPath>(() => resolveSectionPath(window.location.pathname, window.location.hash) ?? '/')
  const frame = useRef(0)

  function scrollToSection(path: SectionPath, smooth: boolean, focus: boolean) {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const target = document.getElementById(sectionRoutes[path].id)
      if (!target) return
      if (focus) {
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }
      const behavior = smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant'
      if (path === '/') window.scrollTo({ top: 0, behavior })
      else target.scrollIntoView({ behavior, block: 'start' })
    })
  }

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    function restore() {
      const path = resolveSectionPath(window.location.pathname, window.location.hash)
      if (!path) return
      // Keep previously shared hash links working, replacing them with clean URLs.
      if (window.location.pathname !== path || window.location.hash) {
        window.history.replaceState(window.history.state, '', path + window.location.search)
      }
      setCurrentPath(path)
      document.title = sectionRoutes[path].title
      scrollToSection(path, false, false)
    }
    restore()
    window.addEventListener('popstate', restore)
    window.addEventListener('hashchange', restore)
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('popstate', restore)
      window.removeEventListener('hashchange', restore)
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (!isPlainNavigation(event) || event.currentTarget.target === '_blank' || event.currentTarget.hasAttribute('download')) return
    const url = new URL(event.currentTarget.href)
    if (url.origin !== window.location.origin) return
    const path = resolveSectionPath(url.pathname, url.hash)
    if (!path) return
    event.preventDefault()
    onNavigate()
    if (window.location.pathname !== path || window.location.hash || window.location.search !== url.search) {
      window.history.pushState(null, '', path + url.search)
    }
    setCurrentPath(path)
    document.title = sectionRoutes[path].title
    scrollToSection(path, true, true)
  }

  return { currentPath, navigate }
}
