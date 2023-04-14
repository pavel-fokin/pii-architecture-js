const firebase = require("./infrastructure/firebase");
const app = require("./services/app");
const crypto = require("./services/crypto");
const pii = require("./services/pii");

function main() {
  // Create service that can encrypt/decrypt data and manage secret keys.
  const cryptoService = crypto.New();

  // Create service that stores PII.
  const piiFirebase = firebase.New();
  const piiService = pii.New(piiFirebase, cryptoService);

  // Create service for the main app.
  const appFirebase = firebase.New();
  const appService = app.New(appFirebase, piiService, cryptoService);

  // Use case.
  appService.postUser({ name: "john.doe", email: "johndoe@email.com" });
  appService.postUser({ name: "alice.white", email: "alice.white2@gmail.com" });

  console.log(appService.getUserByName("john.doe"));
  console.log(appService.getUserByEmail("alice.white2@gmail.com"));
  console.log(appService.getUserWithPII("alice.white"));

  // console.log('\nData in firebase:')
  piiFirebase.printAll();
  appFirebase.printAll();
}

if (require.main === module) {
  main();
}
