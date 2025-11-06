import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Check if user is admin
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        tenantId_personId: {
          tenantId,
          personId
        }
      }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized: User is not an admin' },
        { status: 403 }
      )
    }

    // Get all responses with question and category details
    const responses = await prisma.response.findMany({
      where: {
        tenantId
      },
      include: {
        question: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group responses by question
    const questionMap = new Map<string, {
      questionText: string
      questionType: string
      category: string
      responses: Array<{
        personId: string
        personName?: string
        answer: string
        date: string
      }>
    }>()

    responses.forEach(response => {
      const questionId = response.questionId
      if (!questionMap.has(questionId)) {
        questionMap.set(questionId, {
          questionText: response.question.questionText,
          questionType: response.question.questionType,
          category: response.question.category.name,
          responses: []
        })
      }
      
      questionMap.get(questionId)!.responses.push({
        personId: response.personId,
        personName: response.personName || 'Unknown',
        answer: response.answerValue,
        date: response.createdAt.toISOString()
      })
    })

    const results = Array.from(questionMap.values())

    // Calculate statistics
    const totalResponses = responses.length
    const uniqueRespondents = new Set(responses.map(r => r.personId)).size
    const totalQuestions = await prisma.question.count({
      where: { tenantId, isActive: true }
    })

    return NextResponse.json({
      results,
      statistics: {
        totalResponses,
        uniqueRespondents,
        totalQuestions
      }
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}

