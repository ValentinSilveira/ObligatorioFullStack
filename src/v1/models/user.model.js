import mongoose from "mongoose";
import { Role, Roles } from "../../constants/role.constants.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    plan: {
        type: String,
        default: "Plus"
    },
    role: {
        type: String,
        enum: Roles,
        default: Role.user
    },

});

userSchema.set('toJSON', {
    //doc es el documento de mongoose y ret el elemento a devolver
    transform: (doc, ret) => {
        // renombrar _id → id
        ret.id = ret._id;
        //borramos el id de mongo
        delete ret._id;
        delete ret.password;
        // eliminar campos que no querés exponer 
        delete ret.__v;
        // delete ret.createdAt;
        // delete ret.updatedAt;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);

export default User;