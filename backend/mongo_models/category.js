const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var categorySchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  name: {type: String, required: true},
},
{
    versionKey: false
});

categorySchema.set('toObject', { virtuals: true })
categorySchema.set('toJSON', { virtuals: true })


categorySchema.virtual('id').get(function() {
  return this._id.toString();
});

const categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;