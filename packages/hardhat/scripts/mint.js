/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require("ipfs-http-client");

const ipfs = ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const delayMS = 1000; // sometimes xDAI needs a 6000ms break lol 😅

const main = async () => {
  // ADDRESS TO MINT TO:
  const toAddress = "YOUR_FRONTEND_ADDRESS";

  console.log("\n\n 🎫 Minting to " + toAddress + "...\n");

  const { deployer } = await getNamedAccounts();
  const TheGuildsOfSibiu = await ethers.getContract(
    "TheGuildsOfSibiu",
    deployer
  );

  const Blacksmiths = {
    description: "It's actually a bison?",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image: "https://austingriffith.com/images/paintings/Blacksmiths.jpg",
    name: "Blacksmiths",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "green",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 42,
      },
    ],
  };
  console.log("Uploading Blacksmiths...");
  const uploaded = await ipfs.add(JSON.stringify(Blacksmiths));

  console.log("Minting Blacksmiths with IPFS hash (" + uploaded.path + ")");
  await TheGuildsOfSibiu.mintItem(toAddress, uploaded.path, {
    gasLimit: 400000,
  });

  await sleep(delayMS);

  const Goldsmiths = {
    description: "What is it so worried about?",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image: "https://austingriffith.com/images/paintings/Goldsmiths.jpg",
    name: "Goldsmiths",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "blue",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 38,
      },
    ],
  };
  console.log("Uploading Goldsmiths...");
  const uploadedGoldsmiths = await ipfs.add(JSON.stringify(Goldsmiths));

  console.log(
    "Minting Goldsmiths with IPFS hash (" + uploadedGoldsmiths.path + ")"
  );
  await TheGuildsOfSibiu.mintItem(toAddress, uploadedGoldsmiths.path, {
    gasLimit: 400000,
  });

  await sleep(delayMS);

  const Cobblers = {
    description: "What a horn!",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image: "https://austingriffith.com/images/paintings/Cobblers.jpg",
    name: "Cobblers",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "pink",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 22,
      },
    ],
  };
  console.log("Uploading Cobblers...");
  const uploadedCobblers = await ipfs.add(JSON.stringify(Cobblers));

  console.log(
    "Minting Cobblers with IPFS hash (" + uploadedCobblers.path + ")"
  );
  await TheGuildsOfSibiu.mintItem(toAddress, uploadedCobblers.path, {
    gasLimit: 400000,
  });

  await sleep(delayMS);

  const Embroiderers = {
    description: "Is that an underbyte?",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image: "https://austingriffith.com/images/paintings/Embroiderers.jpg",
    name: "Embroiderers",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "blue",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 15,
      },
    ],
  };
  console.log("Uploading Embroiderers...");
  const uploadedEmbroiderers = await ipfs.add(JSON.stringify(Embroiderers));

  console.log(
    "Minting Embroiderers with IPFS hash (" + uploadedEmbroiderers.path + ")"
  );
  await TheGuildsOfSibiu.mintItem(toAddress, uploadedEmbroiderers.path, {
    gasLimit: 400000,
  });

  await sleep(delayMS);

  console.log(
    "Transferring Ownership of TheGuildsOfSibiu to " + toAddress + "..."
  );

  await TheGuildsOfSibiu.transferOwnership(toAddress, { gasLimit: 400000 });

  await sleep(delayMS);

  /*


  console.log("Minting Goldsmiths...")
  await TheGuildsOfSibiu.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","Goldsmiths.jpg")

  */

  // const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
