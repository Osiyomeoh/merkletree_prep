import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import {ethers} from "ethers";

const token = "0x257ecF5D547390f3cB27F63b952234B121F6Ed41";

const merkleTree = "0x6b97a48c2de43f662e3735eb7efdefafe60d7fabdff6b14b413957701afb7b87";

const bytes32Value = ethers.hexlify(merkleTree);

const MerkleAirdropModule = buildModule("MerkleAirdropModule", (m) => {

  const merkleContract = m.contract("MerkleAirdrop", [token, bytes32Value ], {
    
  });

  return { merkleContract };
});

export default MerkleAirdropModule;


//SamTokenModule#SamToken - 0x257ecF5D547390f3cB27F63b952234B121F6Ed41
//0x869c7789fc7AD8d0EeE19893Addf8f97d168FEf9