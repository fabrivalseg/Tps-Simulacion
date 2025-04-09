import { useState } from 'react'
import './css/App.css'
import GraphRandomData from './components/Grafico'
import SelectorDistribucion from './components/SelectorDistribucion.jsx'
import Formulario from './components/Formulario.jsx'
import DatosGenerados from './components/GenerarCSV.jsx'

function App() {
    const [distribucion, setDistribucion] = useState('default')
    const [datos, setDatos] = useState([])
    const [resultadoChi, setResultadoChi] = useState(null)

    const asignarDistribucion = () => {
        const tipoDistribucion = document.getElementById("tipoDistribucion").value
        setDistribucion(tipoDistribucion)
    }

    // const enviarDatos = async (event) => {
    //     event.preventDefault()
    //     const formData = new FormData(event.target)
    //     const count = formData.get('count')
    //     let url = '', body = {}

    //     switch (distribucion) {
    //         case 'uniforme':
    //             url = 'http://localhost:3000/generate/uniform'
    //             body = { count, min: formData.get('min'), max: formData.get('max') }
    //             break
    //         case 'exponencial':
    //             url = `http://localhost:3000/generate/exponencial`
    //             body = { count, lambda: formData.get('lambda') }
    //             break
    //         case 'poisson':
    //             url = `http://localhost:3000/generate/poisson`
    //             body = { count, lambda: formData.get('lambda') }
    //             break
    //         case 'normal':
    //             url = 'http://localhost:3000/generate/normal'
    //             body = { count, mean: formData.get('mean'), stdDev: formData.get('stdDev') }
    //             break
    //         default:
    //             alert("Seleccione una distribución")
    //             return
    //     }

    //     const response = await fetch(url, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(body)
    //     })
    //     const data = await response.json()
    //     setDatos(data)
    // }

    const enviarDatos = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const count = formData.get('count')
        let url = '', body = {}
    
        switch (distribucion) {
            case 'uniforme':
                url = 'http://localhost:3000/generate/uniform'
                body = { count, min: formData.get('min'), max: formData.get('max') }
                break
            case 'exponencial':
                url = `http://localhost:3000/generate/exponencial`
                body = { count, lambda: formData.get('lambda') }
                break
            case 'poisson':
                url = `http://localhost:3000/generate/poisson`
                body = { count, lambda: formData.get('lambda') }
                break
            case 'normal':
                url = 'http://localhost:3000/generate/normal'
                body = { count, mean: formData.get('mean'), stdDev: formData.get('stdDev') }
                break
            default:
                alert("Seleccione una distribución")
                return
        }
    
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        setDatos(data)

        const chiResponse = await fetch('http://localhost:3000/generate/chi-cuadrado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        const chiData = await chiResponse.json()
        setResultadoChi(chiData)
        
    }

    return (
        <main>
            <form onSubmit={enviarDatos} id='form' className='form-container'>
                <SelectorDistribucion onChange={asignarDistribucion} />
                <div className='parametros-container'>
                    <Formulario distribucion={distribucion} />
                </div>
                <div className='boton-container'>
                    <button className='boton'>Enviar</button>
                </div>
            </form>

            {datos.length > 0 && (
                <DatosGenerados data={datos} />
            )}

            <section className='graphic-container'>
                <h2>Gráfico</h2>
                <GraphRandomData data={datos} />
            </section>

            {resultadoChi && (
                <section className='resultado-container'>
                    <h2>Resultado Prueba Ji-Cuadrado</h2>
                    <p><strong>Chi² calculado:</strong> {resultadoChi.chiSquared.toFixed(4)}</p>
                    <p><strong>Valor crítico (α=0.05, v={resultadoChi.degreesOfFreedom}):</strong> {resultadoChi.criticalValue05}</p>
                    <p><strong>¿Se rechaza la hipótesis?:</strong> {resultadoChi.hypothesisRejected ? 'Sí' : 'No'}</p>
                    <p><strong>Frecuencias observadas:</strong> [{resultadoChi.observed.join(', ')}]</p>
                    <p><strong>Frecuencia esperada por clase:</strong> {resultadoChi.expected}</p>
                </section>
            )}
        </main>
    )
}

export default App