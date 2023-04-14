const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const NONCE_SIZE = 16;

exports.encrypt = (key, data) => {
  key = Buffer.from(key, "hex");
  const iv = crypto.randomBytes(NONCE_SIZE);

  let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return Buffer.concat([iv, encrypted]).toString("hex");
};

exports.decrypt = (key, data) => {
  data = Buffer.from(data, "hex");
  const iv = data.subarray(0, NONCE_SIZE);
  const encryptedText = data.subarray(NONCE_SIZE);

  let decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

exports.hash = (nonce, data) => {
  nonce = Buffer.from(nonce, "hex");
  data = Buffer.from(data);

  dataWithNonce = Buffer.concat([nonce, data]);
  return crypto.Hash("sha256").update(dataWithNonce).digest("hex");
};

exports.generateDEK = () => {
  return Buffer.from(crypto.randomBytes(32)).toString("hex");
};
