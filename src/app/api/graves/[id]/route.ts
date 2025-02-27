import { supabase } from "@/lib/supabaseClient";
import { Grave } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const walletAddress = request.headers.get("wallet-address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  if (!params.id) {
    return NextResponse.json(
      { error: "Grave ID is required" },
      { status: 400 }
    );
  }

  // select a grave by the grave id
  try {
    const { data: graves, error: gravesError } = await supabase
      .from<Grave>("graves")
      .select("*")
      .eq("id", params.id);
    console.log("graves", graves);
    return NextResponse.json({ graves });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
