# Workspace Studio

An interactive workspace configurator built as a frontend challenge for Desent Solutions, inspired by the equipment rental experience at [monis.rent](https://monis.rent).

## The idea

Choosing workspace equipment should feel closer to styling a room than filling out a shopping cart. Workspace Studio makes the space itself the interface: desks, chairs, and accessories change in a single composed illustration as you explore options. The quote stays visible and the rental summary is one step away.

## Stack and approach

- **Next.js App Router + TypeScript** for a small, reliable React application.
- **Tailwind CSS 4 + handcrafted CSS** for the responsive editorial layout and fine-grained scene styling.
- **Motion** for intentional transitions and reduced-motion support.
- **Custom SVG scene** for cohesive product geometry without heavy 3D assets or slow image downloads.
- **Local state and browser storage** so the configuration survives a refresh without a backend.

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000. For validation run `npm run typecheck`, `npm run lint`, and `npm run build`.

## Tradeoffs and next steps

The product options and USD prices in this demo are **illustrative**, not live Monis inventory or pricing. The review screen is a quote preview, **not a real checkout**; no payment or rental order is created. In a production version I would connect the official inventory/pricing API, add delivery-date and location validation, persist sharable setup links, and integrate a verified checkout on the official monis.rent domain. I would also add cross-browser visual regression tests for the custom scene.

This project is an independent challenge prototype and is not an official Monis storefront.
