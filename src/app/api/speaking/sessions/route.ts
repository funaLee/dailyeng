/**
 * Speaking Sessions API
 * 
 * Endpoints:
 * - GET  /api/speaking/sessions?userId=xxx - Lấy sessions của user
 * - POST /api/speaking/sessions - Tạo session mới
 * 
 * Mục đích:
 * - Quản lý phiên luyện nói của user
 * - Track progress và scores
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/speaking/sessions?userId=xxx&scenarioId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const scenarioId = searchParams.get('scenarioId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const sessions = await prisma.speakingSession.findMany({
      where: {
        userId,
        ...(scenarioId && { scenarioId }),
      },
      include: {
        scenario: true,
        turns: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

// POST /api/speaking/sessions
// Body: { userId, scenarioId }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const session = await prisma.speakingSession.create({
      data: {
        userId: body.userId,
        scenarioId: body.scenarioId,
        status: 'IN_PROGRESS',
      },
      include: {
        scenario: true,
      },
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
