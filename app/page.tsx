import { Suspense } from 'react'
import DataWaiting from './components/DataWaiting'
import { Loader2 } from 'lucide-react'

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </div>
    }>
      <DataWaiting />
    </Suspense>
  )
}
