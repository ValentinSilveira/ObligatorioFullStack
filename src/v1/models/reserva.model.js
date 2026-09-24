import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    categoriaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categoria",
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    hora: {
        type: String,
        required: true,
    },
    mascota: {
        type: String,
        required: true,
    },
    nombreMascota: {
        type: String,
        required: true,
    },
    edadMascota: {
        type: Number,
        required: true,
    },
    motivo: {
        type: String,
        required: true,
    },
    motivoProfesional: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        enum: ["pendiente", "confirmada"],
        default: "confirmada",
    },
});

// Índice único compuesto para fecha y hora: al cancelar/borrar una reserva se elimina
// el documento, así que no hace falta filtro parcial, cualquier reserva que exista está vigente.
reservaSchema.index(
    { fecha: 1, hora: 1 },
    { unique: true }
);

reservaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Reserva = mongoose.model("Reserva", reservaSchema);

export default Reserva;
