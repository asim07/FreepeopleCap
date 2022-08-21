# Free People Cap Hardhat Project

This project contains the smart contracts of the platform with the testcases of the treasury contract.

Try running some of the following tasks:

#changes required before runing tests
 Treasury.sol 
    line - 141    change "7 hours" to "0 hours" to run testcases perfectly




```shell
npx hardhat accounts
npx hardhat compilechange
npx hardhat clean
npx hardhat test
npx hardhat test --network localhost/provided one
npx hardhat node
node scripts/treasury-script.js
npx hardhat help
```



```folders
├──├──├──├──├──├──├──├──├──
scripts/freecaptoken.js
used to deploy the smart contracts to a network


├──├──├──├──├──├──├──├──├──
arguments/
after the deployment for verification these arguments are used to verify the contract for each contract.


├──├──├──├──├──├──├──├──├──
test/
script used for the testcases

├──├──├──├──├──├──├──├──├──
contracts contains the all required contracts for FPC token
1. FREEPEOPLECAP.sol (token contract)
2. CONVERSION.sol (Used to swap one token to other using pangolin exchange smart contract  )
3. Treasury.sol (Lates version for reserves)
4. CROWDSALE.sol (for selling of fpc token with dai on private website)



```requirements
yarn install/ npm i

create .env file having parameters
MNEMONIC=""
FUJI_AVALACHE_RPC_PROVIDER="https://api.avax-test.network/ext/bc/C/rpc"
AVALACHE_API_KEY=""





`````addresses fuji testnet
crowdsale : 0xd54e08a6e5fe5479c3219cd6c8c42228a0e9de91
FPC : 0xfbD53f0Cc3a18dEdC6c52E7650DA386B050E2dea
DAI : 0x9134359D82642B8BE1084E9825C091db9179c46B
router : 0x7791E98C3eC430eacd5B62843dA16Ff8bb462FB2


conversion contract address : 0x7b8F8e12a4c92a504DCC5F3d5c5D22c2BbEf99cB
path to buy fpc with awax 
["0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0x9134359D82642B8BE1084E9825C091db9179c46B"]

path to buy with any token

["0xDe5D7A6484E885eDcCA237dFa93E970DA60F74Db","0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0x9134359D82642B8BE1084E9825C091db9179c46B"]