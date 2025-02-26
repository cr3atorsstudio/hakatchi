// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IGraveNFT {
    enum Personality {
        CHEERFUL,
        GLOOMY,
        MYSTERIOUS,
        FRIENDLY,
        GRUMPY
    }

    enum GraveType {
        BASIC,
        FANCY,
        ANCIENT,
        MODERN
    }

    struct Traits {
        Personality personality;
        string color;
        string origin;
        GraveType graveType;
    }

    struct GraveStatus {
        string name;
        uint8 energy;
        uint8 cleanliness;
        uint8 mood;
        Traits traits;
    }

    event GraveCreated(uint256 indexed tokenId, address indexed owner, string name);
    event GraveFed(uint256 indexed tokenId);
    event GraveCleaned(uint256 indexed tokenId);
    event GravePlayed(uint256 indexed tokenId);

    function mintGrave(string memory name, Traits memory traits) external returns (uint256);
    function getGraveStatus(uint256 tokenId) external view returns (GraveStatus memory);
    function updateStatus(uint256 tokenId, uint8 energy, uint8 cleanliness, uint8 mood) external;
}
