import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  //import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  import { ethers } from "hardhat";

  import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  
  describe("MerkleAirdrop", function () {

    const merkleTree = "0x6b97a48c2de43f662e3735eb7efdefafe60d7fabdff6b14b413957701afb7b87";
    // const hexString = "0x6b97a48c2de43f662e3735eb7efdefafe60d7fabdff6b14b413957701afb7b87";
    const BAYC = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
    const BAYC_HOLDER = "0x6E404D8eBf475e196E0581Df3B5C1D43478ad40C";
    // Convert to bytes32
    const bytes32Value = ethers.hexlify(merkleTree);
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    // async function impersonateBAYCHolder() {
    //   await hre.network.provider.request({
    //     method: "hardhat_impersonateAccount",
    //     params: [BAYC_HOLDER],
    //   });
  
    //   const baycHolder = await hre.ethers.getSigner(BAYC_HOLDER);
    //   return baycHolder;
    // }

    async function deployTokenFixture() {
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const SamToken = await hre.ethers.getContractFactory("SamToken", owner);
      const samtoken = await SamToken.deploy();
  
      return { SamToken, samtoken, owner, otherAccount };
    }

    async function deployMerkleAirdropFixture() {

      const [owner, otherAccount] = await hre.ethers.getSigners();
      const { samtoken } = await loadFixture(deployTokenFixture);
      await helpers.impersonateAccount(BAYC_HOLDER);
      const baycHolder = await ethers.getSigner(BAYC_HOLDER);
  
      const leaves = [
        [ baycHolder.address,  ethers.parseUnits("31", 18) ],
        [otherAccount.address, ethers.parseEther("50") ],
      ];
      

      const merkleTree = StandardMerkleTree.of(leaves, ["address", "uint256"]);
      const merkleRoot = merkleTree.root;
  
      const MerkleAirdrop = await hre.ethers.getContractFactory("MerkleAirdrop");
      const merkleAirdrop = await MerkleAirdrop.deploy(samtoken, merkleRoot);
      return { merkleAirdrop, owner, otherAccount, samtoken, merkleTree, leaves, merkleRoot, baycHolder };
    }
  
  
    describe("Token Deployment", function () {
      it("Should set the right owner", async function () {
        const { samtoken, owner} = await loadFixture(deployTokenFixture);
  
        expect(await samtoken.owner()).to.equal(owner);
      });
  
   
    });
  describe("MerkleAirdrop DEPLOYMENT", function () {
    it(" should check if contract deployed successfully", async function() {
  
        const { merkleAirdrop, owner } = await loadFixture(deployMerkleAirdropFixture)

        expect(await merkleAirdrop.owner()).to.equal(owner);
    })
    it(" should check that contract was deployed with the correct erc20 token and merklehash", async function() {
        const { samtoken, otherAccount } = await loadFixture(deployTokenFixture)
        const { merkleAirdrop, owner, merkleTree } = await loadFixture(deployMerkleAirdropFixture)

      
        const expectedMerkleRoot = ethers.hexlify(merkleTree.root);
        expect(await merkleAirdrop.merkleRootHash()).to.equal(expectedMerkleRoot);

        
    })
    
  });
  

  describe("MerkleAirdrop DEPLOYMENT", function () {
    it("should allow BAYC holder to claim airdrop", async function () {
      const { merkleAirdrop, samtoken, owner, baycHolder, merkleTree } = await loadFixture(deployMerkleAirdropFixture);

      
    
      await owner.sendTransaction({
        to: baycHolder,
        value: ethers.parseEther("10"), 
      });
      
      await samtoken.transfer(merkleAirdrop, ethers.parseEther("1000"));

      const amount = ethers.parseUnits("31", 18);
   
      // const baycHolderIndex = leaves.findIndex(
      //   (leaf) => leaf[0] === baycHolder.address
      // );
  
      // Generate the proof for the BAYC holder
      const validProof = merkleTree.getProof([
        baycHolder.address,
        ethers.parseEther("31"),
      ]);
     
      await expect(merkleAirdrop.connect(baycHolder).claimAirdrop(amount, validProof))
        .to.emit(merkleAirdrop, "SuccessfulClaim")
        .withArgs(baycHolder, amount);

     
      const balance = await samtoken.balanceOf(baycHolder.address);
      expect(balance).to.equal(amount);
    });

    it("should not allow non-BAYC holders to claim airdrop", async function () {
      const { merkleAirdrop, samtoken, otherAccount } = await loadFixture(deployMerkleAirdropFixture);

      
      await samtoken.transfer(merkleAirdrop, ethers.parseEther("1000"));

      const amount = ethers.parseUnits("31", 18);
      const invalidProof = [ethers.hexlify(ethers.randomBytes(32))]; 

      
      await expect(merkleAirdrop.connect(otherAccount).claimAirdrop(amount, invalidProof)).to.be.revertedWith(
        "No BAYC NFT ownership"
      );
    });
  });
    
 });
  