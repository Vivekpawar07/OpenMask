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
        const input = req.body.text;
        const style = `<${req.body.style}>`.toLowerCase();

        const response = await axios.post(`${process.env.ML_BACKEND_SERVER}/transferStyle`, {
            input: input,
            target: style
        });

        const data = response.data;
        const result = {
            style_transfer: data
        };

        res.status(200).json(result);

    } catch (error) {
        console.error("Error during style transfer:", error);
        res.status(500).json({
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