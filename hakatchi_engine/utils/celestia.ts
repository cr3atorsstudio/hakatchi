import { Buffer } from "buffer";
import { Client } from "cntsc";

// Celestiaクライアントの設定
const client = new Client(
  process.env.CELESTIA_NODE_URL || "https://rpc-mocha.celestia.org",
  process.env.CELESTIA_AUTH_TOKEN || ""
);

// ブロックチェーンにデータを送信する関数
export async function submitToBlockchain(data: {
  action: string;
  tokenId: number;
  timestamp: number;
  changes: { energy: number; cleanliness: number; mood: number };
}): Promise<any> {
  try {
    // HAKATCHIをhex namespaceに変換
    const namespaceHex = Buffer.from("HAKATCHI")
      .toString("hex")
      .padEnd(32, "0");

    const blobData = {
      action_type: data.action,
      grave_id: data.tokenId,
      timestamp: data.timestamp,
      stats_changes: data.changes,
      metadata: {
        network: "mocha-4",
        app_version: "1.0.0",
      },
    };

    console.log("Submitting to Celestia:", {
      namespace: namespaceHex,
      data: blobData,
    });

    const response = await client.Blob.Submit([blobData], {
      gasLimit: 80000,
      fee: 2000,
    });

    if (!response.success) {
      console.error("Celestia API error:", response.error);
      throw new Error(`Failed to submit blob: ${response.error}`);
    }

    console.log("Celestia blob submitted:", {
      height: response.height,
      txhash: response.txHash,
      namespace: namespaceHex,
    });

    return response;
  } catch (error) {
    console.error("Error submitting blob to Celestia:", error);
    throw error;
  }
}
