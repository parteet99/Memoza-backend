const { getFavorites } = require("./favorite.queries");

const getStarNotes = async (req, res) => {
    try {
        const userId = req.user.userId;

        const note = await getFavorites(userId);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Starred notes fetched successfully",
            note
        })
    } catch (error) {
        console.error("Error fetching starred notes", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch starred notes"
        })
    }
}

module.exports = {
    getStarNotes
}