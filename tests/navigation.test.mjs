import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { normalizePath, isPlainNavigation } from '../src/navigation.ts'

test('clean routes and trailing slashes resolve to the intended sections', () => {
  for (const path of ['/', '/nosotros', '/contacto']) {
    assert.equal(normalizePath(path), path)
    assert.equal(normalizePath(path + '/'), path)
  }
  assert.equal(normalizePath('/unknown'), '/unknown')
})

test('previously shared routes resolve to the new structure', () => {
  assert.equal(normalizePath('/grupo'), '/nosotros')
  assert.equal(normalizePath('/experiencia'), '/')
  assert.equal(normalizePath('/empresas'), '/')
})

test('modified and middle clicks retain native browser behavior', () => {
  const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false }
  assert.equal(isPlainNavigation(click), true)
  for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented']) {
    assert.equal(isPlainNavigation({ ...click, [key]: true }), false)
  }
  assert.equal(isPlainNavigation({ ...click, button: 1 }), false)
})

test('production output serves the new pages and preserves old URLs', () => {
  const rules = readFileSync(new URL('../dist/_redirects', import.meta.url), 'utf8')
  assert.ok(rules.includes('/grupo /nosotros 301'))
  assert.ok(rules.includes('/empresas /#empresas 301'))
  for (const path of ['/nosotros', '/contacto']) assert.ok(rules.includes(`${path} ${path}.html 200`))
})

test('production pages include readable HTML, distinct metadata and built assets', () => {
  const titles = new Set()
  for (const path of ['', '/nosotros', '/contacto']) {
    const html = readFileSync(new URL(path ? `../dist${path}.html` : '../dist/index.html', import.meta.url), 'utf8')
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1)
    assert.ok(html.includes('Grupo AyM'))
    assert.ok(!/A&amp;M GROUP|cinco empresas|ANKA ERP|Nueva Lima|Lorem ipsum/i.test(html))
    assert.ok(!html.includes('src="/src/'))
    assert.ok(html.includes(`href="https://grupoaym.com${path || '/'}"`))
    titles.add(html.match(/<title>(.*?)<\/title>/)[1])
  }
  assert.equal(titles.size, 3)
})
