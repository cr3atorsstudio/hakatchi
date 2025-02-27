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

  console.log("Setting base URI for metadata...");
  const baseURI = "https://hakatchi.s3.us-east-1.amazonaws.com/meta/v1/";

  const tx = await graveNFT.setBaseURI(baseURI);
  await tx.wait();
  console.log(`Base URI set to: ${baseURI}`);

  console.log("Deployment and configuration complete!");
  console.log("Contract address:", address);
  console.log("Metadata base URI:", baseURI);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
