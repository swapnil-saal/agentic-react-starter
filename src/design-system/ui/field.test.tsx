import { zodResolver } from '@hookform/resolvers/zod'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { Button } from './button'
import { Field, FieldDescription, FieldLabel } from './field'
import { Input } from './input'
import { Textarea } from './textarea'

/**
 * Worked example for the third component archetype: a field wired to React
 * Hook Form and Zod.
 *
 * This is also the mechanical guard for hard rule 4 — `Input` and `Textarea`
 * keep the native event-first `onChange`, which is the only reason
 * `register()` works by spreading. Swap in a value-first callback and the
 * submit assertions below go empty, which is exactly the failure that would
 * otherwise ship silently and break every form in the app.
 */
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
})

type Values = z.infer<typeof schema>

function Example({ onValid }: { onValid: (v: Values) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', bio: '' },
  })

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          id="name"
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        <FieldDescription>Your full name.</FieldDescription>
        {errors.name && <span role="alert">{errors.name.message}</span>}
      </Field>

      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea
          id="bio"
          aria-invalid={Boolean(errors.bio)}
          {...register('bio')}
        />
        {errors.bio && <span role="alert">{errors.bio.message}</span>}
      </Field>

      <Button type="submit">Save</Button>
    </form>
  )
}

describe('Field + React Hook Form', () => {
  it('associates the label with the control', () => {
    render(<Example onValid={vi.fn()} />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Bio')).toBeInTheDocument()
  })

  it('passes typed values through register() on submit', async () => {
    const onValid = vi.fn()
    render(<Example onValid={onValid} />)

    await userEvent.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await userEvent.type(
      screen.getByLabelText('Bio'),
      'Mathematician and the first programmer.',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onValid).toHaveBeenCalledOnce()
    expect(onValid.mock.calls[0][0]).toMatchObject({
      name: 'Ada Lovelace',
      bio: 'Mathematician and the first programmer.',
    })
  })

  it('surfaces Zod messages as alerts and blocks submission', async () => {
    const onValid = vi.fn()
    render(<Example onValid={onValid} />)

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    const alerts = await screen.findAllByRole('alert')
    expect(alerts.map((a) => a.textContent)).toEqual([
      'Name must be at least 2 characters',
      'Bio must be at least 10 characters',
    ])
    expect(onValid).not.toHaveBeenCalled()
  })

  it('marks an invalid control with aria-invalid', async () => {
    render(<Example onValid={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByLabelText('Name')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })
})
