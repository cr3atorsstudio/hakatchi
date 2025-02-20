import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { FeedingLog, Grave } from '@/types'
import axios from 'axios'

export async function POST(request: Request) {
  const walletAddress = request.headers.get('wallet_address')

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  const { grave_id, food_quality } = await request.json()

  if (!grave_id || food_quality === undefined) {
    return NextResponse.json({ error: 'grave_id and food_quality are required' }, { status: 400 })
  }

  if (food_quality < 1 || food_quality > 10) {
    return NextResponse.json({ error: 'food_quality must be between 1 and 10' }, { status: 400 })
  }

  // ユーザーを取得
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // お墓を確認
  const { data: grave, error: graveError } = await supabase
    .from<Grave>('graves')
    .select('*')
    .eq('id', grave_id)
    .single()

  if (graveError || !grave) {
    return NextResponse.json({ error: 'Grave not found' }, { status: 404 })
  }

  // 食事ログを記録
  const { data: feedingLog, error: logError } = await supabase
    .from<FeedingLog>('feeding_logs')
    .insert([
      {
        user_id: user.id,
        grave_id,
        fed_at: new Date().toISOString(),
        food_quality,
      },
    ])
    .single()

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 })
  }

  // お墓の空腹度を減少
  const hungerDecrease = food_quality * 5
  const newHunger = Math.max(grave.hunger - hungerDecrease, 0)

  // お墓の空腹度と最終更新日時を更新
  const { error: updateError } = await supabase
    .from('graves')
    .update({
      hunger: newHunger,
      last_updated: new Date().toISOString(),
    })
    .eq('id', grave_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Argus World Engineへの影響
  try {
    const response = await axios.post('https://argus-world-engine/api/updateGrave', {
      grave_id,
      action: 'feeding',
      food_quality,
    })

    const { tx_id } = response.data

    // 必要に応じて tx_id を保存
    // 例: ここではFeedingLogに保存する場合
    await supabase
      .from('feeding_logs')
      .update({ onchain_tx_id: tx_id })
      .eq('id', feedingLog.id)
  } catch (error: any) {
    // オンチェーンへの影響が失敗しても食事は成功とする
    console.error('Argus World Engineへの送信に失敗しました:', error.message)
  }

  return NextResponse.json({ feedingLog, newHunger })
} 