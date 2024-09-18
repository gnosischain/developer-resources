// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/NFT1155.sol";

contract NFT1155Test is Test {
    NFT1155 public nft1155;
    address public owner = address(0x123);
    address public recipient = address(0x456);
    uint256 public constant MINT_PRICE = 0.008 ether;

    function setUp() public {
        nft1155 = new NFT1155("https://api.example.com/metadata/");
        
        nft1155.transferOwnership(owner);
    }

    function testMintingToken() public {
        vm.deal(recipient, 1 ether);
        vm.startPrank(recipient); 
        
        nft1155.mintTo{value: MINT_PRICE}(recipient, 1, 1);
        
        assertEq(nft1155.balanceOf(recipient, 1), 1);
        
        vm.stopPrank();
    }

    function testMintingWithInsufficientFunds() public {
        vm.deal(recipient, 1 ether);
        vm.startPrank(recipient);

        vm.expectRevert(MintPriceNotPaid.selector);
        nft1155.mintTo{value: 0.004 ether}(recipient, 1, 1);
        
        vm.stopPrank();
    }

    function testWithdrawPayments() public {
        vm.deal(recipient, 1 ether);
        vm.startPrank(recipient);
        nft1155.mintTo{value: MINT_PRICE}(recipient, 1, 1);
        vm.stopPrank();

        assertEq(address(nft1155).balance, MINT_PRICE);

        vm.prank(owner);
        nft1155.withdrawPayments(payable(owner));

        assertEq(address(owner).balance, MINT_PRICE);
        assertEq(address(nft1155).balance, 0);
    }

    function testWithdrawWithoutFunds() public {
        vm.prank(owner);
        vm.expectRevert(WithdrawTransfer.selector);
        nft1155.withdrawPayments(payable(owner));
    }

    function testURI() public view {
        string memory expectedURI = "https://api.example.com/metadata/1";
        assertEq(nft1155.uri(1), expectedURI);
    }

    function testSetBaseURI() public {
        vm.prank(owner);
        nft1155.setBaseURI("https://newbaseuri.com/metadata/");

        string memory expectedURI = "https://newbaseuri.com/metadata/1";
        assertEq(nft1155.uri(1), expectedURI);
    }
}
