import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

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
 * Add new routes here. `/brand` and `/components` are deliberately included:
 * they render the entire component library, so one scan covers every component
 * in both themes.
 */
const ROUTES = ['/', '/components', '/brand', '/users', '/feed', '/form-demo']

for (const route of ROUTES) {
  test(`${route} has no detectable accessibility violations`, async ({
    page,
  }) => {
    await page.goto(route)

    // Wait for data-driven routes to settle, so the scan sees real content
    // rather than skeletons.
    await page.waitForLoadState('networkidle')

    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Name the rule and the element, so a failure says what to fix rather than
    // just how many things are wrong.
    expect(
      violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target.join(' ')),
      })),
    ).toEqual([])
  })
}

test('dark mode has no detectable accessibility violations', async ({
  page,
}) => {
  // Contrast is the failure mode most likely to differ between themes, and the
  // light-dark() token pairs mean it is genuinely a separate set of values.
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/components')
  await page.waitForLoadState('networkidle')

  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(
    violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target.join(' ')),
    })),
  ).toEqual([])
})
