import Reserva from "../models/reserva.model.js";
import Categoria from "../models/categoria.model.js";
import { AppError } from "../../utils/appError.js";
import { embellishText } from "./embellish-text.service.js"
import { getUserByIdService } from "./user.services.js";

const MARGEN_ENTRE_RESERVAS_MS = 30 * 60 * 1000;
const LIMITE_RESERVAS_ANUALES_PLUS = 4;

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

// Verifica que no haya otra reserva ese día a menos de 30 minutos de la hora solicitada
const asegurarDistanciaMinima = async (fecha, hora, idReservaExcluida = null) => {
    const fechaHoraSolicitada = aFechaHora(fecha, hora);
    const filtro = { fecha };
    if (idReservaExcluida) {
        filtro._id = { $ne: idReservaExcluida };
    }
    // Buscamos todas las reservas del mismo día
    const reservasDelDia = await Reserva.find(filtro);
    // Verificamos si alguna reserva existente está a menos de 30 minutos de la solicitada
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

// Devuelve el rango [inicio, fin) del año calendario al que pertenece una fecha
const rangoDelAnio = (fecha) => {
    const anio = fecha.getUTCFullYear();
    return {
        inicio: new Date(Date.UTC(anio, 0, 1)),
        fin: new Date(Date.UTC(anio + 1, 0, 1)),
    };
};

// Verifica el límite de reservas anuales según el plan del cliente.
// Los usuarios "premium" tienen reservas ilimitadas; el resto (ej. "plus") tiene un tope anual.
const asegurarLimiteDePlan = async (clienteId, fecha, idReservaExcluida = null) => {
    // obtenemos el cliente para revisar su plan
    const cliente = await getUserByIdService(clienteId);
    //  Si el cliente es premium, no hay límite de reservas anuales
    if (cliente.plan?.toLowerCase() === "premium") {
        return;
    }
    // Si el cliente es plus, verificamos cuántas reservas tiene en el 
    // año calendario de la fecha solicitada
    const { inicio, fin } = rangoDelAnio(fecha);
    const filtro = { cliente: clienteId, fecha: { $gte: inicio, $lt: fin } };
    if (idReservaExcluida) {
        filtro._id = { $ne: idReservaExcluida };
    }
    // Contamos cuántas reservas tiene el cliente en ese año calendario
    const cantidadReservasDelAnio = await Reserva.countDocuments(filtro);
    if (cantidadReservasDelAnio >= LIMITE_RESERVAS_ANUALES_PLUS) {
        throw new AppError(409, `Alcanzaste el límite de ${LIMITE_RESERVAS_ANUALES_PLUS} reservas anuales de tu plan.`);
    }
};

// Función para crear una nueva reserva
export const crearReserva = async (clienteId, categoriaId, fecha, hora, mascota, nombreMascota, edadMascota, motivo) => {
    try {
        await asegurarCategoriaExistente(categoriaId);
        await asegurarDistanciaMinima(fecha, hora);
        await asegurarLimiteDePlan(clienteId, fecha);

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
    return await Reserva.find({ cliente: clienteId })
        .populate("cliente", "name -_id")
        .populate("categoriaId", "nombre -_id");
};

// Función para obtener todas las reservas de un cliente paginadas
export const getReservasByUserServicePaginated = async (
    cliente,
    { pagina, limite }
) => {
    const filtro = { cliente };

    const [reservas, total] = await Promise.all(
        [
            Reserva.find(filtro)
                .sort({ _id: -1 })
                .skip((pagina - 1) * limite)
                .limit(limite)
                .populate("cliente", "name email")
                .populate("categoriaId", "nombrel"),
            Reserva.countDocuments(filtro)
        ]
    );
    return {
        reservas,
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite)
    };
};

// Función para cancelar (borrar) una reserva
export const cancelarReserva = async (idReserva, clienteId) => {
    // verificamos que exista la reserva
    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
        throw new AppError(404, "La reserva no existe.");
    }
    // verificamos que el cliente sea el propietario de la reserva
    asegurarPropietario(reserva, clienteId);
    await Reserva.findByIdAndDelete(idReserva);
    return reserva;
};

// Función para reprogramar una reserva
export const reprogramarReserva = async (idReserva, clienteId, nuevaFecha, nuevaHora) => {
    // verificamos que exista la reserva
    const reserva = await Reserva.findById(idReserva);
    if (!reserva) {
        throw new AppError(404, "La reserva no existe.");
    }
    // verificamos que el cliente sea el propietario de la reserva
    asegurarPropietario(reserva, clienteId);
    await asegurarDistanciaMinima(nuevaFecha, nuevaHora, idReserva);
    // Si la reprogramación cambia de año calendario, se vuelve a validar el cupo del plan
    if (nuevaFecha.getUTCFullYear() !== reserva.fecha.getUTCFullYear()) {
        await asegurarLimiteDePlan(clienteId, nuevaFecha, idReserva);
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

export const obtenerReservaPorId = async (idReserva, clienteId) => {
    const reserva = await Reserva.findById(idReserva);

    if(!reserva){
        throw new AppError(404, "La reserva no existe");
    }

    asegurarPropietario(reserva , clienteId);
    return reserva;
};
