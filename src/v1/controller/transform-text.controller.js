import * as textService from '../services/embellish-text.service.js';

export const transformTextController = async (req, res) => {
    const { texto, tono, maximumAttempts } = req.body;

    if (!texto) {
        return res.status(400).json({ error: "El campo 'texto' es obligatorio." });
    }
    try {
        const resultado = await textService.embellishText(texto, tono, maximumAttempts);
        res.json({
            success: true,
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};