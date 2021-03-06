# ๐ตโ๏ธ๐งฑ๐งคโ The Guilds of Sibiu
_\~entry into the 2022 ETHGlobal NFTHack hackathon\~_

The Guilds of Sibiu is a mixed reality artwork celebrating the rich history of craft guilds in Transylvania, using a new music web3 primitive โย **smart scores**.

### A smart score is a provably authentic, scarce, and immutable digital representation of a musical composition. It is the [autograph score](https://en.wikipedia.org/wiki/Autograph_(manuscript)) of the 3rd millennium, with an important distinction โ the composer and collaborators can receive royalties in perpetuity! ๐ผ โพ ๐ฐ

โ๏ธ For centuries, collectors and scholars have treasured autograph scores written in the composer's hand. ๐ These manuscripts have both aesthetic value and historical significance. ๐ป Some famous examples are [Beethoven's 5th Symphony](https://digital.staatsbibliothek-berlin.de/werkansicht/?PPN=PPN664344127&PHYSID=PHYS_0001) and [Mozart's Requiem](https://www.sothebys.com/en/auctions/ecatalogue/2014/music-continental-books-manuscripts-l14402/lot.199.html).

But when the autograph score for the Requiem sells at Sotheby's for half a million pounds, Mozart's estate receives nothing. And how much more impactful could these perpetual royalties be for living composers still working in the field?

The Guilds of Sibiu is a test of the ๐ก smart score idea โ think of it as **Contemporary chamber music** meets **Emerging web3 technology** meets (soon) **Pen-and-ink illustrations**.

๐  Read on to learn more, or jump straight into the [Guilds metaverse](https://hubs.mozilla.com/jo8FKzd/guilds) to mint your own Guilds music NFT!

## ๐  What technologies are used?
_All components except for the music were built by @NeoDaoist between 14 Jan 2022 and 16 Jan 2022_
- Minting web app, built with [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) and hosted with [Surge](https://surge.sh/)
- Downloadable PDF and audio content, stored with [IPFS](https://ipfs.io/) and [nft.storage](https://nft.storage/)
- 2 ERC721 contracts โย a 1/1 smart score (with [Manifold.xyz](https://www.manifold.xyz/)) and an edition of 8000 music NFT collection (with scaffold-eth)
- 1 ERC1155 contract to slice secondary NFT sales between creative collaborators, built with [Slice.so](https://slice.so/)
- Metaverse scene, built with [Mozilla Hubs](https://hubs.mozilla.com/), [Sketchfab](https://sketchfab.com/), and [Blender](https://www.blender.org/)
- Music
    - Audio mockup of the music, produced with [Steinberg Cubase](https://www.steinberg.net/cubase/) and [Cinematic Studio Series](https://cinematicstudioseries.com/) virtual instruments
    - Sheet music PDF, engraved with [Steinberg Dorico](https://www.steinberg.net/dorico/)

## ๐ป What about the music?
- The piece was composed in 2021 for the ICon Arts Festival in Romania for flute, bassoon, violin, viola, and percussion
- Each of the 8 movements was inspired by a medieval craft guild of Sibiu, Transylvania, Romania (e.g., goldsmiths, embroiderers, candlemakers)
- It was premiered 25 July 2021 by the ICon Arts Ensemble, featuring members of the Sibiu State Philharmonic Orchestra
- V2 of the piece expands the number of guilds from 6 to 8, adding Blacksmiths and Cobblers
- The smart score was minted as a 1 of 1 Music NFT โ [OpenSea](https://testnets.opensea.io/assets/0x05988eb3fc03abb0da03331f2de1bb2b4fc98200/11) and [nft.storage](https://bafybeihr5t4nz4jen6m6liwvqxqduezhczgyeh2cmwgvhq6rmiaebcsiey.ipfs.dweb.link/)
- Secondary royalties are paid to an ERC1155 contract which distributes ETH in proportion to slices owned โย [Slicer](https://testnet.slice.so/slicer/17)

## ๐ What does success look like?
- A fun, compelling experience for listeners
- A new way for composers, performers, engravers, and other collaborators to get paid
- A learning experience building with open source blockchain and metaverse tools

## ๐งช To learn more about how it's built, check out:
- [Demo video](https://www.youtube.com/watch?v=GjHKlm0CSsc)
- [User stories](./extras/user-stories.md)
- [NFT json](./extras/guilds.json)
- Direct link to [scaffold-eth contract](https://github.com/NeoDaoist/guilds/blob/main/packages/hardhat/contracts/TheGuildsOfSibiu.sol)
- Direct link to [scaffold-eth web app](https://guilds-test.surge.sh/)
- Contracts 
    - [Smart score ERC-721 contract](https://rinkeby.etherscan.io/address/0x05988eb3fc03abb0da03331f2de1bb2b4fc98200#code)
    - [Edition of 8000 ERC-721 contract](https://rinkeby.etherscan.io/address/0x87Ef01bCC256245dB467d4820bff8927D53aCBe9#code)
    - Slicer ERC-1155 contract
        - [Slicer](https://testnet.slice.so/slicer/17)
        - [Breakdown of slices](./extras/guilds-smart-score-slicer.png)
        - [Etherscan](https://rinkeby.etherscan.io/address/0x088a002ca3c9323280a1e853e1696e483f5c6350) (not verified yet)

## Journey with us to the [Guilds metaverse](https://hubs.mozilla.com/jo8FKzd/guilds) and mint your Guilds music NFT!

