import mongoose from "mongoose";
import Reserva from "../models/reserva.model.js";
import Categoria from "../models/categoria.model.js";
import User from "../models/user.model.js";
import AgendaDia from "../models/agenda-dia.model.js";
import { AppError } from "../../utils/appError.js";
import { embellishText } from "./embellish-text.service.js"
import { deleteImage } from "./image.service.js";
import { deleteImage as deleteCloudinaryImage,} from "./image.service.js";

// service se encarga de la logica de negocio, validaciones y reglas de negocio.

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

// Modifica el documento de agenda del día (lo crea si no existe). Todas las transacciones
// que reservan ese día escriben el mismo documento, así que si dos corren a la vez una
// entra en conflicto y se reintenta, viendo ya la reserva de la otra.
const bloquearDia = async (fecha, session) => {
    await AgendaDia.findOneAndUpdate(
        { fecha },
        { $inc: { guard: 1 } },
        { upsert: true, session }
    );
};

// Verifica que no haya otra reserva ese día a menos de 30 minutos de la hora solicitada
const asegurarDistanciaMinima = async (fecha, hora, session, idReservaExcluida = null) => {
    const fechaHoraSolicitada = aFechaHora(fecha, hora);
    const filtro = { fecha };
    if (idReservaExcluida) {
        filtro._id = { $ne: idReservaExcluida };
    }
    // Buscamos todas las reservas del mismo día
    const reservasDelDia = await Reserva.find(filtro).session(session);
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

// Verifica que la categoría exista. Se hace con una escritura (no una lectura) para que
// una eliminación concurrente de la categoría entre en conflicto con esta transacción.
const asegurarCategoriaExistente = async (categoriaId, session) => {
    const categoria = await Categoria.findOneAndUpdate(
        { _id: categoriaId },
        { $inc: { reservaGuard: 1 } },
        { session }
    );

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
const asegurarLimiteDePlan = async (clienteId, fecha, session, idReservaExcluida = null) => {
    // obtenemos el cliente para revisar su plan
    const cliente = await User.findById(clienteId).session(session);
    if (!cliente) {
        throw new AppError(404, "El usuario no existe.");
    }
    //  Si el cliente es premium, no hay límite de reservas anuales
    if (cliente.plan?.toLowerCase() === "premium") {
        return;
    }
    // Modificamos el documento del usuario para serializar sus altas concurrentes:
    // si otra transacción del mismo usuario corre a la vez, una se reintenta y
    // cuenta también la reserva de la otra.
    await User.updateOne({ _id: clienteId }, { $inc: { reservaLimitGuard: 1 } }, { session });
    // Si el cliente es plus, verificamos cuántas reservas tiene en el 
    // año calendario de la fecha solicitada
    const { inicio, fin } = rangoDelAnio(fecha);
    const filtro = { cliente: clienteId, fecha: { $gte: inicio, $lt: fin } };
    if (idReservaExcluida) {
        filtro._id = { $ne: idReservaExcluida };
    }
    // Contamos cuántas reservas tiene el cliente en ese año calendario
    const cantidadReservasDelAnio = await Reserva.countDocuments(filtro).session(session);
    if (cantidadReservasDelAnio >= LIMITE_RESERVAS_ANUALES_PLUS) {
        throw new AppError(409, `Alcanzaste el límite de ${LIMITE_RESERVAS_ANUALES_PLUS} reservas anuales de tu plan.`);
    }
};

// Función para crear una nueva reserva
export const crearReserva = async (clienteId, categoriaId, fecha, hora, mascota, nombreMascota, edadMascota, motivo, imageUrl, imagePublicId) => {
    // La llamada a la IA va fuera de la transacción para no mantenerla
    // abierta ni repetir la llamada si la transacción se reintenta.
    // embellishText nunca rechaza (si falla devuelve el texto original).
    const motivoProfesional = await embellishText(
        motivo,
        "profesional veterinario"
    );

    const session = await mongoose.startSession();
    let nuevaReserva;
    try {
        await session.withTransaction(async () => {
            await asegurarCategoriaExistente(categoriaId, session);
            await bloquearDia(fecha, session);
            await asegurarDistanciaMinima(fecha, hora, session);
            await asegurarLimiteDePlan(clienteId, fecha, session);

            const [reserva] = await Reserva.create([{
                cliente: clienteId,
                categoriaId,
                fecha,
                hora,
                mascota,
                nombreMascota,
                edadMascota,
                motivo,
                motivoProfesional,
                estado: "confirmada",
                imageUrl: imageUrl || undefined,
                imagePublicId: imagePublicId || undefined,
            }], { session });
            nuevaReserva = reserva;
        });
        return nuevaReserva;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ya existe una reserva para esa fecha y hora.");
        }
        throw error;
    } finally {
        await session.endSession();
    }
};

// Función para obtener todas las reservas de un día (agenda del admin), ordenadas por hora
export const getReservasDelDia = async (fecha) => {
    return await Reserva.find({ fecha })
        .sort({ hora: 1 })
        .populate("cliente", "name username -_id")
        .populate("categoriaId", "nombre -_id");
};

// Horas ocupadas de un día (para que el cliente vea qué horarios quedan libres).
// Solo devuelve las horas, sin datos de las reservas de otros clientes
export const getHorariosOcupados = async (fecha) => {
    const reservas = await Reserva.find({ fecha }).select("hora").sort({ hora: 1 });
    return reservas.map((reserva) => reserva.hora);
};

// Función para obtener todas las reservas de un cliente
export const getAllReservas = async (clienteId) => {
    return await Reserva.find({ cliente: clienteId })
        .populate("cliente", "name -_id")
        .populate("categoriaId", "nombre -_id");
};

// Función para obtener todas las reservas de un cliente paginadas (las más nuevas primero).
// El filtro por mascota se aplica en Mongo antes de contar y limitar, así el total y las páginas son correctos
export const getReservasByUserServicePaginated = async (
    cliente,
    { pagina, limite, mascota }
) => {
    const filtro = { cliente };

    // busca el texto dentro del nombre de la mascota, sin importar mayúsculas;
    // se escapan los caracteres especiales para que se busque el texto tal cual y no como expresión regular
    if (mascota) {
        const textoEscapado = mascota.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filtro.nombreMascota = { $regex: textoEscapado, $options: "i" };
    }

    const [reservas, total] = await Promise.all(
        [
            Reserva.find(filtro)
                .sort({ _id: -1 })
                .skip((pagina - 1) * limite)
                .limit(limite)
                .populate("cliente", "name email")
                .populate("categoriaId", "nombre"),
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
    
    // Primero se elimina la imagen.
    // Si Cloudinary falla, la reserva permanece y el usuario puede volver a intentar.
    if (reserva.imagePublicId) {
        await deleteCloudinaryImage(
            reserva.imagePublicId,
        );
    };
    await Reserva.findByIdAndDelete(idReserva);
    return reserva;
};

// Función para editar una reserva: fecha y hora siempre, y los demás campos que vengan en "cambios"
// (nombreMascota, categoriaId, mascota, edadMascota, motivo, imageUrl + imagePublicId)
export const reprogramarReserva = async (idReserva, clienteId, nuevaFecha, nuevaHora, cambios = {}) => {
    const { nombreMascota, categoriaId, mascota, edadMascota, motivo, imageUrl, imagePublicId } = cambios;

    // si cambia el motivo, la IA vuelve a generar el motivo profesional para que coincidan.
    // Se calcula antes de la transacción para no mantenerla abierta ni repetir la llamada si se reintenta.
    let motivoProfesional;
    if (motivo !== undefined) {
        const actual = await Reserva.findById(idReserva).select("motivo");
        if (actual && motivo !== actual.motivo) {
            motivoProfesional = await embellishText(motivo, "profesional veterinario");
        }
    }

    const session = await mongoose.startSession();
    let reservaEditada;
    let imagePublicIdAnterior;
    try {
        await session.withTransaction(async () => {
            // verificamos que exista la reserva
            const reserva = await Reserva.findById(idReserva).session(session);
            if (!reserva) {
                throw new AppError(404, "La reserva no existe.");
            }
            // verificamos que el cliente sea el propietario de la reserva
            asegurarPropietario(reserva, clienteId);
            if (categoriaId !== undefined) {
                await asegurarCategoriaExistente(categoriaId, session);
            }
            await bloquearDia(nuevaFecha, session);
            await asegurarDistanciaMinima(nuevaFecha, nuevaHora, session, idReserva);
            // Si la reprogramación cambia de año calendario, se vuelve a validar el cupo del plan
            if (nuevaFecha.getUTCFullYear() !== reserva.fecha.getUTCFullYear()) {
                await asegurarLimiteDePlan(clienteId, nuevaFecha, session, idReserva);
            }

            // se guarda la imagen anterior para borrarla de Cloudinary después de guardar la nueva
            imagePublicIdAnterior = imageUrl !== undefined ? reserva.imagePublicId : undefined;

            reserva.fecha = nuevaFecha;
            reserva.hora = nuevaHora;
            const camposOpcionales = { nombreMascota, categoriaId, mascota, edadMascota, motivo, motivoProfesional, imageUrl, imagePublicId };
            for (const [campo, valor] of Object.entries(camposOpcionales)) {
                if (valor !== undefined) {
                    reserva[campo] = valor;
                }
            }

            await reserva.save({ session });
            reservaEditada = reserva;
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ese horario ya está ocupado por otra reserva.");
        }
        throw error;
    } finally {
        await session.endSession();
    }

    // si falla el borrado de la imagen vieja no se corta la edición, la reserva ya quedó guardada
    if (imagePublicIdAnterior && imagePublicIdAnterior !== imagePublicId) {
        try {
            await deleteImage(imagePublicIdAnterior);
        } catch (error) {
            console.error("No se pudo borrar la imagen anterior de Cloudinary:", error.message);
        }
    }

    // se devuelve con el nombre de la categoría, igual que el detalle
    await reservaEditada.populate("categoriaId", "nombre");
    return reservaEditada;
};

export const obtenerReservaPorId = async (idReserva, clienteId) => {
    // se trae el nombre de la categoría y su id (el front lo usa para preseleccionarla al editar)
    const reserva = await Reserva.findById(idReserva)
        .populate("categoriaId", "nombre");

    if (!reserva) {
        throw new AppError(404, "La reserva no existe");
    }

    asegurarPropietario(reserva, clienteId);
    return reserva;
};

// Datos para el informe de reservas por categoría.
// Incluye el id del cliente para que el admin pueda ver el gráfico de uno o varios clientes
export const getReservasParaInforme = async () => {
  return await Reserva.find()
    .select("categoriaId cliente -_id")
    .populate("categoriaId", "nombre -_id");
};