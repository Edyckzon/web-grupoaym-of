export function buildContactMailto(recipient: string, brandName: string, fields: Record<string, FormDataEntryValue>) {
  const body = [
    `Nombre: ${fields.name ?? ''}`,
    `Empresa: ${fields.company || 'No indicada'}`,
    `Correo: ${fields.email ?? ''}`,
    `Teléfono: ${fields.phone || 'No indicado'}`,
    `Marca de interés: ${brandName}`,
    '', 'Consulta:', String(fields.message ?? ''),
  ].join('\r\n')
  return `mailto:${recipient}?subject=${encodeURIComponent(`Consulta desde Grupo AyM — ${brandName}`)}&body=${encodeURIComponent(body)}`
}
