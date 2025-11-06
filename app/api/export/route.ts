import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

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

    // Get tenant info
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })

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
      orderBy: [
        { question: { category: { name: 'asc' } } },
        { question: { order: 'asc' } },
        { createdAt: 'desc' }
      ]
    })

    // Create workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Survey Results')

    // Add header
    worksheet.columns = [
      { header: 'Kategori', key: 'category', width: 25 },
      { header: 'Soru', key: 'question', width: 50 },
      { header: 'Soru Tipi', key: 'questionType', width: 20 },
      { header: 'Kişi ID', key: 'personId', width: 30 },
      { header: 'Kişi Adı', key: 'personName', width: 30 },
      { header: 'Cevap', key: 'answer', width: 50 },
      { header: 'Tarih', key: 'date', width: 20 }
    ]

    // Style header
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    // Add data
    responses.forEach(response => {
      worksheet.addRow({
        category: response.question.category.name,
        question: response.question.questionText,
        questionType: response.question.questionType,
        personId: response.personId,
        personName: response.personName || 'Bilinmiyor',
        answer: response.answerValue,
        date: new Date(response.createdAt).toLocaleDateString('tr-TR')
      })
    })

    // Add summary sheet
    const summarySheet = workbook.addWorksheet('Özet')
    summarySheet.columns = [
      { header: 'Metrik', key: 'metric', width: 30 },
      { header: 'Değer', key: 'value', width: 20 }
    ]

    summarySheet.getRow(1).font = { bold: true }
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    const uniqueRespondents = new Set(responses.map(r => r.personId)).size
    const totalQuestions = await prisma.question.count({
      where: { tenantId, isActive: true }
    })

    summarySheet.addRow({ metric: 'Toplam Cevap Sayısı', value: responses.length })
    summarySheet.addRow({ metric: 'Katılımcı Sayısı', value: uniqueRespondents })
    summarySheet.addRow({ metric: 'Toplam Soru Sayısı', value: totalQuestions })
    summarySheet.addRow({ metric: 'Firma', value: tenant?.name || tenantId })
    summarySheet.addRow({ 
      metric: 'Rapor Tarihi', 
      value: new Date().toLocaleDateString('tr-TR') 
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="survey-results-${Date.now()}.xlsx"`
      }
    })
  } catch (error) {
    console.error('Error exporting results:', error)
    return NextResponse.json(
      { error: 'Failed to export results' },
      { status: 500 }
    )
  }
}

