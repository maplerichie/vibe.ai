// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VibeToken
 * @dev Implementation of the Vibe Token, which can be minted only by the reward manager
 */
contract VibeToken is ERC20, Ownable {
    // Reward manager address
    address public rewardManager;

    // Events
    event RewardManagerSet(address indexed rewardManager);

    constructor() ERC20("Vibe Token", "VIBE") Ownable(msg.sender) {}

    /**
     * @dev Sets the reward manager address
     * @param rewardManager_ The address of the reward manager
     */
    function setRewardManager(address rewardManager_) external onlyOwner {
        require(rewardManager_ != address(0), "VibeToken: zero address");
        rewardManager = rewardManager_;
        emit RewardManagerSet(rewardManager_);
    }

    /**
     * @dev Mints tokens to an address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == rewardManager, "VibeToken: caller is not the reward manager");
        require(to != address(0), "VibeToken: zero address");
        require(amount > 0, "VibeToken: amount must be greater than 0");
        _mint(to, amount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) public {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "Vibe: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }
}
