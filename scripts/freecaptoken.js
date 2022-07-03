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



  const treasury = await Treasury.deploy([],dai.address,TREASURTYMainaccount);
  await treasury.deployed();


  const crowdsale = await Crowdsale.deploy("1",treasury.address,fpc.address,dai.address,OwnerAccount);
  await crowdsale.deployed();

  

  const conversion = await Conversion.deploy(pangolinAddress,treasury.address,dai.address)
  await conversion.deployed();


  console.log("FPC : ",fpc.address);
  console.log("Dai : ",dai.address);
  console.log("crowdasle : ",crowdsale.address);
  console.log("Treasury : ",treasury.address);
  console.log("Conversion : ",conversion.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// FPC :  0xfbD53f0Cc3a18dEdC6c52E7650DA386B050E2dea
// Dai :  0x9134359D82642B8BE1084E9825C091db9179c46B
// crowdasle :  0xD54E08a6E5fe5479C3219cD6c8c42228A0E9dE91
// Treasury :  0xcb82616F6b8b20ab5A8FFB6bf2F8eF8ae9Be9981
// Conversion :  0x1d46025Fc0fBF74B299C972027e0bFdD9d0AeD05


//rip 

["0x224695Ba2a98E4a096a519B503336E06D9116E48","0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0x9134359D82642B8BE1084E9825C091db9179c46B"]

//pangolin address
//0x688d21b0B8Dc35971AF58cFF1F7Bf65639937860

// test path to exchange awax with any token
// ["0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0xe24C1B5e02fae85786aaB1E381EF3Ea97fedd901"]

//

//pangolin address
//0x688d21b0B8Dc35971AF58cFF1F7Bf65639937860
["0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0x9134359D82642B8BE1084E9825C091db9179c46B"]





// 0x8B2d6c7b0801645F7C432ba5A5B944bb711298b5 conversion

// 0x224695Ba2a98E4a096a519B503336E06D9116E48