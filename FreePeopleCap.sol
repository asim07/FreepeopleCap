// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Interfaces/IPangolinRouter.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
contract FreePeopleCap {

  using SafeMath for uint256;

  //IPangolin Interface to point the contract with address 
  IPangolinRouter private router;
  address private pangolin;  
  address  private vault = 0x043Fe51F898e3bf716963A2218b619DB1ea845D2;

  //Pangolin Test network address : 0x2d99abd9008dc933ff5c0cd271b88309593ab921
  constructor(address _router) {
  router = IPangolinRouter(_router);
  pangolin = _router;
  }

  // pangolin estimator for recieving  amount
  function getAmountsOut(uint _amountIn, address[] calldata _path) public view returns (uint[] memory amounts){
    
    amounts = router.getAmountsOut(_amountIn,_path);

  }

// pangolin estimater for getting amount in reverse
  function getAmountsIn(uint _amountOut, address[] calldata _path) external view returns (uint[] memory amounts){
    amounts = router.getAmountsIn(_amountOut,_path);
  }

// swapp awax with any token
   function swapAVAXForExactTokens(address[] calldata _path, uint _deadline)
        external
        payable
        returns (uint[] memory amounts){
          require(msg.value >0,"Awax amount cannot be zero");
          require(_path.length ==2,"Invalid path");
         // require(_deadline > block.timestamp,"Deadline should be greater than current time");
        uint tax = calculateTax(msg.value);
        uint  _amountIn = msg.value - tax;
        uint[] memory calculations = getAmountsOut(_amountIn,_path);
        amounts = router.swapAVAXForExactTokens{value : msg.value - tax}(calculations[1],_path,msg.sender,block.timestamp + 2 minutes);
        payable(vault).transfer(calculateTax(msg.value));
        }

    function swapTokensForExactTokens(uint _amountIn, address[] calldata _path, uint _deadline)
        external
        returns (uint[] memory amounts){
        IERC20 token = IERC20(_path[0]);
          require(token.allowance(msg.sender,address(this)) >= _amountIn,"need more Allowance");
          require(_path.length == 3,"Invalid path");
          uint tax = calculateTax(_amountIn);
          _amountIn = _amountIn - tax;
          token.transferFrom(msg.sender,address(this),_amountIn);
          token.approve(pangolin,_amountIn);
        //  require(_deadline > block.timestamp,"Deadline should be greater than urent time");
        uint[] memory calculations = getAmountsOut(_amountIn,_path);
        amounts = router.swapTokensForExactTokens(_amountIn,calculations[2],_path,msg.sender,block.timestamp + 1 minutes);
        token.transfer(vault,tax);
        }

    function calculateTax(uint256 _amountIn) public returns(uint256 taxAmount){
          return _amountIn/1000 * 6;
    }    

   


  fallback() external{
    revert();
  }
}

//pangolin address
//0x2d99abd9008dc933ff5c0cd271b88309593ab921

// test path to exchange awax with any token
// ["0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0xe24C1B5e02fae85786aaB1E381EF3Ea97fedd901"]


// test apth for gen to link
//["0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0xe24C1B5e02fae85786aaB1E381EF3Ea97fedd901"]


// test path for swapping tokens with tokens
// ["0xe24C1B5e02fae85786aaB1E381EF3Ea97fedd901","0xd00ae08403B9bbb9124bB305C09058E32C39A48c","0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"]

//link address : 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846
// Genisis address : 0xe24C1B5e02fae85786aaB1E381EF3Ea97fedd901