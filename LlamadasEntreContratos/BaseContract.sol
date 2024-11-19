//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract BaseContract {
    uint256 public baseContractVariable;

    function setBaseContractVariable(uint256 newValue) public {
        baseContractVariable = newValue;
    }
}