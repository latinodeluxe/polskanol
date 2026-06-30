import { supabase } from './supabase'

// Calcula el nivel basado en el XP total
export function calcularNivel(xp) {
  if (xp < 100) return { nivel: 1, nombre: 'Principiante', xpSiguiente: 100 }
  if (xp < 300) return { nivel: 2, nombre: 'Aprendiz', xpSiguiente: 300 }
  if (xp < 600) return { nivel: 3, nombre: 'Estudiante', xpSiguiente: 600 }
  if (xp < 1000) return { nivel: 4, nombre: 'Conocedor', xpSiguiente: 1000 }
  if (xp < 1500) return { nivel: 5, nombre: 'Avanzado', xpSiguiente: 1500 }
  if (xp < 2100) return { nivel: 6, nombre: 'Experto', xpSiguiente: 2100 }
  if (xp < 2800) return { nivel: 7, nombre: 'Maestro', xpSiguiente: 2800 }
  if (xp < 3600) return { nivel: 8, nombre: 'Erudito', xpSiguiente: 3600 }
  if (xp < 4500) return { nivel: 9, nombre: 'Sabio', xpSiguiente: 4500 }
  return { nivel: 10, nombre: 'Nativo Honorario', xpSiguiente: null }
}

// Suma XP al usuario y actualiza su racha
export async function sumarXP(xpGanado) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const hoy = new Date().toISOString().split('T')[0]

  const { data: usuarioActual } = await supabase
    .from('usuarios')
    .select('xp, racha_dias, ultimo_acceso')
    .eq('id', user.id)
    .single()

  let nuevaRacha = 1
  if (usuarioActual?.ultimo_acceso) {
    const ultimoAcceso = new Date(usuarioActual.ultimo_acceso)
    const ayer = new Date()
    ayer.setDate(ayer.getDate() - 1)
    const ayerStr = ayer.toISOString().split('T')[0]
    const ultimoStr = ultimoAcceso.toISOString().split('T')[0]

    if (ultimoStr === hoy) {
      nuevaRacha = usuarioActual.racha_dias || 1
    } else if (ultimoStr === ayerStr) {
      nuevaRacha = (usuarioActual.racha_dias || 0) + 1
    } else {
      nuevaRacha = 1
    }
  }

  const xpNuevo = (usuarioActual?.xp || 0) + xpGanado

  const { data, error } = await supabase
    .from('usuarios')
    .update({
      xp: xpNuevo,
      racha_dias: nuevaRacha,
      ultimo_acceso: hoy
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error al sumar XP:', error)
    return null
  }

  return data
}

// Marca una leccion como completada y registra el progreso
export async function completarLeccion(leccionId, xpGanado) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  await supabase
    .from('progreso')
    .upsert({
      usuario_id: user.id,
      leccion_id: leccionId,
      completada: true,
      xp_ganado: xpGanado,
      completada_en: new Date().toISOString()
    }, { onConflict: 'usuario_id,leccion_id' })

  return await sumarXP(xpGanado)
}

// Obtiene el numero de lecciones completadas
export async function contarLeccionesCompletadas() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count } = await supabase
    .from('progreso')
    .select('*', { count: 'exact', head: true })
    .eq('usuario_id', user.id)
    .eq('completada', true)

  return count || 0
}
