import { generarQrReserva } from "../services/api-externa.service.js";
import { obtenerReservaPorId } from "../services/reserva.service.js";

export const generarQrReservaController = async (req, res) => {
    const { idReserva } = req.params;
    const  reserva = await obtenerReservaPorId(idReserva, req.user.id)
    const imageQR = await generarQrReserva(reserva.id.toString())
    
    return res.status(200).type("image/png").send(Buffer.from(imageQR));
}
