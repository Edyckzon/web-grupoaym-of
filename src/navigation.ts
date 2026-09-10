export function normalizePath(path: string) {
  const clean = path.replace(/\/+$/, '') || '/'
  return clean === '/grupo' ? '/nosotros' : clean === '/empresas' || clean === '/experiencia' ? '/' : clean
}

export function isPlainNavigation(event: { button: number; metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean; defaultPrevented: boolean }) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey
}
