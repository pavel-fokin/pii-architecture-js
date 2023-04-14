const crypto = require("crypto");

const secrets = require("../lib/secrets");
const utils = require("../lib/utils");

const env = {
  HASH_NONCE: Buffer.from(crypto.randomBytes(16)).toString("hex"),
};

exports.New = (firebase, piiService, cryptoService) => {
  return {
    firebase: firebase,
    // Option 1.
    // cryptoService: cryptoService,

    piiService: piiService,

    postUser(user) {
      // Option 1. Generate DEK and try to encrypt it.
      // dek = secrets.generateDEK();
      // encryptedDEK = cryptoService.encrypt(dek);

      const userID = crypto.randomUUID();
      this.piiService.savePII(userID, "email", user.email);

      this.firebase.insert("users", {
        id: userID,
        name: user.name,
        // Emails.
        emailHashed: secrets.hash(env.HASH_NONCE, user.email),
        emailMasked: maskEmail(user.email),

        // Option 1.
        // Encrypt email with not encrypted DEK.
        // emailEncrypted: secrets.encrypt(dek, user.email),
        // Store encrypted DEK.
        // emailDEK: encryptedDEK,

        // Probably better to store in one object.
        // email: {
        //   hashed: secrets.hash(env.HASH_NONCE, user.email),
        //   masked: maskEmail(user.email),
        // }
      });
    },

    getUserByName(userName) {
      const user = this.firebase.findAll("users", "name", userName)[0];
      return { name: user.name, email: user.emailMasked };
    },

    getUserByEmail(userEmail) {
      const user = this.firebase.findAll(
        "users",
        "emailHashed",
        secrets.hash(env.HASH_NONCE, userEmail)
      )[0];
      return { name: user.name, email: user.emailMasked };
    },

    getUserWithPII(userName) {
      // We intentionally slowdown this method.
      utils.sleep(1);

      const user = this.firebase.findAll("users", "name", userName)[0];
      const decryptedEmail = this.piiService.getPII(user.id, "email");

      // Option 1.
      // Decrypt DEK and then decrypt email.
      // decryptedDEK = this.cryptoService.decrypt(user.emailDEK);
      // decryptedEmail = secrets.decrypt(decryptedDEK, user.emailEncrypted);

      return { name: user.name, email: decryptedEmail };
    },
  };
};

// Generated with ChatGPT ¯\_(ツ)_/¯.
function maskEmail(email) {
  const emailSplit = email.split("@");
  if (emailSplit.length !== 2) {
    throw new Error("Invalid email format");
  }

  const localPart = emailSplit[0];
  const domainPart = emailSplit[1];

  const maskedLocalPart =
    localPart.length > 2
      ? localPart.charAt(0) +
        "*".repeat(localPart.length - 2) +
        localPart.charAt(localPart.length - 1)
      : "*".repeat(localPart.length);

  const domainSplit = domainPart.split(".");
  const maskedDomainPart =
    domainSplit.length > 1
      ? domainSplit[0] + "." + "*".repeat(domainSplit[1].length)
      : domainPart;

  return maskedLocalPart + "@" + maskedDomainPart;
}
