var mongoose = require('mongoose');
const CountryModel = require('../mongo_models/country.js');

class Country{

    static getCountries = async ()=>{
       try{
            const countries = await CountryModel.find({});
            if(countries?.length){
                return countries;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting all countries");
        }
    }

}

module.exports.Country = Country;