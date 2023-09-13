const Category = require('../../models/categoryModel');
const { error, success } = require("../../utils/responseApi");


module.exports = {
    addCategory: async (req, res) => {
        try {
            let { category_name, category_description } = req.body;
            //converting category name into lowercase
            category_name = req.body.category_name.split(" ").join("-").toLowerCase()
            //checking whether category already exist
            const Category = await Category.findOne({ category_name: category_name });
            if (Category) {
                return res.status(409).json(error("Category name already exist, choose another one"));
            }
            //creating new category
            await Category.create({ category_name: category_name, category_description: category_description })
            return res.status(201).json(success('Category created'));
        } catch (err) {
            return res.status(500).json(error("Something went wrong, Try after sometimes"))
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const category = await Category.find();
            return res.status(200).json(success("Details of all categories", { categories: category }));
        } catch (err) {
            return res.status(500).json(error("Something went wrong, Try after sometime"));
        }
    },

    getCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const category = await Category.findById({ _id: id })
            return res.status(200).json(success('Category details', { data: category }))
        } catch (err) {
            return res.status(500).json(error('Smoething went wrong, Please try again later'))
        }
    },

    updateCategoryStatus: async (req, res) => {
        try {
            const status = req.query.status;
            const category_id = req.params.id;
            const updatedCategory = await Category.findOneAndUpdate({ _id: category_id }, { status: status });
            return res.status(200).json(success("Category updated succesfully", { data: updatedCategory }));
        } catch (err) {
            res.status(500).json(error('Something went wrong, Please try again later'))
        }
    },

    editCategory: async (req, res) => {
        try {
            let { category_name, category_description } = req.body

            category_name = category_name.split(" ").join("-").toLowerCase()
            // checking whether the category name already exist
            const previousCategory = await Category.findById(req.params.id);
            const isExist = await Category.findOne({ category_name: category_name })
            if (isExist && previousCategory.category_name !== category_name) {
                return res.status(409).json(error("Category name already exist, Choose another one"));
            }
            //updating the category
            const category = await Category.findOneAndUpdate({ _id: req.params.id }, { category_name: category_name, category_description: category_description });
            return res.status(200).json(success("Category edited"));
        } catch (err) {
            res.status(500).json(error('Something went wrong, Please try after sometimes'));
        }
    }
}