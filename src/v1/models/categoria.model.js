import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    // Se incrementa en cada alta de reserva con esta categoría, para que una
    // eliminación concurrente de la categoría entre en conflicto con la reserva.
    reservaGuard: {
        type: Number,
        default: 0,
        select: false,
    },
});

categoriaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;
