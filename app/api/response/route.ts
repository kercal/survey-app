import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionId, tenantId, personId, personName, answerValue } = body

    if (!questionId || !tenantId || !personId || answerValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if question exists and is active
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        tenantId,
        isActive: true
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found or inactive' },
        { status: 404 }
      )
    }

    // Upsert the response (update if exists, create if not)
    const response = await prisma.response.upsert({
      where: {
        questionId_personId: {
          questionId,
          personId
        }
      },
      update: {
        answerValue,
        personName,
        updatedAt: new Date()
      },
      create: {
        questionId,
        tenantId,
        personId,
        personName,
        answerValue
      }
    })

    return NextResponse.json({ 
      success: true, 
      response 
    })
  } catch (error) {
    console.error('Error saving response:', error)
    return NextResponse.json(
      { error: 'Failed to save response' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId')
    const personId = searchParams.get('personId')

    if (!tenantId || !personId) {
      return NextResponse.json(
        { error: 'tenantId and personId are required' },
        { status: 400 }
      )
    }

    const responses = await prisma.response.findMany({
      where: {
        tenantId,
        personId
      },
      include: {
        question: true
      }
    })

    return NextResponse.json({ responses })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}

