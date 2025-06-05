// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NDAContract {
    address public startupContractAddress;

    struct NDA {
        address investor;
        address fundraiser;
        bool signed;
        uint256 timestamp;
    }

    constructor(address _startupContractAddress) {
        startupContractAddress = _startupContractAddress;
    }

    mapping(address => NDA[]) public ndas;

    event NDAUpdated(address indexed investor, address indexed fundraiser, bool signed, uint256 timestamp);

    function signNDA(address fundraiser) external {
        address fundseeker = getFundSeekerAddress(fundraiser);
        require(fundseeker == fundraiser, "Invalid fundraiser address");
        
        NDA[] storage investorNDAs = ndas[msg.sender];
        for (uint256 i = 0; i < investorNDAs.length; i++) {
            require(investorNDAs[i].fundraiser != fundraiser, "Investor already has an NDA with this fundraiser");
        }
        
        investorNDAs.push(NDA(msg.sender, fundseeker, true, block.timestamp));
        emit NDAUpdated(msg.sender, fundseeker, true, block.timestamp);
    }

    function getNDAStatus(address investor) external view returns (NDA[] memory) {
        require(investor != address(0), "Invalid investor address");

        return ndas[investor];
    }

    function getFundSeekerAddress(address fundraiser) internal view returns (address) {
        return StartupContractNew(startupContractAddress).getFundSeekerAddress(fundraiser);
    }
}
interface StartupContractNew {
    function getFundSeekerAddress(address fundraiser) external view returns (address);
}
