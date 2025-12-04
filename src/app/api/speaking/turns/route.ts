/**
 * Speaking Turns API
 * 
 * Endpoints:
 * - GET  /api/speaking/turns?sessionId=xxx - Lấy turns của session
 * - POST /api/speaking/turns - Tạo turn mới (user hoặc AI)
 * 
 * Mục đích:
 * - Lưu lượt hội thoại trong session
 * - Track scores cho từng turn
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/speaking/turns?sessionId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    const turns = await prisma.speakingTurn.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json(turns)
  } catch (error) {
    console.error('Error fetching turns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch turns' },
      { status: 500 }
    )
  }
}

// POST /api/speaking/turns
// Body: { sessionId, role, text, audioUrl?, pronunciationScore?, fluencyScore?, grammarScore?, contentScore? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const turn = await prisma.speakingTurn.create({
      data: {
        sessionId: body.sessionId,
        role: body.role, // 'USER' | 'TUTOR' | 'AI'
        text: body.text,
        audioUrl: body.audioUrl,
        pronunciationScore: body.pronunciationScore,
        fluencyScore: body.fluencyScore,
        grammarScore: body.grammarScore,
        contentScore: body.contentScore,
      },
    })

    return NextResponse.json(turn, { status: 201 })
  } catch (error) {
    console.error('Error creating turn:', error)
    return NextResponse.json(
      { error: 'Failed to create turn' },
      { status: 500 }
    )
  }
}
