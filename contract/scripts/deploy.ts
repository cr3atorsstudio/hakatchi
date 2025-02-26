const hre = require("hardhat");

async function main() {
  console.log("Starting deployment process...");
  console.log("Network:", hre.network.name);

  const GraveNFT = await hre.ethers.getContractFactory("GraveNFT");
  console.log("Contract factory created. Initiating deployment...");

  const graveNFT = await GraveNFT.deploy();
  console.log("Deployment transaction sent. Waiting for confirmation...");

  await graveNFT.waitForDeployment();
  const address = await graveNFT.getAddress();
  console.log(`GraveNFT successfully deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });