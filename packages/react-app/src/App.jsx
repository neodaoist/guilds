/* lint-ignore */

import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Button, Card, Col, Input, List, Menu, Row } from "antd";
import "antd/dist/antd.css";
import Authereum from "authereum";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Fortmatic from "fortmatic";
// https://www.npmjs.com/package/ipfs-http-client
// import { create } from "ipfs-http-client";
import React, { useCallback, useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Address, AddressInput, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch } from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import { useContractConfig } from "./hooks";
// import Hints from "./Hints";

const { BufferList } = require("bl");
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

const { ethers } = require("ethers");

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.rinkeby; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;

// EXAMPLE STARTING JSON:
const STARTING_JSON = {
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
  ],
};

// helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path);
    if (!file.content) continue;
    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }
    console.log(content);
    return content;
  }
};

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const poktMainnetProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(
      "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
    )
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

// Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: "light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://polygon.bridge.walletconnect.org",
        infuraId: INFURA_ID,
        rpc: {
          1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          42: `https://kovan.infura.io/v3/${INFURA_ID}`,
          100: "https://dai.poa.network", // xDai
        },
      },
    },
    portis: {
      display: {
        logo: "https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png",
        name: "Portis",
        description: "Connect to Portis App",
      },
      package: Portis,
      options: {
        id: "6255fb2b-58c8-433b-a2c9-62098c05ddc9",
      },
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: "pk_live_5A7C91B2FC585A17", // required
      },
    },
    "custom-walletlink": {
      display: {
        logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
        name: "Coinbase",
        description: "Connect to Coinbase Wallet (not Coinbase App)",
      },
      package: walletLinkProvider,
      connector: async (provider, _options) => {
        await provider.enable();
        return provider;
      },
    },
    authereum: {
      package: Authereum, // required
    },
  },
});

