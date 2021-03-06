// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // When running the script with `npx hardhat run <script>` you'll find the Hardhat
// // Runtime Environment's members available in the global scope.
// const hre = require("hardhat");

// async function main() {
//   // Hardhat always runs the compile task when running scripts with its command
//   // line interface.
//   //
//   // If this script is run directly using `node` you may want to call compile
//   // manually to make sure everything is compiled
//   // await hre.run('compile');

//   // We get the contract to deploy
//   // const Greeter = await hre.ethers.getContractFactory("Greeter");
//   // const greeter = await Greeter.deploy("Hello, Hardhat!");

//   const [signer1,signer2,signer3,signer4,signer5,signer6,signer7] = await ethers.getSigners();
//   const addresses = [signer1.address, signer2.address, signer3.address,signer4.address, signer5.address, signer6.address, signer7.address];
//   const Dai = await hre.ethers.getContractFactory("Dai");
//   const dai = await Dai.deploy();

//   const Treasury = await hre.ethers.getContractFactory("TreasuryV2");
//   const treasury = await Treasury.deploy(addresses,dai.address);
//   await treasury.deployed();

//   dai.connect(signer1).mint(treasury.address,100000000000);
//   await treasury.connect(signer1).appealforFund(100000,0x00);
//   console.log("Deployed succesfully",treasury.address);
//   const activeAppeal = await treasury.connect(signer1).activeAppeal();

//   await treasury.connect(signer2).AllocationVote(activeAppeal);
//   await treasury.connect(signer3).AllocationVote(activeAppeal);
//   await treasury.connect(signer4).AllocationVote(activeAppeal);
//   await treasury.connect(signer5).AllocationVote(activeAppeal);
//   await treasury.connect(signer6).AllocationVote(activeAppeal);

//   // await greeter.deployed();

//   // console.log("Greeter deployed to:", greeter.address);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
