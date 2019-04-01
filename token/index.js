const jwt = require('jsonwebtoken')
// 密钥
const secret = 'ILOVEXCQ'

const forToken = {
  setToken(option) {
    return new Promise((resolve, reject) => {
      // Token 数据
      const payload = {
        name: option.name,
        password: option.password,
        admin: option.admin
      }
      // 签发 Token
      const token = jwt.sign(payload, secret, {
        expiresIn: '1day'
      })
      resolve(token)
    })
  },
  //解析token
  getToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          reject(error.message)
        }
        resolve(decoded)
      })
    })
  }
}
module.exports = forToken