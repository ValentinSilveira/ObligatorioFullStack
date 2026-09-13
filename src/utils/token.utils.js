import jwt from "jsonwebtoken";

const baseOptions = {
    algorithm: "HS256",//algoritmo de firma
    issuer: "jwt-demo-api",//quien lo emite
    audience: "jwt-demo-client" //quien lo va a usar
};

//token comunes 

export const generateAccessToken = (data) => {
    return jwt.sign(
        data,
        process.env.JWT_ACCESS_SECRET,
        { ...baseOptions, expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, baseOptions);
}

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { sub: user.id, tokenVersion: user.tokenVersion },
        process.env.JWT_REFRESH_SECRET,
        { ...baseOptions, expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );
}

export const verifyRefreshToken = (token) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, baseOptions);
