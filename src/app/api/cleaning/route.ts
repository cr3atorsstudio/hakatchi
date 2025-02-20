import { supabase } from "@/lib/supabaseClient";
import { CleaningLog, Grave } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const walletAddress = request.headers.get("wallet_address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

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

  // ユーザーを取得
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", walletAddress)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // お墓を確認
  const { data: grave, error: graveError } = await supabase
    .from<Grave>("graves")
    .select("*")
    .eq("id", grave_id)
    .single();

  if (graveError || !grave) {
    return NextResponse.json({ error: "Grave not found" }, { status: 404 });
  }

  // 清掃ログを記録
  const { data: cleaningLog, error: logError } = await supabase
    .from<CleaningLog>("cleaning_logs")
    .insert([
      {
        user_id: user.id,
        grave_id,
        cleaned_at: new Date().toISOString(),
        effort_level,
        onchain_impact: effort_level >= 5, // 例: effort_levelが5以上ならオンチェーンに影響
      },
    ])
    .single();

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 });
  }

  // お墓の汚れ度を減少
  const dirtinessDecrease = effort_level * 5;
  const newDirtiness = Math.max(grave.dirtiness - dirtinessDecrease, 0);

  // お墓の汚れ度と最終更新日時を更新
  const { error: updateError } = await supabase
    .from("graves")
    .update({
      dirtiness: newDirtiness,
      last_updated: new Date().toISOString(),
    })
    .eq("id", grave_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Argus World Engineへの影響
  if (effort_level >= 5) {
    try {
      const response = await axios.post(
        "https://argus-world-engine/api/updateGrave",
        {
          grave_id,
          action: "cleaning",
          effort_level,
        }
      );

      const { tx_id } = response.data;

      // 必要に応じて tx_id を保存
      // 例: ここではCleanLogに保存する場合
      await supabase
        .from("cleaning_logs")
        .update({ onchain_tx_id: tx_id })
        .eq("id", cleaningLog.id);
    } catch (error: any) {
      // オンチェーンへの影響が失敗しても清掃は成功とする
      console.error("Argus World Engineへの送信に失敗しました:", error.message);
    }
  }

  return NextResponse.json({ cleaningLog, newDirtiness });
}
