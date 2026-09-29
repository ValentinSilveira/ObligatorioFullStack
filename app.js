import express from "express";
import "dotenv/config";
import { connectMongo } from "./src/v1/config/mongo.config.js";
import apiRoutes from "./src/v1/routes/index.js";
import { middlewareErrores } from "./src/middleware/error.middleware.js";
import { apiRateLimit } from "./src/v1/middleware/rate-limit.middleware.js";

// connectRedis();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Servidor disponible" })
})




app.use(
    "/api",

    apiRateLimit,

    // Después conectamos MongoDB.
    async (req, res, next) => {
        try {
            await connectMongo();
            next();
        } catch (error) {
            next(error);
        }
    },

    // Finalmente procesamos las rutas.
    apiRoutes
);


//mas rutas 


app.use(middlewareErrores)

// app.use(routerTareas);

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});

export default app;