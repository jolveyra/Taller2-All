/// --------------------------------------------------------------------------------------------------
/// ToDo: Place your contract test code here
/// --------------------------------------------------------------------------------------------------
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

const chai = require("chai");
const { solidity } = require( "ethereum-waffle");
const { ConstructorFragment } = require("ethers/lib/utils");
const { Console } = require("console");
chai.use(solidity);
const { expect } = chai;

let beaconContractInstance, callerContractInstance, beaconAddress, signer, provider, account1;

describe("OwnerAndMessageCall tests", () => {

    before(async () => {
        // Get Signer
        [signer, account1] = await ethers.getSigners();
        provider = ethers.provider;
        
        // Deploy student contract
        const beaconContractPath = "contracts/02 - Burn_your_cosmos/03_OwnerAndMessageCall.sol:BeaconContract";
        const callerContractPath = "contracts/02 - Burn_your_cosmos/03_OwnerAndMessageCall.sol:CallerContract";

        const beaconContractFactory = await ethers.getContractFactory(beaconContractPath, signer);
        const callerContractFactory = await ethers.getContractFactory(callerContractPath, signer);

        beaconContractInstance = await beaconContractFactory.deploy();
        callerContractInstance = await callerContractFactory.deploy();

        beaconAddress = beaconContractInstance.address;
    });

    describe("Beacon contract test", () => {
        describe("Constructor test", () => {
            it("Initialization test", async () => {
                const expectedOwner = signer.address;
                const recievedOwner = await beaconContractInstance.owner();
                expect(recievedOwner).to.be.equals(expectedOwner);
            });
        });

        describe("setAuthorizedContract method test", () => {
            it("try set zero address test", async () => {
                const zeroAddress = '0x0000000000000000000000000000000000000000';
                await expect(beaconContractInstance.setAuthorizedContract(zeroAddress)).revertedWith("Invalid _address");
            });

            it("try with no authorized account test", async () => {
                const newInstance = await beaconContractInstance.connect(account1);
                await expect(newInstance.setAuthorizedContract(callerContractInstance.address)).revertedWith("Not the owner");
            });

            it("Set caller contract account test", async () => {
                const expectedAccount = callerContractInstance.address;

                const tx = await beaconContractInstance.setAuthorizedContract(callerContractInstance.address);
                await provider.waitForTransaction(tx.hash, 1);

                const receivedAccount = await beaconContractInstance.authorizedContract();

                expect(receivedAccount).to.be.equals(expectedAccount);
            });
        });

        describe("getBalance method test", () => {
            it("Zero balance address test", async () => {
                const expectedBalance = ethers.utils.parseEther("0");
                const receivedBalance = await beaconContractInstance.getBalance();
                expect(receivedBalance).to.be.equals(expectedBalance);
            });
        });

        describe("setLastCaller method test", () => {
            it("try with no authorized account test", async () => {
                const newInstance = await beaconContractInstance.connect(account1);
                await expect(newInstance.setLastCaller()).revertedWith("Not authorized");
            });

            it("setLastCaller method test", async () => {
                const zeroAddress = '0x0000000000000000000000000000000000000000';
                const expectedAccount = signer.address;
                const receivedLastCallerBefore = await beaconContractInstance.lastCaller();

                const tx = await beaconContractInstance.setLastCaller();
                await provider.waitForTransaction(tx.hash, 1);

                const receivedLastCallerAfter = await beaconContractInstance.lastCaller();

                expect(receivedLastCallerBefore).to.be.equals(zeroAddress);
                expect(receivedLastCallerAfter).to.be.equals(expectedAccount);
            });
        });
    });

    describe("Caller Contract tests", () => {
        it("getBeaconContractLastCaller with zero address test", async () => {
            const expectedAddress = signer.address;
            const recievedAddress = await callerContractInstance.getBeaconContractLastCaller(beaconAddress);
            expect(recievedAddress).to.be.equals(expectedAddress);
        });

        it("getBeaconContractBalance with zero balance test", async () => {
            const expectedBalance = ethers.utils.parseEther("0");
            const recievedBalance = await callerContractInstance.getBeaconContractBalance(beaconAddress);
            expect(recievedBalance).to.be.equals(expectedBalance);
        });
        
        it("setLastCaller method test", async () => {
            const expectedAccountBefore = signer.address;
            const expectedAccountAfter = callerContractInstance.address;
            const receivedLastCallerBefore = await beaconContractInstance.lastCaller();

            const tx = await callerContractInstance.setLastCaller(beaconContractInstance.address);
            await provider.waitForTransaction(tx.hash, 1);

            const receivedLastCallerAfter = await beaconContractInstance.lastCaller();

            expect(receivedLastCallerBefore).to.be.equals(expectedAccountBefore);
            expect(receivedLastCallerAfter).to.be.equals(expectedAccountAfter);
        });

        it("getBeaconContractLastCaller with Beacon contract address test", async () => {
            const expectedAddress = callerContractInstance.address;
            const recievedAddress = await callerContractInstance.getBeaconContractLastCaller(beaconAddress);
            expect(recievedAddress).to.be.equals(expectedAddress);
        });
    });
});