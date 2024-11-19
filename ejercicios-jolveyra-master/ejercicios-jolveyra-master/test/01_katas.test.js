const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

const chai = require("chai");
const { solidity } = require( "ethereum-waffle");
const { ConstructorFragment } = require("ethers/lib/utils");
chai.use(solidity);
const { expect } = chai;

let katasContract, signer;

describe("Katas evaluation tests", () => {
    before(async () => {
        // Get Signer
        [signer] = await ethers.getSigners();
        
        // Deploy student contract
        const contractPath = "contracts/01 - Katas/Katas.sol:Katas";
        const contractFactory = await ethers.getContractFactory(contractPath, signer);
        katasContract = await contractFactory.deploy();
    });

    describe("CountBy test", async() => {
        it("(0, 0) test", async function () {
            const x = 0;
            const n = 0;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });

        it("(0, 1) test", async function () {
            const x = 0;
            const n = 1;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });

        it("(1, 0) test", async function () {
            const x = 1;
            const n = 0;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });

        it("(1, 10) test", async function () {
            const x = 1;
            const n = 10;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });

        it("(2, 5) test", async function () {
            const x = 2;
            const n = 5;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });

        it("(10, 1) test", async function () {
            const x = 10;
            const n = 1;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });

        it("(7, 11) test", async function () {
            const x = 7;
            const n = 11;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });

        it("(10, 100) test", async function () {
            const x = 10;
            const n = 100;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });

        it("(1000, 1000) test", async function () {
            const x = 10;
            const n = 100;
            const result = await katasContract.countBy(x, n);
        
            expect(result).to.have.lengthOf(n);

            for (let i = 1; i <= n; i++) {
                expect(result[i - 1]).to.equal(x * i);
            }
        });
    });

    describe("isFactor test", async() => {
        it("(0, 0) test", async function () {
            const _base = 0;
            const _factor = 0;
            await expect(katasContract.isFactor(_base, _factor)).revertedWith("Invalid _factor");
        });

        it("(0, 1) test", async function () {
            const _base = 0;
            const _factor = 1;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.true;
        });

        it("(1, 1) test", async function () {
            const _base = 1;
            const _factor = 1;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.true;
        });

        it("(107, 1) test", async function () {
            const _base = 107;
            const _factor = 1;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.true;
        });

        it("(6, 2) test", async function () {
            const _base = 6;
            const _factor = 2;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.true;
        });

        it("(3333, 11) test", async function () {
            const _base = 3333;
            const _factor = 11;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.true;
        });

        it("(1, 2) test", async function () {
            const _base = 1;
            const _factor = 2;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.false;
        });

        it("(7, 2) test", async function () {
            const _base = 7;
            const _factor = 2;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.false;
        });

        it("(7, 2) test", async function () {
            const _base = 12;
            const _factor = 11;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.false;
        });

        it("(7, 2) test", async function () {
            const _base = 11;
            const _factor = 12;
            const _result = await katasContract.isFactor(_base, _factor);
            expect(_result).to.be.false;
        });
    });

    describe("centuryOf test", async() => {
        it("0 year test", async function () {
            const _year = 0;
            await expect(katasContract.centuryOf(_year)).revertedWith("Invalid _year");
        });

        it("Current year +1 test", async function () {
            const _year = new Date().getFullYear() +1;
            await expect(katasContract.centuryOf(_year)).revertedWith("Invalid _year");
        });

        it("1 year test", async function () {
            const _year = 1;
            const _expectedCentury = 1;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("100 year test", async function () {
            const _year = 100;
            const _expectedCentury = 1;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("101 year test", async function () {
            const _year = 101;
            const _expectedCentury = 2;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("200 year test", async function () {
            const _year = 200;
            const _expectedCentury = 2;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("999 year test", async function () {
            const _year = 999;
            const _expectedCentury = 10;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("1200 year test", async function () {
            const _year = 1200;
            const _expectedCentury = 12;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("1705 year test", async function () {
            const _year = 1705;
            const _expectedCentury = 18;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("1601 year test", async function () {
            const _year = 1601;
            const _expectedCentury = 17;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("2000 year test", async function () {
            const _year = 2000;
            const _expectedCentury = 20;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("2001 year test", async function () {
            const _year = 2001;
            const _expectedCentury = 21;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });

        it("Current year test", async function () {
            const _year = new Date().getFullYear();
            const _expectedCentury = 21;
            const _result = await katasContract.centuryOf(_year);
            expect(_result).to.be.equals(_expectedCentury);
        });
    });

    describe("repeatMe test", async() => {
        it("(0, '') test", async function () {
            const _n = 0;
            const _s = "";
            await expect(katasContract.repeatMe(_n, _s)).revertedWith("Invalid string");
        });

        it("(1, '') test", async function () {
            const _n = 1;
            const _s = "";
            await expect(katasContract.repeatMe(_n, _s)).revertedWith("Invalid string");
        });

        it("(0, 'Hola') test", async function () {
            const _n = 0;
            const _s = "Hola";
            const _expectedResult = "";
            const _result = await katasContract.repeatMe(_n, _s);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(1, 'Hola') test", async function () {
            const _n = 1;
            const _s = "Hola";
            const _expectedResult = _s;
            const _result = await katasContract.repeatMe(_n, _s);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(2, 'Hola') test", async function () {
            const _n = 2;
            const _s = "Hola";
            const _expectedResult = _s + _s;
            const _result = await katasContract.repeatMe(_n, _s);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(2, ' Hola ') test", async function () {
            const _n = 2;
            const _s = " Hola ";
            const _expectedResult = _s + _s;
            const _result = await katasContract.repeatMe(_n, _s);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(10, ' ') test", async function () {
            const _n = 10;
            const _s = " ";
            const _expectedResult = "          ";
            const _result = await katasContract.repeatMe(_n, _s);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(55, 'Hola ') test", async function () {
            const _n = 55;
            const _s = "Hola ";
            let _expectedResult = _s + _s + _s + _s + _s + _s + _s + _s + _s + _s;
            _expectedResult = _expectedResult + _expectedResult + _expectedResult + _expectedResult + _expectedResult;
            _expectedResult = _expectedResult + _s + _s + _s + _s + _s;
            const _result = await katasContract.repeatMe(_n, _s);
            expect(_result).to.be.equals(_expectedResult);
        });
    });

    describe("trianglesGeometry test", async() => {
        it("(0, 0) test", async function () {
            const _a = 0;
            const _b = 0;
            await expect(katasContract.trianglesGeometry(_a, _b)).revertedWith("Invalid angle _a");
        });

        it("(0, 1) test", async function () {
            const _a = 0;
            const _b = 1;
            await expect(katasContract.trianglesGeometry(_a, _b)).revertedWith("Invalid angle _a");
        });

        it("(1, 0) test", async function () {
            const _a = 1;
            const _b = 0;
            await expect(katasContract.trianglesGeometry(_a, _b)).revertedWith("Invalid angle _b");
        });

        it("(180, 180) test", async function () {
            const _a = 180;
            const _b = 180;
            await expect(katasContract.trianglesGeometry(_a, _b)).revertedWith("Invalid angles");
        });

        it("(179, 1) test", async function () {
            const _a = 179;
            const _b = 1;
            await expect(katasContract.trianglesGeometry(_a, _b)).revertedWith("Invalid angles");
        });

        it("(1, 179) test", async function () {
            const _a = 1;
            const _b = 179;
            await expect(katasContract.trianglesGeometry(_a, _b)).revertedWith("Invalid angles");
        });

        it("(90, 90) test", async function () {
            const _a = 90;
            const _b = 90;
            await expect(katasContract.trianglesGeometry(_a, _b)).revertedWith("Invalid angles");
        });

        it("(75, 105) test", async function () {
            const _a = 75;
            const _b = 105;
            await expect(katasContract.trianglesGeometry(_a, _b)).revertedWith("Invalid angles");
        });

        it("(1, 1) test", async function () {
            const _a = 1;
            const _b = 1;
            const _expectedResult = 179;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(90, 45) test", async function () {
            const _a = 90;
            const _b = 45;
            const _expectedResult = 90;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(45, 90) test", async function () {
            const _a = 45;
            const _b = 90;
            const _expectedResult = 135;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(178, 1) test", async function () {
            const _a = 178;
            const _b = 1;
            const _expectedResult = 2;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(1, 178) test", async function () {
            const _a = 1;
            const _b = 178;
            const _expectedResult = 179;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(60, 60) test", async function () {
            const _a = 60;
            const _b = 60;
            const _expectedResult = 120;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(30, 30) test", async function () {
            const _a = 30;
            const _b = 30;
            const _expectedResult = 150;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(17, 93) test", async function () {
            const _a = 17;
            const _b = 93;
            const _expectedResult = 163;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(93, 17) test", async function () {
            const _a = 93;
            const _b = 17;
            const _expectedResult = 87;
            const _result = await katasContract.trianglesGeometry(_a, _b);
            expect(_result).to.be.equals(_expectedResult);
        });
    });

    describe("maxCombination test", async() => {
        it("(0, 0, 0) test", async function () {
            const _a = 0;
            const _b = 0;
            const _c = 0;
            await expect(katasContract.maxCombination(_a, _b, _c)).revertedWith("Invalid inputs");
        });

        it("(0, 1, 1) test", async function () {
            const _a = 0;
            const _b = 1;
            const _c = 1;
            await expect(katasContract.maxCombination(_a, _b, _c)).revertedWith("Invalid inputs");
        });

        it("(1, 0, 1) test", async function () {
            const _a = 1;
            const _b = 0;
            const _c = 1;
            await expect(katasContract.maxCombination(_a, _b, _c)).revertedWith("Invalid inputs");
        });

        it("(1, 1, 0) test", async function () {
            const _a = 1;
            const _b = 1;
            const _c = 0;
            await expect(katasContract.maxCombination(_a, _b, _c)).revertedWith("Invalid inputs");
        });

        it("(11, 11, 11) test", async function () {
            const _a = 11;
            const _b = 11;
            const _c = 11;
            await expect(katasContract.maxCombination(_a, _b, _c)).revertedWith("Invalid inputs");
        });

        it("(11, 1, 1) test", async function () {
            const _a = 11;
            const _b = 1;
            const _c = 1;
            await expect(katasContract.maxCombination(_a, _b, _c)).revertedWith("Invalid inputs");
        });

        it("(1, 11, 1) test", async function () {
            const _a = 1;
            const _b = 11;
            const _c = 1;
            await expect(katasContract.maxCombination(_a, _b, _c)).revertedWith("Invalid inputs");
        });

        it("(1, 1, 11) test", async function () {
            const _a = 1;
            const _b = 1;
            const _c = 11;
            await expect(katasContract.maxCombination(_a, _b, _c)).revertedWith("Invalid inputs");
        });

        it("(1, 1, 1) test", async function () {
            const _a = 1;
            const _b = 1;
            const _c = 1;
            const _expectedResult = 3;
            const _result = await katasContract.maxCombination(_a, _b, _c);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(10, 10, 10) test", async function () {
            const _a = 10;
            const _b = 10;
            const _c = 10;
            const _expectedResult = 1000;
            const _result = await katasContract.maxCombination(_a, _b, _c);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(1, 2, 3) test", async function () {
            const _a = 1;
            const _b = 2;
            const _c = 3;
            const _expectedResult = 9;
            const _result = await katasContract.maxCombination(_a, _b, _c);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(3, 2, 1) test", async function () {
            const _a = 3;
            const _b = 2;
            const _c = 1;
            const _expectedResult = 9;
            const _result = await katasContract.maxCombination(_a, _b, _c);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(10, 1, 1) test", async function () {
            const _a = 10;
            const _b = 1;
            const _c = 1;
            const _expectedResult = 20;
            const _result = await katasContract.maxCombination(_a, _b, _c);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(10, 2, 1) test", async function () {
            const _a = 10;
            const _b = 2;
            const _c = 1;
            const _expectedResult = 30;
            const _result = await katasContract.maxCombination(_a, _b, _c);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(10, 1, 2) test", async function () {
            const _a = 10;
            const _b = 1;
            const _c = 2;
            const _expectedResult = 30;
            const _result = await katasContract.maxCombination(_a, _b, _c);
            expect(_result).to.be.equals(_expectedResult);
        });

        it("(1, 5, 1) test", async function () {
            const _a = 1;
            const _b = 5;
            const _c = 1;
            const _expectedResult = 7;
            const _result = await katasContract.maxCombination(_a, _b, _c);
            expect(_result).to.be.equals(_expectedResult);
        });
    });
});