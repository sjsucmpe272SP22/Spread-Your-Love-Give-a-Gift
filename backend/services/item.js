var mongoose = require('mongoose');
const ItemModel = require('../mongo_models/item.js');
const ShopModel = require('../mongo_models/shop.js');
const FavoriteItemModel = require('../mongo_models/favoriteitem.js');

class Item{

    static getShopItems = async ({shopId})=>{
        try{
            const query = {
                "shop": mongoose.Types.ObjectId(shopId)
            };
            const items = await ItemModel.find(query);
            if(items?.length){
                return items;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting all categories");
        }
    }

    static getItem = async ({itemId,userId})=>{
        try{
            const query = {
                "_id": mongoose.Types.ObjectId(itemId)
            };
            let item = await ItemModel.findOne(query).populate('shop').populate('category');
            item = JSON.parse(JSON.stringify(item)); 
            if(item){
                const favItemQuery = {
                    "item": mongoose.Types.ObjectId(itemId),
                    "user": mongoose.Types.ObjectId(userId)
                };  
                const favoriteItem = await FavoriteItemModel.findOne(favItemQuery);
                if(favoriteItem && Object.keys(favoriteItem)?.length){
                 item.favorite = true;   
                }else{
                 item.favorite = false;   
                }
                return item;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting all categories");
        }
    }

    static addItem = async ({name, displayPicture, category, description, price, quantity, salesCount, shopId})=>{
        try{
            const query = {
                name,
                displayPicture,
                category,
                description,
                price,
                quantity,
                salesCount,
                shop:shopId
            };
            const item = new ItemModel(query);
            const result = await item.save();
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while adding item");
        }
    }

    static editItem = async ({id, name, displayPicture, category, description, price, quantity})=>{
        try{
            const findCondition = {
                "_id":mongoose.Types.ObjectId(id)
            };
            const updateCondition = {
                name,
                displayPicture,
                category,
                description,
                price,
                quantity
            }
            const result = await ItemModel.updateOne(findCondition,updateCondition);
            const itemObj = {};
            if(result){
                itemObj.itemEdited = true;
            }else{
                itemObj.itemEdited = false; 
            }
            return itemObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while editing item");
        }
    }

    static getOtherItems = async ({id})=>{
        try{
            const shopQuery = {
                "owner":mongoose.Types.ObjectId(id)
            };
            const shop = await ShopModel.findOne(shopQuery);
            const shopId = shop?.id;
            const itemQuery = {
                "shop":{$nin:[mongoose.Types.ObjectId(shopId)]}
            }
            let items = await ItemModel.find(itemQuery).populate('shop').populate('category');
            items = JSON.parse(JSON.stringify(items));
            if(items){
                 const itemIds = items.map((eachItem)=>{
                    return mongoose.Types.ObjectId(eachItem.id);
                });
                let favItemQuery = {};
                if(itemIds?.length){
                    favItemQuery = {
                        user:mongoose.Types.ObjectId(id),
                        item:{$in:itemIds}
                    };
                }else{
                    favItemQuery = {
                        user:mongoose.Types.ObjectId(id)
                    };
                }
                const favItems = await FavoriteItemModel.find(favItemQuery);
                const favItemIds = favItems.map((eachFavItem)=>{
                    return eachFavItem.itemStr;
                });
                items.forEach((eachItem)=>{
                    if(favItemIds.includes(eachItem.id)){
                        eachItem.favorite=true;
                    }else{
                        eachItem.favorite=false;
                    }
                })
                return items;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting user by id");
        }
    }

    static getOtherFilteredItems = async ({shop,searchQuery,minPrice,maxPrice,inStock,sortBy,userId})=>{
        try{
            const itemQuery = {
                "shop":{$nin:[mongoose.Types.ObjectId(shop)]}
            }
            itemQuery.$and = [];
            if(searchQuery){
                let searchRegex = new RegExp(`${searchQuery}`);
                itemQuery.$and.push({"name":searchRegex}); 
            }
            if(minPrice){
                itemQuery.$and.push({"price":{"$gte":minPrice}}); 
            }
            if(maxPrice){
                itemQuery.$and.push({"price":{"$lt":maxPrice}}); 
            }
            if(inStock){
                 itemQuery.$and.push({"quantity":{"$gt":0}}); 
            }
            if(!itemQuery?.$and?.length){
                delete itemQuery.$and;
            }
            let sortQuery = {};
            if(sortBy==="price"){
                sortQuery = {"price":1};
            }
            if(sortBy==="quantity"){
                sortQuery = {"quantity":-1};
            }
            if(sortBy==="salesCount"){
                sortQuery = {"salesCount":-1};
            }
            const items = await ItemModel.find(itemQuery).sort(sortQuery).populate('shop').populate('category');
            if(items){
                 const itemIds = items.map((eachItem)=>{
                    return mongoose.Types.ObjectId(eachItem.id);
                });
                let favItemQuery = {};
                if(itemIds?.length){
                    favItemQuery = {
                        user:mongoose.Types.ObjectId(userId),
                        item:{$in:itemIds}
                    };
                }else{
                    favItemQuery = {
                        user:mongoose.Types.ObjectId(userId)
                    };
                }
                const favItems = await FavoriteItemModel.find(favItemQuery);
                const favItemIds = favItems.map((eachFavItem)=>{
                    return eachFavItem.item;
                });
                items.forEach((eachItem)=>{
                    if(favItemIds.includes(eachItem.id)){
                        eachItem.favorite=true;
                    }else{
                        eachItem.favorite=false;
                    }
                })
                return items;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting filtered items");
        }
    }

    static updateDisplayPicture = async ({key,itemId})=>{
        try{
            const findCondition = {
                _id:mongoose.Types.ObjectId(itemId)
            };
            const updateCondition = {
                displayPicture:key
            }
            const result = await ItemModel.updateOne(findCondition,updateCondition);
            const itemObj = {};
            if(result){
                itemObj.itemEdited = true;
            }else{
                itemObj.itemEdited = false; 
            }
            return itemObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while updating item display picture");
        }
    }

}

module.exports.Item = Item;

