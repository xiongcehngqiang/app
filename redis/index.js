var redis = require("redis"),
  client = redis.createClient();

const cache = {
  set(stu, name, obj, time) {
    let that = this
    //stu类似表名字 name类似一条数据 obj是要存入的数据
    return new Promise((reslove, reject) => {
      //写入JavaScript(JSON)对象
      client.hmset(`${stu}:${name}`, obj, function (err, val) {
        if (val == 'OK') {
          var myDate = new Date();
          that.setExpress(`${stu}:${name}`, time || 100000)
          reslove('redis存入成功')
        }
      })
    })
  },
  getVal(key) {
    //获取key 值
    return new Promise((reslove, reject) => {
      client.hgetall(key, function (err, val) {
        console.log(val)
        reslove(val)
      })
    })
  },
  getKey(stu) {
    return new Promise((reslove, reject) => {
      //读取JavaScript(JSON)对象
      client.keys(`${stu}:*`, function (err, val) {
        console.log(val)
        reslove(err, val)
      })
    })
  },
  setExpress(stu, time) {
    client.expire(stu, time)
    let now = require('moment')
    let duiTimer = now().add(time, 's').format("dddd, MMMM Do YYYY, h:mm:ss a");
    console.log('过期时间：' + duiTimer)
  },
  //删除 key
  del(stu) {
    return new Promise((reslove, reject) => {
      client.del(stu, function (err, val) {
        console.log('xcq', val)
        reslove(val)
      })
    })
  }
}
module.exports = cache