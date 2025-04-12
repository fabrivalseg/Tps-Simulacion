"use client"

import { useState, useEffect } from "react"
import "./css/App.css"
import SelectorDistribucion from "./components/SelectorDistribucion.jsx"
import Formulario from "./components/Formulario.jsx"
import Histograma from "./components/Histograma.jsx"

function App() {
  const [distribucion, setDistribucion] = useState("default")
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (datos.data && datos.data.length > 0) {
      setShowResults(false)
      setTimeout(() => {
        setShowResults(true)
      }, 100)
    }
  }, [datos])

  const asignarDistribucion = () => {
    const tipoDistribucion = document.getElementById("tipoDistribucion").value
    setDistribucion(tipoDistribucion)
  }

  const enviarDatos = async (event) => {
    event.preventDefault()
    setLoading(true)
    setShowResults(false)

    const formData = new FormData(event.target)
    const count = formData.get("count")
    let url = "",
      body = {}

    switch (distribucion) {
      case "uniforme":
        url = "http://localhost:3000/generate/uniform"
        body = { count, min: formData.get("min"), max: formData.get("max"), intervals: formData.get("intervals") }
        break
      case "exponencial":
        url = "http://localhost:3000/generate/exponencial"
        body = { count, lambda: formData.get("lambda"), intervals: formData.get("intervals") }
        break
      case "poisson":
        url = "http://localhost:3000/generate/poisson"
        body = { count, lambda: formData.get("lambda") }
        break
      case "normal":
        url = "http://localhost:3000/generate/normal"
        body = {
          count,
          mean: formData.get("mean"),
          stdDev: formData.get("stdDev"),
          intervals: formData.get("intervals"),
        }
        break
      default:
        alert("Seleccione una distribución")
        setLoading(false)
        return
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      console.log(data)
      setDatos(data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-container">
      <div className="app-header">
        <h1>Generador de Distribuciones Estadísticas</h1>
        <p>Genera datos aleatorios según diferentes distribuciones y analiza sus propiedades</p>
      </div>

      <form onSubmit={enviarDatos} id="form" className="form-container">
        <div className="card distribucion-card fade-in">
          <SelectorDistribucion onChange={asignarDistribucion} />
          {distribucion === "default" && (
            <p className="parrafo-distribucion-default">Por favor seleccione una distribución para continuar</p>
          )}
        </div>

        {distribucion !== "default" && (
          <div className="card parametros-card slide-in">
            <h2>Parámetros para distribución {distribucion}</h2>
            <div className="parametros-container">
              <Formulario distribucion={distribucion} />
            </div>
          </div>
        )}

        <div className="boton-container">
          <button className={`boton ${loading ? "loading" : ""}`} disabled={distribucion === "default" || loading}>
            <span className="boton-text">{loading ? "Procesando..." : "Generar datos"}</span>
            {loading && <span className="loader"></span>}
          </button>
        </div>
      </form>

      {datos.data && datos.data.length > 0 && (
        <div className={`results-container ${showResults ? "show" : ""}`}>
          <div className="card datos-card">
            
          </div>

          {datos.observed && (
            <div className="card histograma-card">
              <h2>Histograma (Frecuencias Observadas)</h2>
              <div className="histograma-container">
                <Histograma intervals={datos.intervals} observed={datos.observed} />
              </div>
            </div>
          )}

          {datos.data && datos.data.length > 0 && (
            <div className="card resultado-card">
              <h2>Resultado Prueba Ji-Cuadrado</h2>
              <div className="resultado-grid">
                <div className="resultado-stats">
                  <div className="stat-item">
                    <span className="stat-label">Chi² calculado:</span>
                    <span className="stat-value">{datos.chi2?.toFixed(4)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Valor crítico (α=0.05, v={datos.df}):</span>
                    <span className="stat-value">{datos.critical?.toFixed(4)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">¿Se rechaza la hipótesis?:</span>
                    <span className={`stat-badge ${datos.passed ? "success" : "error"}`}>
                      {datos.passed ? "No" : "Si"}
                    </span>
                  </div>
                </div>

                <div className="resultado-conclusion">
                  <h3>Conclusión</h3>
                  <p>{datos.conclusion}</p>
                </div>

                <div className="resultado-frecuencias">
                  <div className="frecuencia-item">
                    <h3>Frecuencias observadas:</h3>
                    <div className="frecuencia-values">{datos.observed?.join(", ")}</div>
                  </div>
                  <div className="frecuencia-item">
                    <h3>Frecuencia esperada por clase:</h3>
                    <div className="frecuencia-values">{datos.expected?.join(", ")}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default App

