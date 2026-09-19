import Reserva from "../models/reserva.model.js";
import { AppError } from "../../utils/appError.js";
import { embellishText } from "./embellish-text.service.js"

const asegurarPropietario = (reserva, clienteId) => {
    if (reserva.cliente.toString() !== clienteId.toString()) {
        throw new AppError(403, "No tenés permiso para modificar esta reserva.");
    }
};

export const crearReserva = async (clienteId, fecha, hora, mascota, nombreMascota, edadMascota, motivo) => {
    try {
        const motivoProfesional = await embellishText(
            motivo,
            "profesional veterinario"
        );

        const nuevaReserva = await Reserva.create({
            cliente: clienteId,
            fecha,
            hora,
            mascota,
            nombreMascota,
            edadMascota,
            motivo,
            motivoProfesional,
            estado: "pendiente"
        });

        return nuevaReserva;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ya existe una reserva para esa fecha y hora.");
        }
        throw error;
    }
};

export const getAllReservas = async (clienteId) => {
    return await Reserva.find({ cliente: clienteId });
};

export const cancelarReserva = async (idReserva, clienteId) => {
    const reserva = await Reserva.findById(idReserva);

    if (!reserva) {
        throw new AppError(404, "La reserva no existe.");
    }

    asegurarPropietario(reserva, clienteId);

    if (reserva.estado === "cancelada") {
        throw new AppError(409, "La reserva ya estaba cancelada.");
    }

    reserva.estado = "cancelada";
    await reserva.save();

    return reserva;
};

export const reprogramarReserva = async (idReserva, clienteId, nuevaFecha, nuevaHora) => {
    const reserva = await Reserva.findById(idReserva);

    if (!reserva) {
        throw new AppError(404, "La reserva no existe.");
    }

    asegurarPropietario(reserva, clienteId);

    if (reserva.estado === "cancelada") {
        throw new AppError(409, "No se puede reprogramar una reserva cancelada.");
    }

    reserva.fecha = nuevaFecha;
    reserva.hora = nuevaHora;

    try {
        await reserva.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ese horario ya está ocupado por otra reserva.");
        }
        throw error;
    }

    return reserva;
};
