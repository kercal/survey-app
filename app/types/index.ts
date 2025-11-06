export type QuestionType = 'multiple_choice' | 'free_text' | 'rating' | 'yes_no'

export interface Category {
  id: string
  tenantId: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  questions?: Question[]
}

export interface Question {
  id: string
  categoryId: string
  tenantId: string
  questionText: string
  questionType: QuestionType
  options?: string[]
  isRequired: boolean
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
  responses?: Response[]
}

export interface Response {
  id: string
  questionId: string
  tenantId: string
  personId: string
  personName?: string
  answerValue: string
  createdAt: Date
  updatedAt: Date
  question?: Question
}

export interface AdminUser {
  id: string
  tenantId: string
  personId: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserData {
  tenantID: string
  personID: string
  personName?: string
  bearerToken?: string
}

export interface SurveyData {
  categories: Category[]
  isAdmin: boolean
  responses: Record<string, string> // questionId -> answerValue
}

export interface ExportData {
  questionText: string
  questionType: string
  category: string
  responses: {
    personId: string
    personName?: string
    answer: string
    date: string
  }[]
}

