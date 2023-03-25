// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DiaryNFT is ERC721, ERC721URIStorage, Ownable {
    struct Diary{
        uint id;
        string name;
        address owner1;
        address owner2;
        uint[] pages;
    }

    Diary[] public diaries;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("DiaryNFT", "DNFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function newDiary(string memory name, address to, string memory uri) public{
        uint[] memory temp;
        diaries.push(Diary({id: diaries.length, name: name, owner1: msg.sender, owner2: to, pages: temp}));
        post(msg.sender, uri);
        diaries[diaries.length - 1].pages.push(getPageNum() - 1);
    }

    function newPage(uint id, string memory uri) public{
        post(msg.sender, uri);
        diaries[id].pages.push(getPageNum() - 1);
    }
    

    function post(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }


    function getDiary(uint id) public view returns(Diary memory){
        return diaries[id];
    }

    function getPageNum() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getDiaryNum() public view returns (uint256) {
        return diaries.length;
    }
}