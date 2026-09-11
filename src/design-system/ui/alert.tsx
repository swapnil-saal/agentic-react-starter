import { cva, type VariantProps } from 'class-variance-authority'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import * as React from 'react'

import { cn } from '../cn'

const alertVariants = cva(
  'flex gap-3 rounded-lg border p-4 text-base [&_svg]:size-4.5 [&_svg]:shrink-0 [&_svg]:mt-0.5',
  {
    variants: {
      tone: {
        info: 'border-info-border bg-info-subtle text-info-fg',
        success: 'border-success-border bg-success-subtle text-success-fg',
        warning: 'border-warning-border bg-warning-subtle text-warning-fg',
        danger: 'border-danger-border bg-danger-subtle text-danger-fg',
      },
    },
    defaultVariants: { tone: 'info' },
  },
)

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
} as const

export interface AlertProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
}

/** An icon accompanies every tone on purpose: meaning must never be carried by
 *  colour alone. `role="alert"` is set for the tones a user must not miss. */
export function Alert({
  className,
  tone = 'info',
  title,
  children,
  ...props
}: AlertProps) {
  const Icon = ICONS[tone ?? 'info']
  const urgent = tone === 'danger' || tone === 'warning'

  return (
    <div
      role={urgent ? 'alert' : 'status'}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      <Icon aria-hidden />
      <div className="flex flex-col gap-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className="text-fg-muted">{children}</div>}
      </div>
    </div>
  )
}
