import { expect, test } from '@playwright/test'

/**
 * Tests for the EXAMPLE routes only.
 *
 * `pnpm reset` deletes this file along with the routes it covers, so a fresh
 * project is not left with a red test suite pointing at screens it removed.
 */
test.describe('data layer', () => {
  test('list loads, and a rejected mutation rolls back optimistically', async ({
    page,
  }) => {
    await page.goto('/users')
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(4)

    // The mock API rejects this record on purpose, so the optimistic update
    // must visibly apply and then revert.
    const toggle = page
      .locator('tr', { hasText: 'Grace Hopper' })
      .getByRole('switch')

    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-checked', 'true') // optimistic
    await expect(toggle).toHaveAttribute('aria-checked', 'false') // rolled back
    await expect(page.getByText('Change reverted')).toBeVisible()
  })

  test('detail route loads a single user', async ({ page }) => {
    await page.goto('/users')
    await page.getByRole('link', { name: 'Ada Lovelace' }).click()
    await expect(page).toHaveURL(/\/users\/1$/)
    await expect(page.getByText('ada@example.com')).toBeVisible()
  })
})

test.describe('example form', () => {
  test('form shows validation errors from the Zod schema', async ({ page }) => {
    await page.goto('/form-demo')
    await page.getByRole('button', { name: 'Send' }).click()

    await expect(
      page.getByText('Name must be at least 2 characters'),
    ).toBeVisible()
    await expect(page.getByText('Enter a valid email address')).toBeVisible()
    await expect(
      page.getByText('Message must be at least 10 characters'),
    ).toBeVisible()
  })
})
