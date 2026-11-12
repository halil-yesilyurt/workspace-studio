# Workspace Builder

An interactive workspace planner made for the [Desent Solutions developer challenge](https://www.desent.io/coding-test-2), using [Monis](https://www.monis.rent) in Bali as the product context.

**[Open the live demo](https://workspace-studio-dusky.vercel.app)**

## Short write-up

I approached the challenge as a small product rather than a furniture catalog. A person moving to Bali should be able to assemble a practical desk setup, see what their choices look like together, and understand the rental estimate without switching between product pages. I built a focused two-column configurator with **Next.js, TypeScript, Tailwind CSS, and Motion**, using an original SVG workspace scene for immediate feedback. With more time, I would connect the experience to an authorized Monis product catalog, location-specific availability, real rental prices, and an official checkout.

## The experience

The interface centers on the workspace itself. The left side shows the current arrangement; the right side handles product choices and pricing. On narrow screens, the same sequence becomes a single column.

1. **Pick a desk.** Switch between the Electric Standing Desk and the larger Dual-Motor Pro Desk.
2. **Choose a chair.** Compare an ergonomic mesh chair with a padded office chair.
3. **Add finishing touches.** Choose a monitor, lamp, keyboard/mouse set, and plant. The 27-inch and 34-inch displays share one position, so switching between them replaces rather than stacks the display.
4. **Inspect the result.** The preview updates as items change. Try the sit/stand control or switch between daylight and evening lighting.
5. **Review the setup.** Open the summary to see each product, the selected weekly/monthly rental period, and the estimated total. Share a link, copy the list, or download a PNG of the setup.

For someone who prefers a starting point, three ready-made configurations are available. The optional **Workspace Finder** asks about work style, room size, and priorities, then proposes a setup with concrete reasons and a side-by-side price comparison. It uses straightforward, inspectable rules—not a fabricated AI score.

## Challenge requirements

| Requirement | Where it is implemented |
| --- | --- |
| At least 2 desks | Desk selection tab, with two variants |
| At least 2 chairs | Chair selection tab, with two variants |
| Add accessories | Accessories tab, with five optional products |
| Visual updates on selection | React state driving the interactive SVG scene |
| Setup or checkout summary | Review drawer with selected items and estimated rental total |
| Public deployment | [Vercel live URL](https://workspace-studio-dusky.vercel.app) |
| Source on GitHub | This repository; reviewer access is granted separately by the repository owner |
| Short write-up in README | [Short write-up](#short-write-up) above |
| Next.js, Tailwind CSS, Vercel | Application framework, styling, and hosting |

The review drawer is intentionally a **summary, not a payment form**.

## Design decisions

**Let the product carry the detail.** The workspace illustration is the main visual element. Navigation, product cards, and selection states stay quiet so the customer can see what changed.

**Stay close to the rental problem.** Weekly/monthly pricing is shown alongside products. The review lists exactly which items are included rather than implying that an illustration is a real order.

**Make choices reversible.** Customers can switch desks and chairs, toggle accessories, use a preset, reset the setup, or revisit any step. A guided recommendation is optional; it never replaces manual configuration.

**Keep the scene coherent.** The workspace and individual product thumbnails are original SVG drawings. A single SVG scene renders without external product imagery, and scoped SVG paint IDs prevent color and gradient collisions in the side-by-side comparison.

**Use motion only for feedback.** Product changes have restrained transitions. The interface respects the user's reduced-motion setting and still works without animations.

The visual cleanup followed the practical principles in [Unslop by Damir Sokolovsky](https://github.com/heydamir/unslop) (CC BY 4.0): readable type, simplified layout, and visual emphasis on the actual product.

## Technology

| Layer | Choice | Reason |
| --- | --- | --- |
| Application | Next.js App Router, React, TypeScript | Clear component boundaries and type-checked configuration |
| Styling | Tailwind CSS 4 plus focused custom CSS | Utility-based layout primitives, with deliberate control over typography and illustration framing |
| Interaction | Motion | Small state transitions and reduced-motion support |
| Product visuals | SVG and React | Immediate, scalable changes without external image downloads |
| Client state | React state | Instant selections; no backend needed for a challenge prototype |
| Persistence | Browser localStorage | Keeps the user's most recent configuration between visits |
| Sharing | Validated URL query parameters | Recreates the same products and rental period without accounts |
| Image export | Browser Canvas | Converts the assembled SVG and summary into a downloadable PNG |
| Unit testing | Node.js test runner | Exercises catalog, pricing, validation, recommendations |
| Browser testing | Playwright / Chromium | Checks real selection flows, exports, dialogs, responsive layouts |
| Deployment | Vercel | Hosted Next.js production build |

### How state and sharing work

The setup is a small typed object: desk, chair, accessories, and rental period. The catalog and price functions live outside the UI components, making them easy to test.

When a shared URL contains valid setup parameters, it takes precedence over saved local state. Otherwise, the builder restores the previously saved setup where available. Invalid identifiers and conflicting monitor selections do not become part of a configuration. The optional Finder constructs a valid setup through deterministic rules.

## Project structure

```text
src/
  app/
    page.tsx                 Main route
    layout.tsx               Metadata and document shell
    globals.css              Tailwind entry and UI design system
  components/
    workspace-builder.tsx    Configurator, selection flow, review drawer
    workspace-scene.tsx      Reactive SVG room and equipment illustration
    product-art.tsx          Original SVG product thumbnails
    workspace-finder.tsx     Guided recommendation questions and comparison
  lib/
    catalog.ts               Product types, example prices, selection rules, URLs
    workspace-finder.ts      Explainable recommendation rules
    export-setup.ts          Client-side PNG export
tests/
  catalog.test.mjs           Catalog, validation, pricing, sharing
  workspace-finder.test.mjs  Matching and comparison across 36 combinations
  workspace.spec.ts          End-to-end product and review journeys
  visual.spec.ts             Browser errors, screenshots, responsive behavior
  unslop.spec.ts             Readability and layout regressions
.github/workflows/
  checks.yml                Automated quality checks
```

## Running locally

**Requirements:** Node.js 22 and npm.

```bash
git clone https://github.com/halil-yesilyurt/workspace-studio.git
cd workspace-studio
npm ci
npm run dev
```

Open `http://localhost:3000`.

No environment variables or API keys are needed. The repository is private, so cloning requires an account with access.

### Quality checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests start the application automatically. On CI they use the **production** Next.js server after a successful build; locally they can reuse a development server.

GitHub Actions runs the checks on pushes to `main` and on pull requests. The test suite includes:

- Catalog and pricing totals for both rental periods
- Validation of share links, restored state, and mutually exclusive displays
- All **36 combinations** of the Finder's work style, room size, priority, and rental period
- Desk, chair, and accessory selection through the browser
- Review summary, dialog focus and Escape-to-close behavior
- Sit/stand and lighting controls, plus reduced-motion behavior
- PNG export and unique SVG filter/gradient IDs in comparison views
- Desktop and mobile screenshot capture; horizontal-overflow checks from **320px** through tablet sizes

Screenshots and failure traces are retained as short-lived GitHub Actions artifacts. Screenshot capture is not the same as automated pixel-diff or human visual approval.

## Limitations and next steps

This project is an **independent design exercise**, not an official Monis site. Product details, pricing in USD, and the scene are illustrative. There is no live inventory feed, pricing guarantee, checkout, payment collection, delivery scheduling, or confirmed booking. The outbound Monis link opens the legitimate rental website; it does **not** transfer a reservation.

Before making this a real rental product, I would:

1. Integrate an authorized Monis catalog with exact product images, prices, and availability.
2. Capture delivery area and start/end dates and calculate a confirmed quote.
3. Hand the configuration to an official checkout with proper server-side pricing validation.
4. Expand accessibility testing with screen-reader and automated audit coverage, and add screenshot-diff baselines.
5. Validate the illustrated arrangement against actual product dimensions and available combinations.

## Credits

Product context: [Monis](https://www.monis.rent). Challenge: [Desent Solutions](https://www.desent.io/coding-test-2). Design-audit reference: [Unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky (CC BY 4.0).

The artwork and configurator are independently implemented. This repository is not affiliated with or endorsed by Monis.
