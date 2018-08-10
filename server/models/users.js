var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    'userId': String,
    'userName': String,
    'userPwd': String,
    'orderList': Array,
    'cartList': [{
        "productId": String,
        "productName": String,
        "salePrice": Number,
        "productImage": String,
        "productUrl": String,
        'checked':String,
        'productNum':Number
    }],
    'addressList':[
      {
        "addressId": String,
        "userName": String,
        "streetName": String,
        "postCode": Number,
        "tel": Number,
        "default": Boolean
      }
    ]
});

module.exports = mongoose.model('user', userSchema, 'users');
