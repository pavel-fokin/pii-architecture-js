const crypto = require("crypto");
const secrets = require("../lib/secrets");

const env = {
  // In prod we need to think about how to rotate this key.
  CRYPTO_KEY: Buffer.from(crypto.randomBytes(32)).toString("hex"),
};

exports.New = () => {
  return {
    encrypt(data) {
      return secrets.encrypt(env.CRYPTO_KEY, data);
    },
    decrypt(data) {
      return secrets.decrypt(env.CRYPTO_KEY, data);
    },
  };
};
