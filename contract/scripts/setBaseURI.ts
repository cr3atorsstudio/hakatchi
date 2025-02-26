const hre = require("hardhat");

async function main() {
  console.log("Starting setBaseURI process...");
  
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const baseURI = process.env.NEXT_PUBLIC_BASE_URL + "/api/token/";
  
  console.log(`Setting base URI to: ${baseURI}`);
  console.log(`Contract address: ${contractAddress}`);

  const GraveNFT = await hre.ethers.getContractFactory("GraveNFT");
  const contract = GraveNFT.attach(contractAddress);

  const tx = await contract.setBaseURI(baseURI);
  console.log("Transaction sent. Waiting for confirmation...");
  
  await tx.wait();
  console.log("Base URI successfully set!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error setting base URI:", error);
    process.exit(1);
  });
