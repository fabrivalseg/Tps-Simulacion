import React from 'react';

function SelectorDistribucion({ onChange }) {
    return (
        <div className='distribucion-container'>
            <label htmlFor="tipoDistribucion">Tipo de Distribución:</label>
            <select onChange={onChange} id="tipoDistribucion" name="tipoDistribucion" required>
                <option value="default">Seleccione una opción</option>
                <option value="uniforme">Uniforme</option>
                <option value="exponencial">Exponencial</option>
                <option value="poisson">Poisson</option>
                <option value="normal">Normal</option>
            </select>
        </div>
    )
}

export default SelectorDistribucion
