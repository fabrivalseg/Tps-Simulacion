import express from "express";
import cors from "cors";
import algorithmRouter from "./routes/routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/generate", algorithmRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
