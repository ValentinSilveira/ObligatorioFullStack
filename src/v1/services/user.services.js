import User from "../models/user.model.js";
import { AppError } from "../../utils/appError.js";


export const getUserByIdService = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(404, "El usuario no existe.");
    }

    return user;
};

export const getUserByEmail = async (data) => {
    return await User.findOne({ email: data });
}

export const getUserByUsername = async (data) => {
    return await User.findOne({ username: data });
}

export const deleteUserService = async (id) => {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new AppError(404, "El usuario no existe.");
    }

    return user;
};

export const updateUserService = async (id, data) => {
    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        if (!user) {
            throw new AppError(404, "El usuario no existe.");
        }

        return user;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(409, "Ese username o email ya está en uso.");
        }
        throw error;
    }
};

export const updatePlanService = async (id, plan) => {
    const user = await User.findByIdAndUpdate(id, { plan }, { new: true, runValidators: true });

    if (!user) {
        throw new AppError(404, "El usuario no existe.");
    }

    return user;
};
