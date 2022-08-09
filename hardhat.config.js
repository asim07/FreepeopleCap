require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { POLYGON_MUMBAI_RPC_PROVIDER, FUJI_AVALACHE_RPC_PROVIDER, AVALACHE_API_KEY } =
  process.env;
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  // for (const account of accounts) {
  //   console.log(account.address);
  // }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.12",
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: POLYGON_MUMBAI_RPC_PROVIDER,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
    fuji: {
      url: FUJI_AVALACHE_RPC_PROVIDER,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    }
  },
  etherscan: { apiKey: AVALACHE_API_KEY },
};