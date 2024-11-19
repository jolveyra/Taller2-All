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

let contractInstance, signer;

describe("Calculator tests", () => {

    before(async () => {
        // Get Signer
        [signer] = await ethers.getSigners();
        
        // Deploy student contract
        const contractPath = "contracts/02 - Burn_your_cosmos/01_Calculator.sol:Calculator";
        const contractFactory = await ethers.getContractFactory(contractPath, signer);
        contractInstance = await contractFactory.deploy();
    });

    describe("Constructor setup tests", () => {
        it("Initialization test", async () => {
            const owner = await contractInstance.owner();
            expect(owner).to.be.equals(signer.address);
        });
    });

    describe("Addition function tests", () => {
        it("1 + 2 = 3", async () => {
            const result = await contractInstance.addition(1, 2);
            expect(parseInt(result)).to.be.equals(3);
        });

        it("1.000.000.000.000 + 1.000.000.000.000 = 2.000.000.000.000", async () => {
            const result = await contractInstance.addition(1000000000000, 1000000000000);
            expect(parseInt(result)).to.be.equals(2000000000000);
        });

        it("Try send a value over 1.000.000.000.000", async () => {
            await expect(contractInstance.addition(1000000000001, 1)).to.be.revertedWith("Out of range value");
        });

        it("Try send a value over 1.000.000.000.000", async () => {
            await expect(contractInstance.addition(1, 1000000000001)).to.be.revertedWith("Out of range value");
        });
    })

    describe("Substraction function tests", () => {
        it("3 - 1 = 2", async () => {
            const result = await contractInstance.subtraction(3, 1);
            expect(parseInt(result)).to.be.equals(2);
        });

        it("1.000.000.000.000 - 1.000.000.000.000 = 0", async () => {
            const result = await contractInstance.subtraction(1000000000000, 1000000000000);
            expect(parseInt(result)).to.be.equals(0);
        });

        it("Try send a value over 1.000.000.000.000", async () => {
            await expect(contractInstance.subtraction(1000000000001, 1)).to.be.revertedWith("Out of range value");
        });

        it("Try send a value over 1.000.000.000.000", async () => {
            await expect(contractInstance.subtraction(1, 1000000000001)).to.be.revertedWith("Out of range value");
        });

        it("Try send a value of a less then b", async () => {
            await expect(contractInstance.subtraction(1, 3)).to.be.revertedWith("Subtrahend can't be greater than minuend");
        });
    })

    describe("Multiplication function tests", () => {
        it("3 * 2 = 6", async () => {
            const result = await contractInstance.multiplication(3, 2);
            expect(parseInt(result)).to.be.equals(6);
        });

        it("1 * 0 = 0", async () => {
            const result = await contractInstance.multiplication(1, 0);
            expect(parseInt(result)).to.be.equals(0);
        });

        it("0 * 1 = 0", async () => {
            const result = await contractInstance.multiplication(0, 1);
            expect(parseInt(result)).to.be.equals(0);
        });

        it("0 * 0 = 0", async () => {
            const result = await contractInstance.multiplication(0, 0);
            expect(parseInt(result)).to.be.equals(0);
        });

        it("1.000.000.000.000 * 1.000.000.000.000 = 1.000.000.000.000.000.000.000.000", async () => {
            const result = await contractInstance.multiplication(1000000000000, 1000000000000);
            expect(parseInt(result)).to.be.equals(1000000000000000000000000);
        });

        it("Try send a value over 1.000.000.000.000", async () => {
            await expect(contractInstance.multiplication(1000000000001, 1)).to.be.revertedWith("Out of range value");
        });

        it("Try send a value over 1.000.000.000.000", async () => {
            await expect(contractInstance.multiplication(1, 1000000000001)).to.be.revertedWith("Out of range value");
        });
    })

    describe("division function tests", () => {
        it("6 / 3 = 2", async () => {
            const result = await contractInstance.division(6, 3);
            expect(parseInt(result)).to.be.equals(2);
        });

        it("0 / 1 = 0", async () => {
            const result = await contractInstance.division(0, 1);
            expect(parseInt(result)).to.be.equals(0);
        });

        it("1.000.000.000.000 / 1.000.000.000.000 = 1", async () => {
            const result = await contractInstance.division(1000000000000, 1000000000000);
            expect(parseInt(result)).to.be.equals(1);
        });

        it("Try send a value over 1.000.000.000.000", async () => {
            await expect(contractInstance.division(1000000000001, 1)).to.be.revertedWith("Out of range value");
        });

        it("Try send a value over 1.000.000.000.000", async () => {
            await expect(contractInstance.division(100000000000, 0)).to.be.revertedWith("Dividend can't be zero");
        });
    });
});