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
npx hardhat test --network localhost
npx hardhat node
node scripts/treasury-script.js
npx hardhat help
```
