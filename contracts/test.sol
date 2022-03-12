pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
contract testing {

using SafeMath for uint256;
function buy() external payable {

    uint amount = 0;
    uint tax = msg.value/1000 * 500;
    amount = msg.value - tax;
    payable(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB).transfer(msg.value - tax);
    payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db).transfer(amount);

}

function checkBalance() public view returns(uint256 val){
    return address(0xf80e7EE0f5dbB0f05dA199a386B01416cA62b0d5).balance;
     
}


}