const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var countrySchema = new Schema({
  name: {type: String, required: true},
},
{
    versionKey: false
});

countrySchema.set('toObject', { virtuals: true })
countrySchema.set('toJSON', { virtuals: true })


countrySchema.virtual('id').get(function() {
  return this._id.toString();
});

const countryModel = mongoose.model('country', countrySchema);
module.exports = countryModel;