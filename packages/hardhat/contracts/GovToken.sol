// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovToken is ERC20, Ownable {
    constructor() ERC20("GovToken", "MGT") {}

    /**
     * @dev Allows the owner to mint tokens to a specified address.
     * @param account The address of the recipient.
     * @param amount The amount of tokens to mint.
     */
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }
}
