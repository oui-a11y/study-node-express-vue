var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');//做post请求数据处理包
// app.use(bodyParser.urlencoded({ extended: false }))
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});
//商品列表
var goods = require('../models/goods');
//用户model
var user = require('../models/users');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1/demo');
//查看是否连接成功;

mongoose.connection.on('error', function (err) {
  console.log('数据库连接失败' + err);
});
mongoose.connection.on('connected', function () {
  console.log('数据库连接成功');
});

mongoose.connection.on('open', function () {
  console.log('数据库连接成功');
});
mongoose.connection.on('disconnected', function () {
  console.log('数据库断开连接');
});
/* GET home page. */
router.get('/list', function (req, res, next) {
  let params = {};
  let sort = req.param('sort');
  let currentPage = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let skipNum = (currentPage - 1) * pageSize;
  if (!(req.param('startPrice') == '-1' || req.param('endPrice') == '-1')) {
    var priceGt = parseInt(req.param('startPrice'));
    var priceLte = parseInt(req.param('endPrice'));
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    };
  }

  goods.find(params).skip(skipNum).limit(pageSize).sort({'salePrice': sort}).exec(function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        rusult: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: data.length,
          data: data
        }
      });
    }

  })
});


//购物车提交
router.post('/addCart', function (req, res, next) {
  let userId = '101';
  let productId = req.body.productId;

  user.findOne({'userId': userId}, function (err, userDoc) {
    if (err) {
      res.json({
        stauts: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (userDoc) {
        let goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          console.dir(`item${item}`);
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum ++;
          }
        });
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message,
                rusult: ''
              });
            } else {
              res.json({
                status: '0',
                msg: '',
                rusult: 'success'
              });
            }
          });
        } else {
          goods.findOne({productId: productId}, function (err3, doc3) {
            if (err3) {
              res.json({
                status: '1',
                msg: err2.message,
                rusult: ''
              });
            }else{
              if(doc3){
                doc3.productNum = 1;
                doc3.checked = 1;
                console.dir(`这是新添加2:${doc3}`)

                userDoc.cartList.push(doc3);

                userDoc.save(function (err4,doc4) {
                  if(err4){
                    res.json({
                      status: '1',
                      msg: err4.message,
                      rusult: ''
                    });
                  }else{
                    res.json({
                      status: '0',
                      msg: '',
                      rusult: 'success'
                    });
                  }
                })
              }
            }
          })
        }
      }
    }
  });
});

module.exports = router;
