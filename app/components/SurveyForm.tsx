'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { Category, Question, UserData } from '@/app/types'

interface SurveyFormProps {
  category: Category
  initialResponses: Record<string, string>
  userData: UserData
  onSubmit: (responses: Record<string, string>) => Promise<void>
  onBack: () => void
}

export default function SurveyForm({ 
  category, 
  initialResponses, 
  userData,
  onSubmit,
  onBack
}: SurveyFormProps) {
  const [responses, setResponses] = useState<Record<string, string>>(initialResponses)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setSaveSuccess(false)
    
    try {
      // Only submit responses that have values
      const answeredQuestions = Object.entries(responses).filter(([_, value]) => value?.trim())
      
      if (answeredQuestions.length === 0) {
        alert('Lütfen en az bir soruyu cevaplayın')
        setSaving(false)
        return
      }

      const responsesToSave: Record<string, string> = {}
      answeredQuestions.forEach(([questionId, value]) => {
        responsesToSave[questionId] = value
      })

      await onSubmit(responsesToSave)
      setSaveSuccess(true)
      
      // Show success message for 2 seconds then go back
      setTimeout(() => {
        onBack()
      }, 2000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Kayıt sırasında bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const renderQuestion = (question: Question) => {
    const questionId = question.id
    const value = responses[questionId] || ''

    switch (question.questionType) {
      case 'multiple_choice':
        const options = question.options || []
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">
              {question.questionText}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {options.map((option, idx) => (
                <label key={idx} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input
                    type="radio"
                    name={questionId}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleChange(questionId, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'rating':
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">
              {question.questionText}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleChange(questionId, String(rating))}
                  className={`w-12 h-12 rounded-full border-2 transition-colors font-semibold ${
                    value === String(rating)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:border-blue-400 text-gray-700'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        )

      case 'yes_no':
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">
              {question.questionText}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input
                  type="radio"
                  name={questionId}
                  value="Evet"
                  checked={value === 'Evet'}
                  onChange={(e) => handleChange(questionId, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-900">Evet</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input
                  type="radio"
                  name={questionId}
                  value="Hayır"
                  checked={value === 'Hayır'}
                  onChange={(e) => handleChange(questionId, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-900">Hayır</span>
              </label>
            </div>
          </div>
        )

      case 'free_text':
      default:
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-900">
              {question.questionText}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              value={value}
              onChange={(e) => handleChange(questionId, e.target.value)}
              placeholder="Cevabınızı yazın..."
              rows={4}
              className="text-gray-900"
            />
          </div>
        )
    }
  }

  if (saveSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h3 className="text-2xl font-bold text-gray-900">Cevaplarınız Kaydedildi!</h3>
          <p className="text-gray-700">Kategori listesine yönlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
          {category.description && (
            <p className="text-gray-700 text-sm mt-1">{category.description}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Sorular</CardTitle>
          <CardDescription className="text-gray-700">
            Lütfen aşağıdaki soruları cevaplayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {category.questions?.map((question) => (
            <div key={question.id} className="pb-6 border-b last:border-b-0">
              {renderQuestion(question)}
            </div>
          ))}
          {!category.questions?.length && (
            <p className="text-gray-500 text-sm text-center py-8">
              Bu kategoride soru bulunmuyor
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save All Button */}
      {category.questions && category.questions.length > 0 && (
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={saving}
          >
            İptal
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-8"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
