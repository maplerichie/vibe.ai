// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IVibeToken
 * @dev Interface for the Vibe Token
 */
interface IVibeToken {
    function mint(address to, uint256 amount) external;
}

/**
 * @title IVibeNFT
 * @dev Interface for the Vibe Reward NFT
 */
interface IVibeNFT {
    function mint(address to, string memory awardType, string memory description, uint16 year)
        external
        returns (uint256);
}

/**
 * @title VibeRewardManager
 * @dev Implementation of the Vibe Reward Manager, which can mint NFTs and Vibe tokens as rewards
 */
contract VibeRewardManager is Ownable {
    // Vibe token contract
    IVibeToken public vibeToken;

    // VibeNFT contract
    IVibeNFT public vibeNFT;

    // Award types
    enum AwardType {
        TOP_CONTRIBUTOR,
        COMMUNITY_STAR,
        INNOVATION_AWARD,
        GOVERNANCE_EXPERT
    }

    // Mapping from award type to token amount
    mapping(AwardType => uint256) public awardTokenAmounts;

    // Events
    event RewardManagerUpdated(address vibeToken, address VibeNFT);
    event AwardTokenAmountSet(AwardType awardType, uint256 amount);
    event NFTDistributed(address indexed to, AwardType awardType, uint256 tokenAmount, uint256 nftId);
    event TokenDistributed(address indexed to, uint256 tokenAmount);

    constructor(address vibeToken_, address vibeNFT_) Ownable(msg.sender) {
        require(vibeToken_ != address(0), "VibeRewardManager: zero address for vibe token");
        require(vibeNFT_ != address(0), "VibeRewardManager: zero address for vibe reward NFT");

        vibeToken = IVibeToken(vibeToken_);
        vibeNFT = IVibeNFT(vibeNFT_);
    }

    /**
     * @dev Initializes the reward manager with the Vibe token and VibeNFT contracts
     * @param vibeToken_ The address of the Vibe token contract
     * @param vibeNFT_ The address of the VibeNFT contract
     */
    function updateRewards(address vibeToken_, address vibeNFT_) external onlyOwner {
        require(vibeToken_ != address(0), "VibeRewardManager: zero address for vibe token");
        require(vibeNFT_ != address(0), "VibeRewardManager: zero address for vibe reward NFT");

        vibeToken = IVibeToken(vibeToken_);
        vibeNFT = IVibeNFT(vibeNFT_);

        emit RewardManagerUpdated(vibeToken_, vibeNFT_);
    }

    /**
     * @dev Sets the token amount for an award type
     * @param awardType The award type
     * @param amount The token amount
     */
    function setAwardTokenAmount(AwardType awardType, uint256 amount) external onlyOwner {
        awardTokenAmounts[awardType] = amount;
        emit AwardTokenAmountSet(awardType, amount);
    }

    /**
     * @dev Distributes a NFT to a user
     * @param to The address to distribute the reward to
     * @param awardType The award type
     * @param description The description of the award
     */
    function mintNFT(address to, AwardType awardType, bool withToken, string memory description) external onlyOwner {
        require(to != address(0), "VibeRewardManager: zero address");
        require(address(vibeToken) != address(0), "VibeRewardManager: vibe token not initialized");
        require(address(vibeNFT) != address(0), "VibeRewardManager: vibe reward NFT not initialized");

        // Get the token amount for the award type
        uint256 tokenAmount = awardTokenAmounts[awardType];
        require(tokenAmount > 0, "VibeRewardManager: token amount not set for award type");

        // Get the current year
        uint16 currentYear = uint16(block.timestamp / 31536000 + 1970);

        // Convert award type to string
        string memory awardTypeString = _awardTypeToString(awardType);

        // Mint NFT
        uint256 nftId = vibeNFT.mint(to, awardTypeString, description, currentYear);

        if (withToken) {
            // Transfer Vibe tokens
            vibeToken.mint(to, tokenAmount);
            emit NFTDistributed(to, awardType, tokenAmount, nftId);
        } else {
            emit NFTDistributed(to, awardType, 0, nftId);
        }
    }

    /**
     * @dev Distributes tokens to a user
     * @param to The address to distribute the reward to
     * @param tokenAmount The award amount
     */
    function mintToken(address to, uint256 tokenAmount) external onlyOwner {
        require(to != address(0), "VibeRewardManager: zero address");
        require(address(vibeToken) != address(0), "VibeRewardManager: vibe token not initialized");

        // Transfer Vibe tokens
        vibeToken.mint(to, tokenAmount);

        emit TokenDistributed(to, tokenAmount);
    }

    /**
     * @dev Converts an award type to a string
     * @param awardType The award type
     * @return The string representation of the award type
     */
    function _awardTypeToString(AwardType awardType) internal pure returns (string memory) {
        if (awardType == AwardType.TOP_CONTRIBUTOR) {
            return "Top Contributor";
        } else if (awardType == AwardType.COMMUNITY_STAR) {
            return "Community Star";
        } else if (awardType == AwardType.INNOVATION_AWARD) {
            return "Innovation Award";
        } else if (awardType == AwardType.GOVERNANCE_EXPERT) {
            return "Governance Expert";
        } else {
            return "Unknown";
        }
    }

    /**
     * @dev Allows the owner to withdraw any ERC20 tokens from the contract
     * @param token The address of the token to withdraw
     * @param amount The amount to withdraw
     */
    function withdrawERC20(address token, uint256 amount) external onlyOwner {
        require(token != address(0), "VibeRewardManager: zero address");
        require(amount > 0, "VibeRewardManager: amount must be greater than 0");

        IERC20 tokenContract = IERC20(token);
        require(tokenContract.transfer(owner(), amount), "VibeRewardManager: token transfer failed");
    }
}
