const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderitemSchema = new Schema({
    order: {type: mongoose.Schema.Types.ObjectId, ref: 'order',required: true},
    name: {type: String, required: true},
    displayPicture: {type: String},
    price: {type: Number, required: true},
    orderQuantity: {type: Number, required: true},
    date: {type: Date, required: true},
    shopName: {type: String, required: true},
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item',required: true},
    gift: {type: String},
    cartDescription: {type: String},
},
{
    versionKey: false
});

orderitemSchema.set('toObject', { virtuals: true })
orderitemSchema.set('toJSON', { virtuals: true })


orderitemSchema.virtual('id').get(function() {
  return this._id.toString();
});

const orderitemModel = mongoose.model('orderitem', orderitemSchema);
module.exports = orderitemModel;