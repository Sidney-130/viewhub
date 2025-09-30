// /api/pool-position/route.ts
import { NextRequest, NextResponse } from 'next/server'

const SAROS_API_BASE = 'https://api.saros.finance'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id') // now optional
    const poolId = searchParams.get('pool_id')
    const pageNum = searchParams.get('page_num') || '1'
    const pageSize = searchParams.get('page_size') || '100'

    // Build query params for Saros API
    const params: any = { page_num: pageNum, page_size: pageSize }
    if (userId) params.user_id = userId // only include if provided
    if (poolId) params.pair_id = poolId

    const apiUrl = `${SAROS_API_BASE}/api/pool-position?${new URLSearchParams(params)}`
    const response = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } })

    if (!response.ok) {
      throw new Error(`Saros API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Pool position API error:', error)
    return NextResponse.json({ error: 'Failed to fetch pool positions' }, { status: 500 })
  }
}
