// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Formatter} from "@selfxyz/contracts/contracts/libraries/Formatter.sol";
import {CircuitAttributeHandler} from "@selfxyz/contracts/contracts/libraries/CircuitAttributeHandler.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

contract VibeVerifier is SelfVerificationRoot, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable vibe;

    uint256 constant INITIAL_AMOUNT = 100e18;
    mapping(address => bool) public initialClaim;

    mapping(uint256 => bool) internal _nullifiers;

    event VibeClaimed(address indexed claimer, uint256 amount);

    error RegisteredNullifier();

    constructor(
        address _identityVerificationHub,
        uint256 _scope,
        uint256 _attestationId,
        address _token,
        bool _olderThanEnabled,
        uint256 _olderThan,
        bool _forbiddenCountriesEnabled,
        uint256[4] memory _forbiddenCountriesListPacked,
        bool[3] memory _ofacEnabled
    )
        SelfVerificationRoot(
            _identityVerificationHub,
            _scope,
            _attestationId,
            _olderThanEnabled,
            _olderThan,
            _forbiddenCountriesEnabled, // Flag to enable forbidden countries verification
            _forbiddenCountriesListPacked, // Packed data representing the list of forbidden countries
            _ofacEnabled // Flag to enable OFAC check
        )
        Ownable(_msgSender())
    {
        vibe = IERC20(_token);
    }

    function verifySelfProof(IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof) public override {
        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }

        if (_nullifiers[proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX]]) {
            revert RegisteredNullifier();
        }

        IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result = _identityVerificationHub
            .verifyVcAndDisclose(
            IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                olderThanEnabled: _verificationConfig.olderThanEnabled,
                olderThan: _verificationConfig.olderThan,
                forbiddenCountriesEnabled: _verificationConfig.forbiddenCountriesEnabled,
                forbiddenCountriesListPacked: _verificationConfig.forbiddenCountriesListPacked,
                ofacEnabled: _verificationConfig.ofacEnabled,
                vcAndDiscloseProof: proof
            })
        );

        _nullifiers[result.nullifier] = true;
        if (!initialClaim[address(uint160(result.userIdentifier))]) {
            initialClaim[address(uint160(result.userIdentifier))] = true;
            vibe.safeTransfer(address(uint160(result.userIdentifier)), INITIAL_AMOUNT);
            emit VibeClaimed(address(uint160(result.userIdentifier)), INITIAL_AMOUNT);
        }
    }

    function withdrawVibe(address to, uint256 amount) external onlyOwner {
        vibe.safeTransfer(to, amount);
    }
}
