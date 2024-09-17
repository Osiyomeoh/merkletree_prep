import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  //import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  import {ethers} from "ethers";
  
  describe("MerkleAirdrop", function () {

    const merkleTree = "0x6b97a48c2de43f662e3735eb7efdefafe60d7fabdff6b14b413957701afb7b87";
    // const hexString = "0x6b97a48c2de43f662e3735eb7efdefafe60d7fabdff6b14b413957701afb7b87";

    // Convert to bytes32
    const bytes32Value = ethers.hexlify(merkleTree);
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployTokenFixture() {
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const SamToken = await hre.ethers.getContractFactory("SamToken", owner);
      const samtoken = await SamToken.deploy();
  
      return { SamToken, samtoken, owner, otherAccount };
    }

    async function deployMerkleAirdropFixture(){
        
        const [owner, otherAccount, samtoken] = await hre.ethers.getSigners();

        const MerkleAirdrop = await hre.ethers.getContractFactory("MerkleAirdrop");

        const merkleAirdrop =  await MerkleAirdrop.deploy(samtoken, bytes32Value );
        
        
        return { merkleAirdrop, owner};

     

    }
  
    describe("Token Deployment", function () {
      it("Should set the right owner", async function () {
        const { samtoken, owner} = await loadFixture(deployTokenFixture);
  
        expect(await samtoken.owner()).to.equal(owner);
      });
  
   
    });
  describe("MerkleAirdrop DEPLOYMENT", function () {
    it(" should check if contract deployed successfully", async function() {
        const { samtoken, otherAccount } = await loadFixture(deployTokenFixture)
        const { merkleAirdrop, owner } = await loadFixture(deployMerkleAirdropFixture)

        expect(await merkleAirdrop.owner()).to.equal(owner);
    })
    it(" should check that contract was deployed with the correct erc20 token and merklehash", async function() {
        const { samtoken, otherAccount } = await loadFixture(deployTokenFixture)
        const { merkleAirdrop, owner } = await loadFixture(deployMerkleAirdropFixture)

      
        expect(await merkleAirdrop.merkleRootHash()).to.equal(bytes32Value);
        
    })
    it("should not allow invalid claims", async function() {
        const { merkleAirdrop, owner } = await loadFixture(deployMerkleAirdropFixture)

        const amount = hre.ethers.parseUnits("500", 18);

        const invalidProof = [ethers.hexlify(ethers.randomBytes(32))];

        await expect(merkleAirdrop.claimAirdrop(amount, invalidProof)).to.be.revertedWith("Invalid proof");

    
        
       
    })
  });
    
 });
  