const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "SKU already exists"
        });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid data format"
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;