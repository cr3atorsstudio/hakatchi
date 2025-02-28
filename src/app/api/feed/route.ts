import { celestiaClient } from "@/lib/celestia-client";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse request body
    const { user_id, grave_id, name, food_quality } = await request.json();

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

    // Get current hunger value from the database
    const { data: grave, error: graveError } = await supabase
      .from("graves")
      .select("hunger")
      .eq("id", grave_id)
      .single();

    if (graveError) {
      return NextResponse.json(
        { error: "Failed to get grave data: " + graveError.message },
        { status: 500 }
      );
    }

    // Calculate new hunger value (ensure it doesn't go below 0)
    const hungerReduction = food_quality;
    const newHunger = Math.max(0, grave.hunger - hungerReduction);

    // Update hunger value in the database
    const { error: updateError } = await supabase
      .from("graves")
      .update({
        hunger: newHunger,
        last_updated: new Date().toISOString(),
      })
      .eq("id", grave_id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update grave: " + updateError.message },
        { status: 500 }
      );
    }

    // Construct the feeding log for Celestia
    const feedLog = {
      action: "FEED",
      grave_id,
      timestamp: Date.now(),
      actionDetails: {
        food_quality: food_quality,
        food_name: name,
        description: `Fed grave #${grave_id} with food quality ${food_quality}`,
      },
      changes: {
        hunger: -hungerReduction, // Adjust hunger based on food quality
      },
    };

    // Try to send data to Celestia, but continue even if it fails
    let celestiaHeight: number | null = null;
    let celestiaSuccess = false;

    try {
      const celestiaResponse = await celestiaClient.submitBlob(feedLog);
      celestiaHeight = celestiaResponse?.result || null;
      celestiaSuccess = celestiaHeight !== null;
      console.log("Celestia response:", celestiaResponse);
    } catch (celestiaError: any) {
      console.error("Celestia error:", celestiaError.message);
      // Continue execution even if Celestia fails
    }

    // Send data to Argus World Engine
    let txId: string | null = null;
    try {
      const response = await axios.post(
        `${process.env.ARGUS_API_URL}/tx/game/feed-grave`,
        {
          personaTag: "haka",
          namespace: "defaultnamespace",
          timestamp: Date.now(),
          salt: Math.floor(Math.random() * 100000), // Generate a random salt
          body: {
            grave_id,
          },
        }
      );
      console.log("argus response:", response.data);

      txId = response.data.TxHash || null;
      console.log("txId:", txId);
    } catch (error: any) {
      console.error(
        "Failed to send data to Argus World Engine:",
        error.message
      );
    }

    //Save Celestia height and Argus transaction ID in Supabase
    const { error: logError, data: feedingLog } = await supabase
      .from("feeding_logs")
      .insert([
        {
          user_id,
          grave_id,
          food_quality,
          fed_at: new Date().toISOString(),
          celestia_height: celestiaHeight,
        },
      ])
      .select()
      .single();

    console.log("feedingLog:", feedingLog);
    console.log("logError:", logError);

    if (logError) {
      console.error("Error saving feeding log:", logError);
      // Continue execution even if log saving fails
    }

    return NextResponse.json({
      newHunger,
      hungerReduction,
      celestiaSuccess,
      feedingLog: feedingLog || null,
    });
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
