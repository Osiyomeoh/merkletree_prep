// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SamToken is ERC20("SamToken", "STK"){
     address public owner;

     error  addressZeroDetected();

    constructor(){
        owner = msg.sender;
        _mint(msg.sender, 10000e18);
    }

    function mint (uint256 _amount) external {
      if( msg.sender == address(0)){
        revert addressZeroDetected();
      }
      require(msg.sender == owner, "only owner allowed");

      _mint(msg.sender, _amount * 1e18);

    }

    
}