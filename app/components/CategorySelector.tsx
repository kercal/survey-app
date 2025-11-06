'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Category } from '@/app/types'
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface CategorySelectorProps {
  categories: Category[]
  onSelectCategory: (category: Category) => void
}

const ITEMS_PER_PAGE = 20

export default function CategorySelector({ categories, onSelectCategory }: CategorySelectorProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentCategories = categories.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)
  const goToPreviousPage = () => goToPage(Math.max(1, currentPage - 1))
  const goToNextPage = () => goToPage(Math.min(totalPages, currentPage + 1))

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Anket Kategorileri</h2>
        <p className="text-gray-700">
          Lütfen doldurmak istediğiniz anket kategorisini seçin
          {categories.length > 0 && (
            <span className="ml-2 text-gray-600">
              (Toplam {categories.length} kategori)
            </span>
          )}
        </p>
      </div>

      {categories.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCategories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                onClick={() => onSelectCategory(category)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900">{category.name}</CardTitle>
                      {category.description && (
                        <CardDescription className="mt-2 text-gray-700">
                          {category.description}
                        </CardDescription>
                      )}
                    </div>
                    <ChevronRight className="h-6 w-6 text-blue-600 flex-shrink-0 ml-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">
                      {category.questions?.length || 0} soru
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="px-2"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => goToPage(page as number)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="px-2"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600">
                Sayfa {currentPage} / {totalPages}
                {' • '}
                {startIndex + 1}-{Math.min(endIndex, categories.length)} arası gösteriliyor
              </p>
            </div>
          )}
        </>
      )}

      {!categories.length && (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">
              Henüz aktif anket kategorisi bulunmuyor
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

