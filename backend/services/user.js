var mongoose = require('mongoose');
const UserModel = require('../mongo_models/user.js');

class User{
    static addUser = async ({id,name, email, password, country, currency, profilePicture})=>{
        try{
            const query = {
                name,
                email,
                password,
                country,
                currency,
                profilePicture
            };
            const user = new UserModel(query);
            const result = await user.save();
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while adding user");
        }
    }

    static checkExists = async ({email})=>{
        try{
            const query = {
                email
            };
            const result = await UserModel.findOne(query);
            const userObj = {};
            if(result){
                userObj.userFound = true;
                userObj.user = result;
            }else{
                userObj.userFound = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred checking exists");
        }
    }

    static getUserById = async ({id})=>{
        try{
            const query = {
                _id:mongoose.Types.ObjectId(id)
            };
            const result = await UserModel.findOne(query);
            const userObj = {};
            if(result){
                userObj.userFound = true;
                userObj.user = result;
            }else{
                userObj.userFound = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while getting user by id");
        }
    }

    static editUser = async ({id,profilePicture,name,email,gender,dob,phone,address,city,country,about})=>{
        try{
            const findCondition = {
                _id:mongoose.Types.ObjectId(id)
            };
            const updateCondition = {
                profilePicture,
                name,
                email,
                gender,
                dob,
                phone,
                address,
                city,
                country,
                about
            }
            const result = await UserModel.updateOne(findCondition,updateCondition);
            const userObj = {};
            if(result){
                userObj.userEdited = true;
            }else{
                userObj.userEdited = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while editing user");
        }
    }

    static updateUserCurrency = async ({userId,currencyId}) => {
        try{
            const findCondition = {
                _id:mongoose.Types.ObjectId(userId)
            };
            const updateCondition = {
                currency:currencyId
            }
            const result = await UserModel.updateOne(findCondition,updateCondition);
            const userObj = {};
            if(result){
                userObj.userEdited = true;
            }else{
                userObj.userEdited = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while updating user currency");
        }
    }

    static updateProfilePicture = async ({key,userId})=>{
        try{
            const findCondition = {
                _id:mongoose.Types.ObjectId(userId)
            };
            const updateCondition = {
                profilePicture:key
            };
            const result = await UserModel.updateOne(findCondition,updateCondition);
            const userObj = {};
            if(result){
                userObj.userEdited = true;
            }else{
                userObj.userEdited = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred while updating profile picture");
        }
    }
}

module.exports.User = User;
