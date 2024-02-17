// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StableCoin is ERC20 {
    constructor() ERC20("MyUSDT", "USDT") {}

    function mint(uint256 mintAmount) public {
        _mint(msg.sender, mintAmount);
    }
}