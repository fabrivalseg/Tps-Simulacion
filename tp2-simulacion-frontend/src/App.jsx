import { useState } from 'react'
import './App.css'
import GraphRandomData from './graphic.jsx'

function App() {
  const [distribucion, setDistribucion] = useState('default') 
  const [datos, setDatos] = useState([])

  const asignarDistribucion = () => {
    const tipoDistribucion = document.getElementById("tipoDistribucion").value
    switch (tipoDistribucion) {
      case 'uniforme':
        setDistribucion('uniforme')
        break
      case 'exponencial':
        setDistribucion('exponencial')
        break
      case 'poisson':
        setDistribucion('poisson')
        break
      case 'normal':
        setDistribucion('normal')
        break
      default:
        setDistribucion('default')
    }
  }

  const enviarDatos = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const count = formData.get('count')

    if (distribucion === 'uniforme') {
      const min = formData.get('min')
      const max = formData.get('max')
      const response = await fetch('http://localhost:3000/generate/uniform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count, min, max })
      })
      const data = await response.json()
      setDatos(data)
    } else if (distribucion === "exponencial") {
      const lambda = formData.get('lambda')
      const response = await fetch('http://localhost:3000/generate/exponential', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count, lambda })
      })
      const data = await response.json()
      setDatos(data)
    } else if (distribucion === "poisson") {
      const lambda = formData.get('lambda')
      const response = await fetch('http://localhost:3000/generate/poisson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count, lambda })
      })
      const data = await response.json()
      setDatos(data)
    } else if (distribucion === "normal") {
      const mean = formData.get('mean')
      const stdDev = formData.get('stdDev')
      const response = await fetch('http://localhost:3000/generate/normal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({count,  mean, stdDev })
      })
      const data = await response.json()
      console.log(data)
      setDatos(data)
      
    } else{
      alert("Seleccione una distribucion")
    }
  }

  const exportarCsv = (data) => {
    const csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "datos.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <main>
      <form onSubmit={(e) => enviarDatos(e)} id='form' className='form-container'>
        <div className='distribucion-container'>
          <label htmlFor="tipoDistribucion">Tipo de Distribución:</label>
          <select onChange={() => asignarDistribucion()} id="tipoDistribucion" name="tipoDistribucion" required>
            <option value="default">Seleccione una opción</option>
            <option value="uniforme">Uniforme</option>
            <option value="exponencial">Exponencial</option>
            <option value="poisson">Poisson</option>
            <option value="normal">Normal</option>
          </select>
        </div>
        <div className='parametros-container'>
            {
              distribucion === 'default' && (
                <div className='distribucion-parametros'>
                  <p className='parrafo-distribucion-default'>Seleccione la distribucion que desea</p>
                </div>
              )              
            }
            {
              distribucion === 'uniforme' && (
                <div className='distribucion-parametros'>
                  <div>
                    <label htmlFor="min">Min:</label>
                    <input type="number" step="any" id="min" name="min" required />
                  </div>
                  <div>
                    <label htmlFor="max">Max:</label>
                    <input type="number" step="any" id="max" name="max" required />
                  </div>
                  <div>
                    <label htmlFor="count">Cantidad De Numeros</label>
                    <input type="text" name="count" id="count" placeholder='50000' required />
                  </div>
                </div>
              )
            }
            {
              (distribucion === 'exponencial' || distribucion === 'poisson') && (
                <div className='distribucion-parametros'>
                  <div>
                    <label htmlFor="lambda">Lambda:</label>
                    <input type="number" step="any" id="lambda" name="lambda" required />
                  </div>
                  <div>
                    <label htmlFor="count">Cantidad De Numeros</label>
                    <input type="text" name="count" id="count" placeholder='50000' required />
                  </div>
                </div>
              )
            }
            {
              distribucion === 'normal' && (
                <div className='distribucion-parametros'>
                  <div>
                    <label htmlFor="mean">Media:</label>
                    <input type="number" step="any" id="mean" name="mean" required placeholder='5'/>
                  </div>
                  <div>
                    <label htmlFor="stdDev">Desviación Estándar:</label>
                    <input type="number" step="any" id="stdDev" name="stdDev" required placeholder='2.5' />
                  </div>
                  <div>
                    <label htmlFor="count">Cantidad De Numeros</label>
                    <input type="text" name="count" id="count" placeholder='50000' required />
                  </div>
                </div>
              )
            }
            
        </div>
        <div className='boton-container'>
          <button className='boton'>Enviar</button>
        </div>
      </form>
          {
            datos.length > 0 && (
              <section className='data-container'>
                <div className='datos-header'>
                  <h2>Datos Generados</h2>
                  <button onClick={() => exportarCsv(datos)} className='boton boton-csv'>Exportar CSV</button>
                </div>
              </section>
            )
          }
      <section className='graphic-container'>
        <h2>Grafico</h2>
        <GraphRandomData data={datos} />
      </section>
      <section>
        <p>PRUEBAS</p>
        <p style={{fontSize: "10px"}}>Proximamente</p>
      </section>
    </main>
  )
}

export default App


/*
  <ul className='data-list'>
                    {datos.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
*/