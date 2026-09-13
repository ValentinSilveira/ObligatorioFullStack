import User from "../models/user.model.js";


export const getAllUsersService = async () => {
    return await User.find();
};

export const getUserByIdService = async (id) => {
    return await User.findById(id).select("+password");
};

export const getUserByEmail = async (data) => {
    return await User.findOne({ email: data });
}

export const getUserByUsername = async (data) => {
    return await User.findOne({ username: data });
}

export const deleteUserService = async (id) => {
    return await User.findByIdAndDelete(id);
};

export const updateUserService = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true });
};

export const replaceUserService = async (id, data) => {
    return await User.findByIdAndReplace(id, data, { new: true });
}
