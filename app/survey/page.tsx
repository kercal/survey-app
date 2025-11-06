'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import SurveyForm from '@/app/components/SurveyForm'
import CategorySelector from '@/app/components/CategorySelector'
import ResultsPanel from '@/app/components/ResultsPanel'
import { Category, UserData } from '@/app/types'

export default function SurveyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [surveyData, setSurveyData] = useState<{
    categories: Category[]
    isAdmin: boolean
    responses: Record<string, string>
  } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get user data from sessionStorage
    const storedData = sessionStorage.getItem('userData')
    
    if (!storedData) {
      // Redirect back to home if no user data
      router.push('/')
      return
    }

    try {
      const parsed = JSON.parse(storedData)
      setUserData(parsed)
      fetchSurveyData(parsed)
    } catch (err) {
      console.error('Error parsing user data:', err)
      router.push('/')
    }
  }, [router])

  const fetchSurveyData = async (user: UserData) => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/survey?tenantId=${user.tenantID}&personId=${user.personID}`
      )

      if (!response.ok) {
        throw new Error('Anket verileri yüklenirken hata oluştu')
      }

      const data = await response.json()
      setSurveyData(data)
    } catch (err) {
      console.error('Error fetching survey:', err)
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResponses = async (responses: Record<string, string>) => {
    if (!userData) return

    // Submit all responses
    const promises = Object.entries(responses).map(([questionId, answer]) =>
      fetch('/api/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId,
          tenantId: userData.tenantID,
          personId: userData.personID,
          personName: userData.personName,
          answerValue: answer
        })
      })
    )

    const results = await Promise.all(promises)
    
    // Check if any failed
    const failed = results.filter(r => !r.ok)
    if (failed.length > 0) {
      throw new Error('Bazı cevaplar kaydedilemedi')
    }

    // Update local responses
    setSurveyData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        responses: {
          ...prev.responses,
          ...responses
        }
      }
    })
  }

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 underline"
          >
            Ana sayfaya dön
          </button>
        </div>
      </div>
    )
  }

  if (!surveyData || !userData) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Anket Uygulaması</h1>
        {userData.personName && (
          <p className="text-gray-800">Hoş geldiniz, {userData.personName}</p>
        )}
      </div>

      {surveyData.isAdmin ? (
        <Tabs defaultValue="survey" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="survey">Anket</TabsTrigger>
            <TabsTrigger value="results">Sonuçlar</TabsTrigger>
          </TabsList>

          <TabsContent value="survey">
            {selectedCategory ? (
              <SurveyForm
                category={selectedCategory}
                initialResponses={surveyData.responses}
                userData={userData}
                onSubmit={handleSubmitResponses}
                onBack={handleBackToCategories}
              />
            ) : (
              <CategorySelector
                categories={surveyData.categories}
                onSelectCategory={handleSelectCategory}
              />
            )}
          </TabsContent>

          <TabsContent value="results">
            <ResultsPanel userData={userData} />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          {selectedCategory ? (
            <SurveyForm
              category={selectedCategory}
              initialResponses={surveyData.responses}
              userData={userData}
              onSubmit={handleSubmitResponses}
              onBack={handleBackToCategories}
            />
          ) : (
            <CategorySelector
              categories={surveyData.categories}
              onSelectCategory={handleSelectCategory}
            />
          )}
        </>
      )}
    </div>
  )
}
