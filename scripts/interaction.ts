import { ethers } from "hardhat";

async function main(){

    const merkleTree = "0x6b97a48c2de43f662e3735eb7efdefafe60d7fabdff6b14b413957701afb7b99";

    const bytes32Value = ethers.hexlify(merkleTree);

    const samTokenAddress = "0x257ecF5D547390f3cB27F63b952234B121F6Ed41";
    
    const samToken = await ethers.getContractAt("SamToken", samTokenAddress);

    const merkleAirdropAddress = "0x869c7789fc7AD8d0EeE19893Addf8f97d168FEf9";

    const merkleAirdrop = await ethers.getContractAt("MerkleAirdrop", merkleAirdropAddress);

    const hashbeforeupdate = await merkleAirdrop.merkleRootHash();


    console.log("merkle root before update", hashbeforeupdate)

    const updateMerkleRootHash = await merkleAirdrop.UpdateMerkleRoot(bytes32Value)

    updateMerkleRootHash.wait()

    console.log("tx hash", updateMerkleRootHash)

    const hashafterupdate = await merkleAirdrop.merkleRootHash();


    console.log("merkle root after update", hashafterupdate)





}

main().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
})