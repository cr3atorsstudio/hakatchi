import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Grave } from '@/types'
import axios from 'axios'

export async function POST(request: Request) {
  const walletAddress = request.headers.get('wallet_address')

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  const { grave_id } = await request.json()

  if (!grave_id) {
    return NextResponse.json({ error: 'grave_id is required' }, { status: 400 })
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

  // お墓を取得
  const { data: grave, error: graveError } = await supabase
    .from<Grave>('graves')
    .select('*')
    .eq('id', grave_id)
    .single()

  if (graveError || !grave) {
    return NextResponse.json({ error: 'Grave not found' }, { status: 404 })
  }

  // Argus World Engineにステータス変更を送信
  try {
    const response = await axios.post('https://argus-world-engine/api/updateCharacter', {
      grave_id,
      dirtiness: grave.dirtiness,
      hunger: grave.hunger,
    })

    const { tx_id } = response.data

    // お墓にオンチェーンのトランザクションIDを保存
    const { error: updateError } = await supabase
      .from('graves')
      .update({
        // 必要に応じて onchain_tx_id カラムを追加
        // onchain_tx_id: tx_id,
      })
      .eq('id', grave_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ tx_id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 