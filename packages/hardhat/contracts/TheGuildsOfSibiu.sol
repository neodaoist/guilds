// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
//                                                                                 //
//      .oooooo.    ooooo     ooo ooooo ooooo        oooooooooo.    .oooooo..o     //
//     d8P'  `Y8b   `888'     `8' `888' `888'        `888'   `Y8b  d8P'    `Y8     //
//    888            888       8   888   888          888      888 Y88bo.          //
//    888            888       8   888   888          888      888  `"Y8888o.      //
//    888     ooooo  888       8   888   888          888      888      `"Y88b     //
//    `88.    .88'   `88.    .8'   888   888       o  888     d88' oo     .d8P     //
//     `Y8bood8P'      `YbodP'    o888o o888ooooood8 o888bood8P'   8""88888P'      //
//                                                                                 //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////

contract TheGuildsOfSibiu is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public maxNFTs;
    uint256 public remainingMintableNFTs;

    event RemainingMintableNFTChange(uint256 remainingMintableNFTs);

    constructor() ERC721("TheGuildsOfSibiu", "GUILDS") {
        maxNFTs = 8000;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function mintItem(address to, string memory uri) public returns (uint256) {
        require(_tokenIdCounter.current() < maxNFTs);

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        remainingMintableNFTs = maxNFTs - _tokenIdCounter.current();
        emit RemainingMintableNFTChange(remainingMintableNFTs);

        return tokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getRemainingMintableNFTs() public view returns (uint256) {
        return remainingMintableNFTs;
    }
}
