// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title GraveNFT
 * @dev Enhanced NFT contract for Hakatchi graves with admin controls
 */
contract GraveNFT is ERC721, Ownable {
    using Strings for uint256;

    // Custom error definitions
    error TokenDoesNotExist(uint256 tokenId);
    error MintToZeroAddress();
    error InvalidTokenId();
    error MintingDisabled();

    uint256 private _tokenIds;
    mapping(uint256 => uint256[]) private _graveHeights; // Store Celestia heights
    string private _baseTokenURI;
    
    // Additional admin controls
    bool public mintingEnabled = true;
    uint256 public maxSupply = 10000; // Default max supply
    mapping(address => bool) private _minters; // Authorized minters
    
    // Royalty info
    address public royaltyReceiver;
    uint256 public royaltyPercentage = 250; // 2.5% (in basis points)

    // Events
    event GraveMinted(uint256 indexed tokenId, address indexed owner);
    event HeightRecorded(uint256 indexed tokenId, uint256 height);
    event MintingStatusChanged(bool enabled);
    event MaxSupplyChanged(uint256 newMaxSupply);
    event MinterStatusChanged(address minter, bool status);
    event RoyaltyInfoChanged(address receiver, uint256 percentage);
    event BaseURIChanged(string newBaseURI);

    constructor() ERC721("Hakatchi", "HAKA") Ownable(msg.sender) {
        royaltyReceiver = msg.sender;
        _minters[msg.sender] = true; // Owner is a minter by default
    }

    /**
     * @dev Modifier to check if caller is an authorized minter
     */
    modifier onlyMinter() {
        require(_minters[msg.sender], "Not authorized to mint");
        _;
    }

    /**
     * @dev Sets the base URI for token metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIChanged(baseURI);
    }

    /**
     * @dev Internal function to get the base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId Token ID to query
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert TokenDoesNotExist(tokenId);
        return string.concat(_baseURI(), Strings.toString(tokenId), ".json");
    }

    /**
     * @dev Mints a new grave NFT
     * @return New token ID
     */
    function mintGrave() external returns (uint256) {
        if (!mintingEnabled) revert MintingDisabled();
        if (_tokenIds >= maxSupply) revert("Max supply reached");
        
        uint256 newTokenId = ++_tokenIds;
        
        _safeMint(msg.sender, newTokenId);
        
        emit GraveMinted(newTokenId, msg.sender);
        return newTokenId;
    }

    /**
     * @dev Mints a new grave NFT for a specific address (admin only)
     * @param to Recipient address
     * @return New token ID
     */
    function mintGraveFor(address to) external onlyMinter returns (uint256) {
        if (to == address(0)) revert MintToZeroAddress();
        if (!mintingEnabled) revert MintingDisabled();
        if (_tokenIds >= maxSupply) revert("Max supply reached");
        
        uint256 newTokenId = ++_tokenIds;
        
        _safeMint(to, newTokenId);
        
        emit GraveMinted(newTokenId, to);
        return newTokenId;
    }

    /**
     * @dev Records a new Celestia height for a grave NFT
     * @param tokenId Token ID to update
     * @param height Celestia height to record
     */
    function recordHeight(uint256 tokenId, uint256 height) external onlyOwner {
        if (!_exists(tokenId)) revert TokenDoesNotExist(tokenId);
        
        _graveHeights[tokenId].push(height);
        emit HeightRecorded(tokenId, height);
    }

    /**
     * @dev Returns the Celestia heights for a grave NFT
     * @param tokenId Token ID to query
     */
    function getGraveHeights(uint256 tokenId) public view returns (uint256[] memory) {
        if (!_exists(tokenId)) revert TokenDoesNotExist(tokenId);
        return _graveHeights[tokenId]; 
    }

    /**
     * @dev Internal function to check if a token exists
     * @param tokenId Token ID to check
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // ======== Admin Functions ========

    /**
     * @dev Enables or disables minting
     * @param enabled New minting status
     */
    function setMintingEnabled(bool enabled) external onlyOwner {
        mintingEnabled = enabled;
        emit MintingStatusChanged(enabled);
    }

    /**
     * @dev Sets the maximum supply
     * @param newMaxSupply New maximum supply
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= _tokenIds, "New max supply must be >= current token count");
        maxSupply = newMaxSupply;
        emit MaxSupplyChanged(newMaxSupply);
    }

    /**
     * @dev Adds or removes a minter
     * @param minter Address to update
     * @param status New minter status
     */
    function setMinter(address minter, bool status) external onlyOwner {
        _minters[minter] = status;
        emit MinterStatusChanged(minter, status);
    }

    /**
     * @dev Sets royalty information
     * @param receiver Address to receive royalties
     * @param percentage Royalty percentage (in basis points, e.g. 250 = 2.5%)
     */
    function setRoyaltyInfo(address receiver, uint256 percentage) external onlyOwner {
        require(percentage <= 1000, "Percentage cannot exceed 10%");
        royaltyReceiver = receiver;
        royaltyPercentage = percentage;
        emit RoyaltyInfoChanged(receiver, percentage);
    }

    /**
     * @dev Withdraw funds from the contract
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    /**
     * @dev EIP-2981 royalty standard support
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address, uint256) {
        if (!_exists(tokenId)) revert TokenDoesNotExist(tokenId);
        return (royaltyReceiver, (salePrice * royaltyPercentage) / 10000);
    }

    /**
     * @dev EIP-165 support for royalty interface
     */
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return
            interfaceId == 0x2a55205a || // EIP-2981 Royalty Standard
            super.supportsInterface(interfaceId);
    }
}
