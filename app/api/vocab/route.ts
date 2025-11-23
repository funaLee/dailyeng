/**
 * Vocabulary API Routes
 * 
 * Endpoints:
 * - GET  /api/vocab?topicId=xxx - Lấy vocabulary theo topic
 * - POST /api/vocab - Tạo vocab item mới
 * 
 * Mục đích:
 * - Thay thế mockVocab trong FE
 * - Lấy từ vựng từ database
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vocab?topicId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const topicId = searchParams.get('topicId')

    if (!topicId) {
      return NextResponse.json(
        { error: 'topicId is required' },
        { status: 400 }
      )
    }

    const vocabItems = await prisma.vocabItem.findMany({
      where: {
        topicId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Parse JSON fields và format để match với FE interface
    const formattedVocab = vocabItems.map(item => ({
      id: item.id,
      word: item.word,
      pronunciation: item.pronunciation,
      partOfSpeech: item.partOfSpeech.toLowerCase(),
      meaning: JSON.parse(item.meanings)[0] || '', // FE expects single string
      vietnameseMeaning: JSON.parse(item.vietnameseMeanings)[0] || '',
      meanings: JSON.parse(item.meanings), // Full array
      vietnameseMeanings: JSON.parse(item.vietnameseMeanings),
      examples: JSON.parse(item.examples),
      collocations: item.collocations ? JSON.parse(item.collocations) : [],
      synonyms: item.synonyms ? JSON.parse(item.synonyms) : [],
      antonyms: item.antonyms ? JSON.parse(item.antonyms) : [],
      relatedWords: item.relatedWords ? JSON.parse(item.relatedWords) : [],
      audioUrl: item.audioUrl,
      // For backward compatibility with old FE interface
      exampleSentence: JSON.parse(item.examples)[0]?.en || '',
      exampleTranslation: JSON.parse(item.examples)[0]?.vi || '',
    }))

    return NextResponse.json(formattedVocab)
  } catch (error) {
    console.error('Error fetching vocab:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vocabulary' },
      { status: 500 }
    )
  }
}

// POST /api/vocab
// Body: { topicId, word, pronunciation, partOfSpeech, meanings, vietnameseMeanings, examples, collocations }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const vocabItem = await prisma.vocabItem.create({
      data: {
        topicId: body.topicId,
        word: body.word,
        pronunciation: body.pronunciation,
        partOfSpeech: body.partOfSpeech.toUpperCase(),
        meanings: JSON.stringify(body.meanings),
        vietnameseMeanings: JSON.stringify(body.vietnameseMeanings),
        examples: JSON.stringify(body.examples),
        collocations: body.collocations ? JSON.stringify(body.collocations) : null,
        synonyms: body.synonyms ? JSON.stringify(body.synonyms) : null,
        antonyms: body.antonyms ? JSON.stringify(body.antonyms) : null,
        relatedWords: body.relatedWords ? JSON.stringify(body.relatedWords) : null,
        audioUrl: body.audioUrl,
      },
    })

    // Update topic wordCount
    await prisma.topic.update({
      where: { id: body.topicId },
      data: {
        wordCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(vocabItem, { status: 201 })
  } catch (error) {
    console.error('Error creating vocab:', error)
    return NextResponse.json(
      { error: 'Failed to create vocabulary' },
      { status: 500 }
    )
  }
}
