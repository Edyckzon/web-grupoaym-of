import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolveSectionPath, isPlainNavigation, sectionRoutes } from '../src/useSectionNavigation.ts'

test('clean routes and trailing slashes resolve to the intended sections', () => {
  for (const path of Object.keys(sectionRoutes)) {
    assert.equal(resolveSectionPath(path), path)
    assert.equal(resolveSectionPath(path + '/'), path)
  }
  assert.equal(resolveSectionPath('/unknown'), null)
})

test('previously shared fragments preserve their destinations', () => {
  assert.equal(resolveSectionPath('/', '#grupo'), '/grupo')
  assert.equal(resolveSectionPath('/', '#expertise'), '/experiencia')
  assert.equal(resolveSectionPath('/', '#empresas'), '/empresas')
  assert.equal(resolveSectionPath('/grupo', '#inicio'), '/')
})

test('modified and middle clicks retain native browser behavior', () => {
  const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false }
  assert.equal(isPlainNavigation(click), true)
  for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented']) {
    assert.equal(isPlainNavigation({ ...click, [key]: true }), false)
  }
  assert.equal(isPlainNavigation({ ...click, button: 1 }), false)
})

test('production output includes a rewrite for each section route', () => {
  const rules = readFileSync(new URL('../dist/_redirects', import.meta.url), 'utf8')
  for (const path of Object.keys(sectionRoutes).filter(path => path !== '/')) {
    assert.ok(rules.split(/\r?\n/).includes(`${path} /index.html 200`))
  }
})
