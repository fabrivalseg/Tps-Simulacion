import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend
  } from 'recharts'
  
  const HistogramaChi2 = ({
    intervals,
    observed,
    expected,
    colorObserved = "#8884d8",
    colorExpected = "#82ca9d"
  }) => {
    // Validamos que el arreglo de observados estÃ© definido y tenga datos
    if (!Array.isArray(observed) || observed.length === 0) {
      return <p style={{ color: 'red' }}>No se pudo generar el histograma.</p>
    }
  
    let data = []
    
    // Si se tienen "intervals" y "expected" con la misma longitud que "observed", usamos esos datos
    if (
      Array.isArray(intervals) &&
      intervals.length === observed.length &&
      Array.isArray(expected) &&
      expected.length === observed.length
    ) {
      data = intervals.map(([min, max], index) => ({
        intervalo: `${min.toFixed(2)} - ${max.toFixed(2)}`,
        observada: observed[index],
        esperada: expected[index]
      }))
    } else {
      // Caso para datos discretos (por ejemplo Poisson) donde no se dispone de intervalos
      data = observed.map((valor, index) => ({
        intervalo: index.toString(),
        observada: valor,
        esperada: Array.isArray(expected) && expected[index] ? expected[index] : 0
      }))
    }
  
    return (
      <div style={{ width: '100%', height: '70vh', position: "relative" }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="intervalo" 
              angle={-45} 
              textAnchor="end" 
              height={80} 
              interval={0} 
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Bar 
              dataKey="observada" 
              fill={colorObserved} 
              name="Frecuencia Observada" 
            />
            <Bar 
              dataKey="esperada" 
              fill={colorExpected} 
              name="Frecuencia Esperada" 
            />
          </BarChart>
          <h2 style={{position: "absolute", bottom: "-15px", left: "15px", color: "rgb(102, 102, 102)", fontSize: "15px"}}>* Agrupados en intervalos cuya frecuencia esperada es mayor o igual a 5</h2>
        </ResponsiveContainer>
      </div>
    )
  }
  
  export default HistogramaChi2