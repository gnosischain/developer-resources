// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "solmate/tokens/ERC1155.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

error MintPriceNotPaid();
error MaxSupplyExceeded();
error WithdrawTransfer();

contract NFT1155 is ERC1155, Ownable {

    using Strings for uint256;

    string public baseURI;
    uint256 public constant TOTAL_SUPPLY = 10_000;
    uint256 public constant MINT_PRICE = 0.008 ether;
    uint256 public currentSupply;

    constructor(string memory _baseURI) Ownable(msg.sender) {
        baseURI = _baseURI;
    }

    function mintTo(
        address recipient,
        uint256 tokenId,
        uint256 amount
    ) public payable {
        if (msg.value != MINT_PRICE * amount) {
            revert MintPriceNotPaid();
        }
        if (currentSupply + amount > TOTAL_SUPPLY) {
            revert MaxSupplyExceeded();
        }
        currentSupply += amount;
        _mint(recipient, tokenId, amount, "");
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    function withdrawPayments(address payable payee) external onlyOwner {
        if (address(this).balance == 0) {
            revert WithdrawTransfer();
        }
        
        payable(payee).transfer(address(this).balance);
    }

    function _checkOwner() internal view override {
        require(msg.sender == owner(), "Ownable: caller is not the owner");
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }
}
