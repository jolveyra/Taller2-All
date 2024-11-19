//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract CallToBaseContract {
    uint256 public baseContractVariable;
    address public baseContract;
    string public excecutionResult;
    
    function setBaseContract(address newAddress) public {
        baseContract = newAddress;
    }
    
    function ExecuteMethodFromBaseContract_With_Call(uint256 newValue) public {
        bytes memory methodToCall = abi.encodeWithSignature("setBaseContractVariable(uint256)", newValue);
        (bool _success, bytes memory _returnData) = baseContract.call(methodToCall);
        if(_success == true){
            excecutionResult = "Call";
        }
    }
    
    function ExecuteMethodFromBaseContract_With_DelegateCall(uint256 newValue) public {
        bytes memory methodToCall = abi.encodeWithSignature("setBaseContractVariable(uint256)", newValue);
        (bool _success, bytes memory _returnDaa) = baseContract.delegatecall(methodToCall);
        if(_success == true){
            excecutionResult = "DelegateCall";
        }
    }
    
    function ExecuteMethodFromBaseContract_With_StaticCall(uint256 newValue) public {
        bytes memory methodToCall = abi.encodeWithSignature("setBaseContractVariable(uint256)", newValue);
        (bool _success, bytes memory _returnData) = baseContract.staticcall(methodToCall);
        if(_success == true){
            excecutionResult = "StaticCall";
        }
    }
}