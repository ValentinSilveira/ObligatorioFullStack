import "dotenv/config";
import mongoose from "mongoose";
import { connectMongo } from "../v1/config/mongo.config.js";
import User from "../v1/models/user.model.js";
import { hashear } from "../utils/validar-password.utils.js";
import { Role } from "../constants/role.constants.js";

async function seedAdmin() {
    await connectMongo();

    const username = "admin";
    const email = "admin@admin.com";
    const password = await hashear("admin");

    const existing = await User.findOne({ username });

    if (existing) {
        existing.role = Role.admin;
        existing.password = password;
        await existing.save();
        console.log("Usuario admin ya existia, se actualizo el rol y la password.");
    } else {
        await User.create({
            name: "Admin",
            username,
            email,
            password,
            plan: "Premium",
            role: Role.admin,
        });
        console.log("Usuario admin creado correctamente (username: admin, password: admin).");
    }

    await mongoose.disconnect();
}

seedAdmin().catch((err) => {
    console.error("Error al crear el usuario admin:", err.message);
    process.exit(1);
});
