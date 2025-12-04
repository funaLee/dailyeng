/**
 * Simple Test API
 * Test xem API routes và database connection có hoạt động không
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const scenarioCount = await prisma.speakingScenario.count()
    const topicCount = await prisma.topic.count()
    
    return NextResponse.json({ 
      message: 'API and Database are working!',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        scenarios: scenarioCount,
        topics: topicCount,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      message: 'API works but Database connection failed',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message,
      }
    }, { status: 500 })
  }
}
