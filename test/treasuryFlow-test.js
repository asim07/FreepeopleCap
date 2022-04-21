const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Treasury", async () => {
  let Token;
  let Dai;
  let signer1;
  let signer2;
  let signer3;
  let signer4;
  let signer5;
  let signer6;
  let signer7;
  let signer8;
  let addresses;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("Treasury");
    [signer1, signer2, signer3, signer4, signer5, signer6, signer7, signer8] =
      await ethers.getSigners();
    addresses = [
      signer1.address,
      signer2.address,
      signer3.address,
      signer4.address,
      signer5.address,
      signer6.address,
      signer7.address,
    ];

    Dai = await ethers.getContractFactory("Dai");
    Dai = await Dai.deploy();
    await Dai.deployed();
    Token = await Token.deploy(addresses, Dai.address);
    await Token.deployed();
  });
  describe("Flows", function () {
    //test1
    it("Signer should withdraw funds after approval", async function () {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await Token.connect(signer2).AllocationVote(parseInt(value));
      await Token.connect(signer3).AllocationVote(parseInt(value));
      await Token.connect(signer4).AllocationVote(parseInt(value));
      await Token.connect(signer5).AllocationVote(parseInt(value));
      await Token.connect(signer6).AllocationVote(parseInt(value));
      await Token.connect(signer1).withdrawFunds(signer1.address, 10000);

      expect(await Dai.connect(signer1).balanceOf(signer1.address)).to.equal(
        10000
      );
    });

    //test2
    it("Signer cant withdraw funds again", async function () {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await Token.connect(signer2).AllocationVote(parseInt(value));
      await Token.connect(signer3).AllocationVote(parseInt(value));
      await Token.connect(signer4).AllocationVote(parseInt(value));
      await Token.connect(signer5).AllocationVote(parseInt(value));
      await Token.connect(signer6).AllocationVote(parseInt(value));
      await Token.connect(signer1).withdrawFunds(signer1.address, 10000);

   await expect(
         Token.connect(signer1).withdrawFunds(signer1.address, 10000)
      ).to.be.revertedWith("No funds..");
    });
    //test3

    it("signer cant deny vote after the rejection of appeal", async function () {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await Token.connect(signer2).denyVote(parseInt(value));
      await Token.connect(signer3).denyVote(parseInt(value));
      await Token.connect(signer4).denyVote(parseInt(value));
      // await Token.connect(signer5).denyVote(parseInt(value));

      await expect(
        Token.connect(signer5).denyVote(parseInt(value))
      ).to.be.revertedWith("Appeal finished");
    });

    //test 4
    it("2 appeals cant be in progress on each time", async function () {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await Token.connect(signer2).denyVote(parseInt(value));
      await Token.connect(signer3).denyVote(parseInt(value));
      await Token.connect(signer4).denyVote(parseInt(value));
      await expect(
        Token.connect(signer5).denyVote(parseInt(value))
      ).to.be.revertedWith("Appeal finished");
    });

    //test 5
    it("Multiple signers applying for the appeals", async function () {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for usecase");
      await Token.connect(signer2).appealforFund(
        10000,
        "Appying for usecase 2"
      );
      await Token.connect(signer3).appealforFund(
        10000,
        "Applying for usecase 3"
      );
      await Token.connect(signer4).appealforFund(
        10000,
        "Applying for usecase 4"
      );
      await Token.connect(signer5).appealforFund(
        10000,
        "Applying for usecase 5"
      );
      await Token.connect(signer6).appealforFund(
        10000,
        "Applying for usecase 6"
      );
      await Token.connect(signer7).appealforFund(
        10000,
        "Applying for usecase 7"
      );
    });
    //test 4
    it("multiple signers can withdraw funds after the approval", async function () {
      await Dai.connect(signer1).mint(Token.address, 200);
      await Token.connect(signer1).appealforFund(100, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await Token.connect(signer2).AllocationVote(parseInt(value));
      await Token.connect(signer3).AllocationVote(parseInt(value));
      await Token.connect(signer4).AllocationVote(parseInt(value));
      await Token.connect(signer5).AllocationVote(parseInt(value));
      await Token.connect(signer6).AllocationVote(parseInt(value));
      await Token.connect(signer1).withdrawFunds(signer1.address, 100);
    
      await Token.connect(signer2).appealforFund(100, "second Appeal");

      value = await Token.userActiveAppeal(signer2.address);
      value = value.toString();
      await Token.connect(signer1).AllocationVote(parseInt(value));
      await Token.connect(signer3).AllocationVote(parseInt(value));
      await Token.connect(signer4).AllocationVote(parseInt(value));
      await Token.connect(signer5).AllocationVote(parseInt(value));
      await Token.connect(signer6).AllocationVote(parseInt(value));

      await Token.connect(signer2).withdrawFunds(signer2.address, 100);
      expect(await Dai.balanceOf(signer2.address)).to.equal(100);

      // await expect(
      //   Token.connect(signer5).denyVote(parseInt(value))
      // ).to.be.revertedWith("Appeal finished");
    });
  });
});
