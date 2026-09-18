const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const summarizeNote = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Note content is required"
            })
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `Summarize the following note clearly and concisely
            Note: ${content}
            `
        })

        return res.status(200).json({
            success: true,
            summary: response.text
        })
    } catch (error) {
        console.error("Gemini summarize error", error);

        return res.status(500).json({
            success: false,
            message: "Failed to summarize note"
        })
    }
}


module.exports = {
    summarizeNote
};