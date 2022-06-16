// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  const [signer1,signer2,signer3,signer4,signer5,signer6,signer7] = await ethers.getSigners();
  addresses = [signer1.address,signer2.address,signer3.address,signer4.address,signer5.address,signer6.address,signer7.address]
  const address =  [signer1.address, signer2.address, signer3.address,signer4.address];
  

  const OwnerAccount = "0x6DF9042d178F25E5c392e291414590856a398BCF"
  const TREASURTYMainaccount = "0x214Fed686BF2f72734f815F4D94EAFaC4E2Ee7b9"
  const DevAccount = "0xcd9434d9E54cA60189c86ae9a140Fbb49D45E99F"
  const MarketingAccount = "0x61fC6383554ECC310745565077bE9eF20044FF6d"
  const CharityAccount = "0x797978fd3987b1e8F4Cf7D26B3f5106d634D4379"
  const liqiduidityAccount = "0x797978fd3987b1e8F4Cf7D26B3f5106d634D4379"
  const pangolinAddress = "0x2d99abd9008dc933ff5c0cd271b88309593ab921"


  const FPC = await hre.ethers.getContractFactory("FreePeopleCap");
  const Dai = await hre.ethers.getContractFactory("Dai");
  const Crowdsale = await hre.ethers.getContractFactory("CrowdSale");
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const Conversion = await hre.ethers.getContractFactory("conversion");

  const accounts = [DevAccount,MarketingAccount,CharityAccount,liqiduidityAccount]


  const fpc = await FPC.deploy("FreePeopleCap","FPC","100000000000000",accounts,[25,25,25,25,25,25,25,25],OwnerAccount);
  await fpc.deployed();

  const dai = await Dai.deploy();
  await dai.deployed();


  const crowdsale = await Crowdsale.deploy("1",signer1.address,fpc.address,dai.address);
  await crowdsale.deployed();

  const conversion = await Conversion.deploy(pangolinAddress,TREASURTYMainaccount,dai.address)
  await conversion.deployed();

  const treasury = await Treasury.deploy(address,dai.address,TREASURTYMainaccount);

  console.log("FPC : ",fpc.address);
  console.log("Dai : ",dai.address);
  console.log("crowdasle : ",crowdsale.address);
  console.log("Treasury : ",treasury.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//   FPC :  0x778f712D2F3c6Fd94b4beD73D93fDA4091a9808e
//   Dai :  0xa89Dbfb8c402dd3445dB4F22494eec898A366504
//   crowdasle :  0xEc1CC7f3052D106F9c6D2Dd008D84Cea88767738
//   Treasury :  0xD7eFe4cF091c405F809CC70a84355eDcDBD7f6D3