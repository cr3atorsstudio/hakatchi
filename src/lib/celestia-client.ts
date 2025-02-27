export class CelestiaClient {
  private nodeUrl: string;
  private authToken: string;
  // Define namespace as a class property
  private readonly namespace = "AAAAAAAAAAAAAAAAAAAAAAAAAAAASEFLYVRDSEU=";

  constructor(nodeUrl: string, authToken: string) {
    if (!nodeUrl || !authToken) {
      throw new Error("CELESTIA_NODE_URL and CELESTIA_AUTH_TOKEN must be set");
    }
    this.nodeUrl = nodeUrl.trim().replace(/\/$/, ""); // 末尾の `/` を削除
    this.authToken = authToken;
  }

  /**
   * Celestia にデータをアップロード
   */
  async submitBlob(data: any) {
    try {
      console.log("Submitting to Celestia:", {
        url: this.nodeUrl,
        data: JSON.stringify(data, null, 2),
      });

      // Celestia に送信するデータの準備
      const payload = {
        id: 1,
        jsonrpc: "2.0",
        method: "blob.Submit",
        params: [
          [
            {
              namespace: this.namespace,
              data: Buffer.from(JSON.stringify(data)).toString("base64"),
              share_version: 0,
              index: -1,
            },
          ],
          {
            gas_price: 0.002,
            is_gas_price_set: true,
            gas: 142225,
            key_name: "my_celes_key",
            signer_address: "celestia1jmxezr6m0y2zwvhzkt72hwavx20rel35u449sh",
            fee_granter_address:
              "celestia1jmxezr6m0y2zwvhzkt72hwavx20rel35u449sh",
          },
        ],
      };

      console.log("Request to Celestia:", {
        namespace: this.namespace,
        payload,
      });

      // Celestia に JSON-RPC でリクエストを送信
      const response = await fetch(this.nodeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("response:", response);

      if (!response.ok) {
        throw new Error(`Failed to submit blob: ${await response.text()}`);
      }

      const result = await response.json();
      console.log("Celestia Response:", result);
      return result;
    } catch (error) {
      console.error("Error submitting blob to Celestia:", error);
      throw error;
    }
  }

  /**
   * Celestia からブロブデータを取得
   */
  async getBlobData(height: number) {
    try {
      console.log(
        "Fetching data from Celestia with namespace:",
        this.namespace
      );

      // Celestia に JSON-RPC でデータを取得
      const payload = {
        jsonrpc: "2.0",
        method: "blob.GetAll",
        id: 1,
        params: [height, [this.namespace]],
      };

      const response = await fetch(this.nodeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blob: ${await response.text()}`);
      }

      const result = await response.json();
      console.log("Fetched Blob Data:", result);
      return result;
    } catch (error) {
      console.error("Error fetching blob from Celestia:", error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.nodeUrl}/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        status: response.status,
        ok: response.ok,
        data: response.status === 200 ? await response.json() : null,
      };
    } catch (error) {
      console.error("Celestia health check failed:", error);
      return { status: 500, ok: false, data: null };
    }
  }
}

// Export a singleton instance for convenience
export const celestiaClient = new CelestiaClient(
  process.env.CELESTIA_NODE_URL || "https://rpc-mocha.celestia.org",
  process.env.CELESTIA_AUTH_TOKEN || ""
);
