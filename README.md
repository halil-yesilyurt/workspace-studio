# Workspace Builder

A visual equipment-rental planner for the [Desent Solutions developer challenge](https://desent.io/), inspired by [Monis](https://www.monis.rent) in Bali.

**[Try the live builder](https://workspace-studio-dusky.vercel.app)**

## The product idea

A person arriving in Bali needs a productive desk setup, not another spreadsheet of furniture. The workspace itself is the selection interface: choose a desk, chair and accessories; see them together instantly; and review the rental estimate without losing your place.

The experience stays deliberately direct. Product cards have clear choices and prices, and the scene reacts without page reloads.

## The extra touch

**Workspace Finder** is a three-question flow about the kind of work, available space and highest priority. It makes an explainable recommendation rather than claiming a made-up AI confidence score. Customers can compare that recommendation with their current setup, including the price difference, before applying it.

There are also three one-click starting bundles, animated sit/stand and lighting previews, persistent selections, shareable configuration URLs and a downloadable PNG card made from the actual SVG workspace illustration.

## Design direction

The builder is an application, not a marketing landing page. After reviewing the screen, I removed the announcement strip, promotional feature sections and repeated heading/subheading pairs. I kept one clear page title, gave the assembled workspace the largest area and moved recommendations and presets into quiet secondary controls. Type now follows a small, readable scale and avoids tiny labels or unnecessarily heavy headlines.

The visual audit was informed by [Unslop by Damir Sokolovsky](https://github.com/heydamir/unslop) (CC BY 4.0). This project’s interface and illustrations are independently implemented.

## Built with

- Next.js App Router, React and TypeScript
- Tailwind CSS 4 with deliberate custom CSS
- Motion for small, purposeful transitions (with reduced-motion support)
- Handcrafted vector product drawings and a responsive SVG workspace scene
- Browser storage and validated URL parameters, with no account required

The SVG stage is lightweight, scales to mobile, avoids external image dependencies and uses scoped paint IDs so side-by-side previews never interfere with each other.

## Run locally

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

The test suite covers product selection and pricing, URL round-trips, all 36 Finder answer/period combinations, the checkout summary, image download, accessibility interactions, responsive widths down to 320px, and SVG rendering isolation. GitHub Actions runs the checks and saves browser screenshots when the workflow runs.

## What I would improve next

This is an **independent interactive prototype**, not a Monis product or checkout. The product lineup and USD amounts are illustrative; no actual inventory, availability, delivery, payment or reservation is connected. In production, I would integrate an authorized live catalog, validate delivery location and dates, use verified product imagery where it improves confidence, and hand off to a secure official checkout. I would also add browser-level accessibility audits and visual-diff baselines.

A polished, honest prototype is more useful than a fake working payment button.
