import { Alert, Button, Card, Input, Stack, Text } from '@usefragments/ui'
import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

/**
 * The canonical form pattern for this repo.
 *
 * Two rules worth knowing before you copy this:
 *
 * 1. One Zod schema is the single source of truth for both runtime validation
 *    and the TypeScript type. Infer the type — never declare it separately.
 *
 * 2. Fragments inputs are **value-first**: `onChange` receives a `string`, not
 *    a DOM event, and the native `onChange` is omitted from their props. That
 *    makes React Hook Form's `register()` spread incompatible, so bind fields
 *    with `<Controller>` instead. Spreading `register('x')` onto an <Input>
 *    type-errors, and would silently never update if forced through.
 */
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormValues = z.infer<typeof schema>

const FIELDS = [
  { name: 'name', label: 'Name', placeholder: 'Ada Lovelace' },
  { name: 'email', label: 'Email', placeholder: 'ada@example.com' },
  {
    name: 'message',
    label: 'Message',
    placeholder: 'What would you like to build?',
  },
] as const satisfies ReadonlyArray<{
  name: keyof FormValues
  label: string
  placeholder: string
}>

function FormDemo() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  })

  const onSubmit = async (values: FormValues) => {
    // Stands in for a real mutation — swap for a TanStack Query useMutation.
    await new Promise((resolve) => setTimeout(resolve, 400))
    console.info('submitted', values)
    reset()
  }

  return (
    <Stack direction="column" gap="lg">
      <Stack direction="column" gap="sm">
        <Text as="h1" scale="2xl" weight="bold">
          Form demo
        </Text>
        <Text color="secondary">
          React Hook Form + Zod. Submit while empty to see validation.
        </Text>
      </Stack>

      {isSubmitSuccessful && (
        <Alert tone="success">
          <Alert.Title>Sent</Alert.Title>
          <Alert.Content>Your message was submitted.</Alert.Content>
        </Alert>
      )}

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack direction="column" gap="md">
              {FIELDS.map((f) => (
                <Controller
                  key={f.name}
                  name={f.name}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      label={f.label}
                      placeholder={f.placeholder}
                      type={f.name === 'email' ? 'email' : 'text'}
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              ))}

              <Stack direction="row" gap="sm">
                <Button
                  type="submit"
                  variant="solid"
                  tone="accent"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending…' : 'Send'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => reset()}>
                  Reset
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card.Body>
      </Card>
    </Stack>
  )
}

export const Route = createFileRoute('/form-demo')({ component: FormDemo })
