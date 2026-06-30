'use client'
import { useState, useEffect } from 'react'
import { completarLeccion } from '@/lib/gamificacion'

export default function Leccion1() {
  const [tab, setTab] = useState('vocabulario')
  const [tarjetaActual, setTarjetaActual] = useState(0)
  const [voltear, setVoltear] = useState(false)
  const [respuestas, setRespuestas] = useState({})
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [xpGuardado, setXpGuardado] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const vocabulario = [
    { polaco: 'Cześć', pronunciacion: 'cheshch', traduccion: 'Hola', ejemplo: 'Cześć! Jak sie masz?' },
    { polaco: 'Dzień dobry', pronunciacion: 'dyen DOB-ri', traduccion: 'Buenos dias', ejemplo: 'Dzień dobry! Co słychać?' },
    { polaco: 'Dobry wieczór', pronunciacion: 'DOB-ri VYE-chur', traduccion: 'Buenas noches', ejemplo: 'Dobry wieczór pani.' },
    { polaco: 'Do widzenia', pronunciacion: 'do vi-DZE-nya', traduccion: 'Hasta luego', ejemplo: 'Do widzenia! Do zobaczenia!' },
    { polaco: 'Tak', pronunciacion: 'tak', traduccion: 'Si', ejemplo: 'Tak, rozumiem.' },
    { polaco: 'Nie', pronunciacion: 'nye', traduccion: 'No', ejemplo: 'Nie, dziękuję.' },
    { polaco: 'Dziękuję', pronunciacion: 'dyen-KU-ye', traduccion: 'Gracias', ejemplo: 'Dziękuję bardzo!' },
    { polaco: 'Proszę', pronunciacion: 'PRO-she', traduccion: 'Por favor', ejemplo: 'Proszę, usiądź.' },
  ]

  const ejercicios = [
    { pregunta: 'Como se dice Hola en polaco?', opciones: ['Cześć', 'Dziękuję', 'Proszę', 'Do widzenia'], correcta: 'Cześć' },
    { pregunta: 'Que significa Dziękuję?', opciones: ['Hola', 'Hasta luego', 'Gracias', 'Por favor'], correcta: 'Gracias' },
    { pregunta: 'Como se pronuncia Tak?', opciones: ['cheshch', 'tak', 'nye', 'PRO-she'], correcta: 'tak' },
    { pregunta: 'Que significa Nie?', opciones: ['Si', 'No', 'Gracias', 'Buenos dias'], correcta: 'No' },
    { pregunta: 'Como se dice Hasta luego en polaco?', opciones: ['Cześć', 'Dzień dobry', 'Do widzenia', 'Proszę'], correcta: 'Do widzenia' },
  ]

  const seleccionarRespuesta = (idx, opcion) => setRespuestas({ ...respuestas, [idx]: opcion })
  const calcularPuntaje = () => ejercicios.filter((ej, idx) => respuestas[idx] === ej.correcta).length

  useEffect(() => {
    if (mostrarResultado && !xpGuardado) {
      guardarProgreso()
    }
  }, [mostrarResultado])

  const guardarProgreso = async () => {
    setGuardando(true)
    const puntaje = calcularPuntaje()
    const xpGanado = puntaje >= 4 ? 20 : puntaje >= 3 ? 15 : 10
    await completarLeccion(1, xpGanado)
    setXpGuardado(true)
    setGuardando(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <a href="/cursos/polaco-a1"><span className="font-bold text-red-500">Hola</span><span className="font-bold text-gray-900">Polska</span></a>
        <a href="/cursos/polaco-a1" className="text-sm text-gray-500">Volver al modulo</a>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span className="text-sm text-red-500 font-medium">Leccion 1 · Modulo 1</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Hola y hasta luego</h1>
          <p className="text-gray-500 mt-2">Aprende los saludos basicos del polaco</p>
        </div>

        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 shadow-sm">
          {['vocabulario', 'flashcards', 'ejercicios'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={"flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors " + (tab === t ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-gray-900')}>
              {t === 'vocabulario' ? 'Vocabulario' : t === 'flashcards' ? 'Flashcards' : 'Ejercicios'}
            </button>
          ))}
        </div>

        {tab === 'vocabulario' && (
          <div className="grid gap-4">
            {vocabulario.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{item.polaco}</h3>
                    <p className="text-red-500 font-medium mt-1">{item.pronunciacion}</p>
                    <p className="text-gray-600 mt-1">{item.traduccion}</p>
                  </div>
                  <span className="bg-red-50 text-red-500 text-xs px-3 py-1 rounded-full font-medium">polaco</span>
                </div>
                <div className="mt-4 bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Ejemplo:</p>
                  <p className="text-gray-700 font-medium">{item.ejemplo}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'flashcards' && (
          <div className="text-center">
            <p className="text-gray-500 mb-6">{tarjetaActual + 1} de {vocabulario.length}</p>
            <div onClick={() => setVoltear(!voltear)} className="bg-white rounded-2xl shadow-sm p-12 cursor-pointer min-h-64 flex items-center justify-center mb-6 hover:shadow-md transition-shadow">
              {!voltear ? (
                <div>
                  <p className="text-4xl font-bold text-gray-900 mb-4">{vocabulario[tarjetaActual].polaco}</p>
                  <p className="text-gray-400 text-sm">Click para ver la traduccion</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-red-500 mb-2">{vocabulario[tarjetaActual].pronunciacion}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-4">{vocabulario[tarjetaActual].traduccion}</p>
                  <p className="text-gray-500 text-sm">{vocabulario[tarjetaActual].ejemplo}</p>
                </div>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={() => { setTarjetaActual(Math.max(0, tarjetaActual - 1)); setVoltear(false) }} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300">Anterior</button>
              <button onClick={() => { setTarjetaActual(Math.min(vocabulario.length - 1, tarjetaActual + 1)); setVoltear(false) }} className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600">Siguiente</button>
            </div>
          </div>
        )}

        {tab === 'ejercicios' && (
          <div>
            {!mostrarResultado ? (
              <div className="grid gap-6">
                {ejercicios.map((ej, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
                    <p className="font-semibold text-gray-900 mb-4">{idx + 1}. {ej.pregunta}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {ej.opciones.map((op) => (
                        <button key={op} onClick={() => seleccionarRespuesta(idx, op)} className={"p-3 rounded-xl border text-sm font-medium transition-colors " + (respuestas[idx] === op ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-700 hover:border-red-300')}>
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={() => setMostrarResultado(true)} className="w-full bg-red-500 text-white font-semibold py-4 rounded-xl hover:bg-red-600 transition-colors">
                  Ver resultados
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="text-6xl mb-4">{calcularPuntaje() >= 4 ? '🏆' : '💪'}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{calcularPuntaje()} de {ejercicios.length} correctas</h2>
                <p className="text-gray-500 mb-4">{calcularPuntaje() >= 4 ? 'Excelente trabajo!' : 'Sigue practicando!'}</p>

                {guardando && (
                  <p className="text-sm text-gray-400 mb-4">Guardando tu progreso...</p>
                )}
                {xpGuardado && !guardando && (
                  <div className="bg-green-50 text-green-600 rounded-xl p-3 mb-6 inline-block">
                    +{calcularPuntaje() >= 4 ? 20 : calcularPuntaje() >= 3 ? 15 : 10} XP ganados!
                  </div>
                )}

                <div className="grid gap-4 mb-8">
                  {ejercicios.map((ej, idx) => (
                    <div key={idx} className={"p-4 rounded-xl text-left " + (respuestas[idx] === ej.correcta ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200')}>
                      <p className="text-sm font-medium text-gray-700 mb-1">{ej.pregunta}</p>
                      <p className="text-sm text-gray-500">Tu respuesta: <span className={respuestas[idx] === ej.correcta ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{respuestas[idx]}</span></p>
                      {respuestas[idx] !== ej.correcta && <p className="text-sm text-green-600 font-medium">Correcta: {ej.correcta}</p>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => { setRespuestas({}); setMostrarResultado(false); setXpGuardado(false) }} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600">Intentar de nuevo</button>
                  <a href="/cursos/polaco-a1/leccion-2" className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold">Siguiente leccion</a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}