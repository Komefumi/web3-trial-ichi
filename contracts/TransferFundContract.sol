// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;

contract Test {
  function transferFunds(address _address, bytes calldata _payload) external { 
    (bool status,) = _address.delegatecall(_payload);
    require(status, "Forwarded call failed.");
  }
}
