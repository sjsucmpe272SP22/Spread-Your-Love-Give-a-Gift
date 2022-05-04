var mongoose = require('mongoose');
const OrderModel = require('../mongo_models/order.js');
const OrderItemModel = require('../mongo_models/orderitem.js');
const CartModel = require('../mongo_models/cart.js');
const ItemModel = require('../mongo_models/item.js');


class Order{

    static getOrderItems = async ({userId,skip,limit})=>{
        try{
            const query = {
                "user": mongoose.Types.ObjectId(userId)
            };
            const orderSortQuery = {
                createdDate:-1
            }
            let moreAvailable = false;
            let orders = await OrderModel.find(query).skip(skip).limit(parseInt(limit)+1).sort(orderSortQuery);
            orders = JSON.parse(JSON.stringify(orders));
            const response = {};
            if(orders?.length){
                const orderIds = orders.map((eachOrder)=>{
                    return eachOrder.id;
                });
                if(orderIds.length>limit){
                    moreAvailable = true;
                }
                if(orderIds.length>limit){
                    orderIds.pop();
                }
                const orderitemsFindQuery = {
                    order:{$in:orderIds}
                }

                const orderitemsSortQuery = {
                    date:-1
                }
                let orderItems = await OrderItemModel.find(orderitemsFindQuery).sort(orderitemsSortQuery);
                orderItems = JSON.parse(JSON.stringify(orderItems));
                orderItems.forEach((eachItem)=>{
                    let date = new Date(eachItem.date);
                    let year = date.getFullYear();
                    let month = date.getMonth()+1;
                    let dt = date.getDate();
                    if (dt < 10) {
                    dt = '0' + dt;
                    }
                    if (month < 10) {
                    month = '0' + month;
                    }
                    eachItem.dateFormatted = month+"/"+dt+"/"+year;
                });
                const groupedOrders = {};
                orderItems.forEach((eachItem)=>{
                    if(eachItem.order in groupedOrders){
                        groupedOrders[eachItem.order].push(eachItem);
                    }else{
                        groupedOrders[eachItem.order] = [eachItem];
                    }
                });
                let sortedGroupedOrders = [];
                let c=0
                for (var orderId in groupedOrders) {
                    sortedGroupedOrders.push([orders[c], groupedOrders[orderId]]);
                    c=c+1
                }

                sortedGroupedOrders.sort(function(a, b) {
                     console.log(new Date(b[1][0].date));
                     return new Date(b[1][0].date) - new Date(a[1][0].date);
                });

                console.log("=================");
               // console.log(JSON.stringify(sortedGroupedOrders));
                console.log("=================");
                response.orders = sortedGroupedOrders;
                response.moreAvailable = moreAvailable;
                return response;
            }else{
                response.orders = {};
                response.moreAvailable = false;
                return response;
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting all order items");
        }
    }

    static placeOrder = async ({userId,name,number,address,city,state,zip})=>{
        let session;
        try{
            session = await mongoose.startSession();
            session.startTransaction();
            try{
                const cartItemQuery = {
                    "user": mongoose.Types.ObjectId(userId)
                };
                let cartItems = await CartModel.find(cartItemQuery).populate('item');
                cartItems = JSON.parse(JSON.stringify(cartItems));
                if(cartItems?.length){
                    const cartItemIds = cartItems.map((eachCartItem)=>{
                        return mongoose.Types.ObjectId(eachCartItem.item.id);
                    });
                    const itemQuery = {
                        "_id": {$in:cartItemIds}
                    };
                    let items = await ItemModel.find(itemQuery).populate('shop');
                    items = JSON.parse(JSON.stringify(items));
                    if(items?.length){
                        const updatedItems = [];
                        cartItems.forEach((eachCartItem)=>{
                            let item = items.filter((eachItem)=>{
                                return eachCartItem.item.id==eachItem.id;
                            });
                            item = item[0];
                            if(item.quantity<eachCartItem.orderQuantity){
                                throw new Error("Item out of stock");
                            }else{
                                item.quantity-=eachCartItem.orderQuantity;
                                item.salesCount+=eachCartItem.orderQuantity;
                                item.orderQuantity=eachCartItem.orderQuantity;
                                item.date = new Date();
                                item.gift = eachCartItem.gift;
                                item.cartDescription = eachCartItem.description;
                                item.shopName = item.shop.name;
                                item.item = item.id;
                                updatedItems.push(item);
                            }
                        });
                        const createOrderQuery = {
                            user:userId,
                            name:name,
                            number:number,
                            address:address,
                            city:city,
                            state:state,
                            zip:zip
                        };
                        const order = new OrderModel(createOrderQuery);
                        const orderCreateResult = await order.save();
                        if(orderCreateResult){
                            const createOrderItemsQuery = [];
                            updatedItems.forEach((eachItem)=>{
                                eachItem.order = orderCreateResult.id;
                                let eachItemCopy = JSON.parse(JSON.stringify(eachItem));
                                delete eachItemCopy.id;
                                delete eachItemCopy._id;
                                const query = {
                                    "insertOne":{
                                        "document":eachItemCopy,
                                    }
                                };
                                createOrderItemsQuery.push(query);
                            });
                            const orderItemsCreateResult = await OrderItemModel.bulkWrite(createOrderItemsQuery);
                            
                            if(orderItemsCreateResult){
                                const updateItemsQuery = [];
                                updatedItems.forEach((eachItem)=>{
                                    const query = {
                                        "updateOne":{
                                            "filter":{
                                                "_id":mongoose.Types.ObjectId(eachItem.id)
                                            },
                                            "update":{
                                                "quantity":eachItem.quantity,
                                                "salesCount":eachItem.salesCount
                                            }
                                        }
                                    };
                                    updateItemsQuery.push(query);
                                });
                                const itemsUpdateResult = await ItemModel.bulkWrite(updateItemsQuery);
                                if(itemsUpdateResult){
                                    const deleteCartItemsQuery = {
                                        "user":mongoose.Types.ObjectId(userId),
                                    }
                                    const deleteCartItemsResult = await CartModel.deleteMany(deleteCartItemsQuery);
                                    if(deleteCartItemsResult){
                                        await session.commitTransaction();
                                        const response = {};
                                        response.orderPlaced = true;
                                        return response;
                                    }else{
                                        throw new Error("Some unexpected error occurred while deleting cart items");
                                    }
                                }else{
                                    throw new Error("Some unexpected error occurred while updating items");
                                }
                            }else{
                                throw new Error("Some unexpected error occurred while creating order items");
                            }
                        }else{
                            throw new Error("Some unexpected error occurred while creating order");
                        }
                    }else{
                    throw new Error("Some unexpected error occurred while getting items to place order");
                    }
                }else{
                    throw new Error("Some unexpected error occurred while getting cart items to place order");
                }
            }catch(err){
                console.log(err);
                throw new Error("Some unexpected error occurred while placing order");
            }
        }catch(err){
            await session.abortTransaction();
            throw new Error("Some unexpected error occurred while placing order");
        }finally{
            session.endSession();
        }
    }
}

module.exports.Order = Order;