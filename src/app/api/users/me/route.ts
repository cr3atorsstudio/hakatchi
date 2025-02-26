
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@/types'

export async function GET(request: Request) {
  const walletAddress = request.headers.get('wallet-address')

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ wallet_address: walletAddress }])
        .select()
        .single()

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json(newUser)
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('wallet_address', walletAddress)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
