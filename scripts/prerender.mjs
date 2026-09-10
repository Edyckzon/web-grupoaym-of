import { build } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Build the same React tree for static HTML without adding a production server.
const serverDir = 'node_modules/.cache/grupoaym-ssr'
await build({ build: { ssr: 'src/entry-server.tsx', outDir: serverDir, emptyOutDir: true } })
const { render, pages } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href)
const template = await readFile('dist/index.html', 'utf8')
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
for (const [path, page] of Object.entries(pages)) {
  const url = `https://grupoaym.com${path}`
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(page.description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(page.title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escape(page.description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`)
  await writeFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, html)
  console.log(`Prerendered ${path}`)
}
const missing = template.replace(/<title>.*?<\/title>/, '<title>Página no encontrada | Grupo AyM</title>').replace('</head>', '<meta name="robots" content="noindex" /></head>').replace('<div id="root"></div>', `<div id="root">${render('/404')}</div>`)
await writeFile('dist/404.html', missing)
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(path => `<url><loc>https://grupoaym.com${path}</loc></url>`).join('')}</urlset>`)
