/**
 * Simple Test API
 * Test xem API routes có hoạt động không
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  })
}
