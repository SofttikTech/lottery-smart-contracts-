const { ether, wei, BN } =  require ('./helpers/ether');
const { increaseTimeTo, duration } =  require('./helpers/increaseTime');
const latestTime = require('./helpers/latestTime')

const {expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const web3 = require('web3');
const { expect, assert } = require("chai");
const BigNumber = web3.utils.BN;
const chai = require("chai");

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const UnitedWorldToken = artifacts.require('UnitedWorldToken')
const LotterySimpleRandom = artifacts.require('LotterySimpleRandom');


contract('Lottery Contract Test Cases ', function ([admin, player1, player2, player3, player4, player5, player6, player7]) {



  /*********************beforeEach will store the values in the variables and will deploy the contracts for the use in all test cases **********/
  beforeEach(async function () {

    /******************************** Token configuration ********************************/

    // Token Config
    this.decimals = 18;
    this.symbol = "UWT";
    this.name = "UnitedWorldToken";

    this.initialSupply = "50000000000";       //50 billion for testing

    // Deploying Token
    this.token = await UnitedWorldToken.new(this.initialSupply);


    // Minting UWT token to the players
    this.token.mint(player1, ether(50000000));                
    this.token.mint(player2, ether(50000000));                
    this.token.mint(player3, ether(50000000));                
    this.token.mint(player4, ether(50000000));               
    this.token.mint(player5, ether(50000000));             
    this.token.mint(player6, ether(50000000));
    this.token.mint(player7, ether(50000000));

    // this.token.mint(this.LotterySimpleRandom, ether(5000000));                 

    

    /******************************** Deploying Lottery Smart Contract ********************************/

    this.LotterySimpleRandom = await LotterySimpleRandom.new(this.token.address, {from: admin});


  
  });


  /****************************will create the lottery by admin and will pass the revert if called by non-admin *************/
  describe('Lottery Contract: Create the lottery', async function () {
    
    it('Create Lottery Test 1: it should create lottery by admin', async function() {

      this.ticketprice = 10000;
      this.totalTickets = 5;
      this.openingTime = (await latestTime()).timestamp + duration.minutes(10);
      this.closingTime = this.openingTime + duration.weeks(1);

      await this.LotterySimpleRandom.createLottery(this.ticketprice, this.totalTickets, this.openingTime, this.closingTime,  {from: admin});
      

    })


    it('Create Lottery Test 2: it should create multiple lotteries', async function() {

      const oldLotteryid = await this.LotterySimpleRandom.lotteryId.call();

      console.log('---------------------------------------------------------------------------------');
      console.log("Old Lottery ID Befor Creating Lottery:", BN(oldLotteryid));
      console.log('---------------------------------------------------------------------------------');

      this.lotteryIdsBeforeCreation = await this.LotterySimpleRandom.getLotteries();

      console.log('---------------------------------------------------------------------------------');
      console.log(`**************** Length of Lotteries before creating new = ${this.lotteryIdsBeforeCreation.length} ******************`);
      console.log('---------------------------------------------------------------------------------');

      this.ticketprice1 = 10000;
      this.totalTickets1 = 5;
      
      this.ticketprice2 = 20000;
      this.totalTickets2 =10;

      this.ticketprice3 = 30000;
      this.totalTickets3 =20;

      this.openingTime1 = (await latestTime()).timestamp + duration.minutes(10);
      this.closingTime1 = this.openingTime + duration.weeks(1);

      this.openingTime2 = (await latestTime()).timestamp + duration.minutes(10);
      this.closingTime2 = this.openingTime + duration.weeks(1);

      this.openingTime3 = (await latestTime()).timestamp + duration.minutes(10);
      this.closingTime3 = this.openingTime + duration.weeks(1);

      await this.LotterySimpleRandom.createLottery(this.ticketprice1, this.totalTickets1, this.openingTime1, this.closingTime1,  {from: admin});
      await this.LotterySimpleRandom.createLottery(this.ticketprice2, this.totalTickets2, this.openingTime2, this.closingTime2,  {from: admin});
      await this.LotterySimpleRandom.createLottery(this.ticketprice3, this.totalTickets3, this.openingTime3, this.closingTime3,  {from: admin});

      

      const createdLotteries = await this.LotterySimpleRandom.getLotteries();
      assert.isTrue(createdLotteries > this.lotteryIdsBeforeCreation);

      console.log('---------------------------------------------------------------------------------');
      console.log(`**************** Length of created Lotteries  = ${createdLotteries.length} ******************`);
      console.log('---------------------------------------------------------------------------------');

      const newLotteryId = await this.LotterySimpleRandom.lotteryId.call();
      assert.isTrue(newLotteryId > oldLotteryid )

      console.log('---------------------------------------------------------------------------------');
      console.log("New Lottery ID: ", BN(newLotteryId));
      console.log('---------------------------------------------------------------------------------');

    })


   

    it('Create Lottery Test 3: it should pass revert "only admin can call this function" ', async function() {

      this.ticketprice = 10000;
      this.totalTickets = 5;
      this.openingTime = (await latestTime()).timestamp + duration.minutes(10);
      this.closingTime = this.openingTime + duration.weeks(1);

      await expectRevert(this.LotterySimpleRandom.createLottery(this.ticketprice, this.totalTickets, this.openingTime, this.closingTime,  {from: player1}), "only admin can create lottery");

    })


     /****************************User will buy the multiple lottery tickets *************/
    describe('Lottery Contract: Buy Lottery Ticket Function', async function () {

      beforeEach(async function () {
      
      this.ticketprice1 = BN(10000);
      this.totalTickets1 = 5;
      
      this.ticketprice2 = BN(20000);
      this.totalTickets2 =7;

      this.ticketprice3 = BN(30000);
      this.totalTickets3 = 10;
      
      this.openingTime1 = (await latestTime()).timestamp + duration.minutes(10);
      this.closingTime1 = this.openingTime + duration.weeks(1);
      
      this.openingTime2 = (await latestTime()).timestamp + duration.minutes(10);
      this.closingTime2 = this.openingTime + duration.weeks(1);
      
      this.openingTime3 = (await latestTime()).timestamp + duration.minutes(10);
      this.closingTime3 = this.openingTime + duration.weeks(1);
      
      this.lotteryId1 = BN(await this.LotterySimpleRandom.lotteryId.call());
      
      await this.LotterySimpleRandom.createLottery(ether(this.ticketprice1), this.totalTickets1, this.openingTime1, this.closingTime1,  {from: admin});
      
      this.lotteryId2 = BN(await this.LotterySimpleRandom.lotteryId.call());
      await this.LotterySimpleRandom.createLottery(ether(this.ticketprice2), this.totalTickets2, this.openingTime2, this.closingTime2,  {from: admin});
      
      this.lotteryId3 = BN(await this.LotterySimpleRandom.lotteryId.call());
      await this.LotterySimpleRandom.createLottery(ether(this.ticketprice3), this.totalTickets3, this.openingTime3, this.closingTime3,  {from: admin});
      
      this.lotteryId4 = BN(await this.LotterySimpleRandom.lotteryId.call());

      this.lotteriesId1 = await this.LotterySimpleRandom.lotteries(this.lotteryId1);
      this.lotteriesId2 = await this.LotterySimpleRandom.lotteries(this.lotteryId2);
      this.lotteriesId3 = await this.LotterySimpleRandom.lotteries(this.lotteryId3);
      this.lotteriesId4 = await this.LotterySimpleRandom.lotteries(this.lotteryId4);

     
      // console.log('---------------------------------------------------------------------------------');
      // console.log(`****** Ticket Price of Lottery 1 *******`, BN(this.lotteriesId1["ticketPrice"]));
      // console.log(`****** Ticket Price of Lottery 2 *******`, BN(this.lotteriesId2["ticketPrice"]));
      // console.log(`****** Ticket Price of Lottery 3 *******`, BN(this.lotteriesId3["ticketPrice"]));
      // console.log(`****** Ticket Price of Lottery 4 (Not Created Lottery Yet) Price Should be Zero =  `, BN(this.lotteriesId4["ticketPrice"]));
      // console.log('---------------------------------------------------------------------------------');

      })


      //It should check the total amount after ticket sold, participating 
      it('Buy Ticket Test 1: it should check the participating players with the total number of tickets', async function() {


        await increaseTimeTo(this.openingTime1 + 1000);
        const openingTime = this.openingTime1;
        const currentTime = (await latestTime()).timestamp;
        assert.isTrue(currentTime > openingTime);
  
        const isLottery1Open = await this.LotterySimpleRandom.isOpen(this.lotteryId1);
        isLottery1Open.should.be.true;
  
        const isLottery1Closed = await this.LotterySimpleRandom.hasClosed(this.lotteryId1);
        isLottery1Closed.should.be.false;


        this.ticketAmount1 = BN(10000);
        this.ticketAmount2 = BN(20000);

        // this variable shows who have participated in the lottery
        const playersofLottery1BeforeBuyingTicket = await this.LotterySimpleRandom.getPlayers(this.lotteryId1);
        // console.log("Players Length before buying lottery ticket",playersofLottery1BeforeBuyingTicket.length);
        
        
        //************************************************************************************************** */
        //players approving the amount of the ticket price to the lottery smart contract for the Lottery 1
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player1});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player2});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player3});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player4});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player5});


        //user can participate only one ticket according to the total tickets
        //players are participating in lottery 1
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player1});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player2});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player3});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player4});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player5});


        //************************************************************************************************** */
        //players approving the amount of the ticket price to the lottery smart contract for the Lottery 2
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player1});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player2});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player3});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player4});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player5});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player6});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player7});


        //user can participate only one ticket according to the total tickets
        //players are participating in lottery 2
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether( this.ticketAmount2), {from: player1});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether( this.ticketAmount2), {from: player2});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether( this.ticketAmount2), {from: player3});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether(this.ticketAmount2), {from: player4});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether(this.ticketAmount2), {from: player5});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether(this.ticketAmount2), {from: player6});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether(this.ticketAmount2), {from: player7});


        const playersofLottery1AfterBuyingTicket = await this.LotterySimpleRandom.getPlayers(this.lotteryId1);
        const participatedPlayersofLottery1 = playersofLottery1AfterBuyingTicket.length;
        // console.log(`********** Participated Players of Lottery 1 ************** ${playersofLotter1AfterBuyingTicket}`);
        // console.log("Players Length of Lottery 1 After buying lottery ticket", playersofLotter1AfterBuyingTicket.length);

        const playersofLottery2AfterBuyingTicket = await this.LotterySimpleRandom.getPlayers(this.lotteryId2);
        const participatedPlayersofLottery2 = playersofLottery2AfterBuyingTicket.length;
        // console.log(`********** Participated Players of Lottery 2 ************** ${playersofLotter2AfterBuyingTicket}`);
        // console.log("Players Length of Lottery 2 After buying lottery ticket", playersofLotter2AfterBuyingTicket.length);

      
        participatedPlayersofLottery1.should.equal(this.totalTickets1);
        participatedPlayersofLottery2.should.equal(this.totalTickets2);
      

        });


    
      it('Buy Ticket Test 2: it should pass revert "only users can call this function', async function() {


      await increaseTimeTo(this.openingTime1 + 1000);
      const openingTime = this.openingTime1;
      const currentTime = (await latestTime()).timestamp;
      assert.isTrue(currentTime > openingTime);

      const isLottery1Open = await this.LotterySimpleRandom.isOpen(this.lotteryId1);
      isLottery1Open.should.be.true;


      this.ticketAmount1 = BN(100);

      await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player1});
        
      await expectRevert(this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: admin}), "only users can call function");
      

      });
    

        it('Pick Winner: it should pick winner and reset the ended lottery', async function() {
    

        /**************************creating lottery */
        await increaseTimeTo(this.openingTime1 + 1000);
        const openingTime = this.openingTime1;
        const currentTime = (await latestTime()).timestamp;
        assert.isTrue(currentTime > openingTime);
  
        const isLottery1Open = await this.LotterySimpleRandom.isOpen(this.lotteryId1);
        isLottery1Open.should.be.true;
        
  
        this.ticketAmount1 = BN(10000);
        this.ticketAmount2 = BN(20000);

        const playersofLottery1BeforeBuyingTicket = await this.LotterySimpleRandom.getPlayers(this.lotteryId1);
        // console.log("Players Length before buying lottery ticket",playersofLottery1BeforeBuyingTicket.length);
        
        
        const balanceOfPlayer1beforeLottery1 = await this.token.balanceOf(player1);
        const balanceOfPlayer2beforeLottery1 = await this.token.balanceOf(player2);
        const balanceOfPlayer3beforeLottery1 = await this.token.balanceOf(player3);
        const balanceOfPlayer4beforeLottery1 = await this.token.balanceOf(player4);
        const balanceOfPlayer5beforeLottery1 = await this.token.balanceOf(player5);
        const balanceOfPlayer6beforeLottery1 = await this.token.balanceOf(player6);
        const balanceOfPlayer7beforeLottery1 = await this.token.balanceOf(player7);
        

        console.log('---------------------------------------------------------------------------------');

        console.log("player 1 balance before lottery end",balanceOfPlayer1beforeLottery1.toString());
        console.log("player 2 balance before lottery end",balanceOfPlayer2beforeLottery1.toString());
        console.log("player 3 balance before lottery end",balanceOfPlayer3beforeLottery1.toString());
        console.log("player 4 balance before lottery end",balanceOfPlayer4beforeLottery1.toString());
        console.log("player 5 balance before lottery end",balanceOfPlayer5beforeLottery1.toString());
        console.log("player 6 balance before lottery end",balanceOfPlayer6beforeLottery1.toString());
        console.log("player 7 balance before lottery end",balanceOfPlayer7beforeLottery1.toString());

        console.log('---------------------------------------------------------------------------------');



        //************************************************************************************************** */
        //players approving the amount of the ticket price to the lottery smart contract for the Lottery 1
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player1});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player2});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player3});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player4});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount1), {from: player5});


        //user can participate only one ticket according to the total tickets
        //players are participating in lottery 1
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player1});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player2});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player3});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player4});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId1, ether( this.ticketAmount1), {from: player5});

      
        const balanceofcontractBeforeLottery1 = await this.token.balanceOf(this.LotterySimpleRandom.address);

        console.log('---------------------------------------------------------------------------------');
        console.log("balance of contract before lottery 1 end", balanceofcontractBeforeLottery1.toString());
        console.log('---------------------------------------------------------------------------------');


        const balanceOfAdminBeforeLottery1 = await this.token.balanceOf(admin);

        console.log('---------------------------------------------------------------------------------');
        console.log("balance of admin before lottery 1 end", balanceOfAdminBeforeLottery1.toString());
        console.log('---------------------------------------------------------------------------------');
        

        const participatedPlayersofLottery1AfterBuyTicket = await this.LotterySimpleRandom.getPlayers(this.lotteryId1);

        console.log('---------------------------------------------------------------------------------');
        console.log("Players Paricipated buying lottery 1 ticket = ",participatedPlayersofLottery1AfterBuyTicket.length);
        console.log('---------------------------------------------------------------------------------');
        
        
        const balanceOfPlayer1afterLottery1 = await this.token.balanceOf(player1);
        const balanceOfPlayer2afterLottery1 = await this.token.balanceOf(player2);
        const balanceOfPlayer3afterLottery1 = await this.token.balanceOf(player3);
        const balanceOfPlayer4afterLottery1 = await this.token.balanceOf(player4);
        const balanceOfPlayer5afterLottery1= await this.token.balanceOf(player5);
        const balanceOfPlayer6afterLottery1= await this.token.balanceOf(player6);
        const balanceOfPlayer7afterLottery1= await this.token.balanceOf(player7);
        

        //checking that who have pariticpated in the lottery
        console.log("player 1 balance after lottery 1 end",balanceOfPlayer1afterLottery1.toString());
        console.log("player 2 balance after lottery 1 end",balanceOfPlayer2afterLottery1.toString());
        console.log("player 3 balance after lottery 1 end",balanceOfPlayer3afterLottery1.toString());
        console.log("player 4 balance after lottery 1 end",balanceOfPlayer4afterLottery1.toString());
        console.log("player 5 balance after lottery 1 end",balanceOfPlayer5afterLottery1.toString());
        console.log("player 6 balance after lottery 1 end",balanceOfPlayer6afterLottery1.toString());
        console.log("player 7 balance after lottery 1 end",balanceOfPlayer7afterLottery1.toString());



        //************************************************************************************************** */
        //players approving the amount of the ticket price to the lottery smart contract for the Lottery 2
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player1});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player2});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player3});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player4});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player5});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player6});
        await this.token.approve(this.LotterySimpleRandom.address, ether(this.ticketAmount2), {from: player7});


        //user can participate only one ticket according to the total tickets
        //players are participating in lottery 2
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether( this.ticketAmount2), {from: player1});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether( this.ticketAmount2), {from: player2});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether( this.ticketAmount2), {from: player3});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether(this.ticketAmount2), {from: player4});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether(this.ticketAmount2), {from: player5});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether(this.ticketAmount2), {from: player6});
        await this.LotterySimpleRandom.buyTicket(this.lotteryId2, ether(this.ticketAmount2), {from: player7});


        
        const participatedPlayersofLottery2AfterBuyTicket = await this.LotterySimpleRandom.getPlayers(this.lotteryId2);
        console.log('---------------------------------------------------------------------------------');
        console.log("Players Paricipated buying lottery 2 ticket = ",participatedPlayersofLottery2AfterBuyTicket.length);
        console.log('---------------------------------------------------------------------------------');
        
        
        
        const playersofLotter1AfterBuyingTicket = await this.LotterySimpleRandom.getPlayers(this.lotteryId1);
        const participatedPlayersofLottery1 = playersofLotter1AfterBuyingTicket.length;
        // console.log(`********** Participated Players of Lottery 1 ************** ${playersofLotter1AfterBuyingTicket}`);
        // console.log("Players Length of Lottery 1 After buying lottery ticket", playersofLotter1AfterBuyingTicket.length);

        const playersofLotter2AfterBuyingTicket = await this.LotterySimpleRandom.getPlayers(this.lotteryId2);
        const participatedPlayersofLottery2 = playersofLotter2AfterBuyingTicket.length;
        // console.log(`********** Participated Players of Lottery 2 ************** ${playersofLotter2AfterBuyingTicket}`);
        // console.log("Players Length of Lottery 2 After buying lottery ticket", playersofLotter2AfterBuyingTicket.length);

      
        participatedPlayersofLottery1.should.equal(this.totalTickets1);
        participatedPlayersofLottery2.should.equal(this.totalTickets2);
        
        

        /****************************************pick winner testing */

        await increaseTimeTo(this.closingTime1 + 1000);

        const isLottery1Closed = await this.LotterySimpleRandom.hasClosed(this.lotteryId1);
        isLottery1Closed.should.be.true;

        await this.LotterySimpleRandom.pickWinnerandresetLottery(this.lotteryId1, {from: admin});

  

        console.log('---------------------------------------------------------------------------------');
        const balanceofcontractAfterLottery1 = await this.token.balanceOf(this.LotterySimpleRandom.address);
        console.log('---------------------------------------------------------------------------------');

        console.log("balance of contract after ending lottery1 is", balanceofcontractAfterLottery1.toString());
        console.log('---------------------------------------------------------------------------------');
        
        const balanceOfAdminAfterLottery1 = await this.token.balanceOf(admin);
        console.log('---------------------------------------------------------------------------------');
        console.log("balance of admin after ending lottery1 is  ", balanceOfAdminAfterLottery1.toString());
        console.log('---------------------------------------------------------------------------------');        

        const winnerofLottery1AfterLotterEnded = await this.LotterySimpleRandom.getWinner(this.lotteryId1);
        console.log('---------------------------------------------------------------------------------');
        console.log("---------Address of Lottery 1 Winner => ----------", winnerofLottery1AfterLotterEnded);
        console.log('---------------------------------------------------------------------------------');
        
        
        // testing of lottery 2
        await increaseTimeTo(this.closingTime2 + 2000);

        const isLottery2Closed = await this.LotterySimpleRandom.hasClosed(this.lotteryId2);
        isLottery2Closed.should.be.true;

        await this.LotterySimpleRandom.pickWinnerandresetLottery(this.lotteryId2, {from: admin});

        console.log('---------------------------------------------------------------------------------');
        const balanceofcontractAfterLottery2 = await this.token.balanceOf(this.LotterySimpleRandom.address);
        console.log("balance of contract after ending lottery2 is", balanceofcontractAfterLottery2.toString());

        console.log('---------------------------------------------------------------------------------');
        const balanceOfAdminAfterLottery2 = await this.token.balanceOf(admin);
        console.log('---------------------------------------------------------------------------------');
        console.log("balance of admin after ending lottery2 is", balanceOfAdminAfterLottery2.toString());
        console.log('---------------------------------------------------------------------------------');        

        
        const winnerofLottery2AfterLotterEnded = await this.LotterySimpleRandom.getWinner(this.lotteryId2);

        console.log('---------------------------------------------------------------------------------');
        console.log("---------Address of Lottery 2 Winner => ----------", winnerofLottery2AfterLotterEnded);
        console.log('---------------------------------------------------------------------------------');

        const balanceofWinner1 = await this.token.balanceOf(winnerofLottery1AfterLotterEnded);
        const balanceofWinner2 = await this.token.balanceOf(winnerofLottery2AfterLotterEnded); 


        console.log("Balance of Lottery 1 Winner => ", balanceofWinner1.toString());
        console.log("Balance of Lottery 2 Winner =>", balanceofWinner2.toString()); 

        }) 
    });
  });  
});
