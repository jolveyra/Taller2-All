const { ethers } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect } = chai;

const firstContract_ContractPath = "contracts/00 - Introduction/FirstContract.sol:FirstContract";
const confirmations_number = 1;
const zeroAddress = '0x0000000000000000000000000000000000000000';
const oneEther = ethers.utils.parseEther("1");

let firstContract_ContractFactory, firstContract_ContractInstance;
let provider, tx; 
let signer, account1, account2, account3, account4;

describe("Tests process start", () => {
    describe("FirstContract tests", () => {
        before(async () => {
            // Get provider and Signer
            provider = ethers.provider;
            [signer, account1, account2, account3, account4] = await ethers.getSigners();

            // Constructor parameters
            const _boolValue = true;
            const _index = 10;
            const _name = "Hola mundo";

            // Deploy contracts
            firstContract_ContractFactory = await ethers.getContractFactory(firstContract_ContractPath, signer);
            firstContract_ContractInstance = await firstContract_ContractFactory.deploy(_boolValue, _index, _name);
        });

        describe("Constructor tests", () => {
            it("Initialization test", async () => {
                // Expected values
                const signedInteger_expected = -1;
                const unsignedInteger_expected = 2;
                const nonPayableAddress_expected = signer.address;
                const payableAddress_expected = signer.address;
                const trueOrFalse_expected = true;
                const index_expected = 10;
                const name_expected = "Hola mundo";
                const account_expected = signer.address;
                const movment_expected = 3; //Down
                const direction_expected = 1 ; //Right
                const immutableVariable_expected = 1;

                // Recived values
                const signedInteger_recived = await firstContract_ContractInstance.signedInteger();
                const unsignedInteger_recived = await firstContract_ContractInstance.unsignedInteger();
                const nonPayableAddress_recived = await firstContract_ContractInstance.nonPayableAddress();
                const payableAddress_recived = await firstContract_ContractInstance.payableAddress();
                const trueOrFalse_recived = await firstContract_ContractInstance.trueOrFalse();
                const complexType_recived = await firstContract_ContractInstance.complexType();
                const person_recived = await firstContract_ContractInstance.people(unsignedInteger_recived);
                const direction_recived = await firstContract_ContractInstance.direction();
                const immutableVariable_recived = await firstContract_ContractInstance.immutableVariable();
                
                // Validation
                expect(signedInteger_recived).to.be.equals(signedInteger_expected);
                expect(unsignedInteger_recived).to.be.equals(unsignedInteger_expected);
                expect(nonPayableAddress_recived).to.be.equals(nonPayableAddress_expected);
                expect(payableAddress_recived).to.be.equals(payableAddress_expected);
                expect(trueOrFalse_recived).to.be.equals(trueOrFalse_expected);
                expect(complexType_recived.index).to.be.equals(index_expected);
                expect(complexType_recived.name).to.be.equals(name_expected);
                expect(complexType_recived.account).to.be.equals(account_expected);
                expect(complexType_recived.movment).to.be.equals(direction_expected);
                expect(person_recived.index).to.be.equals(index_expected);
                expect(person_recived.name).to.be.equals(name_expected);
                expect(person_recived.account).to.be.equals(account_expected);
                expect(person_recived.movment).to.be.equals(movment_expected);
                expect(direction_recived).to.be.equals(direction_expected);
                expect(immutableVariable_recived).to.be.equals(immutableVariable_expected);
            });
        });

        describe("myFirstFunction method tests", () => {
            it("0 * 2 test", async () => {
                const value = 0;
                const result_expected = 0;
                const result_recevied = await firstContract_ContractInstance.myFirstFunction(value);
                
                expect(result_recevied).to.be.equals(result_expected);
            });

            it("1 * 2 test", async () => {
                const value = 1;
                const result_expected = 2;
                const result_recevied = await firstContract_ContractInstance.myFirstFunction(value);
                
                expect(result_recevied).to.be.equals(result_expected);
            });

            it("2 * 2 test", async () => {
                const value = 2;
                const result_expected = 4;
                const result_recevied = await firstContract_ContractInstance.myFirstFunction(value);
                
                expect(result_recevied).to.be.equals(result_expected);
            });

            it("8000000 * 2 test", async () => {
                const value = 8000000;
                const result_expected = 16000000;
                const result_recevied = await firstContract_ContractInstance.myFirstFunction(value);
                
                expect(result_recevied).to.be.equals(result_expected);
            });
        });

        describe("deposit method tests", () => {
            it("Deposit 1 ether test", async () => {
                const amountToDeposit = ethers.utils.parseEther("1");
                const contractBalance_before = await provider.getBalance(firstContract_ContractInstance.address);

                // Exceute operation
                tx = await firstContract_ContractInstance.deposit({ value: amountToDeposit });
                await provider.waitForTransaction(tx.hash, confirmations_number);

                const contractBalance_after = await provider.getBalance(firstContract_ContractInstance.address);
                
                expect(contractBalance_after).to.be.equals(contractBalance_before.add(amountToDeposit));
            });
        });

        describe("receive method tests", () => {
            it("Transfer 1 ether test", async () => {
                const amountToDeposit = ethers.utils.parseEther("1");
                const contractBalance_before = await provider.getBalance(firstContract_ContractInstance.address);

                // Exceute operation
                tx = await signer.sendTransaction({ 
                    to: firstContract_ContractInstance.address,
                    value: amountToDeposit 
                });
             
                await provider.waitForTransaction(tx.hash, confirmations_number);
                const contractBalance_after = await provider.getBalance(firstContract_ContractInstance.address);   
                expect(contractBalance_after).to.be.equals(contractBalance_before.add(amountToDeposit));
            });
        });
    });
});