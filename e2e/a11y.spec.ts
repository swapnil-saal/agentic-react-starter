import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/**
 * Automated accessibility scan.
 *
 * The `jsx-a11y` ESLint rules catch what is visible in the source — a missing
 * `alt`, a click handler on a div. They cannot see anything that only exists
 * once the page is rendered: contrast between resolved tokens, ARIA that is
 * wrong only in context, or a page with no landmark structure. This runs axe
 * against the real production build to cover that half.
 *
 * A brand change can introduce a contrast failure without touching a single
 * component, which is exactly the kind of regression this catches.
 *
 * The route list is read from the app's own navigation rather than hardcoded.
 * That means a new page is covered the moment it appears in the nav, and
 * `pnpm reset` cannot leave this spec pointing at screens it deleted — a
 * hardcoded list keeps passing in that case, because a missing route renders
 * the not-found page and a not-found page has no violations.
 */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

async function navRoutes(page: Page) {
  await page.goto('/')
  // The nav is rendered by React, so it is not in the DOM at load.
  await page.locator('nav a[href^="/"]').first().waitFor()

  const hrefs = await page
    .locator('nav a[href^="/"]')
    .evaluateAll((links) =>
      links.map((a) => a.getAttribute('href')).filter((h): h is string => !!h),
    )
  return [...new Set(hrefs)].sort()
}

async function violationsOn(page: Page, route: string) {
  await page.goto(route)
  // Let data-driven routes settle, so the scan sees content, not skeletons.
  await page.waitForLoadState('networkidle')

  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()

  // Name the route, the rule and the element, so a failure says what to fix
  // rather than just how many things are wrong.
  return violations.flatMap((v) =>
    v.nodes.map(
      (n) => `${route} — ${v.id} (${v.impact}): ${n.target.join(' ')}`,
    ),
  )
}

test('every page in the navigation is free of accessibility violations', async ({
  page,
}) => {
  const routes = await navRoutes(page)
  expect(routes.length, 'no nav routes found to scan').toBeGreaterThan(0)

  const failures: string[] = []
  for (const route of routes)
    failures.push(...(await violationsOn(page, route)))

  expect(failures).toEqual([])
})

test('every page holds up in dark mode too', async ({ page }) => {
  // Contrast is the failure mode most likely to differ between themes, and the
  // light-dark() token pairs mean it is genuinely a separate set of values.
  await page.emulateMedia({ colorScheme: 'dark' })

  const routes = await navRoutes(page)
  // Same guard as above: an empty route list would make this pass vacuously.
  expect(routes.length, 'no nav routes found to scan').toBeGreaterThan(0)

  const failures: string[] = []
  for (const route of routes)
    failures.push(...(await violationsOn(page, route)))

  expect(failures).toEqual([])
})
