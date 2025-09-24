/**
 * Genera un slug único basado en el título
 * @param title - El título del post
 * @param existingSlugs - Array de slugs existentes para evitar duplicados
 * @returns Un slug único
 */
export function generateSlug(title: string, existingSlugs: string[] = []): string {
  // Convertir a minúsculas y reemplazar caracteres especiales
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-|-$/g, ''); // Eliminar guiones al inicio y final

  // Si el slug está vacío, usar 'post'
  if (!slug) {
    slug = 'post';
  }

  // Verificar si el slug ya existe
  let finalSlug = slug;
  let counter = 1;

  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
}
