'use client'
import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const aceptado = localStorage.getItem('holapolska_cookies')
    if (!aceptado) setVisible(true)
  }, [])

  const aceptar = () => {
    localStorage.setItem('holapolska_cookies', 'aceptado')
    setVisible(false)
  }

  const rechazar = () => {
    localStorage.setItem('holapolska_cookies', 'rechazado')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-6 py-5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-700 font-medium mb-1">Usamos cookies</p>
          <p className="text-xs text-gray-500">
            Usamos cookies esenciales para que la plataforma funcione y cookies de analisis para mejorar tu experiencia.
            Consulta nuestra <a href="/compliance/cookies" className="text-red-500 underline">Politica de Cookies</a> y <a href="/compliance/privacy" className="text-red-500 underline">Privacidad</a>.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={rechazar}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 transition-colors">
            Solo esenciales
          </button>
          <button onClick={aceptar}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors">
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  )
}
