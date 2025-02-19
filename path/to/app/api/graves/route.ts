import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Grave } from '@/types'

export async function POST(request: Request) {
  const walletAddress = request.headers.get('wallet_address')

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  const { name, location } = await request.json()

  if (!name || !location) {
    return NextResponse.json({ error: 'Name and location are required' }, { status: 400 })
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

  // お墓を作成
  const { data: newGrave, error } = await supabase
    .from<Grave>('graves')
    .insert([
      {
        user_id: user.id,
        name,
        location,
        dirtiness: 0,
        hunger: 0,
        last_updated: new Date().toISOString(),
      },
    ])
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(newGrave)
} 