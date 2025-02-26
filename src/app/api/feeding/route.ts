import { celestiaClient } from "@/lib/celestia-client";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse request body
    const { grave_id, food_quality } = await request.json();

    if (!grave_id || food_quality === undefined) {
      return NextResponse.json(
        { error: "grave_id and food_quality are required" },
        { status: 400 }
      );
    }

    if (food_quality < 1 || food_quality > 10) {
      return NextResponse.json(
        { error: "food_quality must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Construct the feeding log for Celestia
    const feedLog = {
      action: "FEED",
      grave_id,
      timestamp: Date.now(),
      actionDetails: {
        food_quality,
        description: `Fed grave #${grave_id} with food quality ${food_quality}`,
      },
      changes: {
        hunger: -food_quality * 5, // Adjust hunger based on food quality
      },
    };

    // Send data to Celestia and retrieve the block height
    let celestiaHeight: number | null = null;
    try {
      const celestiaResponse = await celestiaClient.submitBlob(feedLog);
      celestiaHeight = celestiaResponse?.result?.height || null;
    } catch (celestiaError: any) {
      console.error("Failed to send data to Celestia:", celestiaError.message);
    }

    // Send data to Argus World Engine
    let txId: string | null = null;
    try {
      //TODO: fix
      const response = await axios.post(
        `${process.env.ARGUS_API_URL}/api/updateGrave`,
        {
          grave_id,
          action: "feeding",
          food_quality,
        }
      );

      txId = response.data.tx_id || null;
    } catch (error: any) {
      console.error(
        "Failed to send data to Argus World Engine:",
        error.message
      );
    }

    // Save Celestia height and Argus transaction ID in Supabase
    const { error: logError, data: feedingLog } = await supabase
      .from("feeding_logs")
      .insert([
        {
          grave_id,
          food_quality,
          timestamp: new Date().toISOString(),
          celestia_height: celestiaHeight,
          onchain_tx_id: txId,
        },
      ])
      .select()
      .single();

    if (logError) {
      return NextResponse.json({ error: logError.message }, { status: 500 });
    }

    return NextResponse.json({ feedingLog });
  } catch (error: any) {
    console.error("Feed error:", error);
    return NextResponse.json(
      {
        message: "Failed to process feeding action",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
