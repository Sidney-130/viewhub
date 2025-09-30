import { NextRequest, NextResponse } from 'next/server'

const SAROS_API_BASE = 'https://api.saros.finance' // or devnet URL

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')
    const pageNum = searchParams.get('page_num') || '1'
    const pageSize = searchParams.get('page_size') || '100'
    const pairId = searchParams.get('pair_id')

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const params = new URLSearchParams({
      user_id: userId,
      page_num: pageNum,
      page_size: pageSize,
    })

    if (pairId) {
      params.append('pair_id', pairId)
    }

    const response = await fetch(`${SAROS_API_BASE}/api/bin-position?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Saros API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Bin position API error:', error)
    return NextResponse.json({ error: 'Failed to fetch bin positions' }, { status: 500 })
  }
}
