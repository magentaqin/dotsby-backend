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
    try {
      const decoded = jwt.verify(token, this.secretKey);
      this.decoded = decoded;
      isVerified = true;
    } catch (err) {
      isVerified = false;
    }
    return isVerified
  }
}

module.exports = Token;
