const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favoriteitemSchema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref: 'users',required: true},
    item:{type:mongoose.Schema.Types.ObjectId, ref: 'item',required: true},
},
{
    versionKey: false
});

favoriteitemSchema.set('toObject', { virtuals: true })
favoriteitemSchema.set('toJSON', { virtuals: true })


favoriteitemSchema.virtual('id').get(function() {
  return this._id.toString();
});

favoriteitemSchema.virtual('itemStr').get(function() {
  return this.item.toString();
});

const favoriteitemModel = mongoose.model('favoriteitem', favoriteitemSchema);
module.exports = favoriteitemModel;