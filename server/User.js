const sequelize = require('sequelize');
const db = require('../db');
const random = require('../utils/random');

// 定义一个 user model
const {
  STRING
} = sequelize;
//0是普通会员 1是管理员
const User = db.define('user', {
  user_name: {
    type: STRING(32),
    unique: true,
  },
  password: {
    type: STRING(32),
    defaultValue: "123456"
  },
  auth: {
    type: STRING(32),
    defaultValue: "0"
  }
});
const createTable = async () => {
  // 可以选择在 应用/服务器 启动的时候，把 User 映射到数据库中，比如这里会在数据库中自动创建一张表: users
  // 如果 force 为 true, 则每次都会重建表 users
  await User.sync({
    force: false,
  }).then(r => {
    console.log("xcq9", r)
    User.findAll().then(a => {
      console.log(a)
      if (!a.length) {
        User.create({
          user_name: 'admin',
          password: '123'
        }).then(res => {
          console.log('默认用户admin生成成功！')
        })
      }
    })
  });
}
//调用该函数,数据库有 表就会映射，没有则创建
createTable()
User.find({}, (err, doc) => {
  if (err) {
    console.log(err)
  } else {
    if (!doc.length) {
      users.create({
        user_name: 'admin',
        password: '123'
      }).then(res => {
        console.log('默认用户admin生成成功！')
      })
    } else {
      console.log("Userinit has done")
    }
  }
})
module.exports = User;