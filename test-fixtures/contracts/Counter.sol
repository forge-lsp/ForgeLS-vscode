// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.34;

struct CounterStruct {
  uint x;
}

contract Counter {
  uint public x;
  address public owner;
  CounterStruct public counterStruct;

  event Increment(uint by);
  event Decrement(uint by);

  function inc() public {
    x++;

    counterStruct.x++;

    emit Increment(x);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(x);
  }
  
}