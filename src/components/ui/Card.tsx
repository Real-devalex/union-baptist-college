import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('p-4 border-b border-gray-200', className)}>{children}</div>
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('p-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: CardProps) {
  return <h3 className={cn('text-lg font-semibold text-gray-900', className)}>{children}</h3>
}

export function StatCard({ label, value, icon, color = 'blue' }: {
  label: string
  value: string | number
  icon: ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-50 text-gray-600',
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={cn('p-3 rounded-lg', colorMap[color])}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
