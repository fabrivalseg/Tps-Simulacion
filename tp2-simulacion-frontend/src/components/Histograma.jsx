import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from 'recharts'
  
  const Histograma = ({ intervals, observed }) => {


    if (!Array.isArray(observed) || observed.length === 0) {
      return <p style={{ color: 'red' }}>No se pudo generar el histograma.</p>
    }
  
    let data = []
  
    if (Array.isArray(intervals) && intervals.length === observed.length) {

      data = intervals.map(([min, max], index) => ({
        intervalo: `${min.toFixed(2)} - ${max.toFixed(2)}`,
        frecuencia: observed[index],
      }))
    } else {

      data = observed.map((valor, index) => ({
        intervalo: index.toString(),
        frecuencia: valor,
      }))
    }
  
    return (
      <div style={{ width: '100%', height: '70vh' }}>
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
            <Bar dataKey="frecuencia" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
  
  export default Histograma