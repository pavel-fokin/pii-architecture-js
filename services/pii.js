const crypto = require("crypto");

const secrets = require("../lib/secrets");
const utils = require("../lib/utils");


const env = {
  HASH_NONCE: Buffer.from(crypto.randomBytes(16)).toString("hex"),
};

exports.New = (firebase, cryptoService) => {
  return {
    db: firebase,
    cryptoService: cryptoService,

    savePII(id, field, value) {
      dek = secrets.generateDEK();
      encryptedDEK = this.cryptoService.encrypt(dek);

      data = {}
      data.id = secrets.hash(env.HASH_NONCE, id);
      data[field] = secrets.encrypt(dek, value);
      data[`${field}DEK`] = encryptedDEK;

      this.db.insert("pii", data);
    },
    getPII(id, field) {
      // We intentionally slowdown this method.
      utils.sleep(1);

      data = this.db.findOne("pii", "id", secrets.hash(env.HASH_NONCE, id));
      decryptedDEK = this.cryptoService.decrypt(data[`${field}DEK`]);
      decryptedField = secrets.decrypt(decryptedDEK, data[field]);
      return decryptedField;
    },
  };
};
