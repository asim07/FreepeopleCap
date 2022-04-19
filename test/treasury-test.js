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

  describe("security checks", () => {
    //test 1
    it("should set the signers correctly", async () => {
      for (i = 0; i < addresses.length; i++) {
        if (i > 6) {
          expect(await Token.isSigner(addresses[i])).to.equal(false);
        } else {
          expect(await Token.isSigner(addresses[i])).to.equal(true);
        }
      }
    });

    //test2
    it("only signer can apply for funds", async () => {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await expect(
        Token.connect(signer8).appealforFund(10000, "Applying for funds")
      ).to.be.revertedWith("caller is not signer");
    });

    //test3
    it("signer cant Appeal for funds more than 1 at once", async () => {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      Token.connect(signer1).appealforFund(10000, "Applying for funds");
      await expect(
        Token.connect(signer1).appealforFund(10000, "Applying for funds")
      ).to.be.revertedWith("Appeal already In progress");
    });

    //test4
    it("Signer cant vote its own compain", async () => {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await expect(
        Token.connect(signer1).AllocationVote(parseInt(value))
      ).to.be.revertedWith("cant vote yourself");
    });

    //test5
    it("Signer can only approve or reject Appeal once", async () => {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await Token.connect(signer2).AllocationVote(parseInt(value));
      await expect(
        Token.connect(signer2).AllocationVote(parseInt(value))
      ).to.be.revertedWith("Vote is Already Casted");
    });

    //test6
    it("cant vote on finished Appeal", async () => {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await Token.connect(signer2).AllocationVote(parseInt(value));
      await Token.connect(signer3).AllocationVote(parseInt(value));
      await Token.connect(signer4).AllocationVote(parseInt(value));
      await Token.connect(signer5).AllocationVote(parseInt(value));
      await Token.connect(signer6).AllocationVote(parseInt(value));
      await expect(
        Token.connect(signer7).denyVote(parseInt(value))
      ).to.be.revertedWith("Appeal finished");
    });

    //test7
    it("only appealer can withdraw  funds, After approval", async () => {
      await Dai.connect(signer1).mint(Token.address, 1000000);
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.userActiveAppeal(signer1.address);
      value = value.toString();
      await Token.connect(signer2).AllocationVote(parseInt(value));
      await Token.connect(signer3).AllocationVote(parseInt(value));
      await Token.connect(signer4).AllocationVote(parseInt(value));
      await Token.connect(signer5).AllocationVote(parseInt(value));
      await Token.connect(signer6).AllocationVote(parseInt(value));
      await expect(
        Token.connect(signer7).withdrawFunds(signer1.address)
      ).to.be.revertedWith("No funds");
    });

    //test8
    it("requested amount should be available", async () => {
      await Dai.connect(signer1).mint(Token.address, 1000000);

      await expect(
        Token.connect(signer1).appealforFund(100000000000, "Applying for funds")
      ).to.be.revertedWith("no funds");
    });
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
      await Token.connect(signer1).withdrawFunds(signer1.address);
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
      await Token.connect(signer1).withdrawFunds(signer1.address);
      await expect(
        Token.connect(signer1).withdrawFunds(signer1.address)
      ).to.be.revertedWith("No funds");
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
      // await Token.connect(signer5).denyVote(parseInt(value));

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
      console.log("user 1 appeal num : ",value);

      value = value.toString();
      await Token.connect(signer2).AllocationVote(parseInt(value));
      await Token.connect(signer3).AllocationVote(parseInt(value));
      await Token.connect(signer4).AllocationVote(parseInt(value));
      await Token.connect(signer5).AllocationVote(parseInt(value));
      await Token.connect(signer6).AllocationVote(parseInt(value));
      await Token.connect(signer1).withdrawFunds(signer1.address);

      // expect(await Dai.balanceOf(signer1.address)).to.equal(100);

     await Token.connect(signer2).appealforFund(100,"second Appeal");
      value =  await Token.userActiveAppeal(signer2.address);
      console.log("user 2 appeal num : ",value);
      value = value.toString();
      await Token.connect(signer1).AllocationVote(parseInt(value));
      await Token.connect(signer3).AllocationVote(parseInt(value));
      await Token.connect(signer4).AllocationVote(parseInt(value));
      await Token.connect(signer5).AllocationVote(parseInt(value));
      await Token.connect(signer6).AllocationVote(parseInt(value));

      // await Token.connect(signer2).withdrawFunds(signer2.address);
       balance = await Token.allocatedFund(signer2.address);
      console.log(balance);
      await Token.connect(signer2).withdrawFunds(signer2.address);
      expect(await Dai.balanceOf(signer2.address)).to.equal(100);


      // await expect(
      //   Token.connect(signer5).denyVote(parseInt(value))
      // ).to.be.revertedWith("Appeal finished");
    });
  });
});
