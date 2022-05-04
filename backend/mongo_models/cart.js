const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cartSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user',required: true},
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'item',required: true},
  orderQuantity: {type:Number, required: true},
  description: {type:String},
  gift: {type:String}
},
{
    versionKey: false
});

cartSchema.set('toObject', { virtuals: true })
cartSchema.set('toJSON', { virtuals: true })


cartSchema.virtual('id').get(function() {
  return this._id.toString();
});

const cartModel = mongoose.model('cart', cartSchema);
module.exports = cartModel;