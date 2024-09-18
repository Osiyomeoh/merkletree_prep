// import {
//     loadFixture,
//     time
//   } from "@nomicfoundation/hardhat-toolbox/network-helpers";
//   import { expect } from "chai";
//   import hre from "hardhat";
//   import { ethers } from "hardhat";
//   import { generateMerkleTree } from "../generateMerkleRoot";
//   const helpers = require("@nomicfoundation/hardhat-network-helpers");
  
//   // Main test suite for the Airdrop contract
//   describe("MerkleAirdrop", function () {
  
//     const AirDropEndingTimeInSec = time.duration.seconds(30 * 24 * 60 * 60);
  
//     // Function to deploy the SamToken ERC-20 contract.
//     async function deployTokenFixture() {
//       const [owner, otherAccount] = await hre.ethers.getSigners();
    
//       const SamToken = await hre.ethers.getContractFactory("SamToken", owner);
//       const token = await SamToken.deploy();
    
//       return { SamToken, token, owner, otherAccount };
//     }
  
//     // Function to deploy the Merkle Airdrop contract
//     async function deployMerkleAirdropFixture() {
//       const TOKEN_HOLDER = "0x6E404D8eBf475e196E0581Df3B5C1D43478ad40C";
//       const NON_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
      
//       await helpers.impersonateAccount(TOKEN_HOLDER);
//       await helpers.impersonateAccount(NON_HOLDER);
  
//       const holder = await ethers.getSigner(TOKEN_HOLDER);
//       const nonholder = await ethers.getSigner(NON_HOLDER);
  
//       const { token } = await loadFixture(deployTokenFixture);  // Load the deployed token.
  
//       const [owner, other, addr1] = await ethers.getSigners();  // Get three accounts: owner, other, addr1.
  
//       // Generate Merkle tree from eligible addresses
//       const { merkleRoot, merkleTree, leaves } = generateMerkleTree();
  
//       // Deploy the Merkle Airdrop contract with the token address, Merkle root, and ending time.
//       const MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
//       const airdropAddress = await MerkleAirdrop.deploy(token, merkleRoot, AirDropEndingTimeInSec);
  
//       return { token, owner, holder, nonholder, leaves, other, airdropAddress, merkleRoot, addr1, merkleTree };
//     }
  
//     // Test suite for the SamToken deployment.
//     describe("SamToken Deployment", function () {
//       it("Should check that the correct number of tokens are minted", async function () {
//         const { token } = await loadFixture(deployTokenFixture);
  
//         const expectedSupply = ethers.parseUnits("500000", 18);
//         expect(await token.totalSupply()).to.equal(expectedSupply);  // Check that the token supply matches the expected value.
//       });
//     });
  
//     // Test suite for the Merkle Airdrop contract deployment.
//     describe("MerkleAirdrop Deployment", function () {
//       it("Should set the correct Merkle root", async function () {
//         const { airdropAddress, merkleRoot } = await loadFixture(deployMerkleAirdropFixture);
//         expect(await airdropAddress.merkleRoot()).to.equal(merkleRoot);  // Verify that the Merkle root is correctly set in the contract.
//       });
  
//       it("Should set the correct token address", async function () {
//         const { token, airdropAddress } = await loadFixture(deployMerkleAirdropFixture);
//         expect(await airdropAddress.tokenAddress()).to.equal(token.address);  // Verify that the token address is correctly set.
//       });
  
//       it("Should set the correct owner", async function () {
//         const { owner, airdropAddress } = await loadFixture(deployMerkleAirdropFixture);
//         expect(await airdropAddress.owner()).to.equal(owner.address);  // Verify that the contract owner is correctly set.
//       });
//     });
  
//     // Test suite for Airdrop functionality
//     describe("Airdrop Functionality", function () {
//       it("Should allow BAYC holder to claim airdrop", async function () {
//         const { token, airdropAddress, merkleTree, leaves, holder } = await loadFixture(deployMerkleAirdropFixture);
        
//         const amount = ethers.parseUnits("40", 18);  // Amount to be claimed
  
//         // Transfer tokens to the airdrop contract
//         await token.transfer(airdropAddress.address, ethers.parseUnits("100000", 18));
  
//         // Simulate airdrop claim by BAYC holder
//         await airdropAddress.connect(holder).claimAirDrop(merkleTree, leaves, 0, amount);
  
//         expect(await token.balanceOf(holder.address)).to.equal(amount);  // Verify holder received tokens.
//       });
  
//       it("Should revert if a non-holder of BAYC tries to claim airdrop", async function () {
//         const { airdropAddress, merkleTree, leaves, nonholder } = await loadFixture(deployMerkleAirdropFixture);
  
//         const amount = ethers.parseUnits("40", 18);
  
//         await expect(
//           airdropAddress.connect(nonholder).claimAirDrop(merkleTree, leaves, 0, amount)
//         ).to.be.revertedWithCustomError(airdropAddress, "YouDoNotOwnRequiredNFT");
//       });
  
//       it("Should not allow claiming airdrop twice", async function () {
//         const { token, airdropAddress, merkleTree, leaves, holder } = await loadFixture(deployMerkleAirdropFixture);
  
//         const amount = ethers.parseUnits("40", 18);
  
//         // First claim
//         await airdropAddress.connect(holder).claimAirDrop(merkleTree, leaves, 0, amount);
//         expect(await token.balanceOf(holder.address)).to.equal(amount);
  
//         // Second claim (should fail)
//         await expect(
//           airdropAddress.connect(holder).claimAirDrop(merkleTree, leaves, 0, amount)
//         ).to.be.revertedWithCustomError(airdropAddress, "AirDropAlreadyClaimed");
//       });
//     });
//   });
  