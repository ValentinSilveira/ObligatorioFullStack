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
    estado: {
        type: String,
        enum: ["pendiente", "confirmada", "cancelada"],
        default: "confirmada",
    },
    activa: {
        type: Boolean,
        default: true,
    }
});

// Antes de guardar, actualizo el campo "activa" según el estado de la reserva
reservaSchema.pre("save", function () {
    this.activa = this.estado !== "cancelada";
});

// Creo un índice único compuesto para fecha y hora, pero solo para reservas activas
reservaSchema.index(
    { fecha: 1, hora: 1 },
    { unique: true, partialFilterExpression: { activa: true } }
);


reservaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.activa;
        return ret;
    }
});

const Reserva = mongoose.model("Reserva", reservaSchema);

export default Reserva;
