// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract StartupContract {
    struct Startup {
        string name;
        string description;
        address fundSeeker;
        uint256 goal;
    }

    mapping(bytes32 => Startup) public startups;
    bytes32[] public startupIds;

    event StartupRegistered(
        bytes32 indexed startupId,
        address indexed fundSeeker,
        string name,
        string description,
        uint256 goal
    );

    function registerStartup(
        string calldata _name,
        string calldata _description,
        uint256 _goal
    ) external returns (bytes32) {
        require(
            bytes(_name).length > 0 && bytes(_description).length > 0,
            'Name and description cannot be empty.'
        );
        bytes memory nameBytes = bytes(_name);
        bytes memory descriptionBytes = bytes(_description);
        require(
            nameBytes.length <= 32 && descriptionBytes.length <= 512,
            'Name should not exceed 32 bytes and description should not exceed 512 bytes.'
        );

        bytes32 startupId = keccak256(abi.encodePacked(msg.sender, _name, _description, _goal));
        startups[startupId] = Startup({
            name: _name,
            description: _description,
            fundSeeker: msg.sender,
            goal: _goal
        });
        startupIds.push(startupId);

        emit StartupRegistered(startupId, msg.sender, _name, _description, _goal);

        return startupId;
    }

    function getProject(bytes32 _startupId) external view returns (uint256) {
        Startup storage startup = startups[_startupId];
        require(startup.fundSeeker != address(0), "Startup ID does not exist.");
        return startup.goal;
    }

    function getFundSeekerAddress(bytes32 _startupId) external view returns (address) {
        Startup storage startup = startups[_startupId];
        require(startup.fundSeeker != address(0), "Startup ID does not exist.");
        return startup.fundSeeker;
    }


    function getAllStartupIds() external view returns (bytes32[] memory) {
        return startupIds;
    }
}
