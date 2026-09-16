
export const constructorError = (message, status) => {
    const errorAux = new Error(message);
    errorAux.status = status;
    return errorAux;
}