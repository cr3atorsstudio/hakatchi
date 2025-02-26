// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IGraveNFT.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GraveNFT is ERC721, Ownable, IGraveNFT {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;
    mapping(uint256 => GraveStatus) private _graves;
    mapping(uint256 => uint256[]) private _graveHeights; // Celestia の height を複数保持
    string private _baseTokenURI;

    constructor() ERC721("Hakatchi", "HAKA") {}

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "GraveNFT: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        if (bytes(baseURI).length == 0) {
            return "";
        }

        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    function mintGrave(
        string memory name,
        Traits memory traits,
        uint256 height // Celestia の height を最初に設定
    ) external override returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _graves[newTokenId] = GraveStatus({
            name: name,
            energy: 50,
            cleanliness: 50,
            mood: 50,
            traits: traits
        });

        _graveHeights[newTokenId].push(height); // Celestia の height を配列に追加

        emit GraveCreated(newTokenId, msg.sender, name);
        return newTokenId;
    }

    function updateStatus(
        uint256 tokenId,
        uint8 energy,
        uint8 cleanliness,
        uint8 mood,
        uint256 height // 新しい Celestia の height を追加
    ) external override onlyOwner {
        require(_exists(tokenId), "GraveNFT: Token does not exist");

        GraveStatus storage grave = _graves[tokenId];
        grave.energy = energy;
        grave.cleanliness = cleanliness;
        grave.mood = mood;

        _graveHeights[tokenId].push(height); // 過去の height も記録
    }

    function getTraits(uint256 tokenId) public view returns (Traits memory) {
        require(_exists(tokenId), "GraveNFT: Token does not exist");
        return _graves[tokenId].traits;
    }

    function getGraveHeights(uint256 tokenId) public view returns (uint256[] memory) {
        require(_exists(tokenId), "GraveNFT: Token does not exist");
        return _graveHeights[tokenId]; // Celestia の height の履歴を取得
    }
}
