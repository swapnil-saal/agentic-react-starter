import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Button } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './dialog'

/**
 * Worked example for the second component archetype: a Base UI wrapper that
 * renders through a portal.
 *
 * The value of these tests is not the markup — it is the behaviour Base UI
 * gives us for free and that a careless refactor silently removes: the popup is
 * announced as a dialog, it is labelled by its title, focus moves into it, and
 * Escape closes it. Testing Library queries the whole document, so the portal
 * needs no special handling.
 */
function Example() {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Delete project</Button>} />
      <DialogContent>
        <DialogTitle>Delete project</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('is closed until the trigger is used', () => {
    render(<Example />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens from the trigger and is labelled by its title', async () => {
    render(<Example />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete project' }),
    )
    expect(
      await screen.findByRole('dialog', { name: 'Delete project' }),
    ).toBeVisible()
  })

  it('moves focus into the dialog when it opens', async () => {
    render(<Example />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete project' }),
    )
    const dialog = await screen.findByRole('dialog')

    // Base UI moves focus once the enter transition settles, so this is
    // genuinely async — asserting immediately would catch the trigger instead.
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    )
  })

  it('closes on Escape', async () => {
    render(<Example />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete project' }),
    )
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes from a DialogClose child', async () => {
    render(<Example />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete project' }),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('gives the built-in close affordance an accessible name', async () => {
    render(<Example />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete project' }),
    )
    expect(
      await screen.findByRole('button', { name: 'Close dialog' }),
    ).toBeInTheDocument()
  })
})
