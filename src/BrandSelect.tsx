import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { companies } from './siteData'

export function BrandSelect({ value, onChange, error, disabled }: { value: string; onChange: (value: string) => void; error: boolean; disabled: boolean }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [above, setAbove] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const selected = companies.find(c => c.id === value)
  const search = useRef({ text: '', time: 0 })

  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open])

  function expand(index = Math.max(0, companies.findIndex(c => c.id === value))) {
    const rect = trigger.current?.getBoundingClientRect()
    setAbove(Boolean(rect && window.innerHeight - rect.bottom < 270 && rect.top > 270))
    setActive(index)
    setOpen(true)
  }
  function select(index: number) {
    onChange(companies[index].id)
    setOpen(false)
    trigger.current?.focus()
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      if (event.key === 'Enter' || event.key === ' ') { if (open) select(active); else expand(); return }
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? companies.length - 1 : Math.max(0, Math.min(companies.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1)))
      if (open) setActive(index)
      else expand(event.key === 'End' ? companies.length - 1 : event.key === 'Home' ? 0 : undefined)
    } else if (event.key === 'Escape') {
      event.preventDefault(); setOpen(false)
    } else if (event.key === 'Tab') {
      setOpen(false)
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now()
      search.current = { text: now - search.current.time < 700 ? search.current.text + event.key : event.key, time: now }
      const match = companies.findIndex(c => c.name.toLowerCase().startsWith(search.current.text.toLowerCase()))
      if (match >= 0) { event.preventDefault(); if (open) setActive(match); else expand(match) }
    }
  }
  return <div className="form-full brand-select" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
    <label id="brand-label" htmlFor="brand-trigger">Marca de interés</label>
    <input type="hidden" name="brand" value={value} />
    <button id="brand-trigger" ref={trigger} className={`brand-select-trigger ${open ? 'is-open' : ''} ${error ? 'has-error' : ''}`} type="button" role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls="brand-options" aria-labelledby="brand-label brand-value" aria-activedescendant={open ? `brand-option-${companies[active].id}` : undefined} aria-required="true" aria-invalid={error || undefined} aria-describedby={error ? 'brand-error' : undefined} disabled={disabled} onClick={() => open ? setOpen(false) : expand()} onKeyDown={keyboard}>
      {selected && <span className="brand-select-logo"><img src={selected.logo} alt="" width="62" height="36" /></span>}
      <span className="brand-select-value"><span id="brand-value">{selected?.name ?? 'Selecciona una marca'}</span>{selected && <small>{selected.category}</small>}</span>
      <svg className="brand-select-chevron" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {open && <div className={`brand-select-popup ${above ? 'above' : ''}`}><p className="brand-select-caption" aria-hidden="true">Encuentra tu especialidad <span>03 marcas</span></p><div role="listbox" id="brand-options" aria-labelledby="brand-label">{companies.map((company, index) => <div id={`brand-option-${company.id}`} key={company.id} role="option" aria-selected={value === company.id} className={`brand-select-option ${index === active ? 'highlighted' : ''} ${value === company.id ? 'selected' : ''}`} onPointerMove={() => setActive(index)} onMouseDown={e => e.preventDefault()} onClick={() => select(index)}>
      <span className="brand-select-logo"><img src={company.logo} alt="" width="62" height="36" /></span><span className="brand-select-value"><strong>{company.name}</strong><small>{company.category}</small></span><span className="brand-select-check" aria-hidden="true">{value === company.id && <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>
    </div>)}</div></div>}
    {error && <p className="brand-select-error" id="brand-error" role="alert">Selecciona la marca que deseas consultar.</p>}
  </div>
}
