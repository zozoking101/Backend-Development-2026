export const notFound = (req, res) => {
    res.status(404).json({
        message: `🚫 ${req.originalUrl} route not found`
    })
}