const con = require("../db");


const tableName = "item";
const shopTableName = "shop";
const favoriteItemTableName = "favoriteitem";
const categoryTableName = "category";

class Item{

    static getShopItems = async ({shopId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select * from ${tableName} WHERE shop='${shopId}'`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    static getItem = async ({itemId,userId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select ${tableName}.id as itemId, ${tableName}.name as itemName, ${tableName}.displayPicture as itemDisplayPicture, ${tableName}.description as itemDescription, ${tableName}.price as itemPrice, ${tableName}.quantity as itemQuantity, ${tableName}.salesCount as itemSalesCount, ${shopTableName}.id as shopId, ${shopTableName}.owner as shopOwner, ${shopTableName}.name as shopName, ${shopTableName}.displayPicture as shopDisplayPicture,${categoryTableName}.name as categoryName from ${tableName} INNER JOIN ${shopTableName} ON ${tableName}.shop=${shopTableName}.id INNER JOIN ${categoryTableName} ON ${tableName}.category=${categoryTableName}.id WHERE ${tableName}.id='${itemId}'`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }else if(results){
                    const item = results[0];
                    const sqlQuery = `select * from ${favoriteItemTableName} where item=${itemId} AND user='${userId}' `
                    con.query(sqlQuery, (error, favResults) => {
                        if(error){
                            console.log(error);
                            return reject(error);
                        }else if(favResults && favResults.length){
                            item.favorite = true;
                            return resolve(item);
                        }else if(favResults && !favResults.length){
                            item.favorite = false;
                            return resolve(item);
                        }else{
                            return reject("Some unexpected error occurred!");
                        }
                    });
                }else{
                    return reject("Some unexpected error occurred!");
                }
            });
        });
    }

    static addItem = async ({name, displayPicture, category, description, price, quantity, salesCount, shopId})=>{
        try{
            return new Promise((resolve, reject)=>{
                try{
                    const sqlQuery = `INSERT INTO ${tableName} (name, displayPicture, category, description, price, quantity, salesCount, shop) VALUES ('${name}', '${displayPicture}', '${category}', '${description}', '${price}', '${quantity}', '${salesCount}', '${shopId}')`;
                    con.query(sqlQuery,(error, results)=>{
                        if(error){
                            console.log(error);
                            return reject(error);
                        }
                        console.log("ADD Item RESULTS: ", results);
                        return resolve(results);
                    });
                }catch(e){
                    console.log(e);
                    return reject(e);
                }
            });
        }catch(e){
            console.log(e);
            throw Error(e);
        }
    }

    static editItem = async ({id, name, displayPicture, category, description, price, quantity})=>{
        try{
            return new Promise((resolve, reject)=>{
                try{
                    const sqlQuery = `update ${tableName} set name = '${name}', displayPicture = '${displayPicture}', category = '${category}', description = '${description}', price = '${price}', quantity = '${quantity}' where id = '${id}'`;
                    con.query(sqlQuery,(error, results)=>{
                        if(error){
                            console.log(error);
                            return reject(error);
                        }
                        console.log("ADD Item RESULTS: ", results);
                        return resolve(results);
                    });
                }catch(e){
                    console.log(e);
                    return reject(e);
                }
            });
        }catch(e){
            console.log(e);
            throw Error(e);
        }
    }

    static getOtherItems = async ({id})=>{
        return new Promise((resolve, reject) => {
            const sqlQueryOuter = `select * from ${shopTableName} WHERE owner='${id}'`;
            con.query(sqlQueryOuter,(error, results)=>{
                if (error) {
                    console.log(error);
                    return reject(error);
                }else{
                    let shop;
                    let sqlQuery;
                    if(results && results[0] && results[0].id){
                        shop = results[0].id;
                        sqlQuery = `select * from ${tableName} WHERE shop!='${shop}'`;
                    }else{
                        sqlQuery = `select * from ${tableName}`;
                    }
                    con.query(sqlQuery, (error, results) => {
                        if (error) {
                            console.log(error);
                            return reject(error);
                        }
                        const itemIds = results.map((eachResult)=>{
                            return eachResult.id;
                        });
                        let favitemsSqlQuery = '';
                        if(itemIds.length > 0){
                            favitemsSqlQuery = `select * from ${favoriteItemTableName} WHERE user='${id}' AND ${favoriteItemTableName}.item IN (${itemIds})`;
                        }else{
                            favitemsSqlQuery = `select * from ${favoriteItemTableName} WHERE user='${id}'`;
                        }
                        con.query(favitemsSqlQuery,(error, favItems)=>{
                            if(error){
                                console.log(error);
                                return reject(error);
                            }else{
                                const favItemIds = favItems.map((eachFavItem)=>{
                                    return eachFavItem.item;
                                });
                                results.forEach((eachResult)=>{
                                    if(favItemIds.includes(eachResult.id)){
                                        eachResult.favorite=true;
                                    }else{
                                        eachResult.favorite=false;
                                    }
                                })
                                return resolve(results);
                            }
                        })
                    });
                }
            })
            
        });
    }

    static getOtherFilteredItems = async ({shop,searchQuery,minPrice,maxPrice,inStock,sortBy,userId})=>{
        return new Promise((resolve, reject) => {
            let sqlQuery = `select * from ${tableName} WHERE shop!='${shop}'`;
            if(searchQuery){
                sqlQuery+=` AND name LIKE '%${searchQuery}%'`; 
            }
            if(minPrice){
                sqlQuery+=` AND price>=${minPrice}`; 
            }
            if(maxPrice){
                sqlQuery+=` AND price<=${maxPrice}`; 
            }
            if(inStock){
                sqlQuery+=` AND quantity>salesCount`;
            }
            if(sortBy==="price"){
                sqlQuery+=` ORDER BY price`;
            }
            if(sortBy==="quantity"){
                sqlQuery+=` ORDER BY quantity DESC`;
            }
            if(sortBy==="salesCount"){
                sqlQuery+=` ORDER BY salesCount DESC`;
            }
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                const itemIds = results.map((eachResult)=>{
                    return eachResult.id;
                });
                let favitemsSqlQuery;
                if(itemIds.length > 0){
                    favitemsSqlQuery = `select * from ${favoriteItemTableName} WHERE user='${userId}' AND ${favoriteItemTableName}.item IN (${itemIds})`;
                }else{
                    favitemsSqlQuery = `select * from ${favoriteItemTableName} WHERE user='${userId}'`;
                }
                con.query(favitemsSqlQuery,(error, favItems)=>{
                    if(error){
                        console.log(error);
                        return reject(error);
                    }else{
                        const favItemIds = favItems.map((eachFavItem)=>{
                            return eachFavItem.item;
                        });
                        results.forEach((eachResult)=>{
                            if(favItemIds.includes(eachResult.id)){
                                eachResult.favorite=true;
                            }else{
                                eachResult.favorite=false;
                            }
                        })
                        return resolve(results);
                    }
                })
            });
        });
    }

    static updateDisplayPicture = async ({key,itemId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `update ${tableName} set displayPicture = '${key}' where id = '${itemId}'`;
            con.query(sqlQuery, (error, result) => {
                console.log("USER UPDATED RESULT"+JSON.stringify(result));
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                let itemObj = {};
                if(result){
                    itemObj.itemEdited = true;
                }else{
                    itemObj.itemEdited = false; 
                }
                return resolve(itemObj);
            });
        });
    }

}

module.exports.Item = Item;