import { Button } from '@usefragments/ui'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

/**
 * A worked example of the component-testing pattern for this repo, and a
 * regression guard that Fragments components still mount under jsdom.
 *
 * Query by accessible role and name rather than by class or test id — that
 * asserts the component is reachable the way a user (and a screen reader)
 * reaches it, and it does not break when Fragments changes its internal
 * class names.
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

  it('exposes an accessible name on an icon-only button via aria-label', () => {
    render(
      <Button icon aria-label="Close dialog">
        ×
      </Button>,
    )
    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).toBeInTheDocument()
  })
})
