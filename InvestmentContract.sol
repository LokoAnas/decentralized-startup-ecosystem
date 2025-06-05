// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvestmentContract {
    address public platform;
    address public startupContractAddress;

    event PaymentReceived(address indexed investor, uint256 indexed startupId, uint256 amount);

    constructor(address _startupContractAddress) {
        platform = msg.sender;
        startupContractAddress = _startupContractAddress;
    }

    function pay(uint256 startupId) external payable {
        require(startupId != uint256(0), "Invalid startupId Datatype");
        address fundSeeker = getFundSeekerAddress(startupId);
        require(fundSeeker != address(0), "Startup ID does not exist");
    
        uint256 value = msg.value;
        require(value > 0, "Payment amount must be greater than 0");

        uint256 platformFee = (value * 2) / 100; // 2% of the payment
        uint256 remainingAmount = value - platformFee;

        payable(fundSeeker).transfer(remainingAmount);
        payable(platform).transfer(platformFee);

        emit PaymentReceived(msg.sender, startupId, value);
    }


    function getFundSeekerAddress(uint256 startupId) internal view returns (address) {
        // Call the getFundSeekerAddress function from StartupContract
        return StartupContract(startupContractAddress).getFundSeekerAddress(startupId);
    }
}

// Interface for the StartupContract
interface StartupContract {
    function getFundSeekerAddress(uint256 startupId) external view returns (address);
}
