import React from "react";

function Formulario({ distribucion }) {
    if (distribucion === 'default') {
        return (
            <div className='distribucion-parametros'>
                <p className='parrafo-distribucion-default'>Seleccione la distribución que desea</p>
            </div>
        )
    }

    if (distribucion === 'uniforme') {
        return (
            <div className='distribucion-parametros'>
                <div>
                    <label htmlFor="min">Minimo</label>
                    <input type="number" step="any" id="min" name="min" required />
                </div>
                <div>
                    <label htmlFor="max">Maximo</label>
                    <input type="number" step="any" id="max" name="max" required />
                </div>
                <div>
                    <label htmlFor="count">Cantidad De Números</label>
                    <input type="text" name="count" id="count" placeholder='50000' required />
                </div>
            </div>
        )
    }

    if (distribucion === 'exponencial' || distribucion === 'poisson') {
        return (
            <div className='distribucion-parametros'>
                <div>
                    <label htmlFor="lambda">Lambda:</label>
                    <input type="number" step="any" id="lambda" name="lambda" required />
                </div>
                <div>
                    <label htmlFor="count">Cantidad De Números</label>
                    <input type="text" name="count" id="count" placeholder='50000' required />
                </div>
            </div>
        )
    }

    if (distribucion === 'normal') {
        return (
            <div className='distribucion-parametros'>
                <div>
                    <label htmlFor="mean">Media:</label>
                    <input type="number" step="any" id="mean" name="mean" required placeholder='5' />
                </div>
                <div>
                    <label htmlFor="stdDev">Desviación Estándar:</label>
                    <input type="number" step="any" id="stdDev" name="stdDev" required placeholder='2.5' />
                </div>
                <div>
                    <label htmlFor="count">Cantidad De Números</label>
                    <input type="text" name="count" id="count" placeholder='50000' required />
                </div>
            </div>
        )
    }
}

export default Formulario