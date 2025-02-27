import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const walletAddress = request.headers.get("wallet-address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  try {
    // Get the request body
    const body = await request.json();
    const { name, ghostType, hakaType } = body;

    if (!name || !ghostType || !hakaType) {
      return NextResponse.json(
        { error: "Name, ghost type, and haka type are required" },
        { status: 400 }
      );
    }

    // Get user ID from wallet address
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", walletAddress)
      .single();

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new grave
    const { data: grave, error: graveError } = await supabase
      .from("graves")
      .insert([
        {
          user_id: user.id,
          name: name,
          location: hakaType,
          ghost_type: ghostType,
          dirtiness: 0,
          hunger: 0,
          mood: 50,
          age: 0,
          last_updated: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (graveError) {
      return NextResponse.json({ error: graveError.message }, { status: 500 });
    }

    return NextResponse.json(grave);
  } catch (error) {
    console.error("Error creating grave:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
