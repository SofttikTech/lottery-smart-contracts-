const UnitedWorldToken = artifacts.require('./UnitedWorldToken.sol');
const LotterySimpleRandom = artifacts.require('./LotterySimpleRandom.sol');

module.exports = async function (deployer, network, accounts) {


  /* Stable Coin */ 
  const _decimalsStable = 18;
  const _symbolStable = 'UWT';
  const _nameStable = 'UnitedWorldToken';
  const _totalSupply = '1000';
  
  await deployer.deploy(UnitedWorldToken, _totalSupply); //constructor arguments of lottery smart contract

  const deployedUWTToken = await UnitedWorldToken.deployed(UnitedWorldToken, _totalSupply);

  // deployedUWTToken.mint('0xbA2e20B08bb1efF117785A5738D5019E34a8b159', ether("1000"));              // Mint Investor1 almost 1 Million USDT tokens so he can invest in ICO



  // const _stable = '0x55d398326f99059ff775485246999027b3197955';                                     // This is USDT Mainnet BSC Wallet
  const _wallet = accounts[0]; // TODO: Replace me                                                  // TODO: This wallet will receive USDT Invested

  // const _openingTime = (await web3.eth.getBlock('latest')).timestamp + duration.days(15);         // 15 Days to Start ICO
  // const _openingTime = (await web3.eth.getBlock('latest')).timestamp + duration.minutes(5);         // 15 Days to Start ICO
  // // const _closingTime = _openingTime + duration.weeks(2);                                          // 60 Days ICO Duration
  // const _closingTime = _openingTime + duration.minutes(20);                                          // 60 Days ICO Duration
  // const _releaseTime = _closingTime + duration.months(3);                                         // 3 Months Tokens Timelock

  // const _cap = ether('1000000');                                           // Maximum amount of 1Million USDT we want to raise
  // const _goal = ether('100000');                                          // Min goal 0.1Million USDT we want to raise

  // const _rate = ether("1");                                                // Per Token Price is 1 USDT
  const _totalTickets = "1000";
  const _minTicketsPlayerBuy = "1"


  await deployer.deploy(
    LotterySimpleRandom,
    deployedUWTToken.address
    // token addresss,
    );

  const  deployedLottery = await LotterySimpleRandom.deployed(LotterySimpleRandom);


  console.log('---------------------------------------------------------------------------------');

  // console.log('***************************Deployed UWT Token Address = ', deployedUWTToken.address);
  console.log('***************************Lottery Address = ', LotterySimpleRandom.address);

  console.log('---------------------------------------------------------------------------------');

  return true;
};



// const ether = (n) => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));

// const duration = {
//   seconds: function (val) { return val; },
//   minutes: function (val) { return val * this.seconds(60); },
//   hours: function (val) { return val * this.minutes(60); },
//   days: function (val) { return val * this.hours(24); },
//   weeks: function (val) { return val * this.days(7); },
//   months: function (val) { return val * this.days(30); },
//   years: function (val) { return val * this.days(365); },
// };