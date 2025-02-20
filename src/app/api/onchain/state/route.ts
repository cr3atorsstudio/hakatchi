import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  try {
    const response = await axios.get('https://argus-world-engine/api/getCharacterState')
    const onchainState = response.data

    return NextResponse.json(onchainState)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 