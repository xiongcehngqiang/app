var express = require('express');
var forToken = require('../token');
var router = express.Router();
const users = require('../server/User.js')
const cache = require('../redis')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
    code: '200',
    data: {
      code: '200',
      data: '你想干嘛'
    }
  })
});
//登录接口
router.get('/login', function (req, res, next) {
  users.findOne({
    where: {
      user_name: req.query.name,
      password: req.query.password
    }
  }).then(resp => {
    //根据查找resp是否为空判断是否找到对应的数据
    if (resp !== null) {
      //生成token
      forToken.setToken(req.query).then(r => {
        //存redis缓存
        cache.set('USER', req.query.name, {
          token: r
        }).then((redisResp) => {
          console.log(redisResp)
        })
        res.send({
          code: '200',
          data: {
            code: '200',
            token: r
          }
        })
      })
    } else {
      res.send({
        code: '200',
        data: {
          code: '400',
          data: '账号密码错误'
        }
      })
    }

  })
});
//注册接口
router.get('/regist', function (req, res, next) {
  //判断用户名是否存在
  users.findOne({
      where: {
        user_name: req.query.name,
      }
    })
    .then(resp => {
      if (resp !== null) {
        res.send({
          code: 200,
          data: {
            message: '该用户存在!'
          }
        })
      } else {
        users.create({
            user_name: req.query.name,
            password: req.query.password
          })
          .then(r => {
            res.send({
              code: 200,
              data: {
                message: '注册成功！'
              }
            })
          })
          .catch(r => {
            res.send({
              code: 200,
              data: {
                message: '注册失败，请重新注册！'
              }
            })
          })
      }
    })
});
//修改密码接口
router.get('/change', function (req, res, next) {
  const {
    name,
    password
  } = req.query
  users.upsert({
      user_name: name,
      password
    })
    .then(r => {
      res.send({
        code: 200,
        data: {
          message: '修改成功!'
        }
      })
    })
    .catch(err => {
      res.send({
        code: 200,
        data: {
          message: `修改数据${err}`
        }
      })
    })
});
//删除用户
router.get('/detel', function (req, res, next) {
  const {
    name
  } = req.query
  //判断用户名是否存在
  users.findOne({
      where: {
        user_name: req.query.name,
      }
    })
    .then(r => {
      if (r !== null) {
        users.destroy({
          where: {
            user_name: req.query.name,
          }
        }).then(r => {
          res.send({
            code: 200,
            data: {
              message: '删除成功!'
            }
          })
        }).catch(err => {
          res.send({
            code: 200,
            data: {
              message: `删除数据${err}`
            }
          })
        })
      } else {
        res.send({
          code: 200,
          data: {
            message: `该用户不存在`
          }
        })
      }
    })
    .catch(err => {
      res.send({
        code: 200,
        data: {
          message: `修改数据${err}`
        }
      })
    })
});
//推出接口
router.get('/exit', function (req, res, next) {
  let token = req.query.token;
  forToken.getToken(token).then(resp => {
    const {
      name
    } = resp
    console.log(name)
    cache.del(`USER:${name}`).then(result => {
      console.log(result)
      if (result === 1) {
        res.send({
          status: 403,
          msg: '退出成功'
        });
      } else {
        res.send({
          status: 403,
          msg: "未登录"
        });
      }
    })
  })
});
module.exports = router;