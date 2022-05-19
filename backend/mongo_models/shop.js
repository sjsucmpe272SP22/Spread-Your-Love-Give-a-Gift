const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var shopSchema = new Schema({
    name: {type: String, required: true},
    owner:{type:mongoose.Schema.Types.ObjectId, ref: 'user',required: true},
    displayPicture: {type: String},
},
{
    versionKey: false
});

shopSchema.set('toObject', { virtuals: true })
shopSchema.set('toJSON', { virtuals: true })


shopSchema.virtual('id').get(function() {
  return this._id.toString();
});

const shopModel = mongoose.model('shop', shopSchema);
module.exports = shopModel;