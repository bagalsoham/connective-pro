const activeController = async (req, res) => {
    res.status(200).json({
        message: "Running"
    });
}

export { activeController };