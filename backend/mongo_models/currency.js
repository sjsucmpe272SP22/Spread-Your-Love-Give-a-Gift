const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var currencySchema = new Schema({
    name: {type: String, required: true},
    symbol: {type: String, required: true},
},
{
    versionKey: false
});

currencySchema.set('toObject', { virtuals: true })
currencySchema.set('toJSON', { virtuals: true })


currencySchema.virtual('id').get(function() {
  return this._id.toString();
});

const currencyModel = mongoose.model('currency', currencySchema);
module.exports = currencyModel;