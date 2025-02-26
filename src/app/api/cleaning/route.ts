import { celestiaClient } from "@/lib/celestia-client";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse request body
    const { grave_id, effort_level } = await request.json();

    if (!grave_id || effort_level === undefined) {
      return NextResponse.json(
        { error: "grave_id and effort_level are required" },
        { status: 400 }
      );
    }

    if (effort_level < 1 || effort_level > 10) {
      return NextResponse.json(
        { error: "effort_level must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Construct the cleaning log for Celestia
    const cleanLog = {
      action: "CLEAN",
      grave_id,
      timestamp: Date.now(),
      actionDetails: {
        effort_level,
        description: `Cleaning grave #${grave_id} with ${effort_level}`,
      },
      changes: {
        cleaness: -effort_level * 5, // Adjust hunger based on food quality
      },
    };

    // Send data to Celestia and retrieve the block height
    let celestiaHeight: number | null = null;
    try {
      const celestiaResponse = await celestiaClient.submitBlob(cleanLog);
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
          action: "cleaning",
          effort_level,
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
    const { error: logError, data: cleaningLog } = await supabase
      .from("cleaning_logs")
      .insert([
        {
          grave_id,
          effort_level,
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

    return NextResponse.json({ cleaningLog });
  } catch (error: any) {
    console.error("Feed error:", error);
    return NextResponse.json(
      {
        message: "Failed to process cleaning action",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
