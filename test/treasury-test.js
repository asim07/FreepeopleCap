const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Treasury", () => {
  let Token;
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
    Token = await Token.deploy(addresses);
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
      await expect(
        Token.connect(signer8).appealforFund(10000, "Applying for funds")
      ).to.be.revertedWith("caller is not signer");
    });

    //test3
    it("signer cant Appeal for funds more than 1 at once", async () => {
      Token.connect(signer1).appealforFund(10000, "Applying for funds");
      await expect(
        Token.connect(signer1).appealforFund(10000, "Applying for funds")
      ).to.be.revertedWith("Appeal already In progress");
    });

    //test4
    it("Signer cant vote its own compain", async () => {
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.UserAppeals(signer1.address);
      value = value.toString();
      await expect(
        Token.connect(signer1).AllocationVote(parseInt(value))
      ).to.be.revertedWith("cant vote yourself");
    });

    //test5
    it("Signer can only approve or reject Appeal once", async () => {
      await Token.connect(signer1).appealforFund(10000, "Applying for funds");
      let value = await Token.UserAppeals(signer1.address);
      value = value.toString();
      await Token.connect(signer2).AllocationVote(parseInt(value));
      await expect(
        Token.connect(signer2).AllocationVote(parseInt(value))
      ).to.be.revertedWith("Vote is Already Casted");
    });

//test6
it("cant vote on finished Appeal", async () => {
  await Token.connect(signer1).appealforFund(10000, "Applying for funds");
  let value = await Token.UserAppeals(signer1.address);
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



  });
});
// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });
