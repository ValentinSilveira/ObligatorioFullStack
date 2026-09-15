import { crearReserva, getAllReservas, cancelarReserva, reprogramarReserva } from "../services/reserva.service.js";

export const listarReservas = async (req, res) => {
    const reservas = await getAllReservas(req.user.id);
    return res.status(200).json(reservas);
};

export const reservarTurno = async (req, res) => {
    const { fecha, hora, mascota, nombreMascota, edadMascota, motivo } = req.body;

    const reservaExitosa = await crearReserva(req.user.id, fecha, hora, mascota, nombreMascota, edadMascota, motivo);

    return res.status(201).json({
        message: "¡Turno reservado con éxito!",
        reserva: reservaExitosa
    });
};

export const cancelarReservaController = async (req, res) => {
    const { idReserva } = req.params;
    const reserva = await cancelarReserva(idReserva, req.user.id);
    return res.status(200).json({
        message: "Reserva cancelada con éxito.",
        reserva
    });
};

export const reprogramarReservaController = async (req, res) => {
    const { idReserva } = req.params;
    const { nuevaFecha, nuevaHora } = req.body;

    const reserva = await reprogramarReserva(idReserva, req.user.id, nuevaFecha, nuevaHora);

    return res.status(200).json({
        message: "Reserva reprogramada con éxito.",
        reserva
    });
};
