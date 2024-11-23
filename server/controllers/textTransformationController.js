const axios = require('axios');
const GEC = async (req, res) => {
    try {
        const input = req.body.text;
        const response = await axios.post(`${process.env.ML_BACKEND_SERVER}/correct_grammar`, {
            input: input
        });
        const data = await response;
        const result = {
            GEC: data.data.predictions
        };

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in GEC function:', error);
        res.status(500).json({ error: 'An error occurred while correcting grammar.' });
    }
};

const StyleTransfer = async (req, res) => {
    try {
        // Extract and validate input
        const input = req.body.text?.trim();
        const style = req.body.style?.trim().toLowerCase();

        // Check if input and style are valid
        if (!input || !style) {
            return res.status(400).json({
                success: false,
                message: "Both input text and style must be provided and valid."
            });
        }

        // Ensure ML_BACKEND_SERVER environment variable is set
        if (!process.env.ML_BACKEND_SERVER) {
            console.error("ML_BACKEND_SERVER environment variable is not defined.");
            return res.status(500).json({
                success: false,
                message: "Internal server error. Please contact the administrator."
            });
        }


        // Call the ML backend for style transfer
        const response = await axios.post(`${process.env.ML_BACKEND_SERVER}/transferStyle`, {
            input,
            target: `<${style}>`
        });

        // Prepare and send response
        const result = {
            style_transfer: response.data
        };
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error during style transfer:", error.message);

        // Distinguish between client and server errors
        const statusCode = error.response ? error.response.status : 500;
        return res.status(statusCode).json({
            success: false,
            message: "An error occurred during the style transfer process.",
            error: error.message
        });
    }
};
module.exports = {
    GEC,
    StyleTransfer
}