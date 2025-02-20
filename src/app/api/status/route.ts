import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Grave } from '@/types'

export async function PATCH(request: Request) {
  const walletAddress = request.headers.get('wallet_address')

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  // 現在時刻を取得
  const currentTime = new Date()

  // ユーザーを取得
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // ユーザーが所有するお墓を取得
  const { data: graves, error: gravesError } = await supabase
    .from<Grave>('graves')
    .select('*')
    .eq('user_id', user.id)

  if (gravesError) {
    return NextResponse.json({ error: gravesError.message }, { status: 500 })
  }

  // 各お墓の状態を更新
  const updates = graves.map(async (grave) => {
    const lastUpdated = new Date(grave.last_updated)
    const hoursPassed = Math.floor((currentTime.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60))
    const intervals = Math.floor(hoursPassed) // 1時間ごとに+5

    if (intervals <= 0) return

    let dirtinessIncrease = 5 * intervals
    let hungerIncrease = 5 * intervals

    // 汚れが一定以上の場合、空腹度の増加ペースを上げる
    if (grave.dirtiness >= 50) {
      hungerIncrease += 5 * intervals // 追加で+5 per interval
    }

    const newDirtiness = Math.min(grave.dirtiness + dirtinessIncrease, 100)
    const newHunger = Math.min(grave.hunger + hungerIncrease, 100)

    // お墓の状態を更新
    const { error: updateError } = await supabase
      .from('graves')
      .update({
        dirtiness: newDirtiness,
        hunger: newHunger,
        last_updated: currentTime.toISOString(),
      })
      .eq('id', grave.id)

    if (updateError) {
      console.error(`お墓ID ${grave.id} の更新に失敗しました: ${updateError.message}`)
    }
  })

  await Promise.all(updates)

  return NextResponse.json({ message: 'Grave statuses updated successfully' })
} 