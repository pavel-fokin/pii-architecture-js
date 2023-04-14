const { execSync } = require("child_process");

exports.sleep = (seconds) => {
    execSync(`sleep ${seconds}`)
}