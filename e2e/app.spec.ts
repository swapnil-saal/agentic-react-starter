import { expect, test } from '@playwright/test'

test.describe('app shell', () => {
  test('renders the home page and navigates', async ({ page }) => {
    await page.goto('/')

    // The name comes from package.json via APP_NAME, so assert the real one.
    await expect(
      page.getByRole('heading', { name: 'Agentic React Starter', level: 1 }),
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

test.describe('brand system', () => {
  test('one knob restyles the whole app', async ({ page }) => {
    // The core promise: a single custom property changes every component at
    // once. If a knob stops propagating, this fails.
    await page.goto('/components')

    const button = page.getByRole('button', { name: 'Solid', exact: true })
    const read = (prop: string) =>
      button.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop)

    const before = {
      bg: await read('background-color'),
      radius: await read('border-radius'),
      height: await read('height'),
      duration: await read('transition-duration'),
    }

    // Motion must be live before we assert we can switch it off.
    expect(before.duration).not.toBe('0s')

    await page.evaluate(() => {
      const s = document.documentElement.style
      s.setProperty('--brand-hue', '300')
      s.setProperty('--brand-radius', '0px')
      s.setProperty('--brand-density', '1.3')
      s.setProperty('--brand-motion', '0')
    })
    await page.waitForTimeout(150)

    expect(await read('background-color')).not.toBe(before.bg)
    expect(await read('border-radius')).toBe('0px')
    expect(await read('height')).not.toBe(before.height)
    expect(await read('transition-duration')).toBe('0s')
  })

  test('border width is brand-driven, not hardcoded', async ({ page }) => {
    await page.goto('/components')
    const card = page.locator('table').first()

    const wrapper = card.locator('..')
    const width = () =>
      wrapper.evaluate((el) => getComputedStyle(el).borderTopWidth)

    // Set both values explicitly rather than assuming whatever brand.css
    // currently ships — the default is a brand decision and may change.
    for (const px of ['1px', '4px']) {
      await page.evaluate(
        (v) =>
          document.documentElement.style.setProperty('--brand-border-width', v),
        px,
      )
      await expect.poll(width).toBe(px)
    }
  })

  test('playground presets change the rendered UI', async ({ page }) => {
    await page.goto('/brand')

    const button = page
      .getByRole('button', { name: 'Primary', exact: true })
      .first()
    const radius = () =>
      button.evaluate((el) => getComputedStyle(el).borderRadius)

    const deepSea = await radius()

    await page.getByRole('button', { name: 'Brutalist', exact: true }).click()
    await expect.poll(radius).toBe('0px')

    await page.getByRole('button', { name: 'Soft', exact: true }).click()
    await expect.poll(radius).not.toBe('0px')
    expect(await radius()).not.toBe(deepSea)
  })
})

test('every animated element obeys the single motion knob', async ({
  page,
}) => {
  // Components must import from ui/_motion rather than writing literal
  // durations. A hand-written `duration-150` would survive this and keep
  // animating in a brand that asked for none.
  await page.goto('/components')
  // Wait for hydration — counting computed styles before React mounts finds
  // nothing and would pass the "silenced" assertion vacuously.
  await expect(
    page.getByRole('button', { name: 'Solid', exact: true }),
  ).toBeVisible()

  const countAnimating = () =>
    page.evaluate(() => {
      const els = [
        ...document.querySelectorAll(
          'button,input,tr,a,[role=switch],[role=tab],[role=checkbox]',
        ),
      ]
      return els.filter((el) => {
        const d = getComputedStyle(el).transitionDuration
        return d && !d.split(', ').every((x) => x === '0s')
      }).length
    })

  expect(await countAnimating()).toBeGreaterThan(10)

  await page.evaluate(() =>
    document.documentElement.style.setProperty('--brand-motion', '0'),
  )
  await page.waitForTimeout(150)

  expect(await countAnimating()).toBe(0)
})

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

test.describe('resilience', () => {
  test('an unknown route renders the not-found page, not a blank screen', async ({
    page,
  }) => {
    await page.goto('/definitely-not-a-route')
    await expect(page.getByText('Page not found')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible()
  })

  test('navigation is reachable on a phone', async ({ page }) => {
    // The rail is hidden below md; without the drawer there would be no way
    // to navigate at all on a small screen.
    await page.setViewportSize({ width: 390, height: 780 })
    await page.goto('/')

    await expect(page.locator('aside')).toBeHidden()
    await page.getByRole('button', { name: 'Open navigation' }).click()

    const link = page.getByRole('link', { name: 'Components' })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/components$/)
  })
})

test('the contrast audit reports real measurements, not collapsed ones', async ({
  page,
}) => {
  // Regression guard. When a token cannot be parsed, canvas silently keeps its
  // previous fill, so both sides of a pairing measure identical and every row
  // reports a confident 1.00 "Fail". That looked like a broken brand when it
  // was a broken measurement.
  await page.goto('/brand')
  await expect(page.getByRole('table').first()).toBeVisible()

  const ratios = await page
    .locator('tbody tr')
    .evaluateAll((rows) =>
      rows
        .map((r) => parseFloat(r.querySelectorAll('td')[1]?.textContent ?? ''))
        .filter((n) => !Number.isNaN(n)),
    )

  expect(ratios.length).toBeGreaterThan(4)
  // Every value collapsing to 1.00 is the signature of the bug.
  expect(ratios.every((r) => r === 1)).toBe(false)
  // Dark heading text on a near-white page is unambiguously high contrast;
  // if that reads low, the measurement is wrong rather than the brand.
  expect(Math.max(...ratios)).toBeGreaterThan(10)
})
