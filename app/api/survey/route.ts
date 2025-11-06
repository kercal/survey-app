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

    // Get all active categories with their questions for this tenant
    const categories = await prisma.category.findMany({
      where: {
        tenantId,
        isActive: true
      },
      include: {
        questions: {
          where: {
            isActive: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Get user's existing responses
    const responses = await prisma.response.findMany({
      where: {
        tenantId,
        personId
      }
    })

    // Convert responses to a map for easy lookup
    const responsesMap: Record<string, string> = {}
    responses.forEach(response => {
      responsesMap[response.questionId] = response.answerValue
    })

    return NextResponse.json({
      categories,
      isAdmin: !!adminUser,
      responses: responsesMap
    })
  } catch (error) {
    console.error('Error fetching survey data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch survey data' },
      { status: 500 }
    )
  }
}

