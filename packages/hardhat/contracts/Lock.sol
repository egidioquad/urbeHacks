// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ButtonContract {
    uint256 public value;

    // Function to write a value to the contract
    function writeValue(uint256 _newValue) external {
        value = _newValue;
    }
}
