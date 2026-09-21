import joi from "joi";

const MARGEN_MINIMO_MS = 30 * 60 * 1000;
const HORA_APERTURA = "09:00";
const HORA_CIERRE = "18:30";

//Valido que la fecha y hora de la reserva sean al menos 30 minutos posteriores al momento actual
const crearValidadorFechaHoraFutura = (fechaKey, horaKey) => (value, helpers) => {
    const fecha = value[fechaKey];
    const hora = value[horaKey];
    const fechaStr = fecha.toISOString().split("T")[0];
    const fechaHora = new Date(`${fechaStr}T${hora}:00`);

    if (fechaHora.getTime() < Date.now() + MARGEN_MINIMO_MS) {
        return helpers.error("reserva.horarioInvalido");
    }

    return value;
};

// valido que este en el rango de apertura y cierre
const validarHoraDentroDeRango = (value, helpers) => {
    if (value < HORA_APERTURA || value > HORA_CIERRE) {
        return helpers.error("reserva.horaFueraDeRango");
    }

    return value;
};

// validación para la hora, que debe ser una cadena en formato HH:mm y estar dentro del rango permitido
const horaSchema = joi.string()
    .pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
    .custom(validarHoraDentroDeRango)
    .required();

// Convierto "DD/MM/AAAA" a Date (UTC medianoche), rechazando fechas que no existen (ej: 31/02/2024)
const parsearFechaDDMMAAAA = (value, helpers) => {
    const [dia, mes, anio] = value.split("-").map(Number);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));

    const esFechaValida = fecha.getUTCFullYear() === anio
        && fecha.getUTCMonth() === mes - 1
        && fecha.getUTCDate() === dia;

    if (!esFechaValida) {
        return helpers.error("reserva.fechaInvalida");
    }

    return fecha;
};

// Defino un esquema de validación para la fecha en formato DD-MM-AAAA
const fechaSchema = joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .messages({ "string.pattern.base": "{{#label}} debe tener el formato DD-MM-AAAA" })
    .custom(parsearFechaDDMMAAAA)
    .required();

// esquema de validación para el cuerpo de la solicitud de reserva
export const reservaBodySchema = joi.object({
    categoriaId: joi.string().hex().length(24).required(),
    fecha: fechaSchema,
    hora: horaSchema,
    mascota: joi.string().min(1).max(50).required(),
    nombreMascota: joi.string().min(1).max(50).required(),
    edadMascota: joi.number().integer().min(0).max(100).required(),
    motivo: joi.string().min(1).max(200).required(),
}).custom(crearValidadorFechaHoraFutura("fecha", "hora"));

// esquema de validación para el cuerpo de la solicitud de la reprogramación de reserva
export const reprogramarBodySchema = joi.object({
    nuevaFecha: fechaSchema,
    nuevaHora: horaSchema,
}).custom(crearValidadorFechaHoraFutura("nuevaFecha", "nuevaHora"));
