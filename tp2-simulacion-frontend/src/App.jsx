"use client";

import { useState, useEffect } from "react";
import "./css/App.css";
import SelectorDistribucion from "./components/SelectorDistribucion.jsx";
import Formulario from "./components/Formulario.jsx";
import Histograma from "./components/Histograma.jsx";
import HistogramaChi2 from "./components/HistogramaChi.jsx";

function App() {
  const [distribucion, setDistribucion] = useState("default");
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (datos.data && datos.data.length > 0) {
      setShowResults(false);
      setTimeout(() => {
        setShowResults(true);
      }, 100);
    }
  }, [datos]);

  const asignarDistribucion = () => {
    const tipoDistribucion = document.getElementById("tipoDistribucion").value;
    setDistribucion(tipoDistribucion);
  };

  const enviarDatos = async (event) => {
    event.preventDefault();
    setLoading(true);
    setShowResults(false);

    const formData = new FormData(event.target);
    const count = formData.get("count");
    let url = "",
      body = {};

    switch (distribucion) {
      case "uniforme":
        url = "http://localhost:3000/generate/uniform";
        body = {
          count,
          min: formData.get("min"),
          max: formData.get("max"),
          intervals: formData.get("intervals"),
        };
        break;
      case "exponencial":
        url = "http://localhost:3000/generate/exponencial";
        body = {
          count,
          lambda: formData.get("lambda"),
          intervals: formData.get("intervals"),
        };
        break;
      case "poisson":
        url = "http://localhost:3000/generate/poisson";
        body = { count, lambda: formData.get("lambda") };
        break;
      case "normal":
        url = "http://localhost:3000/generate/normal";
        body = {
          count,
          mean: formData.get("mean"),
          stdDev: formData.get("stdDev"),
          intervals: formData.get("intervals"),
        };
        break;
      default:
        alert("Seleccione una distribución");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setDatos(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const generarCSV = () => {
    const csvContent =
      "data\n" +
      datos.data.map((value) => value.toString().replace(".", ",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="app-container">
      <div className="app-header">
        <h1>Generador de Distribuciones Estadísticas</h1>
        <p>
          Genera datos aleatorios según diferentes distribuciones y analiza sus
          propiedades
        </p>
      </div>

      <form onSubmit={enviarDatos} id="form" className="form-container">
        <div className="card distribucion-card fade-in">
          <SelectorDistribucion onChange={asignarDistribucion} />
          {distribucion === "default" && (
            <p className="parrafo-distribucion-default">
              Por favor seleccione una distribución para continuar
            </p>
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
          <button
            className={`boton ${loading ? "loading" : ""}`}
            disabled={distribucion === "default" || loading}
          >
            <span className="boton-text">
              {loading ? "Procesando..." : "Generar datos"}
            </span>
            {loading && <span className="loader"></span>}
          </button>
        </div>
      </form>

      {datos.data && datos.data.length > 0 && (
        <div className={`results-container ${showResults ? "show" : ""}`}>
          <div className="datos-header">
            <h2>Datos generados ({datos.data.length})</h2>
            <button className="boton boton-csv" onClick={generarCSV}>
              Descargar CSV
            </button>
          </div>
          {datos.observed && (
            <div className="card histograma-card">
              <h2>Histograma (Frecuencias Observadas)</h2>
              <div className="histograma-container">
                <Histograma
                  intervals={datos.intervals}
                  observed={datos.observed}
                  color={"#8884d8"}
                />
              </div>
            </div>
          )}

          {datos.data && datos.data.length > 0 && (
            <div className="card resultado-card">
              <h2 style={{color: "#4f81bd"}}>Resultado Prueba Ji-Cuadrado</h2>
              <div className="histograma-container">
                <HistogramaChi2
                  intervals={datos.groupedIntervals}
                  observed={datos.groupedObserved}
                  expected={datos.groupedExpected}
                  colorObserved={"#4f81bd"}
                  colorExpected={"#82ca9d"}
                />
              </div>
              <div className="resultado-grid">
                <div className="resultado-stats">
                  <div className="stat-item">
                    <span className="stat-label">Chi² calculado:</span>
                    <span className="stat-value">{datos.chi2?.toFixed(4)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">
                      Valor crítico (α=0.05, v={datos.df}):
                    </span>
                    <span className="stat-value">
                      {datos.critical?.toFixed(4)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">
                      ¿Se rechaza la hipótesis?:
                    </span>
                    <span
                      className={`stat-badge ${
                        datos.passed ? "success" : "error"
                      }`}
                    >
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
                    <div className="frecuencia-values">
                      {datos.groupedObserved?.join(", ")}
                    </div>
                  </div>
                  <div className="frecuencia-item">
                    <h3>Frecuencia esperada por clase:</h3>
                    <div className="frecuencia-values">
                      {datos.groupedExpected?.map((valor) => Math.round(valor)).join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
