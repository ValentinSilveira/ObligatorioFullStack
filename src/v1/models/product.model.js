import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    price: {
        type: number, //TODO: mejorar eso
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: { type: String, required: false }

});



tareaSchema.set('toJSON', {
    //doc es el documento de mongoose y ret el elemento a devolver
    transform: (doc, ret) => {
        // renombrar _id → id
        ret.id = ret._id;
        //borramos el id de mongo
        delete ret._id;
        // // eliminar campos que no querés exponer
        delete ret.__v;
        // delete ret.createdAt;
        // delete ret.updatedAt;
        return ret;
    }
});


const Product = mongoose.model("Product", productSchema);

export default Product;