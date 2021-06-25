// const { accounts, contract } = require("@openzeppelin/test-environment");
const {
  BN,
  time,
  expectEvent,
  expectRevert, latest, increaseTo, duration
} = require("@openzeppelin/test-helpers");

const web3 = require("web3");
const { expect, assert } = require("chai");
const BigNumber = web3.utils.BN;
const chai = require("chai");


require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();


const UnitedWorldToken = artifacts.require("UnitedWorldToken");

contract('Token Contract Test Cases', function ([admin, player1, player2, player3, player4, players5]) {

  beforeEach(async function () {
    /******************************** Token configuration ********************************/

    // Token Config
    this.decimals = 18;
    this.symbol = "UWT";
    this.name = "UnitedWorldToken";
    this.initialSupply = "100000";       // 100K


    // Deploying Token
    this.token = await UnitedWorldToken.new(this.initialSupply, {from: admin });

  });

  // testing the parameters of the token smart contract
  describe('Token Parameteres Check', function () {
    it('it should check the symbol', async function () {
      const symbol = await this.token.symbol();
      symbol.toString().should.be.equal(this.symbol.toString());
    });

    it('it should check the name', async function () {
      const name = await this.token.name();
      name.toString().should.be.equal(this.name.toString());
    });

    it('it should check the decimals', async function () {
      const decimals = await this.token.decimals();
      decimals.toString().should.be.equal(this.decimals.toString());
    });

    it('it should check the total supply of token', async function () {
      const totalSupply = await this.token.totalSupply();
      totalSupply.toString().should.be.equal(this.initialSupply.toString());
    })
  });


});