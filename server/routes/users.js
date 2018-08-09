var express = require('express');
var router = express.Router();

var user = require('../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');

});
router.get('/test', function (req, res, next) {
  res.send('test');

});
//登录接口
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  user.findOne(param, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (data) {
        res.cookie('userId', data.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie('userName', data.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: '0',
          msg: '',
          result: data.userName
        });
      }
    }

  })
});

//登出接口
router.post('/logout', function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
});
//登录校验
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
});
//获取购物车信息
router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId;
  user.find({userId: userId}, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        });
      }
    }
  })
});
//购物车删除
router.post('/cart/delect', function (req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  user.update({userId: userId}, {$pull: {'cartList': {'productId': productId}}}, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: 'success',
        result: ''
      });
    }
  });
});

module.exports = router;
