
const UnitedWorldToken = artifacts.require('./UnitedWorldToken.sol');

module.exports = async function (deployer, network, accounts) {

  /* United World Token */
  const _decimals = 18;
  const _symbol = 'UWT';
  const _name = 'United World Token';
  const _admin = (await web3.eth.getAccounts())[0];                          // TODO: Replace me
  // const _admin = "0x247CC4C40b7F539b2Adda2149b92Ae056c316A83";

  const _totalSupply = '1000';

  await deployer.deploy(UnitedWorldToken, _totalSupply);

  const deployedUWTToken = await UnitedWorldToken.deployed(UnitedWorldToken, _totalSupply);


  console.log('---------------------------------------------------------------------------------');

  console.log('***************************United World Token Address = ', deployedUWTToken.address);

  console.log('---------------------------------------------------------------------------------');


};

