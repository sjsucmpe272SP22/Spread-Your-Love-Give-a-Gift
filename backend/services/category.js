var mongoose = require('mongoose');
const CategoryModel = require('../mongo_models/category.js');

class Category{

    static getCategories = async ({userId})=>{
        try{
            const query = {
                "user": {"$in":[null,mongoose.Types.ObjectId(userId)]}
            };
            const categories = await CategoryModel.find(query);
            if(categories?.length){
                return categories;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting all categories");
        }
    }

    static addCategory = async ({userId,name})=>{
        try{
            const query = {
                name,
                user:userId
            };
            const category = new CategoryModel(query);
            const result = await category.save();
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while adding category");
        }
    }
}

module.exports.Category = Category;
