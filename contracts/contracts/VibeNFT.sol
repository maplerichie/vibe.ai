// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VibeNFT
 * @dev Implementation of the Vibe Reward NFT, which can be minted only by the reward manager
 */
contract VibeNFT is ERC721, Ownable {
    using Strings for uint256;

    // Rarity levels
    enum Rarity {
        COMMON,
        UNCOMMON,
        RARE,
        EPIC,
        LEGENDARY
    }

    // Trait categories
    enum TraitCategory {
        BACKGROUND,
        BORDER,
        ICON,
        EFFECT
    }

    uint256 public latestTokenId;

    // Reward manager address
    address public rewardManager;

    // Base URI for token metadata
    string private _baseTokenURI;

    // Mapping from token ID to rarity
    mapping(uint256 => Rarity) public tokenRarity;

    // Mapping from token ID to traits
    mapping(uint256 => mapping(TraitCategory => uint8)) public tokenTraits;

    // Mapping from token ID to year earned
    mapping(uint256 => uint16) public tokenYear;

    // Mapping from token ID to award type
    mapping(uint256 => string) public tokenAwardType;

    // Mapping from token ID to description
    mapping(uint256 => string) public tokenDescription;

    // Events
    event RewardManagerSet(address indexed rewardManager);
    event BaseURISet(string baseURI);
    event NFTMinted(
        address indexed to, uint256 indexed tokenId, Rarity rarity, string awardType, string description, uint16 year
    );

    constructor() ERC721("Vibe Reward NFT", "VIBE") Ownable(msg.sender) {}

    /**
     * @dev Sets the reward manager address
     * @param rewardManager_ The address of the reward manager
     */
    function setRewardManager(address rewardManager_) external onlyOwner {
        require(rewardManager_ != address(0), "VibeNFT: zero address");
        rewardManager = rewardManager_;
        emit RewardManagerSet(rewardManager_);
    }

    /**
     * @dev Sets the base URI for token metadata
     * @param baseURI The base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURISet(baseURI);
    }

    /**
     * @dev Mints a new NFT
     * @param to The address to mint the NFT to
     * @param awardType The type of award
     * @param description The description of the award
     * @param year The year the award was earned
     * @return The ID of the minted NFT
     */
    function mint(address to, string memory awardType, string memory description, uint16 year)
        external
        returns (uint256)
    {
        require(msg.sender == rewardManager, "VibeNFT: caller is not the reward manager");
        require(to != address(0), "VibeNFT: zero address");

        uint256 tokenId = latestTokenId;
        latestTokenId++;
        _safeMint(to, tokenId);

        // Set token metadata
        tokenRarity[tokenId] = _generateRandomRarity();
        tokenYear[tokenId] = year;
        tokenAwardType[tokenId] = awardType;
        tokenDescription[tokenId] = description;

        // Generate random traits
        tokenTraits[tokenId][TraitCategory.BACKGROUND] =
            uint8(uint256(keccak256(abi.encodePacked(block.timestamp, tokenId, "background"))) % 5);
        tokenTraits[tokenId][TraitCategory.BORDER] =
            uint8(uint256(keccak256(abi.encodePacked(block.timestamp, tokenId, "border"))) % 5);
        tokenTraits[tokenId][TraitCategory.ICON] =
            uint8(uint256(keccak256(abi.encodePacked(block.timestamp, tokenId, "icon"))) % 5);
        tokenTraits[tokenId][TraitCategory.EFFECT] =
            uint8(uint256(keccak256(abi.encodePacked(block.timestamp, tokenId, "effect"))) % 5);

        emit NFTMinted(to, tokenId, tokenRarity[tokenId], awardType, description, year);

        return tokenId;
    }

    /**
     * @dev Returns the total supply of NFTs
     * @return The total supply
     */
    function totalSupply() public view returns (uint256) {
        return latestTokenId;
    }

    /**
     * @dev Returns the base URI for token metadata
     * @return The base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Generates a random rarity level
     * @return The generated rarity level
     */
    function _generateRandomRarity() internal view returns (Rarity) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 100;
        if (random < 40) {
            return Rarity.COMMON;
        } else if (random < 70) {
            return Rarity.UNCOMMON;
        } else if (random < 85) {
            return Rarity.RARE;
        } else if (random < 95) {
            return Rarity.EPIC;
        } else {
            return Rarity.LEGENDARY;
        }
    }

    /**
     * @dev Returns the metadata for a token
     * @param tokenId The ID of the token
     */
    function getTokenMetadata(uint256 tokenId)
        external
        view
        returns (Rarity rarity, uint8[4] memory traits, uint16 year, string memory awardType, string memory description)
    {
        traits = [
            tokenTraits[tokenId][TraitCategory.BACKGROUND],
            tokenTraits[tokenId][TraitCategory.BORDER],
            tokenTraits[tokenId][TraitCategory.ICON],
            tokenTraits[tokenId][TraitCategory.EFFECT]
        ];
        return (tokenRarity[tokenId], traits, tokenYear[tokenId], tokenAwardType[tokenId], tokenDescription[tokenId]);
    }
}
