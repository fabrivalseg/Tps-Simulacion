import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const GraphRandomData = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No hay datos para mostrar</p>;
    }


    const histogram = data.reduce((acc, value) => {
        const rounded = Math.round(value); 
        acc[rounded] = (acc[rounded] || 0) + 1;
        return acc;
    }, {});


    const chartData = Object.keys(histogram).map(key => ({
        value: key,
        count: histogram[key]
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="value" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default GraphRandomData;
