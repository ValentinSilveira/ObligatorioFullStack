import bcrypt from "bcryptjs";

export const hashear = async (password) => {
    const hash = await bcrypt.hash(password, 12);
    return hash;
}


export const compararPassword = async (password, hash) => {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
}       