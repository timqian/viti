// https://gist.github.com/chris-rock/6cac4e422f29c28c9d88
// https://cnodejs.org/topic/504061d7fef591855112bab5

const crypto = require('crypto');
const algorithm = 'aes-128-cfb';

module.exports.encrypt = function encrypt(buffer, password) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return crypted;
}

module.exports.decrypt = function decrypt(buffer, password) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return dec;
}
