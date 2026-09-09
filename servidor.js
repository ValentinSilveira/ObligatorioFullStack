import express from "express";

const app = express();
const puerto = 3000;
const url = "/";

const collback = (req, res) => {
    return res.status(200).json({
        mensaje: "Servidor funcionando correctamente"
    });
}

app.get(url, collback);

const callbackAliniciar = () => {
    console.log('Servidor escuchando en el puerto', puerto);
}

app.listen(puerto, callbackAliniciar);