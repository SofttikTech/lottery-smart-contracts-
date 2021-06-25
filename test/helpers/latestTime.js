const { latest } = require("@openzeppelin/test-helpers/src/time");

// Returns the time of the last mined block in seconds
const latestTime = async () => {
  return await web3.eth.getBlock('latest');
}

module.exports = latestTime