import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const SamTokenModule = buildModule("SamTokenModule", (m) => {

  const samtoken = m.contract("SamToken", [], {
    
  });

  return { samtoken };
});

export default SamTokenModule;


//SamTokenModule#SamToken - 0x257ecF5D547390f3cB27F63b952234B121F6Ed41