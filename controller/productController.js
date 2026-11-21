const Product = require("../model/Product");

// CREATE PRODUCT
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL PRODUCTS WITH FILTERING, SORTING AND PAGINATION
const getAllProducts = async (req, res, next) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            search,
            sortBy = "createdAt",
            order = "desc",
            page = 1,
            limit = 10
        } = req.query;

        const filter = { isActive: true };

        if (category) {
            filter.category = new RegExp(category, "i");
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10));

        const allowedSortFields = [
            "name", "price", "stock", "createdAt"
        ];

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const sortOrder = order === "asc" ? 1 : -1;

        const products = await Product.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: products.length,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limitNumber),
            currentPage: pageNumber,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// GET PRODUCT BY ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// SAFE STOCK INCREMENT / DECREMENT
const adjustStock = async (req, res, next) => {
    try {
        const { quantity, operation } = req.body;

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0 ||
            !["increment", "decrement"].includes(operation)
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide a positive integer quantity and valid operation"
            });
        }

        const update = operation === "increment"
            ? { $inc: { stock: quantity } }
            : {
                $inc: { stock: -quantity },
                $expr: { $gte: ["$stock", quantity] }
            };

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, isActive: true, ...(
                operation === "decrement"
                    ? { stock: { $gte: quantity } }
                    : {}
            ) },
            update,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found or insufficient stock"
            });
        }

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// LOW STOCK REPORT
const getLowStockProducts = async (req, res, next) => {
    try {
        const threshold = Math.max(0, Number(req.query.threshold) || 10);

        const products = await Product.find({
            isActive: true,
            stock: { $lte: threshold }
        }).sort({ stock: 1 });

        res.status(200).json({
            success: true,
            threshold,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// CATEGORY-WISE INVENTORY SUMMARY
const getCategorySummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: "$stock" },
                    averagePrice: { $avg: "$price" },
                    inventoryValue: {
                        $sum: { $multiply: ["$price", "$stock"] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalProducts: 1,
                    totalStock: 1,
                    averagePrice: { $round: ["$averagePrice", 2] },
                    inventoryValue: { $round: ["$inventoryValue", 2] }
                }
            },
            { $sort: { category: 1 } }
        ]);

        res.status(200).json({
            success: true,
            count: summary.length,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    adjustStock,
    getLowStockProducts,
    getCategorySummary
};