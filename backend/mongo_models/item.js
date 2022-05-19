const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var itemSchema = new Schema({
    name: {type: String, required: true},
    displayPicture: {type: String},
    category:{type:mongoose.Schema.Types.ObjectId, ref: 'category',required: true},
    description:{type:String},
    price:{type:Number, required:true},
    quantity:{type:Number, required:true},
    salesCount:{type:Number, required:true},
    shop:{type:mongoose.Schema.Types.ObjectId, ref: 'shop',required: true}
},
{
    versionKey: false
});

itemSchema.set('toObject', { virtuals: true })
itemSchema.set('toJSON', { virtuals: true })


itemSchema.virtual('id').get(function() {
  return this._id.toString();
});

const itemModel = mongoose.model('item', itemSchema);
module.exports = itemModel;