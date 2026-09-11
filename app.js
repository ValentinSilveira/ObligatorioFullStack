import express from "express";
import "dotenv/config";
import { connectMongo } from "./src/v1/config/mongo.config.js";
import apiRoutes from "./src/v1/routes/index.js";
// import { middlewareErrores } from "./src/middleware/error.middleware.js";

connectMongo();
//TODO: connectRedis y agregar middleware de errores();

const app = express();

app.use(express.json());


app.use("/api", apiRoutes)

//mas rutas ??


// app.use(middlewareErrores)

// app.use(routerProducts);

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});

export default app;