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

test.describe('paged feed', () => {
  test('loads a page at a time and stops at the end', async ({ page }) => {
    await page.goto('/feed')

    // First page only — the point of paging is that the rest is not here yet.
    await expect(page.getByText('showing 10 of 47')).toBeVisible()

    await page.getByRole('button', { name: 'Load more' }).click()
    await expect(page.getByText('showing 20 of 47')).toBeVisible()

    // Walk to the end; the button must disappear rather than fetch forever.
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Load more' }).click()
    }
    await expect(page.getByText('showing 47 of 47')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Load more' })).toBeHidden()
    await expect(page.getByText('That is everything.')).toBeVisible()
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

  test('a server-side field error lands on the field it belongs to', async ({
    page,
  }) => {
    await page.goto('/form-demo')

    // Passes client validation, so only the server can reject it.
    await page.getByLabel('Name').fill('Ada Lovelace')
    await page.getByLabel('Email').fill('taken@example.com')
    await page.getByLabel('Message').fill('This address is already in use.')
    await page.getByRole('button', { name: 'Send' }).click()

    await expect(
      page.getByText('That email is already registered.'),
    ).toBeVisible()
    await expect(page.getByLabel('Email')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    // A field-level rejection must not also show the form-wide banner.
    await expect(page.getByText('Could not send')).toBeHidden()
  })

  test('a valid submission succeeds', async ({ page }) => {
    await page.goto('/form-demo')

    await page.getByLabel('Name').fill('Ada Lovelace')
    await page.getByLabel('Email').fill('ada@example.com')
    await page.getByLabel('Message').fill('Looking forward to building this.')
    await page.getByRole('button', { name: 'Send' }).click()

    await expect(page.getByText('Your message was submitted.')).toBeVisible()
  })
})
