import { expect, test } from '@playwright/test'

test.describe('app shell', () => {
  test('renders the home page and navigates', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'AI Space', level: 1 }),
    ).toBeVisible()

    await page.getByRole('link', { name: 'Components', exact: true }).click()
    await expect(page).toHaveURL(/\/components$/)
    await expect(
      page.getByRole('heading', { name: 'Components', level: 1 }),
    ).toBeVisible()
  })

  test('components are actually styled', async ({ page }) => {
    // Guards the token layer: if the stylesheet or the @theme bridge breaks,
    // components still render but lose all styling. A plain unstyled <button>
    // has a transparent background, so asserting a painted colour catches it.
    await page.goto('/components')

    const button = page.getByRole('button', { name: 'Solid', exact: true })
    await expect(button).toBeVisible()

    const bg = await button.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    )
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    expect(bg).not.toBe('transparent')
  })

  test('Tailwind utilities and components share the same tokens', async ({
    page,
  }) => {
    // The whole point of the three-layer token setup: a utility class and a
    // component variant must resolve to the identical colour.
    await page.goto('/components')

    const utility = page.getByText('bg-accent', { exact: true })
    const component = page.getByRole('button', { name: 'Solid', exact: true })

    const utilityBg = await utility.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    )
    const componentBg = await component.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    )

    expect(utilityBg).toBe(componentBg)
  })

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

  test('dialog opens, traps focus and closes', async ({ page }) => {
    await page.goto('/components')
    await page.getByRole('button', { name: 'Dialog' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(
      dialog.getByRole('heading', { name: 'Publish changes' }),
    ).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })

  test('theme toggle flips light and dark', async ({ page }) => {
    await page.goto('/components')

    const body = page.locator('body')
    const readBg = () =>
      body.evaluate((el) => getComputedStyle(el).backgroundColor)

    await page.getByRole('button', { name: 'Light' }).click()
    await page.waitForTimeout(150)
    const lightBg = await readBg()

    await page.getByRole('button', { name: 'Dark' }).click()
    await expect.poll(readBg).not.toBe(lightBg)

    // …and back, proving the flip is not one-way.
    await page.getByRole('button', { name: 'Light' }).click()
    await expect.poll(readBg).toBe(lightBg)
  })
})
