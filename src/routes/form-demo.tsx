import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Alert,
  Button,
  Card,
  CardBody,
  Field,
  FieldLabel,
  Input,
  Stack,
  Text,
  Textarea,
} from '@/design-system'
import { api, type ApiError } from '@/lib/api'

/**
 * EXAMPLE — not part of the starter proper.
 *
 * A worked example of React Hook Form + Zod, including the half most forms
 * get wrong: what to do when the *server* rejects a field. Removed by
 * `pnpm reset`.
 */

/**
 * The canonical form pattern for this repo.
 *
 * One Zod schema is the single source of truth for both runtime validation and
 * the TypeScript type — infer the type, never declare it twice.
 *
 * Our Input and Textarea keep the native event-first `onChange`, so
 * `register()` spreads onto them directly. That is deliberate: components that
 * swap in a value-first callback break every uncontrolled form library.
 */
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormValues = z.infer<typeof schema>

const submitContact = (values: FormValues) =>
  api<{ ok: true }>('/contact', {
    method: 'POST',
    body: JSON.stringify(values),
  })

function FormDemo() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  })

  const submit = useMutation({ mutationFn: submitContact })

  /**
   * Client validation has already passed by the time this runs, so everything
   * here is the server's verdict.
   *
   * Field-level rejections go back onto the field with `setError`, so the
   * message lands where the user is looking. Anything else goes to `root`,
   * which is React Hook Form's slot for a form-wide error — using a separate
   * piece of state for it would drift out of sync with `isSubmitting`.
   */
  const onSubmit = async (values: FormValues) => {
    try {
      await submit.mutateAsync(values)
      reset()
    } catch (err) {
      const { fieldErrors, message } = err as ApiError

      if (fieldErrors) {
        for (const [field, msg] of Object.entries(fieldErrors)) {
          setError(field as keyof FormValues, { message: msg })
        }
        return
      }

      setError('root', { message })
    }
  }

  return (
    <Stack gap={8}>
      <Stack gap={2}>
        <Text as="h1" size="3xl" weight="bold">
          Form demo
        </Text>
        <Text tone="muted">
          React Hook Form + Zod. Submit while empty to see client validation, or
          use <code>taken@example.com</code> to see the server reject a field.
        </Text>
      </Stack>

      {isSubmitSuccessful && (
        <Alert tone="success" title="Sent">
          Your message was submitted.
        </Alert>
      )}

      {errors.root && (
        <Alert tone="danger" title="Could not send">
          {errors.root.message}
        </Alert>
      )}

      <Card className="max-w-xl">
        <CardBody className="pt-5">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap={4}>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Ada Lovelace"
                  aria-invalid={Boolean(errors.name)}
                  {...register('name')}
                />
                {errors.name && (
                  <Text size="sm" tone="danger" role="alert">
                    {errors.name.message}
                  </Text>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="ada@example.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register('email')}
                />
                {errors.email && (
                  <Text size="sm" tone="danger" role="alert">
                    {errors.email.message}
                  </Text>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="What would you like to build?"
                  aria-invalid={Boolean(errors.message)}
                  {...register('message')}
                />
                {errors.message && (
                  <Text size="sm" tone="danger" role="alert">
                    {errors.message.message}
                  </Text>
                )}
              </Field>

              <Stack direction="row" gap={2}>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => reset()}>
                  Reset
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Stack>
  )
}

export const Route = createFileRoute('/form-demo')({ component: FormDemo })
