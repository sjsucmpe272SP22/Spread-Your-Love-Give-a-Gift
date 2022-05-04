const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users',required: true},
    name: {type:String},
    number: {type:Number},
    address: {type:String},
    city: {type:String},
    state: {type:String},
    zipcode: {type:Number}
},
{
    versionKey: false
});

orderSchema.set('toObject', { virtuals: true })
orderSchema.set('toJSON', { virtuals: true })


orderSchema.virtual('id').get(function() {
  return this._id.toString();
});

const orderModel = mongoose.model('order', orderSchema);
module.exports = orderModel;