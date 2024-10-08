// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MerkleAirdrop {
    address public owner;
    IERC20 public token;
    IERC721 public constant BAYC = IERC721(0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D); 
    bytes32 public merkleRootHash;
    mapping(address => bool) public hasClaimed;

    event SuccessfulClaim(address indexed user, uint amount);

    modifier onlyOwner(){
        require(msg.sender == owner, "caller is not owner");
        _;
    }

    constructor(address _token, bytes32 _merkleRootHash) {
         token = IERC20(_token);
         merkleRootHash = _merkleRootHash;  
         owner = msg.sender;
    }

    function claimAirdrop(uint _amount, bytes32[] memory _merkleProof) external {
        require(!hasClaimed[msg.sender], "already claimed");
        require(BAYC.balanceOf(msg.sender) > 0, "No BAYC NFT ownership"); 

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, _amount))));
        require(MerkleProof.verify(_merkleProof, merkleRootHash, leaf), "Invalid proof");

        hasClaimed[msg.sender] = true;

        require(token.transfer(msg.sender, _amount), "transfer failed");

        emit SuccessfulClaim(msg.sender, _amount);
    }

    function UpdateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        require(_newMerkleRoot != bytes32(0), "invalid data type");
        merkleRootHash = _newMerkleRoot;
    }

    function withdrawRemainingTokens() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens left to withdraw.");
        require(token.transfer(owner, balance), "Token transfer failed.");
    }
}
