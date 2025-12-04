/**
 * Speaking Session Detail API
 * 
 * Endpoints:
 * - GET    /api/speaking/sessions/[id] - Lấy chi tiết session
 * - PUT    /api/speaking/sessions/[id] - Update session (scores, status)
 * - DELETE /api/speaking/sessions/[id] - Xóa session
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/speaking/sessions/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.speakingSession.findUnique({
      where: { id: params.id },
      include: {
        scenario: true,
        turns: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

// PUT /api/speaking/sessions/[id]
// Body: { status?, overallScore?, pronunciationScore?, fluencyScore?, grammarScore?, contentScore? }
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const session = await prisma.speakingSession.update({
      where: { id: params.id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.overallScore !== undefined && { overallScore: body.overallScore }),
        ...(body.pronunciationScore !== undefined && { pronunciationScore: body.pronunciationScore }),
        ...(body.fluencyScore !== undefined && { fluencyScore: body.fluencyScore }),
        ...(body.grammarScore !== undefined && { grammarScore: body.grammarScore }),
        ...(body.contentScore !== undefined && { contentScore: body.contentScore }),
        ...(body.status === 'COMPLETED' && { completedAt: new Date() }),
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

// DELETE /api/speaking/sessions/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.speakingSession.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}
