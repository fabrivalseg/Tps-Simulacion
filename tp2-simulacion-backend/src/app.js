import express from 'express';
import cors from 'cors';
import algorithmRouter from './routes/algorithms-router.js'

const app = express();
app.use(express.json());
app.use(cors());
app.use("/generate", algorithmRouter);

app.listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000");
});