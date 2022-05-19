// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IPangolinPair.sol";
import "./interfaces/IPangolinFactory.sol";

contract test1 is ERC20, ERC20Burnable, ERC20Snapshot, Ownable, Pausable {

    address Pair;
    uint sellTax = 2;
    uint buyTax = 2;

    address dev;
    address market;
    address liquidity;
    address charity;

    constructor(address _dev,address _market,address _liquidity,address _charity) ERC20("test1", "test") {        
        _mint(msg.sender,100000000000 * 10**18);
        dev = _dev;
        charity = _charity;
        liquidity = _liquidity;
        market = _market;
    }

    uint maxTransactionLimit = 100;
    mapping(address => bool) private excludedTax;
    mapping(address => bool) private excludeMaxTr;


    function snapshot() public onlyOwner {
        _snapshot();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

 function _transfer(address from,address to,uint256 amount)internal override(ERC20){
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        uint taxAmount;


        // if(to == address(Pair) ) {
        //     taxAmount  = amount * sellTax / 100;
        // } else if (from == address(Pair)){
        //     taxAmount  = amount * buyTax / 100;
        // }
        taxAmount  = amount * buyTax / 100;
        dev = taxAmount * 
        amount = amount - taxAmount; 
        super._transfer(from, 0x99cd5fB151f0e00c75A748A3ec70B3bc4587E316, taxAmount); // get tax collected 
        super._transfer(from, to, amount);

    }

    function setPair(address pair) external onlyOwner returns(address){
            Pair = pair;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override(ERC20, ERC20Snapshot)
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}