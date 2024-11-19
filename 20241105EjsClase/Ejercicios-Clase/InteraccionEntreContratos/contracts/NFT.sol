// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/ILockableNFT.sol";

contract NFT is IERC721, ILockableNFT {

    string public _name;


    mapping(uint256 => address) public _owners;

    struct LockState {
        bool isLocked;
        address lockedBy;
    }




    function lockInfo(uint256 _tokenId) external view override returns (LockState memory) {
        // Implementacion

        return LockState(false, address(0));
    }

}