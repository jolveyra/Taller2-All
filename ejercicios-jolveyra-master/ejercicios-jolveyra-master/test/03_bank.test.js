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

let contractInstance, signer, provider, account1;

describe("Bank tests", () => {

    before(async () => {
        // Get Signer
        [signer, account1] = await ethers.getSigners();
        provider = ethers.provider;
        
        // Deploy student contract
        const contractPath = "contracts/02 - Burn_your_cosmos/02_Bank.sol:Bank";
        const contractFactory = await ethers.getContractFactory(contractPath, signer);
        contractInstance = await contractFactory.deploy();
    });

    describe("getBalance tests", () => {
        it("Not a client test", async () => {
            await expect(contractInstance.getBalance(account1.address)).revertedWith("Not a client");
        });

        it("Zero address test", async () => {
            const zeroAddress = '0x0000000000000000000000000000000000000000';
            await expect(contractInstance.getBalance(zeroAddress)).revertedWith("Invalid _address");
        });
    });

    describe("deposit tests", () => {
        it("Zero amount test", async () => {
            const _amount = ethers.utils.parseEther("0");
            await expect(contractInstance.deposit({ value: _amount })).revertedWith("Invalid _amount");
        });

        it("1 ether amount test", async () => {
            const _amount = ethers.utils.parseEther("1");
            
            const contractBalanceBefore = await provider.getBalance(contractInstance.address);
            const signerBalanceBefore = await provider.getBalance(signer.address);
            const signerBalanceOfBefore = await contractInstance.balanceOf(signer.address);
            
            const tx = await contractInstance.deposit({ value: _amount });
            await provider.waitForTransaction(tx.hash, 1);
            
            const contractBalanceAfter = await provider.getBalance(contractInstance.address);
            const signerBalanceAfter = await provider.getBalance(signer.address);
            const signerBalanceOfAfter = await contractInstance.balanceOf(signer.address);
            
            expect(contractBalanceAfter).to.be.equals(contractBalanceBefore.add(_amount));
            expect(signerBalanceAfter.lte(signerBalanceBefore.sub(_amount))).to.be.true;
            expect(signerBalanceOfAfter).to.be.equals(signerBalanceOfBefore.add(_amount));
        });

        it("10 ether amount test", async () => {
            const _amount = ethers.utils.parseEther("10");
            
            const contractBalanceBefore = await provider.getBalance(contractInstance.address);
            const signerBalanceBefore = await provider.getBalance(signer.address);
            const signerBalanceOfBefore = await contractInstance.balanceOf(signer.address);
            
            const tx = await contractInstance.deposit({ value: _amount });
            await provider.waitForTransaction(tx.hash, 1);
            
            const contractBalanceAfter = await provider.getBalance(contractInstance.address);
            const signerBalanceAfter = await provider.getBalance(signer.address);
            const signerBalanceOfAfter = await contractInstance.balanceOf(signer.address);
            
            expect(contractBalanceAfter).to.be.equals(contractBalanceBefore.add(_amount));
            expect(signerBalanceAfter.lte(signerBalanceBefore.sub(_amount))).to.be.true;
            expect(signerBalanceOfAfter).to.be.equals(signerBalanceOfBefore.add(_amount));
        });
    });

    describe("getBalance tests", () => {
        it("Invalid _address test", async () => {
            await expect(contractInstance.getBalance(account1.address)).revertedWith("Invalid _address");
        });

        it("11 ether balance test", async () => {
            const expectedBalance = ethers.utils.parseEther("11");
            const recivedbalance = await contractInstance.getBalance(signer.address);
            expect(recivedbalance).to.be.equals(expectedBalance);
        });
    });

    describe("withdraw tests", () => {
        it("Zero amount test", async () => {
            const _amount = ethers.utils.parseEther("0");
            await expect(contractInstance.withdraw(_amount)).revertedWith("Invalid _amount");
        });

        it("Total balance +1 amount test", async () => {
            const _amount = (await contractInstance.balanceOf(signer.address)).add(1);
            await expect(contractInstance.withdraw(_amount)).revertedWith("Invalid _amount");
        });

        it("1 ether amount test", async () => {
            const _amount = ethers.utils.parseEther("1");
            
            const contractBalanceBefore = await provider.getBalance(contractInstance.address);
            const signerBalanceBefore = await provider.getBalance(signer.address);
            const signerBalanceOfBefore = await contractInstance.balanceOf(signer.address);
            
            const tx = await contractInstance.withdraw(_amount);
            await provider.waitForTransaction(tx.hash, 1);
            
            const contractBalanceAfter = await provider.getBalance(contractInstance.address);
            const signerBalanceAfter = await provider.getBalance(signer.address);
            const signerBalanceOfAfter = await contractInstance.balanceOf(signer.address);
            
            expect(contractBalanceAfter).to.be.equals(contractBalanceBefore.sub(_amount));
            expect(signerBalanceAfter.lte(signerBalanceBefore.add(_amount))).to.be.true;
            expect(signerBalanceOfAfter).to.be.equals(signerBalanceOfBefore.sub(_amount));
        });

        it("10 ether amount test", async () => {
            const _amount = ethers.utils.parseEther("10");
            
            const contractBalanceBefore = await provider.getBalance(contractInstance.address);
            const signerBalanceBefore = await provider.getBalance(signer.address);
            const signerBalanceOfBefore = await contractInstance.balanceOf(signer.address);
            
            const tx = await contractInstance.withdraw(_amount);
            await provider.waitForTransaction(tx.hash, 1);
            
            const contractBalanceAfter = await provider.getBalance(contractInstance.address);
            const signerBalanceAfter = await provider.getBalance(signer.address);
            const signerBalanceOfAfter = await contractInstance.balanceOf(signer.address);
            
            expect(contractBalanceAfter).to.be.equals(contractBalanceBefore.sub(_amount));
            expect(signerBalanceAfter.lte(signerBalanceBefore.add(_amount))).to.be.true;
            expect(signerBalanceOfAfter).to.be.equals(signerBalanceOfBefore.sub(_amount));
        });

        it("Withdraw from zero balance test", async () => {
            const _amount = ethers.utils.parseEther("10");
            await expect(contractInstance.withdraw(_amount)).revertedWith("Invalid _amount");
        });
    });

    describe("getBalance tests", () => {
        it("Not a client test", async () => {
            await expect(contractInstance.getBalance(signer.address)).revertedWith("Not a client");
        });
    });

    describe("deposit tests", () => {
        it("10 ether amount test", async () => {
            const _amount = ethers.utils.parseEther("10");
            
            const contractBalanceBefore = await provider.getBalance(contractInstance.address);
            const signerBalanceBefore = await provider.getBalance(signer.address);
            const signerBalanceOfBefore = await contractInstance.balanceOf(signer.address);
            
            const tx = await contractInstance.deposit({ value: _amount });
            await provider.waitForTransaction(tx.hash, 1);
            
            const contractBalanceAfter = await provider.getBalance(contractInstance.address);
            const signerBalanceAfter = await provider.getBalance(signer.address);
            const signerBalanceOfAfter = await contractInstance.balanceOf(signer.address);
            
            expect(contractBalanceAfter).to.be.equals(contractBalanceBefore.add(_amount));
            expect(signerBalanceAfter.lte(signerBalanceBefore.sub(_amount))).to.be.true;
            expect(signerBalanceOfAfter).to.be.equals(signerBalanceOfBefore.add(_amount));
        });
    });

    describe("transfer tests", () => {
        it("Zero amount test", async () => {
            const _to = account1.address;
            const _amount = ethers.utils.parseEther("0");
            await expect(contractInstance.transfer(_to, _amount)).revertedWith("Invalid _amount");
        });

        it("invalid amount test", async () => {
            const _to = account1.address;
            const _amount = (await contractInstance.balanceOf(signer.address)).add(1);
            await expect(contractInstance.transfer(_to, _amount)).revertedWith("Invalid _amount");
        });

        it("Zero address test", async () => {
            const zeroAddress = '0x0000000000000000000000000000000000000000';
            const _amount = ethers.utils.parseEther("1");
            await expect(contractInstance.transfer(zeroAddress, _amount)).revertedWith("Invalid _address");
        });

        it("1 ether amount test", async () => {
            const _to = account1.address;
            const _amount = ethers.utils.parseEther("1");
            
            const contractBalanceBefore = await provider.getBalance(contractInstance.address);
            const signerBalanceBefore = await provider.getBalance(signer.address);
            const signerBalanceOfBefore = await contractInstance.balanceOf(signer.address);
            const account1BalanceBefore = await provider.getBalance(account1.address);
            const account1BalanceOfBefore = await contractInstance.balanceOf(account1.address);
            
            const tx = await contractInstance.transfer(_to, _amount);
            await provider.waitForTransaction(tx.hash, 1);
            
            const contractBalanceAfter = await provider.getBalance(contractInstance.address);
            const signerBalanceAfter = await provider.getBalance(signer.address);
            const signerBalanceOfAfter = await contractInstance.balanceOf(signer.address);
            const account1BalanceAfter = await provider.getBalance(account1.address);
            const account1BalanceOfAfter = await contractInstance.balanceOf(account1.address);
            
            expect(contractBalanceAfter).to.be.equals(contractBalanceBefore);
            expect(signerBalanceAfter.lte(signerBalanceBefore)).to.be.true;
            expect(signerBalanceOfAfter).to.be.equals(signerBalanceOfBefore.sub(_amount));
            expect(account1BalanceAfter).to.be.equals(account1BalanceBefore);
            expect(account1BalanceOfAfter).to.be.equals(account1BalanceOfBefore.add(_amount));
        });

        it("9 ether amount test", async () => {
            const _to = account1.address;
            const _amount = ethers.utils.parseEther("9");
            
            const contractBalanceBefore = await provider.getBalance(contractInstance.address);
            const signerBalanceBefore = await provider.getBalance(signer.address);
            const signerBalanceOfBefore = await contractInstance.balanceOf(signer.address);
            const account1BalanceBefore = await provider.getBalance(account1.address);
            const account1BalanceOfBefore = await contractInstance.balanceOf(account1.address);
            
            const tx = await contractInstance.transfer(_to, _amount);
            await provider.waitForTransaction(tx.hash, 1);
            
            const contractBalanceAfter = await provider.getBalance(contractInstance.address);
            const signerBalanceAfter = await provider.getBalance(signer.address);
            const signerBalanceOfAfter = await contractInstance.balanceOf(signer.address);
            const account1BalanceAfter = await provider.getBalance(account1.address);
            const account1BalanceOfAfter = await contractInstance.balanceOf(account1.address);
            
            expect(contractBalanceAfter).to.be.equals(contractBalanceBefore);
            expect(signerBalanceAfter.lte(signerBalanceBefore)).to.be.true;
            expect(signerBalanceOfAfter).to.be.equals(signerBalanceOfBefore.sub(_amount));
            expect(account1BalanceAfter).to.be.equals(account1BalanceBefore);
            expect(account1BalanceOfAfter).to.be.equals(account1BalanceOfBefore.add(_amount));
        });
    });
});