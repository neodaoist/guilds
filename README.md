# The Guilds of Sibiu
The Guilds of Sibiu is a mixed reality artwork celebrating the rich history of craft guilds in Transylvania, using a new music web3 primitive — smart scores.

A **smart score** is a provably authentic, scarce, and immutable digital representation of a composer's musical work, built with decentralized web protocols. It is the [autograph score](https://en.wikipedia.org/wiki/Autograph_(manuscript)) for the 3rd millennium, with one important distinction — the composer receives royalties in perpetuity!

For centuries, collectors and scholars alike have treasured autograph scores written in the composer's hand. These manuscripts have both aesthetic value and historical significance. Some famous examples are [Beethoven's 5th Symphony](https://digital.staatsbibliothek-berlin.de/werkansicht/?PPN=PPN664344127&PHYSID=PHYS_0001) and [Mozart's Requiem](https://www.sothebys.com/en/auctions/ecatalogue/2014/music-continental-books-manuscripts-l14402/lot.199.html).

But when the autograph score for Mozart's Requiem sells at Sotheby's for half a million pounds, his estate receives nothing. How much more impactful could these perpetual royalties be for living composers still working in the field?

The Guilds of Sibiu is a test of the smart score idea — think of it as **Contemporary chamber music** meets **Emerging web3 technology** meets (eventually) **Pen-and-ink illustration**.

_All components except for the music was created or coded between 14 Jan 2022 and 16 Jan 2022_

#### What about the music?
- The piece was composed for 5 musicians — flute, bassoon, violin, viola, and percussion
- Each of the 8 movements was inspired by a medieval craft guild of Sibiu, Transylvania, Romania (e.g., goldsmiths, embroiderers, candlemakers)
- It was premiered 25 July 2021 by the ICon Arts Ensemble, featuring members of the Sibiu State Philharmonic Orchestra
- The V2 of the piece expands the number of guilds from 6 to 8, adding Blacksmiths and Cobblers
- The smart score was minted as a 1 of 1 Music NFT — (OpenSea)[https://testnets.opensea.io/assets/0x05988eb3fc03abb0da03331f2de1bb2b4fc98200/11]

#### What technology is used?
- Minting web app, built with (scaffold-eth)[https://github.com/scaffold-eth/scaffold-eth] and hosted with (Surge)[https://surge.sh/]
- Downloadable audio content, stored with (IPFS)[https://ipfs.io/] and (nft.storage)[https://nft.storage/]
- 2 ERC721 contracts — one for an edition of 8000 music NFT collection (with customized scaffold-eth contract), one for the 1/1 smart score (with (Manifold.xyz)[https://www.manifold.xyz/] contract)
- 1 ERC1155 contract to slice secondary NFT sales between creative collaborators, built with (Slice.so)[https://testnet.slice.so/slicer/17]
- Metaverse scene, built with (Mozilla Hubs)[https://hubs.mozilla.com/], (Sketchfab)[https://sketchfab.com/], and (Blender)[https://www.blender.org/]
- Audio mockups of the music, produced with (Steinberg Cubase)[https://www.steinberg.net/cubase/] and (inematic Studio Series)[https://cinematicstudioseries.com/] virtual instruments
- Sheet music PDFs, engraved with (Steinberg Dorico)[https://www.steinberg.net/dorico/]

#### What does success look like?
-	A compelling fan experience
-	A new way for composers, performers, engravers, and other collaborators to get paid
-	5% of all royalties going to charity

To learn more about how it's built, check out:
- [User stories](./user-stories.md)
- [NFT json](./guilds.json)
- [Slicer ERC-1155 contract](https://testnet.slice.so/slicer/17)

## Journey with us to the Guilds metaverse to mint your own Guilds Music NFT!

