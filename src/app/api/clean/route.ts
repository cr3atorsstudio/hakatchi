import { celestiaClient } from "@/lib/celestia-client";
import { supabase } from "@/lib/supabaseClient";
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

    // Get current dirtiness value from the database
    const { data: grave, error: graveError } = await supabase
      .from("graves")
      .select("dirtiness")
      .eq("id", grave_id)
      .single();

    if (graveError) {
      return NextResponse.json(
        { error: "Failed to get grave data: " + graveError.message },
        { status: 500 }
      );
    }

    // Calculate new dirtiness value (ensure it doesn't go below 0)
    const dirtinessReduction = effort_level;
    const newDirtiness = Math.max(0, grave.dirtiness - dirtinessReduction);

    // Update dirtiness value in the database
    const { error: updateError } = await supabase
      .from("graves")
      .update({
        dirtiness: newDirtiness,
        last_updated: new Date().toISOString(),
      })
      .eq("id", grave_id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update grave: " + updateError.message },
        { status: 500 }
      );
    }

    // Construct the cleaning log for Celestia
    const cleanLog = {
      action: "CLEAN",
      grave_id,
      timestamp: Date.now(),
      actionDetails: {
        effort_level,
        description: `Cleaning grave #${grave_id} with effort level ${effort_level}`,
      },
      changes: {
        dirtiness: -dirtinessReduction, // Adjust dirtiness based on effort level
      },
    };

    // Try to send data to Celestia, but continue even if it fails
    let celestiaHeight: number | null = null;
    let celestiaSuccess = false;

    try {
      const celestiaResponse = await celestiaClient.submitBlob(cleanLog);
      celestiaHeight = celestiaResponse?.result || null;
      celestiaSuccess = celestiaHeight !== null;
      console.log("Celestia response:", celestiaResponse);
    } catch (celestiaError: any) {
      console.error("Celestia error:", celestiaError.message);
      // Continue execution even if Celestia fails
    }

    // Save cleaning log in Supabase regardless of Celestia result
    const { error: logError, data: cleaningLog } = await supabase
      .from("cleaning_logs")
      .insert([
        {
          grave_id,
          effort_level,
          cleaned_at: new Date().toISOString(),
          celestia_height: celestiaHeight,
        },
      ])
      .select()
      .single();

    console.log("cleaningLog:", cleaningLog);

    if (logError) {
      console.error("Error saving cleaning log:", logError);
      // Continue execution even if log saving fails
    }

    return NextResponse.json({
      success: true,
      newDirtiness,
      dirtinessReduction,
      celestiaSuccess,
      cleaningLog: cleaningLog || null,
    });
  } catch (error: any) {
    console.error("Clean error:", error);
    return NextResponse.json(
      {
        message: "Failed to process cleaning action",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
