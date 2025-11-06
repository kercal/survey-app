'use client'

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DataWaiting() {
  const [status, setStatus] = useState({ 
    ready: false, 
    message: 'Lütfen Bekleyiniz...' 
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const appURL = searchParams.get('app')

  const handleMessage = useCallback(async (event: MessageEvent) => {
    // Security check
    if (appURL && event.origin !== appURL) {
      console.warn("Güvensiz mesaj:", event.origin)
      return
    }

    if (!event.isTrusted) {
      console.warn("Güvenilmeyen mesaj")
      return
    }

    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data

      // Check for required fields
      if (!data.tenantID || !data.personID) {
        throw new Error('tenantID ve personID gereklidir!')
      }

      // Store user data in sessionStorage
      sessionStorage.setItem('userData', JSON.stringify({
        tenantID: data.tenantID,
        personID: data.personID,
        personName: data.personName || data.fullName || '',
        bearerToken: data.bearerToken || ''
      }))

      setStatus({ 
        ready: true, 
        message: 'Yönlendiriliyorsunuz...' 
      })

      // Redirect to survey page
      setTimeout(() => {
        router.push('/survey')
      }, 500)
    } catch (error) {
      console.error('Mesaj işlenirken hata:', error)
      setStatus({ 
        ready: false, 
        message: 'Veri alınırken hata oluştu!' 
      })
    }
  }, [appURL, router])

  useEffect(() => {
    if (appURL) {
      // Send ready signal to parent
      window.parent.postMessage(
        JSON.stringify({ isReady: true }), 
        appURL
      )
      
      // Listen for messages
      window.addEventListener('message', handleMessage)
    } else {
      setStatus({ 
        ready: false, 
        message: 'Hata: app parametresi bulunamadı!' 
      })
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [handleMessage, appURL])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
        <p className="text-2xl font-semibold text-gray-800">
          {status.message}
        </p>
        {!appURL && (
          <p className="text-sm text-red-600">
            Bu uygulama bir iframe içinde çalışmalıdır
          </p>
        )}
      </div>
    </div>
  )
}

