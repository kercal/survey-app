'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Download } from 'lucide-react'
import { UserData } from '@/app/types'
import { formatDate } from '@/app/utils'

interface ResultsData {
  results: Array<{
    questionText: string
    questionType: string
    category: string
    responses: Array<{
      personId: string
      personName?: string
      answer: string
      date: string
    }>
  }>
  statistics: {
    totalResponses: number
    uniqueRespondents: number
    totalQuestions: number
  }
}

interface ResultsPanelProps {
  userData: UserData
}

export default function ResultsPanel({ userData }: ResultsPanelProps) {
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [data, setData] = useState<ResultsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/results?tenantId=${userData.tenantID}&personId=${userData.personID}`
      )

      if (!response.ok) {
        throw new Error('Sonuçlar yüklenirken hata oluştu')
      }

      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const response = await fetch(
        `/api/export?tenantId=${userData.tenantID}&personId=${userData.personID}`
      )

      if (!response.ok) {
        throw new Error('Export işlemi başarısız')
      }

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `survey-results-${Date.now()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export başarısız')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Toplam Cevap</CardDescription>
            <CardTitle className="text-3xl">{data.statistics.totalResponses}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Katılımcı Sayısı</CardDescription>
            <CardTitle className="text-3xl">{data.statistics.uniqueRespondents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Toplam Soru</CardDescription>
            <CardTitle className="text-3xl">{data.statistics.totalQuestions}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={handleExport} disabled={exporting}>
          {exporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              İndiriliyor...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Excel İndir
            </>
          )}
        </Button>
      </div>

      {/* Results by Question */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Soru Bazlı Sonuçlar</h2>
        {data.results.map((result, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{result.questionText}</CardTitle>
                  <CardDescription>
                    Kategori: {result.category} | Tip: {result.questionType}
                  </CardDescription>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {result.responses.length} cevap
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {result.questionType === 'multiple_choice' || result.questionType === 'yes_no' ? (
                <div className="space-y-2">
                  {/* Group and count responses */}
                  {Object.entries(
                    result.responses.reduce((acc, r) => {
                      acc[r.answer] = (acc[r.answer] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([answer, count]) => (
                      <div key={answer} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{answer}</span>
                        <span className="text-sm text-gray-600">
                          {count} kişi ({Math.round((count / result.responses.length) * 100)}%)
                        </span>
                      </div>
                    ))}
                </div>
              ) : result.questionType === 'rating' ? (
                <div className="space-y-2">
                  {/* Show rating distribution */}
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = result.responses.filter(r => r.answer === String(rating)).length
                    const percentage = result.responses.length > 0 
                      ? (count / result.responses.length) * 100 
                      : 0
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="w-12">{rating} ⭐</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-blue-600 h-4 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-20 text-sm text-gray-600">
                          {count} ({Math.round(percentage)}%)
                        </span>
                      </div>
                    )
                  })}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      Ortalama:{' '}
                      <span className="font-medium">
                        {(
                          result.responses.reduce((sum, r) => sum + Number(r.answer), 0) /
                          result.responses.length
                        ).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {result.responses.map((response, rIdx) => (
                    <div key={rIdx} className="p-3 bg-gray-50 rounded">
                      <p className="text-sm mb-1">{response.answer}</p>
                      <p className="text-xs text-gray-500">
                        {response.personName || response.personId} - {formatDate(response.date)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {!data.results.length && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">Henüz cevap bulunmuyor</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

