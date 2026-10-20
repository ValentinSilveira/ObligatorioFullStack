import mongoose from "mongoose";

// Documento por día que sirve como punto de serialización: toda transacción que
// crea o reprograma una reserva para esa fecha lo modifica, así dos altas simultáneas
// del mismo día entran en conflicto y una se reintenta viendo la reserva de la otra.
const agendaDiaSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        unique: true,
    },
    guard: {
        type: Number,
        default: 0,
    },
});

const AgendaDia = mongoose.model("AgendaDia", agendaDiaSchema);

export default AgendaDia;
