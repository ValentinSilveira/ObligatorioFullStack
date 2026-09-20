import axios from "axios";

//Genera un QR con el id de reserva para presentar en recepcion con goQR API
const urlExternaBase = "https://api.qrserver.com/v1/create-qr-code/";



const apiExternas = axios.create({
    baseURL: urlExternaBase,
    timeout: 5000,
    headers: {
        Accept: "image/png"
    }
});

// apiExternas.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response.status === 401) {
//             localStorage.removeItem("token");
//         }
//         return Promise.reject(error);
//     }
// );

export const generarQrReserva = async (idReserva) => {
    try {
        const contenidoQr = JSON.stringify({
            tipo: "reserva",
            id: idReserva
        });

        const response = await apiExternas.get("", {
            params: {
                data: contenidoQr,
                size: "250x250",
                format: "png"
            },
            responseType: "arraybuffer"
        });

        return response.data;
    } catch (error) {
        console.error(
            "Error generando el QR de la reserva:",
            error.message
        );

        throw new AppError(
            502,
            "No se pudo generar el código QR."
        );
    }
};