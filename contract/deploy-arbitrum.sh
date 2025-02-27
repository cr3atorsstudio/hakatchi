#!/bin/bash

# 環境変数の読み込み
source .env

echo "Deploying GraveNFT to Arbitrum..."

# Foundryのデプロイコマンドを実行（Arbitrum RPCを使用）
forge script script/DeployGraveNFT.s.sol:DeployGraveNFT \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy \
  -vvv

echo "Deployment to Arbitrum completed." 