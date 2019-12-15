const jwt = require('jsonwebtoken')

class Token {
  constructor(secretKey) {
    this.token = ''
    this.decoded = {}
    this.secretKey = Buffer.from(secretKey, 'base64')
  }

  sign(payload, expireTime) {
    const expireData = { expiresIn: expireTime }
    const token = jwt.sign(payload, this.secretKey, expireData)
    this.token = token
    return token
  }

  verify(token) {
    let isVerified = false

    jwt.verify(token, this.secretKey, (err, decoded) => {
      if (!err) {
        isVerified = true
        this.decoded = decoded
      }
    })

    return isVerified
  }
}

module.exports = Token;
