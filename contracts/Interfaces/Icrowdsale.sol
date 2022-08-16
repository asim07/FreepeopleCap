// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface Icrowdsale {
    function buyTokens(address beneficiary,uint _amount) external;
}