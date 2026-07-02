'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RecuperarPassword() {
  const [correo, setCorreo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const enviarEnlace = async (e) => {
    e.preventDefault()
    setError('')
    if (!correo) { setError('Ingresa tu correo electronico.'); return }
    setCargando(true)
    const { error } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: 'https://holapolska.vercel.app/idioma/nueva-password',
    })
    if (error) {
      setError('No pudimos enviar el enlace. Verifica el correo e intentalo de nuevo.')
      setCargando(false)
      return
    }
    setEnviado(true)
    setCargando(false)
  }

  if (enviado) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Revisa tu correo</h1>
          <p className="text-gray-500 mb-8">Te enviamos un enlace para restablecer tu contrasena a <strong>{correo}</strong>. Revisa tambien tu carpeta de spam.</p>
          <a href="/idioma/login" className="text-red-500 font-medium hover:underline">Volver al inicio de sesion</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center justify-center gap-1 mb-10">
          <span className="text-2xl font-bold text-red-500">Hola</span>
          <span className="text-2xl font-bold text-gray-900">Polska</span>
        </a>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contrasena</h1>
          <p className="text-gray-500 mb-8">Ingresa tu correo y te enviamos un enlace para crear una nueva contrasena.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={enviarEnlace} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Correo electronico</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@correo.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 text-gray-900" />
            </div>
            <button type="submit" disabled={cargando}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
              {cargando ? 'Enviando...' : 'Enviar enlace de recuperacion'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <a href="/idioma/login" className="text-red-500 font-medium hover:underline">Volver al inicio de sesion</a>
          </p>
        </div>
      </div>
    </main>
  )
}
