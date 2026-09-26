import { crearReserva, getAllReservas, cancelarReserva, reprogramarReserva, obtenerReservaPorId, getReservasByUserServicePaginated } from "../services/reserva.service.js";

// listamos las reservas del usuario
export const listarReservas = async (req, res) => {
    const { pagina, limite } = res.locals.validatedQuery;

    // Si la URL no indica paginación, mantenemos el formato original: un array.
    if (pagina === undefined && limite === undefined) {
        const reservas = await getAllReservas(req.user.id)
        return res.status(200).json(reservas);
    }
    // Si llega solo uno de los parámetros, usamos el valor por defecto del otro.
    const resultado = await getReservasByUserServicePaginated(req.user.id, {
        pagina: pagina ?? 1,
        limite: limite ?? 20,
    });


    return res.status(200).json(resultado);
};

// reservamos un turno para el usuario autenticado
export const reservarTurno = async (req, res) => {
    const { categoriaId, fecha, hora, mascota, nombreMascota, edadMascota, motivo } = req.body;

    const reservaExitosa = await crearReserva(req.user.id, categoriaId, fecha, hora, mascota, nombreMascota, edadMascota, motivo);

    return res.status(201).json({
        message: "¡Turno reservado con éxito!",
        reserva: reservaExitosa
    });
};

// cancelamos una reserva del usuario autenticado
export const cancelarReservaController = async (req, res) => {
    const { idReserva } = req.params;
    const reserva = await cancelarReserva(idReserva, req.user.id);
    return res.status(200).json({
        message: "Reserva cancelada con éxito.",
        reserva
    });
};

// reprogramamos una reserva del usuario autenticado
export const reprogramarReservaController = async (req, res) => {
    const { idReserva } = req.params;
    const { nuevaFecha, nuevaHora } = req.body;

    const reserva = await reprogramarReserva(idReserva, req.user.id, nuevaFecha, nuevaHora);

    return res.status(200).json({
        message: "Reserva reprogramada con éxito.",
        reserva
    });
};

export const obtenerReservaController = async (req, res) => {
    const { idReserva } = req.params;

    const reserva = await obtenerReservaPorId(
        idReserva,
        req.user.id
    );

    return res.status(200).json(reserva);
};
