import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@/types'

export async function GET(request: Request) {
  const walletAddress = request.headers.get('wallet_address')

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  // ユーザーを取得
  let { data, error } = await supabase
    .from<User>('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    // ユーザーが存在しない場合は作成
    const { data: newUser, error: insertError } = await supabase
      .from<User>('users')
      .insert([{ wallet_address: walletAddress }])
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json(newUser)
  } else {
    // 既存ユーザーの場合、updated_atを更新
    const { data: updatedUser, error: updateError } = await supabase
      .from<User>('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', data.id)
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(updatedUser)
  }
} 