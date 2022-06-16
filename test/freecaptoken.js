// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const Web3 = require("web3");

// describe("Treasury", async () => {
//   let Token;
//   let signer1;
//   let signer2;
//   let signer3;
//   let signer4;
//   let signer5;
//   let signer6;
//   let signer7;
//   let signer8;
//   let addresses;

//   beforeEach(async () => {
//     Token = await ethers.getContractFactory("freecapv21");
//     [signer1, signer2, signer3, signer4, signer5, signer6, signer7, signer8] =
//       await ethers.getSigners();
//     addresses = [
//       signer2.address,
//       signer3.address,
//       signer4.address,
//       signer5.address,
//       signer6.address,
//     ];

//     Token = await Token.deploy("freecap","fpc","10000000000000000",addresses,[25,25,25,25,25,25,25,25]);
//     await Token.deployed();
//   });

//   describe("TAX", async () => {
//     //test 1
//     it("should set the signers correctly", async () => {
//       await Token.connect(signer1).transfer(signer7.address,"1000");
//       await Token.connect(signer7).transfer(signer8.address,"100");
//       let reciever = await Token.connect(signer1).balanceOf(signer8.address)
//       let devtax = await Token.connect(signer1).balanceOf(signer2.address)
//       let martax = await Token.connect(signer1).balanceOf(signer3.address)
//       console.log("reciever : ",reciever);
//       console.log("devtax : ",devtax);
//       console.log("martax : ",martax);
//     //   console.log( await Token.connect(signer1).balanceOf(signer1.address)
      

//     });
//   });
// });