var mongoose = require('mongoose');
const CurrencyModel = require('../mongo_models/currency.js');

class Currency{

    static getCurrencies = async ({})=>{
        try{
            const currencies = await CurrencyModel.find({});
            if(currencies?.length){
                return currencies;
            }else{
                return [];
            }

        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting all currencies");
        }
    }

    static getCurrency = async ({currencyId})=>{
        try{
            const query = {
                "_id": mongoose.Types.ObjectId(currencyId)
            };
            const currency = await CurrencyModel.findOne(query);
            if(currency){
                return currency;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting particular currency");
        }
    }

}

module.exports.Currency = Currency;