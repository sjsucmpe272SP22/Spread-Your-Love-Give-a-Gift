
var mongoose = require('mongoose');
const FavoriteItemModel = require('../mongo_models/favoriteitem.js');


class FavoriteItem{

    static getFavoriteItems = async ({userId})=>{
        try{
            const query = {
                "user": mongoose.Types.ObjectId(userId)
            };
            let items = await FavoriteItemModel.find(query).populate('item');
            if(items?.length){
                return items;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting all favorite items");
        }
    }

    static addItem = async ({userId, itemId})=>{
        try{
            const query = {
                user:userId,
                item:itemId
            };
            const favoriteitem = new FavoriteItemModel(query);
            const result = await favoriteitem.save();
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while adding favorite item");
        }
    }

    static removeItem = async ({userId,itemId})=>{
        try{
            const itemQuery = {
                "user":mongoose.Types.ObjectId(userId),
                "item":mongoose.Types.ObjectId(itemId)
            }
            console.log(itemQuery);
            const item = await FavoriteItemModel.deleteOne(itemQuery);
            if(item){
                return item;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting user by id");
        }
    }

    static getFilteredFavoriteItems = async ({searchQuery,userId})=>{
        try{
            const itemQuery = {
            }
            itemQuery.$and = [];
            itemQuery.$and.push({"user":mongoose.Types.ObjectId(userId)});
            let searchRegex;
            if(searchQuery){
                searchRegex = new RegExp(`${searchQuery}`);
            }
            let items = await FavoriteItemModel.find(itemQuery).populate('item');
            items = items.filter((eachItem)=>{
                return eachItem.item.name.match(searchRegex);
            })
            if(items){
                return items;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting user by id");
        }
    }
}

module.exports.FavoriteItem = FavoriteItem;