function App(props) {
  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  const contractConfig = useContractConfig();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "TheGuildsOfSibiu", "balanceOf", [address]);
  console.log("🤗 balance:", balance);

  // 📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "TheGuildsOfSibiu", "Transfer", localProvider, 1);
  console.log("📟 Transfer events:", transferEvents);

  //
  // 🧠 This effect will update TheGuildsOfSibius by polling when your balance changes
  //
  const yourBalance = balance && balance.toNumber && balance.toNumber();
  const [TheGuildsOfSibius, setTheGuildsOfSibius] = useState();

  useEffect(() => {
    const updateTheGuildsOfSibius = async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        try {
          console.log("Getting token index", tokenIndex);
          const tokenId = await readContracts.TheGuildsOfSibiu.tokenOfOwnerByIndex(address, tokenIndex);
          console.log("tokenId", tokenId);
          const tokenURI = await readContracts.TheGuildsOfSibiu.tokenURI(tokenId);
          console.log("tokenURI", tokenURI);

          const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
          console.log("ipfsHash", ipfsHash);

          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            console.log("jsonManifest", jsonManifest);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setTheGuildsOfSibius(collectibleUpdate);
    };
    updateTheGuildsOfSibius();
  }, [address, yourBalance]);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button
                  onClick={async () => {
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);

                    let switchTx;
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: data[0].chainId }],
                      });
                    } catch (switchError) {
                      // not checking specific error code, because maybe we're not using MetaMask
                      try {
                        switchTx = await ethereum.request({
                          method: "wallet_addEthereumChain",
                          params: data,
                        });
                      } catch (addError) {
                        // handle "add" error
                      }
                    }

                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId == 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  const [yourJSON, setYourJSON] = useState(STARTING_JSON);
  const [sending, setSending] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ipfsDownHash, setIpfsDownHash] = useState();
  const [downloading, setDownloading] = useState();
  const [ipfsContent, setIpfsContent] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [minting, setMinting] = useState(false);
  const [count, setCount] = useState(1);

  // the json for the nfts
  const json = {
    1: {
      description:
        "A blacksmith is a metalsmith who creates objects primarily from wrought iron or steel, but sometimes from other metals, by forging the metal, using tools to hammer, bend, and cut. Blacksmiths produce objects such as gates, grilles, railings, light fixtures, furniture, sculpture, tools, agricultural implements, decorative and religious items, cooking utensils, and weapons.",
      external_url: "https://thomasvieiracomposer.com/the-guilds-of-sibiu-for-chamber-quintet/",
      image: "https://bafkreihs5mtuztqlhiewpuxwlrzuxf3xtqdi5i7s4b5tlnbrcxkz5gnkau.ipfs.dweb.link/",
      audio: "https://bafybeidgorr7jwq4ogls3dbrwmvc4ly6ydhiiotbureo4e3any2322tjla.ipfs.dweb.link/",
      name: "Blacksmiths",
      attributes: [
        {
          trait_type: "Collection",
          value: "GUILDS001",
        },
        {
          trait_type: "Guild",
          value: "Blacksmiths",
        },
        {
          trait_type: "Aggression",
          value: 90,
        },
      ],
    },
    2: {
      description:
        "A goldsmith is a metalworker who specializes in working with gold and other precious metals. Nowadays they mainly specialize in jewelry-making but historically, goldsmiths have also made silverware, platters, goblets, decorative and serviceable utensils, and ceremonial or religious items.",
      external_url: "https://thomasvieiracomposer.com/the-guilds-of-sibiu-for-chamber-quintet/",
      image: "https://bafkreienn6mzlwjifbrkt2usb5g6zcp6dyauxq3jepnagt7dpvuj24xspa.ipfs.dweb.link/",
      audio: "https://bafybeifb63go2wnx2uweob5ct3ighy6ahhgyvt3nn73c5tqnor4her5y2e.ipfs.dweb.link/",
      name: "Goldsmiths",
      attributes: [
        {
          trait_type: "Collection",
          value: "GUILDS001",
        },
        {
          trait_type: "Guild",
          value: "Goldsmiths",
        },
        {
          trait_type: "Aggression",
          value: 20,
        },
      ],
    },
    3: {
      description:
        "Originally, shoes were made one at a time by hand, often by groups of cobblers (also known as cordwainers). In the 18th century, dozens or even hundreds of masters, journeymen and apprentices (both men and women) would work together in a shop, dividing up the work into individual tasks.",
      external_url: "https://thomasvieiracomposer.com/the-guilds-of-sibiu-for-chamber-quintet/",
      image: "https://bafkreidc36ih4latob5xkiwyyp252q2bjwhbd6hssbepbotgoo6iwdd5qq.ipfs.dweb.link/",
      audio: "https://bafybeidwisgrranqlocui354yr3ac2rmm6afebzjdblatwgytkbtlote6m.ipfs.dweb.link/",
      name: "Cobblers",
      attributes: [
        {
          trait_type: "Collection",
          value: "GUILDS001",
        },
        {
          trait_type: "Guild",
          value: "Cobblers",
        },
        {
          trait_type: "Aggression",
          value: 70,
        },
      ],
    },
    4: {
      description:
        "Embroidery is the craft of decorating fabric or other materials using a needle to apply thread or yarn. Embroidery may also incorporate other materials such as pearls, beads, quills, and sequins. In modern days, embroidery is usually seen on caps, hats, coats, overlays, blankets, dress shirts, denim, dresses, stockings, and golf shirts.",
      external_url: "https://thomasvieiracomposer.com/the-guilds-of-sibiu-for-chamber-quintet/",
      image: "https://bafkreidnz5gk3ljny7objwgkz5rfo54fjvpt4wmjv3l4nrtzyv4kryisii.ipfs.dweb.link/",
      audio: "https://bafybeif547b6ug7whg6k5kytcevzlmvdrofgxqp52znfgxqezbfk6zwe6m.ipfs.dweb.link/",
      name: "Embroiderers",
      attributes: [
        {
          trait_type: "Collection",
          value: "GUILDS001",
        },
        {
          trait_type: "Guild",
          value: "Embroiderers",
        },
        {
          trait_type: "Aggression",
          value: 30,
        },
      ],
    },
    5: {
      description:
        "Stonemasonry is the creation of buildings, structures, and sculpture using stone as the primary material. It is one of the oldest activities and professions in human history. Many of the long-lasting, ancient shelters, temples, monuments, artifacts, fortifications, roads, bridges, and entire cities were built of stone.",
      external_url: "https://thomasvieiracomposer.com/the-guilds-of-sibiu-for-chamber-quintet/",
      image: "https://bafkreigjijnelhsxafqvdjy6cwom4khi6ag5pq5y4etxtcol7binxaejau.ipfs.dweb.link/",
      audio: "https://bafybeicmlmvbpl2pdxc3c6u5fxo36tzth37j7o2rjw633bmfynmcuius6y.ipfs.dweb.link/",
      name: "Stonemasons",
      attributes: [
        {
          trait_type: "Collection",
          value: "GUILDS001",
        },
        {
          trait_type: "Guild",
          value: "Stonemasons",
        },
        {
          trait_type: "Aggression",
          value: 60,
        },
      ],
    },
    6: {
      description:
        "Glassblowing is a glassforming technique that involves inflating molten glass into a bubble (or parison) with the aid of a blowpipe (or blow tube). A person who blows glass is called a glassblower, glassmith, or gaffer.",
      external_url: "https://thomasvieiracomposer.com/the-guilds-of-sibiu-for-chamber-quintet/",
      image: "https://bafkreid2veahzmlrga2wiyzbgexog7fc66oa5awwih7ajki5uiowpovfxm.ipfs.dweb.link/",
      audio: "https://bafybeifepgi3gsgmaoru5roydwi5gtgoy24lzf4qy3pydriwt7qa2zo76i.ipfs.dweb.link/",
      name: "Glassblowers",
      attributes: [
        {
          trait_type: "Collection",
          value: "GUILDS001",
        },
        {
          trait_type: "Guild",
          value: "Glassblowers",
        },
        {
          trait_type: "Aggression",
          value: 50,
        },
      ],
    },
    7: {
      description:
        "A chandlery was originally the office in a wealthy medieval household responsible for wax and candles, as well as the room in which the candles were kept. It could be headed by a candlemaker. The office was subordinated to the kitchen, and only existed as a separate office in larger households.",
      external_url: "https://thomasvieiracomposer.com/the-guilds-of-sibiu-for-chamber-quintet/",
      image: "https://bafkreid6azxlub6o4j46f2z6rzj3sv5hxvs3ehxsx5l7frhtrtp7cpghne.ipfs.dweb.link/",
      audio: "https://bafybeicck7rhsopniillzcfmsf7ceqt5364wkhpb37lldizpro3ud2o2hy.ipfs.dweb.link/",
      name: "Candlemakers",
      attributes: [
        {
          trait_type: "Collection",
          value: "GUILDS001",
        },
        {
          trait_type: "Guild",
          value: "Candlemakers",
        },
        {
          trait_type: "Aggression",
          value: 10,
        },
      ],
    },
    8: {
      description:
        "Fletching is the fin-shaped aerodynamic stabilization device attached on arrows, bolts, darts, or javelins, and are typically made from light semi-flexible materials such as feathers or bark. Each piece of such fin is a fletch, also known as a flight or feather. A fletcher is a person who attaches fletchings to the shaft of arrows.",
      external_url: "https://thomasvieiracomposer.com/the-guilds-of-sibiu-for-chamber-quintet/",
      image: "https://bafkreih2ot6ogzl3wbltlh32duaspoia5c6tdoh66pvpivk557bujewjuu.ipfs.dweb.link/",
      audio: "https://bafybeihjo7s6qoyocwjhss2ohi56q2omkti6rj2thafzvl7hdp2uq4l3zm.ipfs.dweb.link/",
      name: "Arrowfletchers",
      attributes: [
        {
          trait_type: "Collection",
          value: "GUILDS001",
        },
        {
          trait_type: "Guild",
          value: "Arrowfletchers",
        },
        {
          trait_type: "Aggression",
          value: 80,
        },
      ],
    },
  };

  const mintItem = async () => {
    // upload to ipfs
    const uploaded = await ipfs.add(JSON.stringify(json[count]));
    setCount(count + 1);
    console.log("Uploaded Hash: ", uploaded);
    const result = tx(
      writeContracts &&
        writeContracts.TheGuildsOfSibiu &&
        writeContracts.TheGuildsOfSibiu.mintItem(address, uploaded.path),
      update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei",
          );
        }
      },
    );
  };

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              The Guilds of Sibiu
            </Link>
          </Menu.Item>
        </Menu>
        <Switch>
          <Route exact path="/">
            <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <h1> 🎵⚗️🧱🧤⚒ The Guilds of Sibiu</h1>
              The Guilds of Sibiu is a mixed reality artwork celebrating the rich history of craft guilds in
              Transylvania, using a new music web3 primitive — <b>smart scores</b>.
              <br />
              <br />
              <h3>
                A{" "}
                <a href="https://testnets.opensea.io/assets/0x05988eb3fc03abb0da03331f2de1bb2b4fc98200/11">
                  smart score
                </a>{" "}
                is a provably authentic, scarce, and immutable digital representation of a musical composition, built
                with decentralized web protocols. It is the{" "}
                <a href="https://en.wikipedia.org/wiki/Autograph_(manuscript)">autograph score</a> of the 3rd
                millennium, with an important distinction — the composer and collaborators can receive royalties in
                perpetuity! 🎼 ♾ 💰
              </h3>
              <br />
              🌠 Visit the <a href="https://github.com/NeoDaoist/guilds">GitHub repo</a> to learn more or start minting
              your own Guilds music NFTs now!
              <br />
              <br />
              <br />
              <Button
                disabled={minting}
                shape="round"
                size="large"
                onClick={() => {
                  mintItem();
                }}
              >
                MINT NFT
              </Button>
            </div>
            <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={TheGuildsOfSibius}
                renderItem={item => {
                  const id = item.id.toNumber();
                  return (
                    <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                      <Card
                        title={
                          <div>
                            <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                          </div>
                        }
                      >
                        <div>
                          <img src={item.image} style={{ maxWidth: 150 }} />
                        </div>
                        <div>
                          <audio controls>
                            <source src={item.audio} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                        <div>{item.description}</div>
                      </Card>
                    </List.Item>
                  );
                }}
              />
            </div>
          </Route>
        </Switch>
      </BrowserRouter>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>
    </div>
  );
}

export default App;
