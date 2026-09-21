import Reserva from "../models/reserva.model.js";
import Categoria from "../models/categoria.model.js";
import { AppError } from "../../utils/appError.js";
import { embellishText } from "./embellish-text.service.js"

const MARGEN_ENTRE_RESERVAS_MS = 30 * 60 * 1000;

// Función para asegurar que el cliente sea el propietario de la reserva
const asegurarPropietario = (reserva, clienteId) => {
    if (reserva.cliente.toString() !== clienteId.toString()) {
        throw new AppError(403, "No tenés permiso para modificar esta reserva.");
    }
};

// Combina la fecha (Date) y la hora (string HH:mm) en un único Date
const aFechaHora = (fecha, hora) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    return new Date(`${fechaStr}T${hora}:00`);
};

// Verifica que no haya otra reserva activa ese día a menos de 30 minutos de la hora solicitada
const asegurarDistanciaMinima = async (fecha, hora, idReservaExcluida = null) => {
    const fechaHoraSolicitada = aFechaHora(fecha, hora);
    const filtro = { fecha, activa: true };
    if (idReservaExcluida) {
        filtro._id = { $ne: idReservaExcluida };
    }
    const reservasDelDia = await Reserva.find(filtro);
    const hayConflicto = reservasDelDia.some(reserva => {
        const fechaHoraExistente = aFechaHora(reserva.fecha, reserva.hora);
        const diferenciaMs = Math.abs(fechaHoraSolicitada.getTime() - fechaHoraExistente.getTime());
        return diferenciaMs < MARGEN_ENTRE_RESERVAS_MS;
    });
    if (hayConflicto) {
        throw new AppError(409, "Debe haber al menos 30 minutos de diferencia con otra reserva.");
    }
};

// Verifica que la categoría exista
const asegurarCategoriaExistente = async (categoriaId) => {
    const categoria = await Categoria.findById(categoriaId);

    if (!categoria) {
        throw new AppError(404, "La categoría no existe.");
    }
};

// Función para crear una nueva reserva
export const crearReserva = async (clienteId, categoriaId, fecha, hora, mascota, nombreMascota, edadMascota, motivo) => {
    try {
        await asegurarCategoriaExistente(categoriaId);
        await asegurarDistanciaMinima(fecha, hora);

        const motivoProfesional = await embellishText(
            motivo,
            "profesional veterinario"
        );

        const nuevaReserva = await Reserva.create({
            cliente: clienteId,
            categoriaId,
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

// Función para obtener todas las reservas de un cliente
export const getAllReservas = async (clienteId) => {
    return await Reserva.find({ cliente: clienteId });
};

// Función para cancelar una reserva
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

// Función para reprogramar una reserva
export const reprogramarReserva = async (idReserva, clienteId, nuevaFecha, nuevaHora) => {
    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
        throw new AppError(404, "La reserva no existe.");
    }
    asegurarPropietario(reserva, clienteId);
    if (reserva.estado === "cancelada") {
        throw new AppError(409, "No se puede reprogramar una reserva cancelada.");
    }
    await asegurarDistanciaMinima(nuevaFecha, nuevaHora, idReserva);
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
