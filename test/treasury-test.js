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

  beforeEach(async () => {
   
  });

  describe("security checks", async() => {
    Token = await ethers.getContractFactory("Treasury");
    [signer1, signer2, signer3, signer4, signer5, signer6, signer7, signer8] =
      await ethers.getSigners();
    const addresses = [
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
    //test 1
    it("should set the signers correctly", async () => {
      expect(await Token.isSigner(signer1.address)).to.equal(true);
      expect(await Token.isSigner(signer2.address)).to.equal(true);
      expect(await Token.isSigner(signer3.address)).to.equal(true);
      expect(await Token.isSigner(signer4.address)).to.equal(true);
      expect(await Token.isSigner(signer5.address)).to.equal(true);
      expect(await Token.isSigner(signer6.address)).to.equal(true);
      expect(await Token.isSigner(signer7.address)).to.equal(true);
      expect(await Token.isSigner(signer8.address)).to.equal(false);
    });

    //test2
    it("only signer can apply for funds", async () => {
     await expect( Token.connect(signer8).appealforFund(10000,"Applying for funds")).to.be.revertedWith("caller is not signer");
    })
    //test3
    it("signer cant Appeal for funds more than 1 at once", async () => {
      await expect( Token.connect(signer8).appealforFund(10000,"Applying for funds")).to.be.revertedWith("");
     })
    //test4

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
