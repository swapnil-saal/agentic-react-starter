import { Toast as BaseToast } from '@base-ui/react/toast'
import { X } from 'lucide-react'

import { cn } from '../cn'
import { transitionAll } from './_motion'

/** Mount <ToastProvider> once at the app root, and <Toaster/> alongside it.
 *  Fire toasts with `useToast().add({ title, description })`. */
export const ToastProvider = BaseToast.Provider
export const useToast = BaseToast.useToastManager

function ToastItem({ toast }: { toast: BaseToast.Root.ToastObject }) {
  return (
    <BaseToast.Root
      toast={toast}
      className={cn(
        'flex w-80 items-start gap-3 rounded-lg border border-border bg-raised p-4 shadow-lg',
        transitionAll,
        'data-[starting-style]:translate-x-4 data-[starting-style]:opacity-0',
        'data-[ending-style]:translate-x-4 data-[ending-style]:opacity-0',
      )}
    >
      <div className="flex flex-1 flex-col gap-1">
        <BaseToast.Title className="text-base font-medium text-fg" />
        <BaseToast.Description className="text-sm text-fg-muted" />
      </div>
      <BaseToast.Close
        aria-label="Dismiss notification"
        className="rounded p-0.5 text-fg-muted focus-ring hover:text-fg"
      >
        <X className="size-4" />
      </BaseToast.Close>
    </BaseToast.Root>
  )
}

export function Toaster() {
  const { toasts } = BaseToast.useToastManager()
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  )
}
