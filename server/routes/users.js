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
  let userId = req.cookies.userId;
  user.findOne({userId: userId}, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: '',
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: data.cartList
      });
    }
  })
});


//购物车删除
router.post('/cartDelect', function (req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  user.update({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, function (err, data) {
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
        rusult: 'success'
      });
    }
  });
});

//购物车修改商品数量选中情况
router.post('/cartEdit', function (req, res, next) {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  user.update({'userId': userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'success'
      });
    }

  })
});
//购物车全选功能
router.post('/editCheckAll', function (req, res, next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll ? '1' : '0';
  user.findOne({userId: userId}, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (data) {
        data.cartList.forEach((item) => {
          item.checked = checkAll;
        })
        data.save(function (err2, doc) {
          if (err2) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'success'
            });
          }
        })
      }
    }
  })
});

//获取用户地址
router.get('/addressList', function (req, res, next) {
  let userId = req.cookies.userId;
  user.findOne({userId: userId}, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: data.addressList
      });
    }
  })

});
//设置默认收货地址
router.post('/setDefault', function (req, res, next) {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is null',
      result: ''
    });
  }
  user.findOne({userId: userId}, function (err, data) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      if (data) {
        let addressList = data.addressList;
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.default = true;
          } else {
            item.default = false;
          }
        });
        data.save((err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'success'
            });
          }
        })
      }
    }
  })
});
//删除收货地址
router.post('/delAddress',function(req,res,next){
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  user.update({userId:userId},{$pull:{'addressList':{'addressId':addressId}}},function(err,data){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'success'
      });
    }
  })
});
module.exports = router;
