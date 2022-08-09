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
