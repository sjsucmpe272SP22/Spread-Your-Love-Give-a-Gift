var mongoose = require('mongoose');
const CartModel = require('../mongo_models/cart.js');

class Cart{

    static addItem = async ({userId, itemId,orderQuantity})=>{
        try{
            const query = {
                user:mongoose.Types.ObjectId(userId),
                item:mongoose.Types.ObjectId(itemId)
            };
            const result = await CartModel.findOne(query);
            if(result){
                const data = {};
                data.itemExists = true;
                return data;
            }else{
               const query = {
                    user:userId,
                    item:itemId,
                    orderQuantity
                };
                const cart = new CartModel(query);
                const result = await cart.save();
                if(result){
                    return result;
                }else{
                    return {};
                } 
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting user by id");
        }    
    }

    static removeItem = async ({id})=>{
        try{
            const query = {
                "_id":mongoose.Types.ObjectId(id),
            }
            const item = await CartModel.deleteOne(query);
            if(item){
                return item;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while deleting item from cart");
        }
    }

    static getCartItems = async ({userId})=>{
        try{
            const query = {
                "user": mongoose.Types.ObjectId(userId)
            };
            let items = await CartModel.find(query).populate('item');
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

    static updateItemOrderQuantity = async ({orderQuantity,userId,itemId,cartId})=>{
        try{
            const findCondition = {
                _id:mongoose.Types.ObjectId(cartId),
                user:mongoose.Types.ObjectId(userId),
                item:mongoose.Types.ObjectId(itemId),
            };
            const updateCondition = {
                orderQuantity,
            }
            const result = await CartModel.updateOne(findCondition,updateCondition);
            if(result){
                return result
            }else{
                return {}; 
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while editing user");
        }
    }

    static updateItemOrderGift = async ({gift,description,userId,itemId,cartId})=>{
        try{
            const findCondition = {
                _id:mongoose.Types.ObjectId(cartId),
                user:mongoose.Types.ObjectId(userId),
                item:mongoose.Types.ObjectId(itemId),
            };
            const updateCondition = {
                gift,
                description
            }
            const result = await CartModel.updateOne(findCondition,updateCondition);
            if(result){
                return result
            }else{
                return {}; 
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while editing user");
        }
    }
}

module.exports.Cart = Cart;