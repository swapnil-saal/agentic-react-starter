import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'

/**
 * Worked example of the component-testing pattern for this repo.
 *
 * Query by accessible role and name — not class names, not test ids. That
 * asserts the component is reachable the way a user and a screen reader reach
 * it, and it survives restyling, which matters a lot when the whole design
 * system is meant to be edited.
 */
describe('Button', () => {
  it('renders with an accessible name', () => {
    render(<Button>Save changes</Button>)
    expect(
      screen.getByRole('button', { name: 'Save changes' }),
    ).toBeInTheDocument()
  })

  it('calls its handler when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Submit</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Submit
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('defaults to type="button" so it cannot accidentally submit a form', () => {
    render(<Button>Action</Button>)
    expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('lets a caller override built-in classes', () => {
    render(<Button className="rounded-none">Square</Button>)
    expect(screen.getByRole('button', { name: 'Square' })).toHaveClass(
      'rounded-none',
    )
  })
})
