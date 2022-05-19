const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    dob: {type: Date},
    gender: {type: String},
    profilePicture:{type: String},
    country:{type: mongoose.Schema.Types.ObjectId, ref: 'countries'},
    city:{type: String},
    address:{type: String},
    about:{type: String},
    phone:{type: String},
    currency:{type: mongoose.Schema.Types.ObjectId, ref: 'currencies'},
},
{
    versionKey: false
});

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

userSchema.virtual('id').get(function() {
  return this._id.toString();
});

userSchema.virtual('countryStr').get(function() {
  return this.country.toString();
});

userSchema.virtual('currencyStr').get(function() {
  return this.currency.toString();
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;