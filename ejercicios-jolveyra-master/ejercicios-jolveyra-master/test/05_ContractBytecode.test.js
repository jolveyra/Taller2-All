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

let bytecodeContractInstance, callingContractInstance, signer, provider, account1, bytecodeAddress;

describe("ContractBytecode tests", () => {

    before(async () => {
        // Get Signer
        [signer, account1] = await ethers.getSigners();
        provider = ethers.provider;
        
        // Deploy student contract
        const bytecodeContractPath = "contracts/02 - Burn_your_cosmos/04_ContractBytecode.sol:BytecodeContract";
        const callingContractPath = "contracts/02 - Burn_your_cosmos/04_ContractBytecode.sol:CallingContract";

        const bytecodeContractFactory = await ethers.getContractFactory(bytecodeContractPath, signer);
        const callingContractFactory = await ethers.getContractFactory(callingContractPath, signer);

        bytecodeContractInstance = await bytecodeContractFactory.deploy();
        callingContractInstance = await callingContractFactory.deploy();

        bytecodeAddress = bytecodeContractInstance.address;
    });

    describe("Bytecode contract test", () => {
        describe("giveMeMyBytecode method test", () => {
            it("Try call giveMeMyBytecode method with EOA test", async () => {
                await expect(bytecodeContractInstance.giveMeMyBytecode()).revertedWith("Not a contract");
            });
        });
    });

    describe("Calling Contract tests", () => {
        describe("Calling Contract tests", () => {
            it("CallToContract with zero address test", async () => {
                const callingContractABIPath = path.resolve(process.cwd(), "artifacts/contracts/02 - Burn_your_cosmos/04_ContractBytecode") + ".sol/CallingContract.json";
                const callingContractArtifact = JSON.parse(fs.readFileSync(callingContractABIPath, 'utf8'));
                
                const expectedCode = callingContractArtifact.deployedBytecode;
                const tx = await callingContractInstance.CallToContract(bytecodeAddress);
                await provider.waitForTransaction(tx.hash, 1);

                const eventName = "publishBytecode";
                const filter = bytecodeContractInstance.filters[eventName]();
                const events = await bytecodeContractInstance.queryFilter(filter, 'latest');
                const lastEvent = events[events.length - 1];
                const recievedCode = lastEvent.args[0];

                expect(recievedCode).to.be.equals(expectedCode);
            });

            it("Try CallToContract twice in the same block test", async () => {
                await expect(callingContractInstance.CallToContract(bytecodeAddress)).revertedWith("Only one call every 3 block is allowed");
            });

            it("CallToContract after force a transaction test", async () => {
                const blockNumberBefore = await provider.getBlockNumber();

                const tx = await callingContractInstance.setForceTransaction();
                await provider.waitForTransaction(tx.hash, 1);

                const blockNumberAfter = await provider.getBlockNumber();
                expect(blockNumberAfter).to.be.equals(blockNumberBefore + 1);

                const callingContractABIPath = path.resolve(process.cwd(), "artifacts/contracts/02 - Burn_your_cosmos/04_ContractBytecode") + ".sol/CallingContract.json";
                const callingContractArtifact = JSON.parse(fs.readFileSync(callingContractABIPath, 'utf8'));
                
                const expectedCode = callingContractArtifact.deployedBytecode;
                const tx2 = await callingContractInstance.CallToContract(bytecodeAddress);
                await provider.waitForTransaction(tx2.hash, 1);

                const eventName = "publishBytecode";
                const filter = bytecodeContractInstance.filters[eventName]();
                const events = await bytecodeContractInstance.queryFilter(filter, 'latest');
                const lastEvent = events[events.length - 1];
                const recievedCode = lastEvent.args[0];

                expect(recievedCode).to.be.equals(expectedCode);
            });
        });        
    });
});