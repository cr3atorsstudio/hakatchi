// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/GraveNFT.sol";

contract DeployGraveNFT is Script {
    function run() external {
        // プライベートキーを取得（.env ファイルから）
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // デプロイヤーのアドレスを取得
        address deployerAddress = vm.addr(deployerPrivateKey);
        console.log("Deploying from address:", deployerAddress);
        
        // デプロイ開始
        vm.startBroadcast(deployerPrivateKey);
        
        // GraveNFTコントラクトをデプロイ
        GraveNFT graveNFT = new GraveNFT();
        console.log("GraveNFT deployed at:", address(graveNFT));
        
        // メタデータのベースURIを設定
        string memory baseURI = "https://hakatchi.s3.us-east-1.amazonaws.com/meta/v1/";
        graveNFT.setBaseURI(baseURI);
        console.log("Base URI set to:", baseURI);
        
        vm.stopBroadcast();
        
        console.log("Deployment complete on Arbitrum!");
    }
} 