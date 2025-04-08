import React from "react";

function DatosGenerados({ data }) {
    const exportarCsv = () => {
        const csvContent = "data:text/csv;charset=utf-8," + data.join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "datos.csv")
        document.body.appendChild(link)
        link.click()
    }

    return (
        <section className='data-container'>
            <div className='datos-header'>
                <h2>Datos Generados</h2>
                <button onClick={exportarCsv} className='boton boton-csv'>Exportar CSV</button>
            </div>
        </section>
    )
}

export default DatosGenerados