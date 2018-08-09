var mongoose = require('mongoose');

var prodectSchema = new mongoose.Schema({
  'productId':String,
  'productName':String,
  'salePrice':Number,
  'productImage':String,
  'productUrl':String,
  "checked": String,
  "productNum": Number
});

module.exports = mongoose.model('Good',prodectSchema);
