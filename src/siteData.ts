import accountingLogo from './assets/img/asesores.webp'
import contawebLogo from './assets/img/contaweb.webp'
import rentingLogo from './assets/img/renting.webp'

export const companies = [
  {
    id: 'asesores', name: 'A&M Asesores Contables', category: 'Contabilidad', email: 'informes@asesorescontablesaym.com',
    headline: 'Contabilidad que genera confianza.',
    description: 'Asesoría contable, tributaria, laboral y empresarial para tomar mejores decisiones con información, experiencia y respaldo profesional.',
    services: ['Asesoría contable y tributaria', 'Asesoría laboral', 'Acompañamiento empresarial'],
    image: '/images/accounting.jpg', logo: accountingLogo,
    destinations: [{ name: 'Conocer A&M Asesores', description: 'Conoce nuestros servicios de asesoría.', url: 'https://www.asesorescontablesaym.com/' }],
  },
  {
    id: 'contaweb', name: 'ContaWeb A&M', category: 'Tecnología', email: '',
    headline: 'Tecnología para gestionar mejor.',
    description: 'Soluciones de facturación electrónica y gestión empresarial para emitir, controlar y decidir con información integrada.',
    services: ['Facturación electrónica', 'ERP — Sistema de Gestión Empresarial', 'Información para tu negocio'],
    image: '/images/technology.jpg', logo: contawebLogo,
    destinations: [
      { name: 'Facturación Electrónica', description: 'Conoce la solución para emitir y gestionar tus comprobantes.', url: 'https://contawebaym.net/' },
      { name: 'ContaWebAyM ERP', description: 'Explora la plataforma de gestión empresarial.', url: 'https://contawebaym.com/' },
    ],
  },
  {
    id: 'renting', name: 'Renting Car A&M', category: 'Movilidad', email: '',
    headline: 'Movilidad que no te detiene.',
    description: 'Alquiler de vehículos y maquinaria para empresas y personas, con atención personalizada y el respaldo de Grupo AyM.',
    services: ['Alquiler de vehículos', 'Alquiler de maquinaria', 'Atención a empresas y personas'],
    image: '/images/car.jpg', logo: rentingLogo,
    destinations: [] as { name: string; description: string; url: string }[],
  },
]

// Complete only with confirmed corporate contact details. No secrets belong here.
export const contact = {
  email: 'administracion@grupoaym.com', phone: '+51 981 204 258', whatsapp: '51981204258', address: '', hours: '',
}

export const pillars = [
  ['Experiencia', 'Conocimiento profesional aplicado a decisiones empresariales.'],
  ['Tecnología', 'Herramientas para simplificar, integrar y controlar la gestión.'],
  ['Confianza', 'Un mismo estándar de atención y respaldo en todas las marcas.'],
]

export const pages = {
  '/': { title: 'Grupo AyM | Contabilidad, tecnología y movilidad en Perú', description: 'Grupo AyM reúne A&M Asesores Contables, ContaWeb A&M y Renting Car A&M en Perú. Asesoría contable, facturación electrónica, gestión empresarial y alquiler de vehículos.' },
  '/nosotros': { title: 'Nosotros | Historia y propósito de Grupo AyM', description: 'Conoce la historia de Grupo AyM: desde nuestra vocación por la contabilidad en 2007 hasta integrar tecnología y movilidad para empresas y personas en Perú.' },
  '/contacto': { title: 'Contacto | Conversemos sobre tu empresa | Grupo AyM', description: 'Encuentra los canales de atención de A&M Asesores Contables, ContaWeb A&M y Renting Car A&M. Conecta con las soluciones de Grupo AyM en Perú.' },
}
export type PagePath = keyof typeof pages

export function trackEvent(event: string, values: Record<string, string>) {
  // An optional first-party event hook. No tracker, cookies or personal data by default.
  window.dispatchEvent(new CustomEvent('grupoaym:event', { detail: { event, ...values } }))
}
