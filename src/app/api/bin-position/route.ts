import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  // For now, just return an empty list
  return NextResponse.json({
    userId,
    positions: [],
    page_num: searchParams.get('page_num'),
    page_size: searchParams.get('page_size'),
  })
}
