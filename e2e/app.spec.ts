import { expect, test } from '@playwright/test'

test.describe('app shell', () => {
  test('renders the home page and navigates', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'AI Space', level: 1 }),
    ).toBeVisible()

    await page.getByRole('link', { name: 'Components' }).first().click()
    await expect(page).toHaveURL(/\/components$/)
    await expect(
      page.getByRole('heading', { name: 'Components', level: 1 }),
    ).toBeVisible()
  })

  test('Fragments components are actually styled', async ({ page }) => {
    // Guards the single most breakable part of the setup: if the Fragments
    // stylesheet stops loading, components still render but lose all styling.
    // A plain unstyled <button> has a transparent background, so asserting a
    // real painted colour catches that regression.
    await page.goto('/components')

    const button = page.getByRole('button', { name: 'Solid' })
    await expect(button).toBeVisible()

    const bg = await button.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    )
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    expect(bg).not.toBe('transparent')
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
})

test('theme toggle flips Fragments components and Tailwind utilities together', async ({
  page,
}) => {
  // The token bridge's whole purpose: a Tailwind utility (bg-accent) and a
  // Fragments component must read from the same tokens, so both must change
  // when the theme changes. If the bridge breaks, the Tailwind element keeps
  // its light-mode colour while the component moves.
  await page.goto('/components')

  const body = page.locator('body')
  const readBg = () =>
    body.evaluate((el) => getComputedStyle(el).backgroundColor)

  const lightBg = await readBg()

  // ThemeToggle renders one button per mode ("Light mode" / "Dark mode"),
  // so target the mode we want rather than the first match.
  await page.getByRole('button', { name: 'Dark mode' }).click()
  await expect.poll(readBg).not.toBe(lightBg)

  const darkBg = await readBg()
  expect(darkBg).not.toBe(lightBg)

  // And back again, proving the flip is not one-way.
  await page.getByRole('button', { name: 'Light mode' }).click()
  await expect.poll(readBg).toBe(lightBg)
})
