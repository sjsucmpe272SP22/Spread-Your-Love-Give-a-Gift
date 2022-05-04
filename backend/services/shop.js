var mongoose = require('mongoose');
const ShopModel = require('../mongo_models/shop.js');

class Shop{

    static getUserShop = async ({userId})=>{
        try{
            const query = {
                "owner": mongoose.Types.ObjectId(userId)
            };
            const shop = await ShopModel.findOne(query);
            const queryResult = {};
            if(shop){
                queryResult.shopFound = true;
                queryResult.shop = shop;
            }else{
                queryResult.shopFound = false;
                queryResult.shop = {};
            }
            return queryResult;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting user shop");
        }
    }

    static checkNameAvailable = async ({shopName})=>{
        try{
            const query = {
                "name": shopName
            };
            const shop = await ShopModel.findOne(query);
            const queryResult = {};
            if(shop){
                queryResult.shopFound = true;
                queryResult.shop = shop;
            }else{
                queryResult.shopFound = false;
                queryResult.shop = {};
            }
            return queryResult;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while checking shop name exists");
        }
    }

    static createShop = async({shopName,user})=>{
        try{
            console.log(user);
            const query = {
                name:shopName,
                owner:user
            };
            const shop = new ShopModel(query);
            const result = await shop.save();
            const queryResult = {};
            if(result){
                queryResult.shopCreated = true;
                queryResult.shop = result;
            }else{
                queryResult.shopCreated = false;
                queryResult.shop = result;
            }
            return queryResult;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while adding category");
        }
    }

    static getShopByUser = async ({userId})=>{
        try{
            const query = {
                "owner": mongoose.Types.ObjectId(userId)
            };
            const shop = await ShopModel.findOne(query);
            let responseObj = {};
            if(shop){
                responseObj.shopFound = true;
                responseObj.shop = shop;
            }else{
                responseObj.shopFound = false;
            }
            return responseObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting user shop");
        }
    }

    static getShopById = async ({userId,shopId})=>{
        try{
            const query = {
                "_id": mongoose.Types.ObjectId(shopId)
            };
            const shop = await ShopModel.findOne(query).populate('owner');
            let responseObj = {};
            if(shop){
                console.log(shop.owner);
                if(shop.owner.id===userId){
                    responseObj.editRights = true;
                }
                responseObj.shopFound = true;
                responseObj.shop = shop;
            }else{
                responseObj.shopFound = false;
            }
            return responseObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting user shop");
        }
    }

    static updateDisplayPicture = async ({key,shopId})=>{
        try{
            const findCondition = {
                _id:mongoose.Types.ObjectId(shopId)
            };
            const updateCondition = {
                displayPicture:key
            };
            const result = await ShopModel.updateOne(findCondition,updateCondition);
            const shopObj = {};
            if(result){
                shopObj.shopEdited = true;
            }else{
                shopObj.shopEdited = false;
            }
            return shopObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while updating profile picture");
        }
    }
}

module.exports.Shop = Shop;