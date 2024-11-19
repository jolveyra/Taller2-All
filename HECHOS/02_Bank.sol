//SPDX-License-Identifier:MIT
pragma solidity 0.8.24;

/**
 * @notice Compete the methods of the next contract that simulates the basic functionalities of a traditional bank
 * but for the cryptocurrency ethers
 */
contract Bank {
    /// @dev Define an account mapping named "balanceOf" to maintain each user's account balance
    /// @dev Account address => account balance
    mapping(address => uint256) public balanceOf;

    /// @dev Define a modifier called "isValidAmount" that receives a positive integer as parameter and reverts in case
    /// the amount is zero or greater than the account balance of the transaction sender, with message "Invalid _amount"

    modifier isValidAmount(uint256 amount, address sender) {
        require(amount > 0 && amount <= balanceOf[sender], "Invalid _amount");
        _;
    }

    /// @dev Define a modifier called "isValidAddress" that receives an address as parameter and reverts in case is zero address
    /// with message "Invalid _address"

    modifier isValidAddress(address addr) {
        require(addr != address(0), "Invalid _address");
        _;
    }

    /// @notice Allows the deposit of an amount of ethers to the sender's account.
    /// @dev If the sender does not exist open an account and set the deposit
    /// @dev The amount to deposit must be greater than zero. Otherwise revert with "Invalid _amount"
    function deposit() external payable {
        require(msg.value > 0, "Invalid _amount");
        uint256 actualBalance = balanceOf[msg.sender] + msg.value;
        balanceOf[msg.sender] = actualBalance;
    }

    /// @notice Allows the withdrawal of a previously deposited amount
    /// @param _amount Must be greater than zero and less or equals than the sender's balance.
    /// Otherwise revert with "Invalid _amount"
    function withdraw(
        uint256 _amount
    ) external isValidAmount(_amount, msg.sender) {
        balanceOf[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    /// @notice Transfer an amount from an existing account to another account.
    /// @dev If the recipient's account does not exist, create it and assign the corresponding balance
    /// @param _to Must be an address other than zero address, otherwise revert with "Invalid recipient address"
    /// @param _amount Must be greater than zero and less than or equal to the sender's balance,
    /// otherwise revert with "Invalid amount"
    function transfer(
        address _to,
        uint256 _amount
    ) external isValidAddress(_to) isValidAmount(_amount, msg.sender) {
        //require(_to != address(0), "Invalid recipient address");
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
    }

    /// @notice Define a function that allows any client of the bank to know the balance of any registered account.
    /// @dev If the sender of the request is not a client of the bank, revert with the message "Not a client"
    /// @param _account It is the account to check the balance. Must be a non-zero address and and belong to a bank customer
    /// ortherwise revert with the message "Invalid _address"
    function getBalance(
        address _account
    ) external view isValidAddress(_account) returns (uint256) {
        require(balanceOf[_account] > 0, "Not a client");
        return balanceOf[_account];
    }
}
